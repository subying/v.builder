###*
# FEbuild
# @date 2014-12-2 15:10:14
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

fs      = require 'fs'
path    = require 'path'
crypto  = require 'crypto'
config  = require '../config'
swig    = require 'swig'
gulp    = require 'gulp'
revall  = require 'gulp-rev-all'
gutil   = require 'gulp-util'
color   = gutil.colors

###引入自定义模块###

binit     = require './binit'
butil     = require './butil'
flctl     = require './flctl'
cssbd     = require './cssbd'
jsto      = require './jsto'
htmlToJs  = require './html2js'
jsonToPhp = require './json2php'
cssToDist = require './cssto'
autowatch = require './autowatch'
htmlCtl   = require './htmlctl'



###
# ************* 构建任务函数 *************
###

###初始化目录###

exports.init = ->
    binit.dir()
    binit.map()

###文件删除操作###
exports.files = 
    delJson: ->
        files = ['jslib.paths','sp.map',]
        for file in files
            json_file = path.join(config.dataPath, file + '.json')
            if fs.existsSync json_file
                fs.unlinkSync json_file
    # 删除旧的文件
    delDistCss: ->
        #创建实例化对象
        _ctl = new flctl '.css'
        _ctl.delList()
    delDistSpImg: ->
        #创建实例化对象
        _ctl = new flctl '.png'
        _ctl.delList()
    delDistJs: ->
        #创建实例化对象
        _ctl = new flctl '.js'
        _ctl.delList()
    delMap: ->
        #创建实例化对象
        _ctl = new flctl '.json'
        _ctl.delMap()
    delDistFiles: =>
        exports.files.delDistCss()
        exports.files.delDistSpImg()
        exports.files.delDistJs()
        # exports.files.delMap()

###
# Pngs combine into less and one image
###
exports.sprite  = cssbd.sp2less

###
# LESS into CSS
###
exports.less2css = cssbd.less2css
    
###
# 生成css的生产文件
###
exports.css2dist = cssToDist

###
# 生成第三方模块路径
###
exports.jsLibPaths = binit.lib

###
# 生成require config 和 ve_cfg
###
exports.config = binit.cfg

jsToDev   = jsto.dev
jsToDist  = jsto.dist
###
# 合并AMD js模块到debug目录(./src/_js/)
###
exports.js2dev = new jsToDev().init

###
# 将html生成js模板
###
exports.tpl2dev = (cb)->
    _cb = cb or ->
    gutil.log color.yellow "Convert html to js" 
    fs.readdirSync(config.tplSrcPath).forEach (v)->
        tplPath = path.join(config.tplSrcPath, v)
        if fs.statSync(tplPath).isDirectory() and v.indexOf('.') != 0
            htmlToJs v
    gutil.log color.green "Convert success!"
    _cb()

###
# 将debug目录中AMD js包文件push到生产目录
###
exports.js2dist = new jsToDist().push

###
# 构建js/css生产文件的Hash表
###
exports.json2php = (cb)->
    _cb = cb or ->
    jsonToPhp -> _cb()

###
# all file to dist
###
exports.all2dist = (cb)->
    _cb = cb or ->
    exports.css2dist ->
        gutil.log color.green 'CSS pushed!'
        exports.js2dist ->
            gutil.log color.green 'JS pushed!'
            exports.json2php ->
                gutil.log color.green 'phpMap done!!!!!!!!!'
                _cb()


# 将静态资源注入到php模板文件中
exports.htmlctl = htmlCtl

###
# Auto watch API
###
exports.autowatch = autowatch
