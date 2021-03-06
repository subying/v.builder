// Generated by CoffeeScript 1.10.0

/**
* html模板构建和压缩模块
 */
var HtmlCtl, Utils, _, color, fs, gulpif, gutil, include, path, plumber, through2, vfs,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

fs = require('fs');

path = require('path');

_ = require('lodash');

vfs = require('vinyl-fs');

gutil = require('gulp-util');

gulpif = require('gulp-if');

plumber = require('gulp-plumber');

through2 = require('through2');

color = gutil.colors;

Utils = require('../utils');

include = require('./include');

HtmlCtl = (function() {
  function HtmlCtl(opts) {
    this.opts = opts;
    this.init = bind(this.init, this);
    this.combine = bind(this.combine, this);
    this.root = this.opts.root;
    this.htmlSrcPath = path.join(this.opts.srcPath, 'html/');
    this.htmlDebugPath = path.join(this.opts.debugPath, 'html/');
    this.htmlDistPath = this.opts.viewPath;
    this.env = this.opts.env;
    this.isDebug = this.opts.isDebug;
    this.include = "@@include";
    this.isMultiSite = false;
  }

  HtmlCtl.prototype._isMultiSite = function() {
    var _isMultiSite;
    _isMultiSite = false;
    fs.readdirSync(this.htmlSrcPath).forEach(function(file) {
      if (/^@/.test(file)) {
        return _isMultiSite = true;
      }
    });
    return this.isMultiSite = _isMultiSite;
  };

  HtmlCtl.prototype._replaceImg = function() {
    var _this;
    _this = this;
    return through2.obj(function(file, enc, callback) {
      var _source;
      _source = Utils.replaceImg(String(file.contents));
      file.contents = new Buffer(_source);
      return callback(null, file);
    });
  };

  HtmlCtl.prototype._buildHtml = function() {
    var _this;
    _this = this;
    return through2.obj(function(file, enc, callback) {
      var _debugPath, _distPath, _name, _path, _source, e, error;
      try {
        _path = String(file.path).replace(/\\/g, '/');
        if (_path.indexOf("/_") === -1) {
          _name = _path.split("/html/")[1];
          _debugPath = _this.htmlDebugPath + _name;
          _distPath = path.join(_this.htmlDistPath, _name);
          _source = file.contents.toString();
          if (_this.env === 'local') {
            Utils.writeFile(_debugPath, _source, !0);
          } else {
            _source = Utils.htmlMinify(_source);
          }
          Utils.writeFile(_distPath, _source, !0);
          if (_this.env !== 'local' && _this.env !== 'dev') {
            gutil.log("'" + color.cyan("" + _name) + "'", "combined.");
          }
        }
      } catch (error) {
        e = error;
      }
      return callback(null, file);
    });
  };

  HtmlCtl.prototype._buildSites = function() {
    var _this;
    _this = this;
    return through2.obj(function(file, enc, callback) {
      var _filePath, e, error, outPath, site, siteArr, sitePath;
      try {
        _filePath = file.relative;
        if (/^@/.test(_filePath)) {
          siteArr = _filePath.split('/');
          site = (siteArr.shift()).replace(/^@/, '');
          if (_this.opts.viewPath[site]) {
            sitePath = _this.opts.viewPath[site];
            outPath = path.join(_this.root, sitePath, siteArr.join('/'));
            Utils.writeFile(outPath, file.contents, !0);
          } else {
            gutil.log('请正确配置viewPath和html开发域');
          }
        }
      } catch (error) {
        e = error;
        gutil.log(e);
      }
      return callback(null, file);
    });
  };

  HtmlCtl.prototype._saveFile = function() {
    return through2.obj(function(file, enc, callback) {
      Utils.writeFile(file.path, file.contents, !0);
      return callback(null, file);
    });
  };

  HtmlCtl.prototype.combine = function(cb) {
    var _cb, _files, _opts, _this;
    _cb = cb || function() {};
    _this = this;
    _files = [path.join(this.htmlSrcPath, '*.html'), path.join(this.htmlSrcPath, '**/*.html'), path.join(this.htmlSrcPath, '**/**/*.html')];
    gutil.log(color.yellow("Combine html templates..."));
    _opts = {
      baseDir: _this.htmlSrcPath,
      staticPath: Utils.getStaticPath(),
      init_css: Utils.init_css,
      init_js: Utils.init_js,
      init_img: Utils.init_img,
      ignore: /\/_\w*\//g,
      ejs: {
        delimiter: "@"
      }
    };
    if (_this.isMultiSite) {
      return vfs.src(_files).pipe(plumber({
        errorHandler: Utils.errrHandler
      })).pipe(include(_opts)).pipe(_this._replaceImg()).pipe(vfs.dest(_this.htmlDebugPath)).pipe(gulpif(_this.isMultiSite, _this._buildSites(), _this._buildHtml())).on("end", function() {
        gutil.log(color.green("Html templates done!"));
        return _cb();
      });
    } else {
      return vfs.src(_files).pipe(plumber({
        errorHandler: Utils.errrHandler
      })).pipe(include(_opts)).pipe(_this._replaceImg()).pipe(vfs.dest(_this.htmlDebugPath)).on("end", function() {
        gutil.log(color.green("Html templates done!"));
        return _cb();
      });
    }
  };

  HtmlCtl.prototype.init = function(cb) {
    var _cb;
    _cb = cb || function() {};
    this._isMultiSite();
    return this.combine(_cb);
  };

  return HtmlCtl;

})();

module.exports = HtmlCtl;
