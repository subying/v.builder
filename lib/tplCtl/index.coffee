###*
* html to AMD module js function
* @date 2015-12-01 22:01:25
* @author pjg <iampjg@gmail.com>
* @link http://pjg.pw
* @version $Id$
###

fs      = require 'fs'
path    = require 'path'
_       = require 'lodash'
gutil   = require 'gulp-util'
color   = gutil.colors
Utils   = require '../utils'

class TplCtl
    constructor:(@opts)->

        @tplSrcPath = path.join @opts.srcPath , 'tpl/'
        @tplOutPath = path.join @opts.srcPath , 'js/_tpl/'

    convertHtmlToJs: (folder,cb)->
        _this = @
        _cb = cb or ->
        return false if folder.indexOf('.') is 0 or folder is ""
        tplPath = _this.tplSrcPath + folder
        # console.log tplPath
        tplData = {}
        fs.readdirSync(tplPath).forEach (file)->
            _filePath = path.join(tplPath, file)
            if file.indexOf('.html') != -1 and file.indexOf('.') != 0
                file_name = file.replace('.html', '')
                _source = fs.readFileSync(_filePath, 'utf8')

                # 给html中的图片链接加上Hash
                _source = Utils.replaceImg(_source,'tpl')

                # 压缩html
                _source = Utils.htmlMinify(_source)

                if file.indexOf('_') == 0
                  tplData[file_name] = "<script id=\"tpl_#{folder}#{file_name}\" type=\"text/html\">#{_source}</script>"
                else
                  tplData[file_name] = _source
        tpl_soure = "define(function(){return #{JSON.stringify(tplData)};});"
        _file = path.join(_this.tplOutPath, folder + '.js')
        Utils.writeFile(_file, tpl_soure, !0)
        @opts.env == "local" && gutil.log( "Convert",color.cyan("tpl/#{folder}/*.html"),"-->" + color.cyan("js/_tpl/#{folder}.js"))
        _cb()

    init: (cb)->
        _cb = cb or ->
        _this = @
        _tplSrcPath = _this.tplSrcPath
        gutil.log color.yellow "Convert html to js..."
        fs.readdirSync(_tplSrcPath).forEach (v)->
            _tplPath = path.join(_tplSrcPath, v)
            if fs.statSync(_tplPath).isDirectory() and v.indexOf('.') != 0
                _this.convertHtmlToJs(v)
        gutil.log color.green "Convert html to js success!"
        _cb()
module.exports = TplCtl
