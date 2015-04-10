###*
# 将CSS的debug文件push到生产目录，并将引用到的背景图片自动添加hash后缀
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
revall  = require 'gulp-rev-all'
gutil   = require 'gulp-util'
mincss  = require 'gulp-minify-css'
plumber = require 'gulp-plumber'
flctl   = require './flctl'

# CSS和雪碧图的相关path
_cssPath        =  config.cssOutPath
_cssDistPath    = config.cssDistPath
_cssBgDistPath  = config.cssBgDistPath
_cssMapName     = config.cssMapName
_spMapName      = config.spMapName
_spDistPath     = config.spriteDistPath
_mapPath        = config.mapPath
_hashLen        = config.hashLength

butil       = require './butil'
errrHandler = butil.errrHandler
objMixin    = butil.objMixin

# 定义两个临时空数组，用来存储CSS背景图片路径
_cssBgImg = []
_cssSpImg = []

_getDistList= (type)->
    _type = type or '.css'
    _list = new flctl(_type).getList()
    return _list or []

try
    getMap = JSON.parse fs.readFileSync(path.join(config.mapPath, _cssMapName), 'utf8')
    getOldMap = JSON.parse fs.readFileSync(path.join(config.mapPath, "old_" + _cssMapName), 'utf8')


    getSpMap = JSON.parse fs.readFileSync(path.join(config.mapPath, _spMapName), 'utf8')
    getOldSpMap = JSON.parse fs.readFileSync(path.join(config.mapPath, "old_" + _spMapName), 'utf8')
catch e
    # ...

### 判断css是否有改变 ###
_isChange= (name)->
    _name = name
    _temp = _name.split('.')
    _type = "." + _temp[2]
    _keyName = _temp[0] + _type
    _list = _getDistList(_type)
    _map = {}
    # console.log "_type===>  #{_type}"
    if _type is '.css'
        _map = getMap or {}
    else if _type is '.png'
        _map = getSpMap  or {}
    return {
        status: not _.has(_map,_keyName) or _map[_keyName].replace('/','') isnt _name or _name not in _list
        key: _keyName
        valule: _map[_keyName] or ""
    }

### 更新上一个版本的Hash表 ###
_updateMap= (type,newMap,cb)->
    _oldMap = getOldMap
    _oldMap = _map = {}
    if type is '.css'
        _map = getMap or {}
        _oldMap = getOldMap or {}
        _file = path.join config.mapPath, "old_" + _cssMapName
    else if type is '.png'
        _map = getSpMap or {}
        _oldMap = getOldSpMap  or {}
        _file = path.join config.mapPath, "old_" + _spMapName
    _temp = objMixin _map,newMap
    _newMap = objMixin _oldMap,_temp
    fs.writeFileSync _file, JSON.stringify(_newMap, null, 2), 'utf8'
    cb()

_pushImg = (paths,destPath,done)->
    _newMap = {}
    gulp.src(paths)
        .pipe plumber({errorHandler: errrHandler})
        .pipe(revall({
            hashLength: _hashLen
            silent: true
            }))
        .pipe(gulp.dest(destPath))
        .on 'data',(output)->
            _path = output.path
            _name = path.basename _path
            _result = _isChange(_name)
            if _result.status and _path.indexOf(config.spriteDistPath) isnt -1
                gutil.log "#{_name} is change!!!"
                _newMap[_result.key] = _result.valule
        .pipe(revall.manifest({ fileName: _spMapName }))
        .pipe(gulp.dest(_mapPath)) 
        .on 'end',->
            done(_newMap)

_pushCss = (done)->
    _newMap = {}
    gulp.src([_cssPath + '*.css']) 
        .pipe plumber({errorHandler: errrHandler})
        .pipe(mincss({
            keepBreaks:false
            compatibility:
                properties:
                    iePrefixHack:true
                    ieSuffixHack:true
        }))   
        .pipe(revall({
            hashLength: _hashLen
            silent: true
            # prefix: '//localhost/'
            transformPath: (rev, source, src) ->
                _srcPath = src.path
                rev = rev.replace "../_img/", "../../img/"
                if source.indexOf('../_img/sp/') is 0
                    _cssSpImg.push(_srcPath)
                else if source.indexOf('../_img/bg/') is 0
                    _cssBgImg.push(_srcPath) if _srcPath not in _cssBgImg
                return rev
        }))
        .pipe(gulp.dest(_cssDistPath))
        .on 'data',(output)->
            _name = path.basename output.path
            _result = _isChange(_name)
            if _result.status
                gutil.log "#{_name} is change!!!"
                _newMap[_result.key] = _result.valule
        .pipe(revall.manifest({ fileName: _cssMapName }))
        .pipe(gulp.dest(_mapPath))
        .on 'end', ->
            done(_newMap)

# 构建函数
_css2dist = (cb)->
    _cb = cb or ->
    _pushCss (data)->
        # console.log _cssBgImg
        # console.log _cssSpImg
        _updateMap '.css',data,->
            _pushImg _cssBgImg,_cssBgDistPath,->
                gutil.log 'CSS bg pushed'
                _pushImg _cssSpImg,_spDistPath,(data)->
                    gutil.log 'CSS SP_bg pushed'
                    _updateMap '.png',data,->
                        _cb()

module.exports = _css2dist
