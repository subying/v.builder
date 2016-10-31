
/**
* html to AMD module js function
* @date 2015-12-01 22:01:25
* @author pjg <iampjg@gmail.com>
* @link http://pjg.pw
* @version $Id$
 */
var TplCtl, Utils, color, fs, gutil, path, _;

fs = require('fs');

path = require('path');

_ = require('lodash');

gutil = require('gulp-util');

color = gutil.colors;

Utils = require('../utils');

TplCtl = (function() {
  function TplCtl(opts) {
    this.opts = opts;
    this.tplSrcPath = path.join(this.opts.srcPath, 'tpl/');
    this.tplOutPath = path.join(this.opts.srcPath, 'js/_tpl/');
  }

  TplCtl.prototype.convertHtmlToJs = function(folder, cb) {
    var tplData, tplPath, tpl_soure, _cb, _file, _this;
    _this = this;
    _cb = cb || function() {};
    if (folder.indexOf('.') === 0 || folder === "") {
      return false;
    }
    tplPath = _this.tplSrcPath + folder;
    tplData = {};
    fs.readdirSync(tplPath).forEach(function(file) {
      var file_name, _filePath, _source;
      _filePath = path.join(tplPath, file);
      if (file.indexOf('.html') !== -1 && file.indexOf('.') !== 0) {
        file_name = file.replace('.html', '');
        _source = fs.readFileSync(_filePath, 'utf8');
        _source = Utils.replaceImg(_source, 'tpl');
        _source = Utils.htmlMinify(_source);
        if (file.indexOf('_') === 0) {
          return tplData[file_name] = "<script id=\"tpl_" + folder + file_name + "\" type=\"text/html\">" + _source + "</script>";
        } else {
          return tplData[file_name] = _source;
        }
      }
    });
    tpl_soure = "define(function(){return " + (JSON.stringify(tplData)) + ";});";
    _file = path.join(_this.tplOutPath, folder + '.js');
    Utils.writeFile(_file, tpl_soure, !0);
    this.opts.env === "local" && gutil.log("Convert", color.cyan("tpl/" + folder + "/*.html"), "-->" + color.cyan("js/_tpl/" + folder + ".js"));
    return _cb();
  };

  TplCtl.prototype.init = function(cb) {
    var _cb, _this, _tplSrcPath;
    _cb = cb || function() {};
    _this = this;
    _tplSrcPath = _this.tplSrcPath;
    gutil.log(color.yellow("Convert html to js..."));
    fs.readdirSync(_tplSrcPath).forEach(function(v) {
      var _tplPath;
      _tplPath = path.join(_tplSrcPath, v);
      if (fs.statSync(_tplPath).isDirectory() && v.indexOf('.') !== 0) {
        return _this.convertHtmlToJs(v);
      }
    });
    gutil.log(color.green("Convert html to js success!"));
    return _cb();
  };

  return TplCtl;

})();

module.exports = TplCtl;
