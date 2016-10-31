###*
* html模板构建和压缩模块
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
vfs     = require 'vinyl-fs'
gutil   = require 'gulp-util'
gulpif   = require 'gulp-if'
plumber = require 'gulp-plumber'
through2 = require 'through2'
color   = gutil.colors
Utils   = require '../utils'
include = require './include'

class HtmlCtl

    constructor:(@opts)->
        @root = @opts.root
        @htmlSrcPath = path.join @opts.srcPath , 'html/'
        @htmlDebugPath = path.join @opts.debugPath , 'html/'
        @htmlDistPath = @opts.viewPath
        @env = @opts.env
        @isDebug = @opts.isDebug
        @include = "@@include"
        @isMultiSite = false


    # 判断是否是多站点模式
    _isMultiSite:->
        _isMultiSite = false
        fs.readdirSync(@htmlSrcPath).forEach (file)->
            if /^@/.test(file)
                _isMultiSite = true
        @isMultiSite = _isMultiSite

    _replaceImg: ->
        _this = @
        return through2.obj (file, enc, callback)->
            # 给html中的图片链接加上Hash
            _source = Utils.replaceImg(String(file.contents))
            file.contents = new Buffer(_source)
            return callback(null,file)

    # 构建单站点模式的html模板
    _buildHtml: ()->
        _this = @
        return through2.obj (file, enc, callback)->
            try
                _path = String(file.path).replace(/\\/g,'/')
                # console.log _path
                if _path.indexOf("/_") == -1
                    _name = _path.split("/html/")[1]

                    _debugPath = _this.htmlDebugPath + _name
                    _distPath = path.join _this.htmlDistPath,_name
                    _source = file.contents.toString()
                    if _this.env is 'local'
                        Utils.writeFile(_debugPath,_source,!0)
                    else
                        # 如果不是开发环境，则压缩html
                        _source = Utils.htmlMinify(_source)

                    Utils.writeFile(_distPath,_source,!0)
                    if _this.env isnt 'local' and _this.env isnt 'dev'
                        gutil.log "'" + color.cyan("#{_name}") + "'","combined."

            catch e
                # console.log e
            return callback(null,file)

    # 构建多站点模式的html模板
    _buildSites:->
        _this = @
        return through2.obj (file, enc, callback)->
            try
                _filePath = file.relative
                if /^@/.test(_filePath)
                    siteArr = _filePath.split('/')
                    site = (siteArr.shift()).replace(/^@/,'')
                    if _this.opts.viewPath[site]
                        sitePath = _this.opts.viewPath[site]
                        outPath = path.join(_this.root,sitePath,siteArr.join('/'))
                        Utils.writeFile(outPath,file.contents,!0)
                    else
                        gutil.log '请正确配置viewPath和html开发域'
            catch e
                gutil.log e
            return callback(null,file)
    # 保存文件
    _saveFile:->
        return through2.obj (file, enc, callback)->
            # console.log file.contents
            Utils.writeFile(file.path,file.contents,!0)
            return callback(null,file)

    combine: (cb)=>
        _cb = cb or ->
        _this = @
        _files = [
            path.join(@htmlSrcPath, '*.html')
            path.join(@htmlSrcPath, '**/*.html')
            path.join(@htmlSrcPath, '**/**/*.html')
        ]
        gutil.log(color.yellow("Combine html templates..."))
        # html模板引擎配置
        _opts =
            baseDir: _this.htmlSrcPath
            staticPath: Utils.getStaticPath()
            init_css: Utils.init_css
            init_js: Utils.init_js
            init_img: Utils.init_img
            ignore: /\/_\w*\//g  # 过滤带下划线开头命名的目录
            ejs:
                delimiter: "@"

        if _this.isMultiSite
            vfs.src(_files)
                .pipe plumber({errorHandler: Utils.errrHandler})
                .pipe include(_opts)
                .pipe _this._replaceImg()
                .pipe vfs.dest(_this.htmlDebugPath)
                .pipe gulpif(_this.isMultiSite,_this._buildSites(),_this._buildHtml())
                .on "end",->
                    gutil.log color.green "Html templates done!"
                    _cb()
        else
            vfs.src(_files)
                .pipe plumber({errorHandler: Utils.errrHandler})
                .pipe include(_opts)
                .pipe _this._replaceImg()
                .pipe vfs.dest(_this.htmlDebugPath)
                .on "end",->
                    gutil.log color.green "Html templates done!"
                    _cb()


    init: (cb)=>
        _cb = cb or ->
        @_isMultiSite()
        @combine(_cb)

module.exports = HtmlCtl
