fs      = require 'fs'
path    = require 'path'
vfs     = require 'vinyl-fs'
Utils   = require '../utils'
# Imagemin = require 'imagemin'
imagemin = require('imagemin-pngquant')
through2 = require 'through2'

class ImgCtl
    constructor:(@opts)->
        @hashLen = @opts.hashLen
        @imgSrcPath = @opts.srcPath + 'img'
        @imgDebugPath = @opts.debugPath + 'img'
        @imgDistPath = @opts.distPath + 'img'
        @imgMapFile = @opts.mapPath + 'imgmap.json'
        @map = {}
    # 设置dist输出文件名
    # 即 filename.{ext}  --> filename.{md5-hash}.{ext}
    _setDistPath: ()->
        _this = @
        # _imgDistPath = _this.imgDistPath
        return through2.obj (file, enc, callback)->
            _name = file.relative.replace(/\\\\/g,'/')
                                 .replace(/\\/g,'/')
            _imgContent = file.contents.toString()
            _hash = Utils.md5(_imgContent)
            _parse = path.parse(file.path)
            _distPath = Utils.setDistPath(_parse,_hash)
            _distName = path.join(path.dirname(_name),path.basename(_distPath))
            _this.map[_name] = {}
            _this.map[_name].hash = _hash
            _this.map[_name].distname = _distName.replace(/\\\\/g,'/')
                                            .replace(/\\/g,'/')

            file.path = _distPath
            return callback(null,file)

    # 复制img文件
    copyImgs: (cb)->
        _this = @
        _imgSrcPath = _this.imgSrcPath
        _imgDebugPath = _this.imgDebugPath
        _imgDistPath = _this.imgDistPath

        vfs.src [_imgSrcPath + '/*.{gif,jpg,png,svg}',_imgSrcPath + '/**/*.{gif,jpg,png,svg}']
            .pipe imagemin({quality: '65-80', speed: 4})()
            .pipe vfs.dest(_imgDebugPath)
            .pipe vfs.dest(_imgDistPath)
            .pipe _this._setDistPath()
            .pipe vfs.dest(_imgDistPath)
            .on 'end',->
                cb and cb()

    init:(cb)->
        _this = @
        _this.copyImgs ->
            global.Cache['imgMap'] = _this.map
            Utils.updateMap(_this.map,'imgMap')
            Utils.saveMapFile('imgMap')
            cb && cb()

module.exports = ImgCtl
