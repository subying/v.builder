###
# 项目初始化
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
Imagemin = require 'imagemin'
gutil   = require 'gulp-util'
color   = gutil.colors

rename = require 'gulp-rename'
butil   = require './butil'
config  = require '../config'

md5     = butil.md5
init = {}

###
# init dist, cache and watch DIRS
###
init.dir = ->
    init_dir = [
        config.rootPath
        config.lessPath
        config.jsSrcPath
        config.tplSrcPath
        config.htmlSrc
        config.spriteSrcPath
        config.spriteLessOutPath
        config.cssDistPath
        config.jsDistPath
        config.tplDistPath
        config.mapPath
        config.spriteDistPath
        config.cssBgDistPath
        config.cssOutPath
        config.jsOutPath
        config.spriteImgOutPath
    ]

    for _dir in init_dir
        butil.mkdirsSync(_dir)
        gutil.log "#{_dir} made success!"
###
# init map file 
###
init.map = ->       
    init_file = [
        config.jsMapName
        config.cssMapName
        config.spMapName
    ]
    for _file in init_file
        _dirpath = path.dirname(_file)
        not fs.existsSync(_dirpath) and butil.mkdirsSync(_dirpath)

        new_file = path.join config.mapPath, _file
        old_file = path.join config.mapPath, "old_" + _file
        not fs.existsSync(new_file) and fs.writeFileSync new_file, "{}", 'utf8'
        not fs.existsSync(old_file) and fs.writeFileSync old_file, "{}", 'utf8'
        
        gutil.log "#{config.mapPath}#{_file} made success!"


###
# build the three part's js libs paths
###
init.lib = (cb)->
    _cb = cb or ->
    namePaths = {}
    fs.readdirSync(config.jsLibPath).forEach (v)->
        jsLibPath = path.join(config.jsLibPath, v)
        if fs.statSync(jsLibPath).isDirectory()
            fs.readdirSync(jsLibPath).forEach (f)->
                jsPath = path.join(jsLibPath, f)
                if fs.statSync(jsPath).isFile() and f.indexOf('.') != 0 and f.indexOf('.js') != -1
                    namePaths[v] = "../../../libs/#{v}/#{f.replace('.js', '')}"
    jsonData = JSON.stringify namePaths, null, 4
    # gutil.log jsonData
    dataPath = config.dataPath
    not fs.existsSync(dataPath) and butil.mkdirsSync(dataPath)
    fs.writeFileSync path.join(dataPath, 'jslib.paths.json'), jsonData, 'utf8'
    gutil.log color.green "jslib.paths.json build success"
    _cb()

###
# build images
###
init.bgmap = (cb)->
    _cb = cb or ->
    _map = {}
    
    _imgSrcPath = config.imgSrcPath
    console.log _imgSrcPath
    # 递归输出文件的路径Tree和hash
    makePaths = (sup_path)->
        _sup_path = sup_path or _imgSrcPath
        _ext = ['.png','.jpg','.gif']
        fs.readdirSync(_sup_path).forEach (v)->
            sub_Path = path.join(_sup_path, v)
            if fs.statSync(sub_Path).isDirectory()
                makePaths(sub_Path)
            else if fs.statSync(sub_Path).isFile() and v.indexOf('.') != 0 and path.extname(sub_Path) in _ext
                # console.log sub_Path
                _name = sub_Path.replace(_imgSrcPath,'')
                # console.log _name
                _this_ext = path.extname(_name)
                _str = String fs.readFileSync(sub_Path, 'utf8')
                _hash = md5(_str)
                _distname = _name.replace(_this_ext,'.') + _hash.substring(0,config.hashLength) + _this_ext
                _map[_name] = {}
                _map[_name].hash = _hash
                _map[_name].distname = _distname
                _imgmin = new Imagemin()
                    .src(sub_Path)
                    .dest(config.imgDistPath)
                    .use(rename(_distname))

                _imgmin.run (err, files) ->
                        err and throw err
                        console.log(files[0].path)

    makePaths(config.imgSrcPath)
    jsonData = JSON.stringify _map, null, 2
    
    not fs.existsSync(config.mapPath) and butil.mkdirsSync(config.mapPath)
    fs.writeFileSync path.join(config.mapPath, config.cssBgMap), jsonData, 'utf8'
    gutil.log color.green "#{config.cssBgMap} build success"
    _cb()

###
# build require.config
###
init.cfg = (cb)->
    _cb = cb or ->
    # 读取json配置
    shimData = JSON.parse fs.readFileSync(path.join(config.dataPath, 'shim.json'), 'utf8')
    jsLibPaths = JSON.parse fs.readFileSync(path.join(config.dataPath, 'jslib.paths.json'), 'utf8')
    # 预留给第三方的js插件的接口
    jsPaths = JSON.parse fs.readFileSync(path.join(config.dataPath, 'paths.json'), 'utf8') 

    # 过滤核心库
    newPaths = {}
    for key,val of jsLibPaths
        if key isnt 'require' and key isnt 'almond' and key isnt 'amdloader'
            newPaths[key] = val
    rCfg =
        baseUrl: config.staticPath + 'src/js'
        paths: _.extend newPaths,jsPaths
        shim: shimData
        # cacheBust : _.extend jsHas, tplHas
    jsSrcPath = config.jsSrcPath
    
    configStr = "
        require.config(#{JSON.stringify(rCfg, null, 4)});\n
    "
    fs.writeFileSync path.join(jsSrcPath, "config.js"), configStr, 'utf8'

    gutil.log color.green "config.js build success"
    _cb()

module.exports = init