// Generated by CoffeeScript 1.10.0

/**
* @fileOverview 将CSS的debug文件push到生产目录，并将引用到的背景图片自动添加hash后缀
*
* @author pjg <iampjg@gmail.com>
* @link http://pjg.pw
* @version $Id$
 */
var CssCtl, ImgCtl, Utils, _, autoprefixer, color, crypto, fs, gulpif, gutil, less, mincss, path, plumber, through2, vfs;

fs = require('fs');

path = require('path');

_ = require('lodash');

crypto = require('crypto');

vfs = require('vinyl-fs');

gutil = require('gulp-util');

less = require('gulp-less');

mincss = require('gulp-clean-css');

gulpif = require('gulp-if');

autoprefixer = require('gulp-autoprefixer');

through2 = require('through2');

plumber = require('gulp-plumber');

color = gutil.colors;

Utils = require('../utils');

ImgCtl = require('../imgCtl');

CssCtl = (function() {
  function CssCtl(opts) {
    this.opts = opts;
    this.root = this.opts.root;
    this.hashLen = this.opts.hashLen;
    this.srcPath = this.opts.srcPath;
    this.debugPath = this.opts.debugPath;
    this.distPath = this.opts.distPath;
    this.lessPath = this.srcPath + 'less';
    this.cssDebugPath = this.debugPath + 'css';
    this.imgDistPath = this.distPath + 'img';
    this.cssDistPath = this.distPath + 'css';
    this.env = this.opts.env;
    this.isDebug = this.opts.isDebug;
    if (!_.has(global.Cache, 'imgMap')) {
      Utils.getMap('imgMap');
    }
    this.imgMap = global.Cache['imgMap'];
    if (!_.has(global.Cache, 'fontsMap')) {
      Utils.getMap('fontsMap');
    }
    this.fontsMap = global.Cache['fontsMap'];
    this.map = {};
  }

  CssCtl.prototype._replaceImgPaths = function(source) {
    var _contents, _cssBgReg, _fontsMap, _imgMap, _nameObj, _pathDeeps, _sPath, _source, _temArr, _this, i, j, k, len;
    _this = this;
    _imgMap = _this.imgMap;
    _fontsMap = _this.fontsMap;
    _sPath = source.relative;
    _pathDeeps = '';
    _temArr = _sPath.split('/');
    for (k = j = 0, len = _temArr.length; j < len; k = ++j) {
      i = _temArr[k];
      _pathDeeps += '../';
    }
    _contents = source.contents;
    _nameObj = path.parse(_sPath);
    _nameObj.hash = Utils.md5(_contents);
    _cssBgReg = /url\s*\(([^\)]+)\)/g;
    _source = String(_contents).replace(_cssBgReg, function(str, map) {
      var key, val;
      if (map.indexOf('fonts/') !== -1 || map.indexOf('font/') !== -1 || map.indexOf('#') !== -1 || map.indexOf('//:') !== -1 || map.indexOf('about:') !== -1 || map.indexOf('data:') !== -1) {
        return str;
      } else {
        key = map.split('/img/')[1].replace(/(^\'|\")|(\'|\"$)/g, '');
        val = _pathDeeps + "img/";
        val += _.has(_imgMap, key) ? _imgMap[key].distname : key + '?t=' + String(new Date().getTime()).substr(0, 8);
        return str.replace(map, val);
      }
    });
    return _source;
  };

  CssCtl.prototype._imgAddHash = function() {
    var _this, cssDebugPath, cssDistPath, imgDistPath, lessPath;
    _this = this;
    lessPath = _this.lessPath;
    cssDebugPath = _this.cssDebugPath;
    imgDistPath = _this.imgDistPath;
    cssDistPath = _this.cssDistPath;
    return through2.obj(function(file, enc, callback) {
      var _con;
      _con = _this._replaceImgPaths(file);
      file.contents = new Buffer(_con);
      return callback(null, file);
    });
  };

  CssCtl.prototype._setDistPath = function() {
    var _this;
    _this = this;
    return through2.obj(function(file, enc, callback) {
      var _con, _distName, _distPath, _hash, _name, _parse;
      _name = file.relative.replace(/\\\\/g, '/').replace(/\\/g, '/');
      _con = file.contents.toString();
      _hash = Utils.md5(_con);
      _parse = path.parse(file.path);
      _distPath = Utils.setDistPath(_parse, _hash);
      _distName = Utils.tranFilePath(path.join(path.dirname(_name), path.basename(_distPath)));
      _this.map[_name] = {};
      _this.map[_name].hash = _hash;
      _this.map[_name].distname = _distName;
      file.path = _distPath;
      return callback(null, file);
    });
  };


  /**
   * 从less生成css源码
   */

  CssCtl.prototype.less2css = function() {
    var _cssDebugPath, _cssDistPath, _files, _lessPath, _this, condition, ref;
    gutil.log('Starting', '\'' + color.cyan('LESS-->CSS') + '\'...');
    _this = this;
    _files = [path.join(this.lessPath, '*.less'), path.join(this.lessPath, '**/*.less'), "!" + (path.join(this.lessPath, '_*.less')), "!" + (path.join(this.lessPath, '_**/*.less')), "!" + (path.join(this.lessPath, '_**/**/*.less')), "!" + (path.join(this.lessPath, '_**/**/**/*.less'))];
    _lessPath = _this.lessPath;
    _cssDebugPath = _this.cssDebugPath;
    _cssDistPath = _this.cssDistPath;
    condition = this.isDebug || ((ref = this.env) !== 'local' && ref !== 'dev');
    return new Promise(function(resolve, reject) {
      var cssStream, err, error;
      try {
        cssStream = vfs.src(_files).pipe(plumber({
          errorHandler: Utils.errrHandler
        })).pipe(less({
          compress: false,
          paths: [_lessPath]
        })).pipe(autoprefixer()).pipe(vfs.dest(_cssDebugPath));
        if (condition) {
          return cssStream.pipe(mincss({
            keepBreaks: false,
            compatibility: 'ie7'
          })).pipe(_this._imgAddHash()).pipe(vfs.dest(_cssDistPath)).pipe(_this._setDistPath()).pipe(vfs.dest(_cssDistPath)).on('end', function() {
            _this.buildMap();
            return resolve(_this.map);
          }).on('error', function(err) {
            return reject(err);
          });
        } else {
          return cssStream.on('end', function() {
            return resolve(_this.map);
          }).on('error', function(err) {
            return reject(err);
          });
        }
      } catch (error) {
        err = error;
        return reject(err);
      }
    });
  };

  CssCtl.prototype.buildMap = function() {
    global.Cache['cssMap'] = this.map;
    Utils.updateMap(this.map, 'cssMap');
    return Utils.saveMapFile('cssMap');
  };

  CssCtl.prototype.init = function(cb) {
    var _this;
    _this = this;
    cb = cb || function() {};
    return _this.less2css().then(function(map) {
      return cb(map);
    })["catch"](function(err) {
      return cb(err);
    });
  };

  return CssCtl;

})();

module.exports = CssCtl;
