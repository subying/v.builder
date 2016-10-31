###*
 * @fileOverview 构建系统的入口文件
 * @author  pjg.pw
 * @since   2015年12月10日21:16:01
###

fs      = require 'fs'
path    = require 'path'
gutil   = require 'gulp-util'
vfs     = require 'vinyl-fs'
Server  = require 'gulp-server-livereload'

Lib = {}
Cfg = {}
Utils = null
SpCtl = null
CssCtl  = null
ImgCtl  = null
JsCtl   = null
TplCtl  = null
HtmlCtl = null
FontsCtl = null
CleanCtl = null
Watcher = null
opts = null

# 主任务
main =
    setConfig: (filePath)->
        # 定义全局的缓存对象
        global.Cache = global.Cache or (global.Cache = {})
        global.Cache['cfgFile'] = filePath

        
        Cfg     = require './lib/cfg'
        Lib     = require './lib'

        Utils   = Lib.Utils
        SpCtl   = Lib.SpCtl
        CssCtl  = Lib.CssCtl

        ImgCtl  = Lib.ImgCtl
        JsCtl   = Lib.JsCtl
        TplCtl  = Lib.TplCtl
        HtmlCtl = Lib.HtmlCtl
        FontsCtl = Lib.FontsCtl
        Watcher = Lib.watchCtl
        CleanCtl = Lib.CleanCtl

        # 全局配置
        opts = global.Cache['gOpts']

    # 初始化目录
    init: ->
        gutil.log('初始化项目的目录')
        _root = Cfg.root
        Paths = opts.paths

        _makePath = (dir)->
            Utils.mkdirsSync(dir)
            gutil.log "#{dir} made success!"

        for key,val of Paths
            _dir = path.join _root,val
            _makePath(_dir)

        # src paths
        ['less','img','js','fonts','html','sprite','tpl'].forEach (val)->
            _dir = path.join _root,Paths['src'],val
            _makePath(_dir)
        # debug paths
        ['css','img','js','fonts','html'].forEach (val)->
            _dir = path.join _root,Paths['debug'],val
            _makePath(_dir)

        # dist paths
        ['css','img','js','fonts','html'].forEach (val)->
            _dir = path.join _root,Paths['dist'],val
            _makePath(_dir)


    # 雪碧图
    sprite: (cb)->
        new SpCtl(opts).init ->
            cb && cb()

    img: (cb)->
        new ImgCtl(opts).init ->
            cb and cb()

    css: (cb)->
        new CssCtl(opts).init ->
            cb and cb()

    js: (cb)->
        new JsCtl(opts).init ->
            cb and cb()

    tpl: (cb)->
        new TplCtl(opts).init ->
            cb and cb()

    html: (cb)->
        new HtmlCtl(opts).init ->
            cb and cb()

    fonts: (cb)->
        new FontsCtl(opts).init ->
            cb and cb()

    watch: ()->
        gutil.log('进入开发模式','文件监控中...')
        Watcher()

    clean: (cb)->
        new CleanCtl(opts).init ->
            cb and cb()
    server:->
        servOpt =
            livereload: false,
            directoryListing: true,
            open: true
            host: opts.host
            port: opts.port

        #启动服务器后是否打开浏览器
        if not Cfg.openBrower
            servOpt.open = false

        vfs.src(opts.root)
           .pipe(Server(servOpt))

    release: (cb)->
        _this = @
        _cb = cb || ->
        _this.sprite ->
            _this.tpl ->
                _this.fonts ->
                    _this.img ->
                        _this.css ->
                            _this.js ->
                                _this.html()
                                Utils.mapToViewPath() if opts.env isnt 'local'
                                cb && cb()
    dev: (cb)->
        _this = @
        _this.release ->
            if opts.env is 'local'
                _this.watch()
                if opts.openBrower
                    setTimeout ->
                        _this.server()
                    ,3000
            else
                cb && cb()


module.exports = main
