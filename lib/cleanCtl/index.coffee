fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
crypto  = require 'crypto'
vfs     = require 'vinyl-fs'
gutil   = require 'gulp-util'
# less    = require 'gulp-less'
# mincss  = require 'gulp-clean-css'
# sourcemaps = require 'gulp-sourcemaps'
# autoprefixer = require 'gulp-autoprefixer'
plumber = require 'gulp-plumber'
color   = gutil.colors
Utils   = require '../utils'
# ImgCtl  = require '../imgCtl'


class cleanCtl
    # 参数初始化
    constructor:(@opts)->
        # console.log @opts
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

    init: (cb)->
        _cb = cb || ->
        _distPath = @distPath
        Utils.getMap("cssMap")
        Utils.getMap("jsMap")
        Utils.getMap("jsHash")
        types = ['img','css','js','fonts']
        files = []
        files.push(_distPath + "**/*.*")
        files.push("!" + _distPath + "**/*.json")
        types.forEach (type)->
            _map = global.Cache[type + "Map"]
            for key,val of _map
                files.push("!" + path.join(_distPath,type,key))
                _map[key].distname && files.push("!" + path.join(_distPath,type,_map[key].distname))

        vfs.src(files)
        .on 'data',(file)->
            fs.unlinkSync(file.path)
            gutil.log "Delete","'" + color.cyan(file.relative) + "'..."
        .on 'end',->
            _cb()
            

module.exports = cleanCtl
