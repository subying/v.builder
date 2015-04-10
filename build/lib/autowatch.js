// Generated by CoffeeScript 1.9.1

/**
 * 开发模式下的监控模块
 * @date 2014-12-2 15:10:14
 * @author pjg <iampjg@gmail.com>
 * @link http://pjg.pw
 * @version $Id$
 */
var JSHINT, _autowatch, butil, checkFile, color, config, cssbd, errrHandler, fs, gutil, htmlCtl, htmlToJs, jsError, jsToDev, jshint, jsto, path, watch, watchChecker,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = require('fs');

path = require('path');

config = require('../config');

watch = require('gulp-watch');

gutil = require('gulp-util');

cssbd = require('./cssbd');

htmlToJs = require('./html2js');

htmlCtl = require('./htmlctl');

jsto = require('./jsto');

jsToDev = jsto.dev;

color = gutil.colors;

butil = require('./butil');

errrHandler = butil.errrHandler;

jshint = require('jshint');

JSHINT = jshint.JSHINT;

jsError = function(file) {
  var _source, e;
  try {
    gutil.log(color.magenta("jshint.JS语法检测开始----->"));
    _source = fs.readFileSync(file, 'utf8');
    !!JSHINT(_source);
    JSHINT.errors.filter(function(error) {
      if (error) {
        gutil.log(color.cyan(file), " error in line " + error.line + "==>");
        return gutil.log(color.yellow(error.reason));
      }
    });
    return gutil.log(color.magenta("----->jshint.JS语法检测结束"));
  } catch (_error) {
    e = _error;
    return console.log(e);
  }
};


/*
 * 检查监控的文件类型和路径的工具类
 */

watchChecker = (function() {
  function watchChecker(file1) {
    this.file = file1;
  }

  watchChecker.prototype.type = function() {
    var dir, ext;
    ext = path.extname(this.file).replace('.', '');
    dir = path.dirname(this.file);
    if (ext === 'html') {
      ext = dir.indexOf('src/tpl/') !== -1 ? 'tpl' : 'html';
    }
    return ext;
  };

  watchChecker.prototype.folder = function() {
    var _file, _str;
    _file = this.file;
    _str = _file.split('src/tpl/')[1] + "";
    return _str.split('/')[0];
  };

  return watchChecker;

})();


/*
 * 检查文件，并根据检测结构选择对应的文件构建方法
 */

checkFile = (function(superClass) {
  extend(checkFile, superClass);

  function checkFile() {
    this.build = bind(this.build, this);
    this.sprite = bind(this.sprite, this);
    this.less = bind(this.less, this);
    this.html = bind(this.html, this);
    this.tpl = bind(this.tpl, this);
    this.js = bind(this.js, this);
    return checkFile.__super__.constructor.apply(this, arguments);
  }

  checkFile.prototype.js = function(cb) {
    var _file, _jsToDev, _module, _type, file, i, len, list;
    _type = this.type();
    if (_type !== 'js') {
      return false;
    }
    _file = this.file.replace(config.jsSrcPath, "");
    jsError(_file);
    _module = _file.replace(".js", "").split('src/js/')[1];
    if (_module.indexOf('/') !== -1) {
      _jsToDev = new jsToDev();
      list = _jsToDev.makeRelateList(_module);
      gutil.log("Conbine", '\'' + color.cyan(_module) + '\'', "and relevant modules ...");
      gutil.log("Waitting...");
      for (i = 0, len = list.length; i < len; i++) {
        file = list[i];
        gutil.log('\'' + color.cyan(file) + '\'', "module has changed!");
        _jsToDev.oneModule(file);
      }
      return cb();
    }
  };

  checkFile.prototype.tpl = function(cb) {
    var _folder, _type;
    _type = this.type();
    if (_type !== 'tpl') {
      return false;
    }
    _folder = this.folder();
    gutil.log(color.yellow("Convert html to js"));
    htmlToJs(_folder);
    gutil.log(color.green("Convert success!"));
    return cb();
  };

  checkFile.prototype.html = function(cb) {
    var _type;
    _type = this.type();
    if (_type !== 'html') {
      return false;
    }
    gutil.log("Injecting HTML source files relative to HTML Template.");
    return htmlCtl();
  };

  checkFile.prototype.less = function(cb) {
    var _type;
    _type = this.type();
    if (_type !== 'less') {
      return false;
    }
    gutil.log(color.yellow("Compiling Less into CSS"));
    return cssbd.less2css(function() {
      gutil.log(color.green("Less compile success!"));
      return cb();
    });
  };

  checkFile.prototype.sprite = function(cb) {
    var _type, sp_folder;
    _type = this.type();
    if (_type !== 'png') {
      return false;
    }
    sp_folder = this.folder();
    return cssbd.png2img(sp_folder, function() {
      gutil.log(color.green(sp_folder + " sprite build success!"));
      return cb();
    });
  };

  checkFile.prototype.build = function(cb) {
    var __html, __js, __less, __sp, __tpl, _type;
    _type = this.type();
    __js = this.js;
    __tpl = this.tpl;
    __html = this.html;
    __sp = this.sprite;
    __less = this.less;
    switch (_type) {
      case 'js':
        return __js(function() {
          return cb();
        });
      case 'tpl':
        return __tpl(function() {
          return cb();
        });
      case 'html':
        return __html(function() {
          return cb();
        });
      case 'png':
        return __sp(function() {
          return cb();
        });
      case 'less':
        return __less(function() {
          return cb();
        });
      default:
        return cb();
    }
  };

  return checkFile;

})(watchChecker);


/*
 * 开发的监控API
 */

_autowatch = function(cb) {
  var _cb, _folder, _list, _path;
  _cb = cb || function() {};
  _list = {};
  _folder = [];
  _path = config.watchFiles;
  return watch(_path, function(file) {
    var _checkfile, _event, _file_folder, _file_path, _file_type, err, watch_timer;
    try {
      _event = file.event;
      if (_event !== void 0 || _event !== 'unlink') {
        _file_path = file.path;
        _checkfile = new checkFile(_file_path);
        _file_type = _checkfile.type();
        _file_folder = _checkfile.folder();
        _list[_file_type] = [];
        if (indexOf.call(_list[_file_type], _file_path) < 0) {
          gutil.log('\'' + color.cyan(file.relative) + '\'', "was " + _event);
          _list[_file_type].push(_file_path);
          if ((_file_type === 'tpl' || _file_type === 'png') && indexOf.call(_folder, _file_folder) >= 0) {
            return false;
          }
          _folder.push(_file_folder);
          _checkfile.build(function() {
            return _cb();
          });
        }
      }
      if (watch_timer) {
        clearTimeout(watch_timer);
      }
      return watch_timer = setTimeout(function() {
        _list = {};
        return _folder = [];
      }, 3000);
    } catch (_error) {
      err = _error;
      return console.log(err);
    }
  });
};

module.exports = _autowatch;