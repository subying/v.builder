###
# js生产文件构建类
###

fs      = require 'fs'
path    = require 'path'
config  = require '../config'
amdeps  = require './amdeps'
flctl   = require './flctl'
_       = require 'lodash'
gulp    = require 'gulp'
revall  = require 'gulp-rev-all'
uglify  = require 'uglify-js'
_uglify = require 'gulp-uglify'
header  = require 'gulp-header'
pkg     = require '../package.json'
info    = '/* <%= pkg.name %>@v<%= pkg.version %>, @description <%= pkg.description %>, @author <%= pkg.author.name %>, @blog <%= pkg.author.url %> */\n'
rjs     = require 'gulp-requirejs'
plumber = require 'gulp-plumber'
gutil   = require 'gulp-util'
color   = gutil.colors
# jshint  = require 'jshint'
# JSHINT  = jshint.JSHINT

### 构建AMD模块依赖表的基类 ###
jsDepBuilder = amdeps.bder

butil      = require './butil'
errrHandler = butil.errrHandler
objMixin    = butil.objMixin

###
# 合并AMD模块到debug目录的继承类
###
class jsToDev extends jsDepBuilder
    prefix: config.prefix
    outPath: config.jsOutPath
    distPath: config.jsDistPath
    libsPath: config.jsLibPath
    configStr: "
        window['#{config.configName}'] = #{JSON.stringify(config.configDate, null, 2)}
        "
    ### AMD模块加载JS与第三方JS合并成核心JS库 ###
    rjsBuilder: (modules,cb)=>
        _cb = cb or ->
        _baseUrl = @srcPath
        _destPath = @outPath
        _name = 'almond'
        # _veCfgFile = config.veCfgFileName
        _include = _.union ['jquery','smcore'].concat(modules)
        # console.log _include
        if config.indexModuleName not in _include
            _outName = config.coreJsName
        else
            _outName = config.indexJsDistName
        _paths = JSON.parse fs.readFileSync(path.join(config.dataPath, 'jslib.paths.json'), 'utf8')
        _shim = JSON.parse fs.readFileSync(path.join(config.dataPath, 'shim.json'), 'utf8')
        
        _rjs = rjs
            baseUrl: _baseUrl
            # mainConfigFile: _mainConfigFile
            paths: _paths
            name: _name
            include: _include
            out: _outName + '.js'
            shim: _shim

        _rjs.on 'data',(output)->
            _soure = String(output.contents)
            _outPath = _destPath + _outName + '.js'
            fs.writeFileSync _outPath, _soure, 'utf8'
            _cb()

    ### 合并所有第三方lib模块 ### 
    coreModule: (cb)=>
        _cb = cb or ->
        _makeDeps = @makeDeps()
        _depLibs = _makeDeps.depLibs        
        # 核心库队列
        _modules = ['jquery'].concat(_depLibs)
        @rjsBuilder _modules,-> _cb()

    ### 合并首页模块 ###
    indexModule: (cb) =>
        _cb = cb or ->
        _index_module_name = config.indexModuleName
        _index_moduleDeps = @makeDeps().allDeps[_index_module_name]
        _modules = _index_moduleDeps.libList.concat(_index_moduleDeps.modList)
        _modules.push(_index_module_name)
        # gutil.log _modules
        @rjsBuilder _modules,-> _cb()

    ### 合并单个模块 ###
    oneModule: (name,cb)=>
        _cb = cb or ->
        _module_name = name

        # 过滤下划线的js模块
        # console.log "_module_name==   " + _module_name
        return _cb() if _module_name.indexOf("_") is 0

        _num = 0

        if _module_name.indexOf("/") is -1 or _module_name.indexOf('.') is 0
            gutil.log "#{_module_name}not an AMD module"
            return _cb()

        if _module_name is config.indexModuleName
           return @indexModule -> 
                  gutil.log color.cyan(config.indexJsDistName + '.js'),"build success"
        else 
            _jsData = []
            _module_path = @srcPath
            _out_path = @outPath
            _moduleDeps = @makeDeps().allDeps[_module_name].modList
            _this_js = path.join _module_path, _module_name + '.js'
            _devName = @prefix + _module_name.replace(/\//g, '_') + '.js'
            _devPath = @outPath + _devName
            # console.log _moduleDeps
            for f in _moduleDeps
                _jsFile = path.join(_module_path, f + '.js')
                if fs.statSync(_jsFile).isFile()
                    _source = fs.readFileSync(_jsFile, 'utf8')
                    # !!JSHINT(_source)
                    # JSHINT.errors.filter (error)->
                    #     if error
                    #         gutil.log color.cyan(f)," error in line #{error.line}==>"
                    #         console.log error.reason
                    _jsData.push _source + ';'
            # 追加当前模块到队列的最后
            _jsData.push fs.readFileSync(_this_js, 'utf8') + ';'
            try
                # mangled = uglify.minify String(_jsData.join('')),
                #             fromString: true
                # source = mangled.code
                # has = md5(source).substring(0,10)
                source = _jsData.join('')
                fs.writeFileSync _devPath, source, 'utf8'
                _num++
                _cb()
            catch error
                gutil.log "Error: #{_devName}"
                gutil.log error

    ### 合并js模块 ###
    modulesToDev: (cb)=> 
        _cb = cb or ->
        _srcPath = @srcPath
        _allDeps = @makeDeps().allDeps
        # console.log _allDeps
        _depList = _allDeps.modList
        # 生成依赖
        _num = 0
        gutil.log color.yellow "Combine javascript modules! Waitting..."
        for module,deps of _allDeps
            # 过滤下划线的js模块
            if module.indexOf("_") isnt 0
                # 排除首页模块
                # if module isnt config.indexModuleName
                _this_js = path.join(_srcPath, module + '.js')
                # console.log "module---------->   " + module
                _devName = @prefix + module.replace(/\//g,'_') + '.js'
                # console.log "_devName-------->   " + _devName
                _devPath = @outPath + _devName
                _jsData = []  
                _modList = deps.modList
                # console.log _modList
                for f in _modList
                    _jsFile = path.join(_srcPath, f + '.js')
                    if fs.statSync(_jsFile).isFile() and f.indexOf('.') != 0
                        _source = fs.readFileSync(_jsFile, 'utf8')
                        _jsData.push _source + ';'
                # 追加当前模块到队列的最后
                _jsData.push fs.readFileSync(_this_js, 'utf8') + ';'
                gutil.log "Waitting..." if _num % 10 == 0 and _num > 1
                try
                    source = _jsData.join('')
                    fs.writeFileSync _devPath, source, 'utf8'
                    _num++
                catch error
                    gutil.log "Error: #{_devName}"
                    gutil.log error
        _cb(_num)

    # build all modules to dev
    init: (cb)=>
        _cb = cb or ->
        _modulesToDev = @modulesToDev
        _coreModule = @coreModule
        _indexModule = @indexModule
        _modulesToDev (num)->
            gutil.log color.cyan(num),"javascript modules combined!"
            # build core module
            _coreModule ->
                gutil.log '\'' + color.cyan("#{config.coreJsName}") + '\'',"combined!"
                # build index module
                _indexModule ->
                    gutil.log '\'' + color.cyan("#{config.indexJsDistName}") + '\'',"combined!"
                    gutil.log color.green "All javascript combined!"
                    _cb()

###
# js生产文件的构建类
###
class jsToDist
    # constructor: (@prefix) ->
    jsPath:  config.jsOutPath
    jsDistPath: config.jsDistPath
    mapPath: config.mapPath
    getMap: butil.getJSONSync path.join(config.mapPath, config.jsMapName)
    getOldMap: butil.getJSONSync path.join(config.mapPath, "old_" + config.jsMapName)
    # 读取生产目录中的js文件名，并返回数组
    jsDistList: =>
        _jsList = new flctl('.js').getList()
        return _jsList or []

    ### 判断js是否有改变 ###
    isChange:(name)=>
        _valName = name
        _keyName = name.split('.')[0] + '.js'
        _map = @getMap
        _jsList = @jsDistList()
        # console.log _distList
        return {
            status: not _.has(_map,_keyName) or _map[_keyName].replace('/','') isnt name or name not in _jsList
            key:_keyName
            valule: _map[_keyName] or ""
        }
    ### 更新上一个版本的js Hash表 ###
    updateMap:(newMap,cb)=>
        _map = @getMap
        _oldMap = @getOldMap
        _temp = objMixin _map,newMap
        _newMap = objMixin _oldMap,_temp
        _file = path.join config.mapPath, "old_" + config.jsMapName
        _str = JSON.stringify(_newMap, null, 2)
        fs.writeFileSync _file, _str, 'utf8'
        cb()

    ### 推送js到生产目录 并生成最新的hash map ###
    push: (cb)=>
        _cb = cb or ->
        _jsPath  =  @jsPath
        _jsDistPath = @jsDistPath
        _mapPath = @mapPath      
        _isChange = @isChange
        _updateMap = @updateMap
        _count = 0
        _Map = @getMap
        _newMap = {}
        _pushJs = gulp.src [_jsPath + "*.js"]
            .pipe plumber({errorHandler: errrHandler})
            .pipe _uglify() 
            .pipe header(info, { pkg : pkg })
            .pipe revall({
                    hashLength: config.hashLength
                    silent: true
                })
            .pipe gulp.dest(_jsDistPath)
            .on 'data',(output)->
                _soure = String(output.contents)
                _name = path.basename output.path
                gutil.log "Waitting..." if _count%10 is 0
                result = _isChange(_name)
                if result.status
                    gutil.log "#{_name} is change!!!"
                    _newMap[result.key] = result.valule
                    # _outPath = _jsDistPath + _name
                    # fs.writeFileSync _outPath, _soure, 'utf8'
                _count++
            .pipe revall.manifest({ fileName: config.jsMapName })
            .pipe gulp.dest(_mapPath)   
            .on 'end', ->
                _updateMap _newMap,->
                    _cb()


exports.dev = jsToDev
exports.dist = jsToDist