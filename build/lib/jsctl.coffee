###*
# 将jS的debug文件push到生产目录
# @date 2014-12-2 15:10:14
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
config  = require '../config'
gulp    = require 'gulp'
gutil   = require 'gulp-util'
uglify = require 'gulp-uglify'
plumber = require 'gulp-plumber'
# rename  = require 'gulp-rename'
header  = require 'gulp-header'
pkg     = require '../package.json'
info    = '/***<%= pkg.name %>@v<%= pkg.version %>, @description <%= pkg.description %>, @author <%= pkg.author.name %>, @blog <%= pkg.author.url %>***/\n'

color = gutil.colors

# CSS和雪碧图的相关path
_jsPath        = config.jsOutPath
_jsDistPath    = config.jsDistPath
_jsMapName     = config.jsMapName
_mapPath        = config.mapPath
_hashLen        = config.hashLength
_isCombo         = config.isCombo


butil       = require './butil'
errrHandler = butil.errrHandler
md5         = butil.md5


###
# js 生产文件处理函数
# @param {string} files 接收一个路径参数，同gulp.src
# @param {function} cb 处理过程中，处理一个buffer流的回调
# @param {function} cb2 所有buffer处理完成后的回调函数
###

_stream = (files,cb,cb2)->
    gulp.src [files]
    .pipe plumber({errorHandler: errrHandler})
    .pipe uglify()
    .pipe header(info, { pkg : pkg })
    .on 'data',(source)->
        _nameObj = path.parse source.path
        _nameObj.hash = md5(source.contents)
        _source = String(source.contents)
        cb(_nameObj,_source)
    .on 'end',cb2

# 生成js的生产文件
_buildJs = (name,source)->
    butil.mkdirsSync(_jsDistPath)
    fs.writeFileSync path.join(_jsDistPath, name), source, 'utf8'

# 生成js的Hash Map
_buildJsMap = (data,cb)->
    jsonData = JSON.stringify data, null, 2
    butil.mkdirsSync(_mapPath)
    fs.writeFileSync path.join(_mapPath, _jsMapName), jsonData, 'utf8'
    cb()

###
# js生产文件构建函数
# @param {string} file 同gulp.src接口所接收的参数，默认是js debug目录中的所有js文件
# @param {function} done 回调函数
###
pushJs = (file,done)->
    _jsMap = {}
    gutil.log "Push Js to dist."
    if not file
        _done = ->
        _file = _jsPath + '*.js'
    else if typeof file is 'function'
        _done = file
        _file = _jsPath + '*.js'
    else
        _file = file
        _done = done
    _stream(
        _file
        ,(obj,source)->
            _source = source
            _distname = obj.name + (if not _isCombo then  '.' + obj.hash.substr(0,_hashLen) else '' ) + obj.ext
            _jsMap[obj.base] = 
                hash : obj.hash
                distname : _distname
            _buildJs _distname,_source
        ,->
            _buildJsMap _jsMap,->
                gutil.log color.green 'Pushed!'
                _done()
    ) 

module.exports = pushJs
