
/**
* @fileOverview 将字体文件复制到debug\dist 目录
*
* @author pjg <iampjg@gmail.com>
* @link http://pjg.pw
* @version $Id$
 */
var CssCtl, Utils, defFontExt, fs, path, plumber, through2, vfs;

fs = require('fs');

path = require('path');

vfs = require('vinyl-fs');

plumber = require('gulp-plumber');

Utils = require('../utils');

through2 = require('through2');

defFontExt = ["eot", "svg", "ttf", "woff"];

CssCtl = (function() {
  function CssCtl(opts) {
    var filePaths, _this;
    this.opts = opts;
    _this = this;
    _this.srcPath = _this.opts.srcPath;
    _this.debugPath = _this.opts.debugPath;
    _this.distPath = _this.opts.distPath;
    _this.fontsPath = _this.srcPath + 'fonts';
    _this.fontsDebugPath = _this.debugPath + 'fonts';
    _this.fontsDistPath = _this.distPath + 'fonts';
    _this.fontExt = _this.opts.fontExt || defFontExt;
    filePaths = [];
    _this.fontExt.forEach(function(value, index) {
      return filePaths.push(path.join(_this.fontsPath, '*.' + value));
    });
    _this.filePaths = filePaths;
    _this.env = _this.opts.env;
    _this.isDebug = _this.opts.isDebug;
    this.map = {};
  }

  CssCtl.prototype.setDistPath = function() {
    var _distPath, _this;
    _this = this;
    _distPath = _this.fontsDistPath;
    return through2.obj(function(file, enc, callback) {
      var _con, _distName, _hash, _name, _parse;
      _name = file.relative.replace(/\\\\/g, '/').replace(/\\/g, '/');
      _con = file.contents.toString();
      _hash = Utils.md5(_con);
      _parse = path.parse(file.path);
      _distPath = Utils.setDistPath(_parse, _hash);
      _distName = path.join(path.dirname(_name), path.basename(_distPath));
      _this.map[_name] = {};
      _this.map[_name].hash = _hash;
      _this.map[_name].distname = _distName.replace(/\\\\/g, '/').replace(/\\/g, '/');
      file.path = _distPath;
      return callback(null, file);
    });
  };


  /**
   * 从src复制到debug
   */

  CssCtl.prototype.copy = function(cb) {
    var _cb, _filePaths, _fontsDebugPath, _fontsDistPath, _this;
    _this = this;
    _cb = cb || function() {};
    _filePaths = _this.filePaths;
    _fontsDebugPath = _this.fontsDebugPath;
    _fontsDistPath = _this.fontsDistPath;
    return vfs.src(_filePaths).pipe(plumber({
      errorHandler: Utils.errrHandler
    })).pipe(vfs.dest(_fontsDebugPath)).pipe(vfs.dest(_fontsDistPath)).pipe(_this.setDistPath()).pipe(vfs.dest(_fontsDistPath)).on('end', function() {
      return _cb();
    });
  };

  CssCtl.prototype.init = function(cb) {
    var _this;
    _this = this;
    return _this.copy(function() {
      global.Cache['fontsMap'] = _this.map;
      Utils.updateMap(_this.map, 'fontsMap');
      Utils.saveMapFile('fontsMap');
      return cb && cb();
    });
  };

  return CssCtl;

})();

module.exports = CssCtl;
