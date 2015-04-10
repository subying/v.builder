###
# 服务端html模板构建和压缩模块
###

fs      = require 'fs'
path    = require 'path'
gulp    = require 'gulp'
plumber = require 'gulp-plumber'
gutil   = require 'gulp-util'
config  = require '../config'
include = require './include'
butil   = require './butil'
getJSONSync = butil.getJSONSync
errrHandler = butil.errrHandler
color   = gutil.colors


evn = config.evn
isCombo = config.isCombo

htmlPath = config.htmlPath
htmlSrc = config.htmlSrc

_jsPath = config.jsDistPath
_cssPath = config.cssDistPath
_mapPath = config.mapPath

_jsMapName = config.jsMapName
_cssMapName = config.cssMapName

# 压缩html
minhtml = (data)->
    _path = String(data.path)
    return false if _path.indexOf('src/html/_') isnt -1
    _name = _path.split('src/html/')[1]
    _soure = String(data.contents)
    if evn isnt 'dev' and evn isnt 'debug'
        _soure = _soure.replace(/<!--([\s\S]*?)-->/g, '')
                       .replace(/\/\*([\s\S]*?)\*\//g, '')
                       .replace(/\n/g, '')
                       .replace(/\t/g, '')
                       .replace(/\r/g, '')
                       .replace(/\n\s+/g, ' ')
                       .replace(/>([\n\s+]*?)</g,'><')
    fs.writeFileSync path.join(htmlPath, _name), _soure, 'utf8'


htmlctl = (file,cb)->
    if typeof file is 'function'
        files = "#{htmlSrc}**/*.html"
        cb = file or ->
    else
        files = file or "#{htmlSrc}**/*.html"
        cb = cb or ->
    jsmap = getJSONSync path.join(_mapPath,_jsMapName)
    cssmap = getJSONSync path.join(_mapPath,_cssMapName)
    hashMaps = butil.objMixin jsmap,cssmap

    # html模板引擎配置
    opts = 
        prefix: '@@'
        basepath: '@file'
        evn: evn
        isCombo: isCombo
        staticRoot: config.staticRoot
        staticPaths:
            css:
                src: config.cssOutPath
                dist: config.cssDistPath
            js:
                src: config.jsOutPath
                dist: config.jsDistPath
        hashmap: hashMaps
        # context:
        #     combo_css: true
        #     combo_js: true
    gutil.log color.yellow "Combine html templates..."
    gulp.src([files])
        .pipe plumber({errorHandler: errrHandler})
        .pipe include(opts)
        .on "data",(data)->
            minhtml(data)   
        .on "end",->
            gutil.log color.green "Html templates done!"
            cb()

module.exports = htmlctl