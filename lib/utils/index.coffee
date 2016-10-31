###*
# @fileOverview  Basic tools
# @date 2014-12-2 15:10:14
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
_url    = require 'url'
crypto  = require 'crypto'
http    = require 'http'
https   = require 'https'
uglify  = require 'uglify-js'
gutil   = require 'gulp-util'
color   = gutil.colors

# numCPUs = require('os').cpus().length

opts = global.Cache['gOpts']

Tools = {}

# md5 hash
Tools.md5 = (source) ->
    # 使用二进制转换，解决中文摘要计算不准的问题
    _buf = new Buffer(source)
    _str = _buf.toString "binary"
    crypto.createHash('md5').update(_str, 'utf8').digest('hex')

# 错误报警,beep响两声
Tools.errrHandler = (e) ->
    gutil.beep()
    gutil.beep()
    gutil.log e

###
# @fileOverview makedir
###
Tools.mkdirsSync = (dirpath, mode)->
    if fs.existsSync(dirpath)
        return true
    else
        if Tools.mkdirsSync path.dirname(dirpath), mode
            fs.mkdirSync(dirpath, mode)
            return true
###
# @fileOverview makedirs
###
Tools.mkdirs = (dirpath, mode, callback)->
    fs.exists dirpath,(exists)->
        if exists
            callback(exists)
        else
            # Try made the parent's dir，then make the current dir
            mkdirs path.dirname(dirpath), mode, ->
                fs.mkdir dirpath, mode, callback

###
# @fileOverview obj mixin function
# @Example
# food = {'key':'apple'}
# food2 = {'name':'banana','type':'fruit'}
# console.log objMixin(food2,food)
# console.log objMixin(food,food2)
###
Tools.mix = _.partialRight _.assign, (a, b) ->
    val = if (typeof a is 'undefined') then b else a
    return val

# 获取文件
Tools.getFileSync = (file, encoding)->
    _encoding = encoding or 'utf8'
    fileCon = ''
    if fs.existsSync(file)
        stats = fs.statSync(file)
        if stats.isFile()
            fileCon = fs.readFileSync(file, _encoding)
    return fileCon

# 获取文件json对象
Tools.getJSONSync = (file) ->
    fileCon = Tools.getFileSync(file)
    data = {}
    if fileCon
        fileCon = fileCon.replace(/\/\/[^\n]*/g, '')
        try
            data = JSON.parse(fileCon)
        catch e
            console.log e

    return data

# 判断是否是空对象
Tools.isEmptyObject = (obj)->
    for name of obj
        return false
    return true

# 文件写入磁盘
Tools.writeFile = (file,source,isNotLog)->
    # Tools.mkdirsSync(path.dirname(file))
    # fs.writeFileSync file, source, 'utf8'
    # name = path.basename(file)
    # not isNotLog && gutil.log("'" + gutil.colors.cyan(name) + "'", "build success.")
    # 文件存在并且MD5值一样，则不重复写入
    name = path.basename(file);
    if fs.existsSync(file) and Tools.md5(Tools.getFileSync(file)) is Tools.md5(source)
        return false
    Tools.mkdirsSync(path.dirname(file))
    fs.writeFileSync(file, source, 'utf8')
    isNotLog or gutil.log("'" + gutil.colors.cyan(name) + "'", "build success.")

# 压缩js源码
Tools.minifyJs = (source)->
    mangled = uglify.minify(source,{fromString: true})
    return mangled.code

# 获取hash map
Tools.getMap= (type)->
    _this = Tools
    _map = {}
    _name = if type in ["css","img","js"] then "#{type}Map"  else "#{type}"
    _file = opts.mapPath + _name.toLowerCase() + '.json'
    if not fs.existsSync(_file)
        # console.log _file
        _this.writeFile(_file,'{}')
    else
        _source = fs.readFileSync(_file)
        try
            _map = JSON.parse(_source, 'utf8')
            # console.log _map
            global.Cache[_name] = _map
        catch e
            try
                # console.log "#{_file}--->",e
                # 解决json文件冲突, git冲突
                _source = _source.toString().replace(/<<<<<<<([\s\S]*?)>>>>>>>\s*\w*/g,'')
                _map = global.Cache[_name] = JSON.parse(_source) or {}
                _this.writeFile(_file,_source)
            catch e
                global.Cache[_name] = {}
                # opts = global.Cache['gOpts']
                switch _name
                    when 'imgMap'
                        _ctl = require('../imgCtl')
                        new _ctl(opts).init()
                    when 'cssMap'
                        _ctl = require('../cssCtl')
                        new _ctl(opts).init()
                    else
                        global.Cache[_name] = {}
                _map = _.assign _map,global.Cache[_name]
    return _map


