###
# 项目初始化
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
gutil   = require 'gulp-util'
color   = gutil.colors


butil   = require './butil'
config  = require '../config'
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
                if fs.statSync(jsPath).isFile() and f.indexOf('.js') != -1 and f.indexOf('.') != 0 
                    namePaths[v] = "../../../libs/#{v}/#{f.replace('.js', '')}"
    jsonData = JSON.stringify namePaths, null, 4
    # gutil.log jsonData
    dataPath = config.dataPath
    not fs.existsSync(dataPath) and butil.mkdirsSync(dataPath)
    fs.writeFileSync path.join(dataPath, 'jslib.paths.json'), jsonData, 'utf8'
    gutil.log color.green "jslib.paths.json build success"
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