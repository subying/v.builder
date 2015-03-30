###*
# 开发模式下的监控模块
# @date 2014-12-2 15:10:14
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###
fs      = require 'fs'
path    = require 'path'
config  = require '../config'
watch   = require 'gulp-watch'
gutil   = require 'gulp-util'
cssbd   = require './cssbd'
htmlToJs  = require './html2js'
htmlCtl   = require './htmlctl'
jsto    = require './jsto'
jsToDev = jsto.dev
color   = gutil.colors

# 错误报警,beep响两声
butil       = require './butil'
errrHandler = butil.errrHandler


# JS语法检测
jshint  = require 'jshint'
JSHINT  = jshint.JSHINT
jsError = (file)->
    try 
        gutil.log color.magenta("jshint.JS语法检测开始----->")
        _source = fs.readFileSync(file, 'utf8')
        # console.log _source
        !!JSHINT(_source)
        JSHINT.errors.filter (error)->
            if error
                gutil.log color.cyan(file)," error in line #{error.line}==>"
                gutil.log color.yellow(error.reason)
        gutil.log color.magenta("----->jshint.JS语法检测结束")
    catch e
        console.log e

###
# 检查监控的文件类型和路径的工具类
###

class watchChecker
    constructor: (@file)->
    type: ->
        ext = path.extname(@file)
                  .replace('.','')
        dir = path.dirname(@file)
        if ext is 'html'
            ext = if dir.indexOf('src/tpl/') isnt -1 then 'tpl' else 'html'
        return ext
    folder: ->
        _file = @file
        _str =  _file.split('src/tpl/')[1] + ""
        return _str.split('/')[0]
###
# 检查文件，并根据检测结构选择对应的文件构建方法
###
class checkFile extends watchChecker
    js: (cb)=>
        _type = @type()
        return false if _type isnt 'js'
        # jshint语法检测
        _file = @file.replace(config.jsSrcPath,"")
        jsError(_file)
        # 合并相关模块
        _module = _file.replace(".js","")
                       .split('src/js/')[1]
        if _module.indexOf('/') isnt -1
            _jsToDev = new jsToDev()
            list = _jsToDev.makeRelateList(_module)
            gutil.log "Conbine",'\'' + color.cyan(_module) + '\'',"and relevant modules ..."
            gutil.log  "Waitting..."
            for file in list
                gutil.log '\'' + color.cyan(file) + '\'',"module has changed!"
                _jsToDev.oneModule(file)
            cb()
    tpl:(cb)=>
        _type = @type()
        return false if _type isnt 'tpl'
        _folder = @folder()
        gutil.log color.yellow "Convert html to js"       
        htmlToJs _folder
        gutil.log color.green "Convert success!"
        cb()
    html:(cb)=>
        _type = @type()
        return false if _type isnt 'html'
        gutil.log "Injecting HTML source files relative to HTML Template."
        htmlCtl()

    less: (cb)=>
        _type = @type()
        return false if _type isnt 'less'
        gutil.log color.yellow "Compiling Less into CSS"
        cssbd.less2css ->
            gutil.log color.green "Less compile success!"
            cb()
    sprite: (cb)=>
        _type = @type()
        return false if _type isnt 'png'
        sp_folder = @folder()
        cssbd.png2img sp_folder,->
            gutil.log color.green "#{sp_folder} sprite build success!"
            # buildLess ->
            #     gutil.log color.green "Compile Less into CSS success!"
            cb()
    build: (cb)=>
        _type = @type()
        __js = @js
        __tpl = @tpl
        __html = @html  
        __sp = @sprite
        __less = @less
        switch _type
            when 'js'
                __js -> cb()
            when 'tpl'
                __tpl -> cb()
            when 'html'
                __html -> cb()
            when 'png'
                __sp -> cb()
            when 'less'
                __less -> cb()
            else
                return cb()
###
# 开发的监控API
###
_autowatch = (cb)->
    _cb = cb or ->
    _list = {}
    _folder = []
    _path = config.watchFiles
    watch _path,(file)->
        try
            _event = file.event
            if _event isnt undefined or _event isnt 'unlink'
                _file_path = file.path
                # 检测文件
                _checkfile = new checkFile(_file_path)
                _file_type = _checkfile.type()
                _file_folder = _checkfile.folder()
                _list[_file_type] = []
                # 队列去重
                if _file_path not in _list[_file_type]
                    gutil.log '\'' + color.cyan(file.relative) + '\'',"was #{_event}"
                    _list[_file_type].push _file_path
                    return false if (_file_type is 'tpl' or _file_type is 'png') and _file_folder in _folder
                    _folder.push _file_folder  

                    # 执行文件的合并
                    _checkfile.build -> _cb()

                # 清理队列
            clearTimeout watch_timer if watch_timer
            watch_timer = setTimeout ->
                # clear the list after 3 seconds
                _list = {}
                _folder = []
            ,3000
        catch err
            console.log err         

module.exports = _autowatch
