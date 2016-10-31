fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
amdclean = require 'amdclean'
gutil   = require 'gulp-util'
color   = gutil.colors
Utils   = require '../utils'
pkg     = require '../../package.json'


###*
 * @fileOverview js构建基础类库
###
class JsInit
    constructor:(@opts)->
        # console.log @opts
        @amdReg = /;?\s*define\s*\(([^(]*),?\s*?function\s*\([^\)]*\)/
        @expStr = /define\s*\(([^(]*),?\s*?function/
        @depArrReg = /^[^\[]*(\[[^\]\[]*\]).*$/
        @jsImgReg = /STATIC_PATH\s*\+\s*(('|")\/img\/.*?\.(jpg|png|gif)('|"))/g
        #@jsImgReg = /STATIC_PATH\s*\+\s*(('|")[\s\S]*?(.jpg|.png|.gif)('|"))/g
        @staticUriReg = /(getStaticUri\.(img|css|js)\(??.*\.(jpg|png|gif|css|js)('|")\))|(STATIC_PATH\s*\+\s*(('|")\/img\/.*?\.(jpg|png|gif)('|")))/g
        @info = "/**\n *Uglify by #{pkg.name}@v#{pkg.version}\n *@description:#{pkg.description}\n *@author:Pang.J.G\n *@homepage:#{pkg.homepage}\n */\n"

        @root = @opts.root
        @env = @opts.env
        @isDebug = @opts.isDebug

        @srcPath = @opts.srcPath + 'js/'
        @debugPath = @opts.debugPath + 'js/'
        @distPath = @opts.distPath + 'js/'
        @mapPath = @opts.mapPath

        @prefix = @opts.prefix
        @hashLen = @opts.hashLen
        @coreMods = @opts.coreJs.mods
        @coreModsName = @opts.coreJs.name
        @vendorPath = @debugPath + 'vendor'
        @jsMap = @mapPath + 'jsmap.json'
        @jsLibs = @mapPath + 'jslibs.json'

    # 字符串转化为对象 
    tryEval: (str)-> 
        try 
            json = eval('(' + str + ')')
        catch err

    # 过滤依赖表里的关键词，排除空依赖 
    filterDepMap: (depMap)->
        _depMap = depMap.filter (dep)->
            return ["require", "exports", "module", ""].indexOf(dep) == -1
        _depMap.map (dep) -> 
            return dep.replace(/\.js$/,'')
        return _depMap

    # 将绝对路径转换为AMD模块ID
    madeModId: (filepath)->
        return filepath.replace(/\\/g,'/')
                       .split('/js/')[1]
                       .replace(/.js$/,'')

    # 将相对路径转换为AMD模块ID
    madeModList: (depArr,curPath)->
        _this = @
        _arr = []
        if depArr.length > 0
            _.forEach depArr,(val)->
                _val = val
                if _val.indexOf('../') is 0 or _val.indexOf('./') is 0
                    _filePath = path.join curPath,_val
                    _val = _this.madeModId(_filePath)
                _arr.push _val
        return _arr

    # 将js数组转字符串
    arrToString: (arr)->
        _str = ""
        if arr.length > 0
            _.forEach arr,(val,n)->
                _str += (if n > 0 then "," else "") + "'#{val}'"
        return "[#{_str}]"

    # 获取正则表达式中的key
    getRegKey: (str,type)->
        return str.replace("getStaticUri.#{type}(","")
                  .replace(')','')
                  .replace(/(^\'|\")|(\'|\"$)/g, '')

    # 获取key对应的生产名字
    getDistName: (key,map)->
        return if _.has(map,key) then map[key].distname else key #+ '?t=' + String(new Date().getTime()).substr(0,8)

    # 替换js中的getStaticUri，给请求的资源增加MD5戳，解决缓存问题
    replaceStaticResName: (res)->
        _this = @
        _getStr = (strs,type)->
            map = Utils.getMap(type)
            key = _this.getRegKey(strs,type)
            val = _this.getDistName(key,map)
            # console.log val
            return strs.replace(key, val)

        _res = res.replace _this.staticUriReg,(str)->
            if str.indexOf('/img/') > -1
                _map = Utils.getMap('img')
                key = str.match(/\/img\/.*\.(png|jpg|gif)/)[0]
                         .replace('/img/', '')
                val = _this.getDistName(key,_map)
                return str.replace(key, val)
            else if str.indexOf('getStaticUri.img(') is 0
                return _getStr(str,'img')
            else if str.indexOf('getStaticUri.css(') is 0
                return _getStr(str,'css')
            else if str.indexOf('getStaticUri.js(') is 0
                return _getStr(str,'js')
            else 
                return str
                
        return _res
        
    ###*
     * 获取具名AMD模块的依赖表
     * @param  {String} file_path [AMD模块文件的路径]
     * @return {Array}  [模块的依赖数组]
    ###
    getOneJsDep: (source)=>
        _this = @
        _list = []
        source.replace _this.amdReg, (str, map)-> 
            depStr = map.replace _this.depArrReg, "$1"
            if /^\[/.test(depStr)
                _arr = _this.tryEval depStr
                try 
                    _list = _this.filterDepMap _arr
                catch err
                    console.log err
        return _list

    # 核心模块过滤方法
    coreModsFilter: (arr)->
        _temp = []
        for f in arr
            _temp.push f if f not in @coreMods
        return _temp
    
    # 过滤AMD，输出原生js
    amdClean: (source)->
        s = amdclean.clean({
            code: source
            wrap:
                start: ''
                end:''
            })
        return s




module.exports = JsInit