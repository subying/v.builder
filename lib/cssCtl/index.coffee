###*
* @fileOverview 将CSS的debug文件push到生产目录，并将引用到的背景图片自动添加hash后缀
*
* @author pjg <iampjg@gmail.com>
* @link http://pjg.pw
* @version $Id$
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
crypto  = require 'crypto'
vfs     = require 'vinyl-fs'
gutil   = require 'gulp-util'
less    = require 'gulp-less'
mincss  = require 'gulp-clean-css'
gulpif  = require 'gulp-if'
# sourcemaps = require 'gulp-sourcemaps'
autoprefixer = require 'gulp-autoprefixer'
through2 = require 'through2'
plumber = require 'gulp-plumber'
color   = gutil.colors
Utils   = require '../utils'
ImgCtl  = require '../imgCtl'


class CssCtl
    # 参数初始化
    constructor:(@opts)->
        @root = @opts.root
        @hashLen = @opts.hashLen

        @srcPath = @opts.srcPath
        @debugPath = @opts.debugPath
        @distPath = @opts.distPath

        @lessPath = @srcPath + 'less'
        @cssDebugPath = @debugPath + 'css'

        @imgDistPath = @distPath + 'img'
        @cssDistPath = @distPath + 'css'


        @env = @opts.env
        @isDebug = @opts.isDebug

        Utils.getMap('imgMap') if not _.has(global.Cache,'imgMap')
        @imgMap = global.Cache['imgMap']

        Utils.getMap('fontsMap') if not _.has(global.Cache,'fontsMap')
        @fontsMap = global.Cache['fontsMap']

        @map = {}


    # 替换背景图片，带上md5版本戳
    _replaceImgPaths: (source)->
        _this = @
        _imgMap = _this.imgMap
        _fontsMap = _this.fontsMap
        _sPath = source.relative

        # 计算CSS文件的目录深度
        _pathDeeps = ''
        _temArr = _sPath.split('/')
        for i,k in _temArr
            _pathDeeps += '../'

        # 文件相对路径的对象
        _contents = source.contents
        _nameObj = path.parse(_sPath)
        _nameObj.hash = Utils.md5(_contents)

        # 替换CSS中的背景图片，加上md5版本戳
        _cssBgReg = /url\s*\(([^\)]+)\)/g
        _source = String(_contents).replace _cssBgReg, (str,map)->
            # console.log str
            # 过滤一些标签
            if map.indexOf('fonts/') isnt -1 or map.indexOf('font/') isnt -1 or map.indexOf('#') isnt -1 or map.indexOf('//:') isnt -1 or map.indexOf('about:') isnt -1 or map.indexOf('data:') isnt -1
                return str
            else
                key = map.split('/img/')[1]
                         .replace(/(^\'|\")|(\'|\"$)/g, '')
                # console.log key
                val = _pathDeeps + "img/"
                val += if _.has(_imgMap,key) then _imgMap[key].distname else  key + '?t=' + String(new Date().getTime()).substr(0,8)
                # console.log val
                return str.replace(map, val)
        return _source
   
    # 替换CSS背景图片,带上版本
    _imgAddHash: ->
        _this = @
        lessPath = _this.lessPath
        cssDebugPath = _this.cssDebugPath
        imgDistPath = _this.imgDistPath
        cssDistPath = _this.cssDistPath
        return through2.obj (file, enc, callback)->
            _con = _this._replaceImgPaths(file)
            file.contents = new Buffer(_con)
            return callback(null,file)

    # 设置dist输出文件名
    # 即 filename.{ext}  --> filename.{md5-hash}.{ext}
    _setDistPath: ->
        _this = @
        # _imgDistPath = _this.imgDistPath
        return through2.obj (file, enc, callback)->
            _name = file.relative.replace(/\\\\/g,'/')
                                 .replace(/\\/g,'/')
            _con = file.contents.toString()
            _hash = Utils.md5(_con)
            _parse = path.parse(file.path)
            _distPath = Utils.setDistPath(_parse,_hash)
            _distName = Utils.tranFilePath(path.join(path.dirname(_name),path.basename(_distPath)))
            _this.map[_name] = {}
            _this.map[_name].hash = _hash
            _this.map[_name].distname = _distName
            file.path = _distPath
            return callback(null,file)        

    ###*
     * 从less生成css源码
    ###
    less2css: ()->
        gutil.log 'Starting','\'' + color.cyan('LESS-->CSS') + '\'...'
        _this = @
        _files = [
            path.join(@lessPath, '*.less')
            path.join(@lessPath, '**/*.less')
            "!#{path.join(@lessPath, '_*.less')}"
            "!#{path.join(@lessPath, '_**/*.less')}"
            "!#{path.join(@lessPath, '_**/**/*.less')}"
            "!#{path.join(@lessPath, '_**/**/**/*.less')}"
        ]
        _lessPath = _this.lessPath
        _cssDebugPath = _this.cssDebugPath
        _cssDistPath = _this.cssDistPath
        condition = @isDebug or @env not in ['local','dev']
        return new Promise (resolve,reject)->
            try
                cssStream = vfs.src(_files)
                .pipe plumber({errorHandler: Utils.errrHandler})
                .pipe less
                        compress: false
                        paths: [_lessPath]
                .pipe autoprefixer()
                .pipe vfs.dest(_cssDebugPath)
                if condition
                    cssStream.pipe mincss({
                            keepBreaks:false
                            compatibility: 'ie7'
                        })
                    .pipe _this._imgAddHash()
                    .pipe vfs.dest(_cssDistPath)
                    .pipe _this._setDistPath()
                    .pipe vfs.dest(_cssDistPath)
                    .on 'end',->
                        _this.buildMap()
                        resolve(_this.map)
                    .on 'error',(err)->
                            reject(err)
                else
                    cssStream.on 'end',->
                        resolve(_this.map)
                    .on 'error',(err)->
                        reject(err)
            catch err
                reject(err)
                # _cb()

    # 更新cssmap.json
    buildMap:->
        global.Cache['cssMap'] = @map
        Utils.updateMap(@map,'cssMap')
        Utils.saveMapFile('cssMap')
    
    init: (cb)->
        _this = @
        cb = cb or ->
        _this.less2css()
        .then (map)->
            cb(map)
        .catch (err)->
            cb(err)

            

module.exports = CssCtl