# 更新map缓存
Tools.updateMap = (obj,mapName)->
    if _.has(global.Cache,mapName)
        _.assign global.Cache[mapName],obj

# 保存map文件
Tools.saveMapFile = (name)->
    _name = name
    _file = opts.mapPath + _name.toLowerCase() + '.json'
    _map = {}

    try
        _map = JSON.parse(fs.readFileSync(_file), 'utf8')
    catch e
        console.log e

    _map = _.assign _map,global.Cache[_name]
    _data = JSON.stringify(_map, null, 4)

    Tools.writeFile(_file,_data)

# 保存缓存文件
Tools.saveCache = ->
    _cache = global.Cache
    delete _cache.gOpts
    Tools.writeFile(opts.mapPath + 'cache.json',JSON.stringify(_cache, null, 0))

# 替换html模板中的img，原构建流程的保留方法
# 新版中请使用 ejs 语法，<@- init_img('logo.png') @>
Tools.replaceImg = (source)->
    Tools.getMap('img')
    imgPath = Tools.getStaticPath() + 'img/'
    imgMap = global.Cache['imgMap']
    imgReg = /<img[\s\S]*?[^(src)]src=('|")([^'|^"]*)('|")/g
    file_source = source.replace imgReg,(str)->
        # console.log str
        map = ''
        str.replace /src=('|")([^'|^"]*)('|")/,($1)->
            map = $1.replace(/^src=/,'').replace(/(\'|\")|(\'|\"$)/g, '')
        if map.indexOf('/img/') isnt 0 or map.indexOf('http://') is 0 or map.indexOf('data:') is 0 or map.indexOf('/<?php/') isnt -1
            return str
        else
            key = map.replace(/(^\'|\")|(\'|\"$)/g, '').split('img/')[1]
            val = imgPath + (if _.has(imgMap,key) and opts.env isnt 'local' then imgMap[key].distname else key + '?=t' + String(new Date().getTime()).substr(0,8))
            # console.log "#{map}--> #{val}"
            return str.replace(map, val)
    return  file_source

# 压缩html
Tools.htmlMinify = (source)->
    s = source
        .replace(/\/\*([\s\S]*?)\*\//g, '')
        .replace(/<!--([\s\S]*?)-->/g, '')
        .replace(/^\s+$/g, '')
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/\r/g, '')
        .replace(/\n\s+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/>([\n\s]*?)</g,'><')
        # .replace(/<?phpforeach/g,'<?php foreach')
        # .replace(/<?phpecho/g,'<?php echo')
    return s

#判断是否window系统
Tools.isWin = ->
    return process.platform is "win32"

#转换文件路径
Tools.tranFilePath = (filePath)->
    _file = filePath or ""
    if Tools.isWin() and _file
        _file = _file.replace(/\\\\/g,'/')
                     .replace(/\\/g,'/')

    return _file

###
# build the three part's js libs paths
###
Tools.buildReqPaths = (cb)->
    _cb = cb or ->
    if _.has(global.Cache,'jsLibs')
        return false
    _libs = {}
    _reqPathsFile = path.join(opts.mapPath, 'req_paths.json')
    try
        _libs = JSON.parse fs.readFileSync(_reqPathsFile, 'utf8')
    catch err
        Tools.writeFile(_reqPathsFile,"{}")
    filePath = opts.srcPath + 'js/vendor/'
    fs.readdirSync(filePath).forEach (v)->
        _path = path.join(filePath, v)
        if fs.statSync(_path).isDirectory()
            fs.readdirSync(_path).forEach (f)->
                _file = path.join(_path, f)
                if fs.existsSync(_file) and f.indexOf('.') != 0 and f.indexOf('.js') != -1
                    _file = Tools.tranFilePath _file

                    _libs[v] = _file.split('/js/')[1].replace(/\.js$/, '')

    # @writeFile(@jsLibs, JSON.stringify(_libs, null, 2))
    global.Cache['jsLibs'] = _libs
    _cb()

# 生成require的配置文件
Tools.buildReqCfg = (cb)->

    # return false if _.has global.Cache,'reqCfg'
    Tools.getMap("jsHash")
    # 如果没有生成 jslibs，则重新生成
    Tools.buildReqPaths() if not _.has global.Cache,'jsLibs'
    jsLibPaths = global.Cache['jsLibs']
    reqShim = {}
    _reqShimFile = path.join(opts.mapPath, 'req_shim.json')
    try
        # 读取json配置
        reqShim = JSON.parse fs.readFileSync(_reqShimFile, 'utf8')
    catch e
        Tools.writeFile(_reqShimFile,"{}")

    # 过滤核心库
    newPaths = {}
    for key,val of jsLibPaths
        if key isnt 'require'
            newPaths[key] = val
    cdnDomain = opts.cdnDomain
    if opts.env == 'www'
        cdnDomain = "local." + cdnDomain
    else
        cdnDomain = cdnDomain.replace(/(test|rc)/,'local')

    # 把调试代码指向本地
    baseUrl = cdnDomain + path.join(opts.debugPath,'js')

    reqCfg =
        baseUrl: baseUrl.replace('\\','/')
        paths: newPaths
        shim: reqShim
    # 写入缓存
    global.Cache['reqCfg'] = reqCfg

    # 生成文件
    reqCfgStr = "require.config(#{JSON.stringify(reqCfg, null, 2)});"
    curHash = Tools.md5(reqCfgStr)
    file = path.join(opts.debugPath, "js/reqcfg.js")
    global.Cache['jsHash']['reqcfg.js'] = curHash
    Tools.saveMapFile('jsHash')
    Tools.writeFile(file,reqCfgStr)
    cb and cb()

# 获取静态资源的路径
Tools.getStaticPath = ->
    _isDebug = !!opts.isDebug
    _env = opts.env
    _debugPath = opts.cdnDomain + opts.debugPath
    _distPath = opts.cdnDomain + opts.distPath
    _staticPath = ''
    if _env isnt 'local' and _env isnt 'dev'
        _staticPath = _distPath
    else
        if _env is 'local' and _isDebug
            _staticPath = _distPath
        else
            _staticPath = _debugPath

    return _staticPath

# 插入到页面中的全局变量
Tools.getGloabVars = ()->
    _staticPath = Tools.getStaticPath()
    GLOBAL_VARS = "var STATIC_PATH='#{_staticPath}',#{opts.spaceName}=window['#{opts.spaceName}']={},_VM_=window['_VM_']={};#{opts.spaceName}.getStaticUri={img:function(n){return STATIC_PATH+'img/'+n;},css:function(n){return STATIC_PATH+'css/'+n;},js:function(n){return STATIC_PATH+'js/'+n}};"
    return "<script>#{GLOBAL_VARS}</script>"

###*
 * 构造 css 资源路径
 * @param {string} cssList css列表
 * @example
 * cssList = 'main.css,index.css'
 * init_css(cssList)
###
Tools.init_css = (cssList)->
    Tools.getMap('css') if not _.has global.Cache,"cssMap"
    _cssMap = global.Cache['cssMap']
    # console.log _cssMap
    _env = opts.env
    _ver = opts.ver
    _isDebug = !!opts.isDebug
    _cssPath = Tools.getStaticPath() + 'css'
    _cssArr = cssList.split(',')
    _cssLinks = ''
    _timestamp = String(new Date().getTime()).substr(0,8)
    _cssArr.forEach (key)->
        if key.indexOf(/\.css$/) == -1
            key = key + '.css'
        if _env isnt 'local' and _env isnt 'dev'
            val = if _.has(_cssMap,key) then _cssMap[key].distname + "?v=#{_ver}" else "#{key}?v=#{_ver}&t=#{_timestamp}"
        else
            if _isDebug and _env is 'local' and _.has(_cssMap,key)
                val = _cssMap[key].distname + "?v=#{_ver}"
            else
                val = "#{key}?v=#{_ver}&t=#{_timestamp}"
        _cssLinks += "<link href='#{_cssPath}/#{val}' rel='stylesheet' type='text/css' />"
    return _cssLinks + Tools.getGloabVars()

###*
 * 构造 js 资源路径
 * @param {string} jsList js列表
 * @example
 * jsList = 'sb.corelibs.js,sb.app_index.js,piwik.js'
 * init_js(jsList)
###
Tools.init_js = (jsList)->
    _isDebug = !!opts.isDebug
    _env = opts.env
    _ver = opts.ver
    _jsLinks = ""
    Tools.getMap('js') if not _.has global.Cache,"jsMap"
    _jsMap = global.Cache['jsMap']
    _jsPath = Tools.getStaticPath() + 'js'
    _coreJsName = opts.prefix + '.' + opts.coreJs.name + '.js'
    # console.log _coreJsName
    _jsArr = jsList.split(',')

    _timestamp = String(new Date().getTime()).substr(0,8)
    _reqJs = "<script src='#{_jsPath}/vendor/require/require.js?v=#{_ver}'></script>"
    if "Zepto" in opts.coreJs.mods or "zepto" in opts.coreJs.mods
        _reqJs += "<script src='#{_jsPath}/vendor/Zepto/zepto.js?v=#{_ver}'></script>"
    else
        _reqJs += "<script src='#{_jsPath}/vendor/jquery/jquery.js?v=#{_ver}'></script>"
    _reqJs += "<script src='#{_jsPath}/reqcfg.js?v=#{_ver}&t=#{_timestamp}'></script>"
    _buildSrcLink =(key)->
        _link = ''
        if key.indexOf(opts.prefix) isnt 0
            val = "#{key}?v=#{_ver}&t=#{_timestamp}"
            _link += "<script src='#{_jsPath}/#{val}'></script>"
        else
            if key is _coreJsName
                _link += _reqJs
            else
                _modName = key.replace("#{opts.prefix}.",'')
                              .replace('.js','').replace(/\_/g,'/')
                _link += "<script>require(['#{_modName}'])</script>"
        return _link
    _buildDistLink = (key)->
        _link = ''
        val = if _.has(_jsMap,key) then _jsMap[key].distname + "?v=#{_ver}" else "#{key}?v=#{_ver}&t=#{_timestamp}"
        _link += "<script src='#{_jsPath}/#{val}'></script>"
        return _link

    _jsArr.forEach (key)->
        if key.indexOf(/\.js$/) == -1
            key = key + '.js'
        if _env isnt 'local' and _env isnt 'dev'
            _jsLinks += _buildDistLink(key)
        else
            if _isDebug and _env is 'local'
                _jsLinks += _buildDistLink(key)
            else
                _jsLinks += _buildSrcLink(key)
    return _jsLinks

# 构造 img 资源路径
Tools.init_img = (imgName)->
    _this = Tools
    _env = opts.env
    _ver = opts.ver
    _isDebug = !!opts.isDebug
    _this.getMap('img') if not _.has global.Cache,"imgMap"
    _imgMap = global.Cache['imgMap']
    _imgPath = _this.getStaticPath() + 'img'
    _timestamp = String(new Date().getTime()).substr(0,8)
    _val = if _env isnt 'local' and _env isnt 'dev' and not _isDebug and _.has(_imgMap,imgName) then _imgMap[imgName].distname + "?v=#{_ver}" else "#{imgName}?v=#{_ver}&t=#{_timestamp}"
    return "#{_imgPath}/#{_val}"

# 将静态资源的map发布到服务端模板目录
Tools.mapToViewPath = (cb)->
    _cb = cb or ->
    _mapPath = opts.mapPath
    _outPath = opts.viewPath
    _maps = ['cssmap','jsmap','imgmap']

    _distPaths = []
    if typeof _outPath is 'object'
        for key,val of _outPath
            _distPaths.push(val)
    else if typeof _outPath is 'string'
        _distPaths.push(_outPath)
    # console.log _distPaths
    _maps.forEach (key)->
        try
            file = _mapPath + key + '.json'
            # mapFile = path.join(_outPath, 'map', key + ".json")
            _jsonData = fs.readFileSync(file, 'utf8')
            _phpArr = []
            for name,val of JSON.parse(_jsonData)
                _name = val.distname
                _hash = val.hash
                _phpArr.push "'#{name}' => array('distname' => '#{_name}', 'hash' => '#{_hash}')"
            _phpStr = '<?php' + '\r\n' + 'return array(' + _phpArr + ');' + '\r\n' + '?>'
            # console.log mapFile
            _distPaths.forEach (v)->
                mapFile = path.join(v, 'map', key)
                Tools.writeFile(mapFile + ".json",_jsonData,0)
                Tools.writeFile(mapFile + ".php",_phpStr,0)
        catch error

    gutil.log color.green "Map done!"
    _cb()

# 生成 dist 文件路径
Tools.setDistPath = (parse,hash)->
    parse.base = parse.name + "." + hash.substring(0,opts.hashLen) + parse.ext
    return path.format(parse)

module.exports = Tools
