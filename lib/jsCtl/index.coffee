###*
 * @fileOverview 将AMD匿名模块转化为具名模块的类库
 * @author pangjg
 * @date 2015年11月26日22:13:31
 * @version $id$
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
vfs     = require 'vinyl-fs'
plumber = require 'gulp-plumber'
gutil   = require 'gulp-util'
# rjs     = require 'gulp-requirejs'
color   = gutil.colors

Utils   = require '../utils'
JsInit  = require './jsInit'

###*
 * @fileOverview 将AMD匿名模块转化为具名模块
 * @extends {class} JsInit
###
class JsAmdCtl extends JsInit

    ###*
     * [makeAmdMod 将AMD匿名模块转化为具名模块的方法]
     * @param  {String}   files [js源文件路径]
     * @param  {Function} cb    [处理js源文件的过程函数，匿名模块转化为具名模块]
     * @param  {Function} cb2   [全部处理完成后的回调]
    ###
    makeAmdMod: (files,cb,cb2)->
        _this = @
        vfs.src [files]
        .pipe plumber({errorHandler: Utils.errrHandler})
        .on 'data',(source)->
            _list = []
            _filePath = source.path.replace(/\\/g,'/').replace(/\/\//g,'/')
            _nameObj = path.parse _filePath
            # _nameObj.hash = Utils.md5(source.contents)
            _modId = _this.madeModId(_filePath)
            _source = String(source.contents)

            # 根目录下的js不允许写AMD模块
            if _filePath.split('/js/')[1].indexOf('/') is -1 or _filePath.indexOf("/vendor/") isnt -1
                return cb(_nameObj,_source)
                
            # 处理AMD模块
            else
                _source = _source.replace _this.amdReg,(str,map)->
                    _depStr = map.replace(_this.depArrReg, "$1")
                    if /^\[/.test(_depStr)
                        _arr = _this.tryEval _depStr
                        try 
                            _list = _this.madeModList(_this.filterDepMap(_arr),_nameObj.dir)
                            _str = _this.arrToString _list
                            return str.replace(_this.expStr, "define('#{_modId}',#{_str},function")
                        catch err
                            console.log err
                    else
                        return str.replace(_this.expStr, "define('#{_modId}',function")
                
            return cb(_nameObj,_source)
        .on 'end',cb2

    ###*
     * [toAmd 将所有AMD具名模块写入到调试目录]
     * @param  {String}   file [js的源文件路径，支持模糊路径]
     * @param  {Function} done [构建完成后的回调]
    ###
    toAmd:(file,done)->
        _this = @
        gutil.log "Starting","'" + color.cyan('AMDmodules') + "'..."
        if typeof file is 'function'
            _done = file
            _file = _this.srcPath + '**/*.js'
        else
            _file = file or _this.srcPath + '**/*.js'
            _done = done or ->
        _num = 0
        # 初始化js源文件的缓存对象
        global.Cache['jsSource'] = {}
        _this.makeAmdMod(
            _file
            (obj,source)->
                _dir = obj.dir.split("/js/")[1]
                _distname = obj.name + obj.ext
                _dir && (_distname = _dir + '/' + _distname)
                if _num%50 == 0 and _num > 15
                    gutil.log 'Building...'
                _file = path.join(_this.debugPath, _distname)

                # 生成js源文件的缓存
                global.Cache['jsSource'][_distname] = source

                # 保存js文件
                Utils.writeFile(_file,source,true)
                _num++
            ->
                gutil.log "'" + color.cyan('AMDmodules') + "'","build success."
                # 保存js源文件的缓存
                _done()
        )

###*
 * @fileOverview js生产文件构建类库
 * @description 将ADM模块依赖关系和顺序生成生产文件，并进行AMD转化原生模块
 * @extends {class} JsAmdCtl
###
class JsCtl extends JsAmdCtl
    
    # 生成单个JS模块的依赖
    oneJsDep: (file_path,file_name)=>
        _file = path.join(file_path, file_name)
        return @getOneJsDep fs.readFileSync(_file, 'utf8').toString()

    # 遍历所有js文件，生成依赖关系表
    allJsDep: =>
        _this = @
        _map = {}
        # console.log _debugPath
        _makeDep = (dir)->
            fs.readdirSync(dir).forEach (v)->
                _fPath = path.join(dir, v)

                # 如果是目录，但又不是第三方插件的目录，则递归
                if fs.statSync(_fPath).isDirectory() and v isnt 'vendor'
                    _makeDep(_fPath)
                        
                # 如果第三方插件的目录，则生成调用require.config的构建方法
                else if v is 'vendor'
                    # if not _.has(global.Cache,'alljsDep')
                    # Utils.buildReqCfg()
                    return false

                # 这里是处理js模块的依赖关系
                else if v.indexOf(".js") isnt -1
                    fileDep = _this.oneJsDep(_fPath, '')
                    _fPath = Utils.tranFilePath _fPath
                    name = _fPath.split('/js/')[1]
                                 .replace(/\.js$/,'')
                    _map["#{name}"] = fileDep

                # 其他情况    
                else 
                    # console.log(_fPath) if v.indexOf(".js") > 0
                    return false
                    
        _makeDep(_this.debugPath)
        # 写入缓存
        global.Cache['alljsDep'] =  _map


    # 计算每个文件对应的依赖，递归+排重
    makeOneModDeps:(depsArr)->
        _this = @
        _list = []
        _this.allJsDep()  if not _.has(global.Cache,'alljsDep')
        _alljsDep = global.Cache['alljsDep']
        _make = (deps) ->
            if _.isArray(deps) and deps.length > 0
                deps.forEach (key)->
                    if key.indexOf('/') > 0 and _.has(_alljsDep,key)
                        _curDep = _alljsDep[key]
                        _curDep.length > 0 and _make(_curDep)
                    _list.push(key)
            else
                if not _.isArray(deps)
                    console.log deps
                return
        _make(depsArr)
        return _.union(_list)

    # 生成每个文件的所有依赖列表
    makeAllModDeps: ->
        _this = @
        _allDeepDeps = {}
        _commonLibs = []
        _this.allJsDep() if not _.has(global.Cache,'alljsDep')
        _alljsDep = global.Cache['alljsDep']
        # 生成所有依赖链
        for file,depList of _alljsDep
            _allDeepDeps[file] = {}
            _list = [] 
            if depList.length > 0
                
                _depList = _this.coreModsFilter(depList) # 过滤核心模块
                _tempArr = _this.makeOneModDeps(_depList)

                # 依赖计算 
                for _file in _tempArr                
                    if  _file.indexOf("/") isnt -1 
                        # 生成模块依赖关系的队列
                        _file not in _list and _list.push(_file)
                    else
                        # 生成核心和公共的模块队列
                        _commonLibs.push(_file) if _file not in _commonLibs

            _allDeepDeps[file] = _list

        global.Cache['allDeepDeps'] = _allDeepDeps
        global.Cache['commonLibs'] = _commonLibs

        return global.Cache

    # 生成某个模块的相关模块列表
    makeOneModRelateDep: (modName) ->
        if modName.indexOf("/") is -1 or modName.indexOf('.') is 0
            gutil.log "'" + color.red(modName) + "'", "isn't an AMDmodule"
            return []
        @makeAllModDeps() if not _.has(global.Cache,'allDeepDeps') or not _.has(global.Cache['allDeepDeps'],modName)
        return global.Cache['allDeepDeps'][modName]

    # AMD模块构建函数
    _amdModBuilder: (outName,source,cb)->
        # console.log outName
        _this = @
        _jsHash = {}

        # 替换js中的img、css和js资源，增加缓存过滤机制
        _source = _this.replaceStaticResName(source)

        # 过滤AMD
        _source = _this.amdClean(_source)

        # 生成带Hash的生产码
        _source = Utils.minifyJs(_source)
        _source = [_this.info,_source].join(';')
        _hash = Utils.md5(_source)
        _distname = outName + '.' + _hash.substring(0,_this.hashLen) + ".js"
        _jsHash[outName + ".js"] = 
            hash: _hash
            distname: _distname


        # 写入两个文件，一个作降级的保险方案
        _distPath = path.join _this.distPath, _distname
        _outName = path.join _this.distPath, outName + ".js"
        gutil.log _outName,'-->',_distPath
        if not fs.existsSync(_distPath)
            Utils.writeFile(_distPath, _source, true)
            Utils.writeFile(_outName, _source)

        cb(_jsHash)

    ### 合并单个模块 ###
    combOneMod: (name,cb)->
        _this = @
        _cb = cb or ->
        _modName = name
        # 读取缓存
        Utils.getMap("jsMap") if not _.has(global.Cache,'jsMap')
        Utils.getMap("jsHash") if not _.has(global.Cache,'jsHash')
        Utils.getMap("jsSource") if not _.has(global.Cache,'jsSource')
        global.Cache["jsHash"] = {} if _this.opts.force
        _jsMap = global.Cache['jsMap']
        _jsHash = global.Cache['jsHash']
        _jsSource = global.Cache['jsSource']

        # 过滤下划线的js模块
        if _modName.indexOf("_") is 0 or _modName.indexOf("/") is -1 or _modName.indexOf('.') is 0
            return _cb(false)
       
        else
            _tempHash = {}
            _jsData = []
            _modDeps = @makeOneModRelateDep(_modName)
            _curFile = path.join @debugPath, _modName + ".js"
            _outName = @prefix + "." + _modName.replace(/\//g, '_')
            # console.log _curFile
            for f in _modDeps
                _jsFile = path.join(@debugPath, f + ".js")
                _name = f + ".js"
                if fs.existsSync(_jsFile)
                    if _.has global.Cache['jsSource'],_name
                        _source = global.Cache['jsSource'][_name]
                    else
                        _source = fs.readFileSync(_jsFile, 'utf8')
                        global.Cache['jsSource'][_name] = _source
                    _jsData.push _source

            # 追加当前模块到最后
            _jsData.push fs.readFileSync(_curFile, 'utf8')
            _content = String(_jsData.join(';'))
            _curHash = Utils.md5(_content) #压缩前的md5戳
            _curKey = _outName + ".js"
            _tempHash[_curKey] = _curHash

            if _.has(global.Cache['jsHash'],_curKey) and global.Cache['jsHash'][_curKey] is _curHash
                gutil.log "'" + color.magenta(_outName) + "'","no change."
                _cb(false)
            else
                try

                    # 缓存当前文件内容
                    Utils.updateMap(_tempHash,'jsHash')
                    @_amdModBuilder _outName,_content,(map)->
                        # 更新jsmap缓存
                        Utils.updateMap(map,'jsMap')
                        _cb(true)
                catch error
                    gutil.log "Error: #{_outName}"
                    gutil.log error
                    _cb(false)
                
        
    ### 合并js模块 ###
    combAllMods: (cb)-> 
        _cb = cb or ->
        # 读取缓存
        @makeAllModDeps() if not _.has(global.Cache,'allDeepDeps') #读取所有AMD模块依赖树
        _allDeepDeps = global.Cache['allDeepDeps']

        # 生成依赖
        _num = 0
        gutil.log color.yellow "Combine AMD modules! Waitting..."
        for mod,dep of _allDeepDeps
            # 过滤下划线的js模块
            if mod.indexOf("_") isnt 0 and mod.indexOf("/_") is -1 and mod.indexOf('/')
                @combOneMod mod,(res)->

                    res && _num++
        gutil.log color.magenta("#{_num}"),"AMD modules changed."
        gutil.log color.green "AMD modules Combined..."        
        _cb()

    ### 合并核心模块 ### 
    coreModule: (cb)->
        _this = @
        gutil.log "Combine","'" + color.yellow(" #{_this.coreModsName}") + "'","..."
        _cb = cb or ->
        _this.makeAllModDeps() if not _.has(global.Cache,'commonLibs')
        _commonLibs = global.Cache['commonLibs']

        # 核心库队列
        # _baseUrl = _this.debugPath
        _distPath = _this.distPath
        _outName = _this.prefix + '.' + _this.coreModsName
        _coreMods = _this.coreMods
        _include = _.union _coreMods.concat(_commonLibs)
 
        # 读取缓存
        Utils.buildReqPaths() if not _.has(global.Cache,'jsLibs')
        Utils.getMap("jsMap") if not _.has(global.Cache,'jsMap')
        Utils.getMap("jsHash") if not _.has(global.Cache,'jsHash')
        global.Cache["jsHash"] = {} if _this.opts.force
        _jsMap = global.Cache['jsMap']
        _jsHash = global.Cache['jsHash']
        _jsLibs = global.Cache['jsLibs']

        # 按照核心文件的数组，读取文件源码
        _jsData = []
        for key in _include
            _filePath = _this.debugPath
            if _.has(_jsLibs,key)
                _filePath += _jsLibs[key] + '.js'
                if fs.existsSync(_filePath)
                    _source = fs.readFileSync(_filePath, 'utf8')
                    _jsData.push _source

        # 拼接源码，过滤AMD，压缩源码，然后写入文件
        if _jsData.length == 0
            return _cb()
        else
            _source = String(_jsData.join(';'))
            _curKey = _outName + ".js"
            _curHash = Utils.md5(_source)

            # 没有变化 跳过构建
            if _.has(global.Cache['jsHash'],_curKey) and global.Cache['jsHash'][_curKey] is _curHash
                gutil.log "'" + color.magenta(_curKey) + "'","no change."

            # 有变化则重新构建
            else
                global.Cache['jsHash'][_curKey] = _curHash
                _source = _this.amdClean(_source) # 过滤AMD
                _source = Utils.minifyJs(_source) # 压缩js
                _outRes = [_this.info,_outRes].join(';')
                _hash = Utils.md5(_outRes)
                _distName = _outName + '.' + _hash.substring(0,_this.hashLen) + ".js"
                _jsMap[_curKey] =
                    hash:  _hash
                    distname: _distName
                # 写入文件
                if not fs.existsSync(path.join(_distPath, _distName))
                    
                    Utils.writeFile(path.join(_distPath, _curKey),_source,!0)
                    Utils.writeFile(path.join(_distPath, _distName),_source)

            # 更新全局缓存
            Utils.updateMap(_jsMap,'jsMap')
            
            _cb()

        
    # 处理根目录下的普遍js，并生成map
    combNormalJs: (cb)->
        _cb = cb or ->
        _this = @
        _debugPath = @debugPath
        _distPath = @distPath
        # 读取缓存
        Utils.getMap("jsSource") if not _.has(global.Cache,'jsSource')
        Utils.getMap("jsMap") if not _.has(global.Cache,'jsMap')
        Utils.getMap("jsHash") if not _.has(global.Cache,'jsHash')
        global.Cache["jsHash"] = {} if _this.opts.force
        # _jsMap = global.Cache['jsMap']
        _jsHash = global.Cache['jsHash']
        _jsSource = global.Cache['jsSource']
                
        _tempMap = {}
        fs.readdirSync(_debugPath).forEach (v)->
            _jsFile = path.join(_debugPath, v)
            
            if fs.existsSync(_jsFile) and v.indexOf('.js') > 0
                # console.log _jsFile
                if _.has(_jsSource,v)
                    _source = _jsSource[v]
                else
                    _source = fs.readFileSync(_jsFile, 'utf8')
                    global.Cache['jsSource'][v] = _source

                _curHash = Utils.md5(_source)

                # 没有变化 跳过构建
                if _.has(global.Cache['jsHash'],v) and global.Cache['jsHash'][v] is _curHash
                    gutil.log "'" + color.magenta(v) + "'","no change."

                # 有变化则重新构建
                else
                    global.Cache['jsHash'][v] = _curHash
                    _source = Utils.minifyJs(_source)
                    _hash = Utils.md5(_source)
                    _distName = v.replace(".js",'') + '.' + _hash.substring(0,_this.hashLen) + ".js"
                    _tempMap[v] = 
                        hash: _hash
                        distname: _distName
                    Utils.writeFile(path.join(_distPath, v),_source)
                    if not fs.existsSync(path.join(_distPath, _distName))
                        # 写入文件
                        Utils.writeFile(path.join(_distPath, _distName),_source,true)
                    
        # 更新jsmap的全局缓存
        Utils.updateMap(_tempMap,'jsMap')
        _cb()

    # 保存map
    _saveMap:->
        ['jsHash','jsMap','allDeepDeps'].forEach (key)->
            Utils.saveMapFile(key)

    # build all
    buildAll: (cb)->
        _cb = cb or ->
        _this = @
        _this.coreModule ->
            _this.combAllMods ->
                _this.combNormalJs ->
                    _cb()
    # 入口
    init:(cb)->
        _cb = cb or ->
        _this = @
        Utils.getMap("jsMap")
        Utils.getMap("jsHash")
        Utils.buildReqCfg()
        _this.toAmd ->
            Utils.saveMapFile('jsSource')
            if _this.opts.force
                global.Cache["jsHash"] = {}
                _this.buildAll ->
                    _this._saveMap()
                    _cb()
            else if _this.env isnt 'local' and _this.env isnt 'dev'
                _this.buildAll ->
                    _this._saveMap()
                    _cb()
            else
                if _this.isDebug and _this.env is 'local'
                    _this.buildAll ->
                        _cb()
                else
                    _cb()


module.exports = JsCtl