###*
# html to AMD module js function
# @date 2015-02-14 15:36:39
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

fs      = require 'fs'
path    = require 'path'
config  = require '../config'

_htmlToJs = (folder)->
    return false if folder.indexOf('.') is 0 or folder is ""
    _tplPath = config.tplSrcPath + folder
    tplData = {}
    # console.log _tplPath
    fs.readdirSync(_tplPath).forEach (file)->
        _file_path = path.join(_tplPath, file)
        if fs.statSync(_file_path).isFile() and file.indexOf('.html') != -1 and file.indexOf('.') != 0
            # console.log file
            file_name = file.replace('.html', '')
            file_soure = fs.readFileSync(_file_path, 'utf8')
                           .replace(/<!--([\s\S]*?)-->/g, '')
                           .replace(/\n/g, '')
                           .replace(/\t/g, '')
                           .replace(/\r/g, '')
                           .replace(/\s+/g, ' ')
                           .replace(/>([\n\s+]*?)</g,'><')
            
            if file.indexOf('_') == 0
              tplData[file_name] = "<script id=\"tpl_#{folder}#{file_name}\" type=\"smcore\">#{file_soure}</script>"
            else
              tplData[file_name] = file_soure

    tpl_soure = "define('_tpl/#{folder}', [], function(){
        return #{JSON.stringify(tplData)};
    });"

    fs.writeFileSync path.join(config.tplOutPath, folder + '.js'), tpl_soure, 'utf8'

module.exports = _htmlToJs 
