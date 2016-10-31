###*
# 开发模式下的监控模块
# @date 2015年11月23日17:37:08
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###
fs      = require "fs"
path    = require "path"
_       = require "lodash"
gutil   = require "gulp-util"
color   = gutil.colors
Watch   = require "gulp-watch"
sprite  = require '../spCtl'

# JS语法检测
jshint  = require "jshint"
JSHINT  = jshint.JSHINT

# 载入构建类库
Tools    = require "../utils"
CssCtl   = require "../cssCtl"
JsCtl    = require "../jsCtl"
TplCtl   = require "../tplCtl"
HtmlCtl  = require "../htmlCtl"
FontsCtl = require "../fontsCtl"
ImgCtl   = require "../imgCtl"

# 读取Cache缓存
opts = global.Cache["gOpts"]

# 初始化构建类库
#这里需要输出到 src 下, 为了www环境下copy到dist中去 用的是imgCtl的copyImgs
spOpts = 
    srcPath: opts.srcPath
    imgOutPath: opts.debugPath+'img/sprite'

spCtl = new sprite(spOpts)
cssCtl   = new CssCtl(opts)
jsCtl    = new JsCtl(opts)
tplCtl   = new TplCtl(opts)
htmlCtl  = new HtmlCtl(opts)
fontsCtl = new FontsCtl(opts)
imgCtl   = new ImgCtl(opts)
# 一些扩展工具
Utils =

    getCache: ->
        _cache = {}
        maps = ["img","css","js","jsHash","jsSource","spMap"]
        if not _.has(global.Cache,"cssMap") and not _.has(global.Cache,"jsMap")
            # Tools.getMap("cache")
            cacheFile = opts.mapPath + "cache.json"
            if fs.existsSync(cacheFile)
                try
                    _cache = JSON.parse(fs.readFileSync(cacheFile), "utf8")
                    global.Cache = _.assign(global.Cache,_cache)
                catch e
                    maps.forEach (val,key)->
                        Tools.getMap(val)
            else
                maps.forEach (val,key)->
                    Tools.getMap(val)

    # JS语法检测
    jsHint: (file)->
        try
            gutil.log color.cyan("jshint.JS语法检测开始-->")
            _source = fs.readFileSync(file, "utf8")
            # console.log _source
            !!JSHINT(_source)
            JSHINT.errors.filter (error)->
                if error
                    gutil.log color.magenta(file.replace(opts.root,'')),"error in line -->",color.magenta(error.line)
                    gutil.log color.yellow(error.reason)
            gutil.log color.cyan("jshint.JS语法检测结束")
        catch e
            console.log e
    # 判断监控文件的类型
    getType: (dir)->
        _path = dir.replace(/\\/g,"/").replace(/\/\//g,"/")
        return (_path.split(opts.srcPath)[1]).split("/")[0]

    # less to CSS
    less: (cb)->
        _cb = cb or ->
        cssCtl.less2css(_cb,!0)

    # pngs to sprite img
    sprite: (file,cb)->
        _folder = (file.split('sprite/')[1]).split('/')[0]
        spCtl.outputOne(_folder,cb)

    # build html tpl
    tpl: (file,cb)->
        _folder = (file.split('tpl/')[1]).split('/')[0]
        tplCtl.convertHtmlToJs(_folder,cb)

    html: (cb)->
        htmlCtl.init(cb)

    # build js to dist dir
    js: (file,cb)->
        this.jsHint(file) if file.indexOf('_tpl/') == -1
        jsCtl.toAmd(file,cb)

    msg: (fileName)->
       gutil.log "'" + color.cyan(fileName) + "'","build success."

    fonts:(cb)->
        fontsCtl.init(cb)

    img: (cb)->
        imgCtl.init(cb)
###
# 开发的监控API
###
watcher = (cb)->
    _this = @
    _list = []
    # 监控的文件
    _files =  [
        "#{opts.srcPath}/less/**/*.less"
        "#{opts.srcPath}/sprite/**/*.png"
        "#{opts.srcPath}/html/**/*.html"
        "#{opts.srcPath}/js/**/*.js"
        "#{opts.srcPath}/tpl/**/*.html"
        "#{opts.srcPath}/img/*.{gif,jpg,png,svg,ico}"
        "#{opts.srcPath}/img/**/*.{gif,jpg,png,svg,ico}"
        "!.DS_Store"
    ]
    _filePaths = []
    opts.fontExt.forEach (value,index)->
        _filePaths.push "#{opts.srcPath}/fonts/**/*.#{value}"

    _files = _files.concat _filePaths

    Utils.getCache()
    # for item of global.Cache
    #     console.log item
    Watch _files,(file)->
        try
            _event = file.event
            if _event isnt "undefined"
                _filePath = file.path.replace(/\\/g,"/")
                if _filePath not in _list
                    _list.push(_filePath)
                    gutil.log "'" + color.cyan(file.relative) + "'","was #{_event}"
                    _type = Utils.getType(_filePath)
                    # console.log "type ==>",_type
                    switch _type
                        when "sprite"
                            Utils.sprite _filePath,->
                                Utils.msg(file.relative)
                        when "less"
                            Utils.less ->
                                Utils.msg("CSS")
                        when "html"
                            Utils.html ->
                                Utils.msg("HTML template")

                        when "js"
                            Utils.js _filePath,->
                                Utils.msg(file.relative)

                        when "tpl"
                            Utils.tpl _filePath,->
                                Utils.msg(file.relative)
                        when "img"
                            Utils.img ->
                                Utils.msg('img copy')
                        when "fonts"
                            Utils.fonts ->
                                Utils.msg('font copy')

            # clear watch list after 3 seconds
            clearTimeout watch_timer if watch_timer
            watch_timer = setTimeout ->
                _list = []
            ,3000
        catch err
            console.log err

module.exports = watcher
