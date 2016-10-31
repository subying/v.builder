// Generated by CoffeeScript 1.10.0

/**
 * @fileOverview 构建系统的入口文件
 * @author  pjg.pw
 * @since   2015年12月10日21:16:01
 */
var Cfg, CleanCtl, CssCtl, FontsCtl, HtmlCtl, ImgCtl, JsCtl, Lib, Server, SpCtl, TplCtl, Utils, Watcher, fs, gutil, main, opts, path, vfs;

fs = require('fs');

path = require('path');

gutil = require('gulp-util');

vfs = require('vinyl-fs');

Server = require('gulp-server-livereload');

Lib = {};

Cfg = {};

Utils = null;

SpCtl = null;

CssCtl = null;

ImgCtl = null;

JsCtl = null;

TplCtl = null;

HtmlCtl = null;

FontsCtl = null;

CleanCtl = null;

Watcher = null;

opts = null;

main = {
  setConfig: function(filePath) {
    global.Cache = global.Cache || (global.Cache = {});
    global.Cache['cfgFile'] = filePath;
    Cfg = require('./lib/cfg');
    Lib = require('./lib');
    Utils = Lib.Utils;
    SpCtl = Lib.SpCtl;
    CssCtl = Lib.CssCtl;
    ImgCtl = Lib.ImgCtl;
    JsCtl = Lib.JsCtl;
    TplCtl = Lib.TplCtl;
    HtmlCtl = Lib.HtmlCtl;
    FontsCtl = Lib.FontsCtl;
    Watcher = Lib.watchCtl;
    CleanCtl = Lib.CleanCtl;
    return opts = global.Cache['gOpts'];
  },
  init: function() {
    var Paths, _dir, _makePath, _root, key, val;
    gutil.log('初始化项目的目录');
    _root = Cfg.root;
    Paths = opts.paths;
    _makePath = function(dir) {
      Utils.mkdirsSync(dir);
      return gutil.log(dir + " made success!");
    };
    for (key in Paths) {
      val = Paths[key];
      _dir = path.join(_root, val);
      _makePath(_dir);
    }
    ['less', 'img', 'js', 'fonts', 'html', 'sprite', 'tpl'].forEach(function(val) {
      _dir = path.join(_root, Paths['src'], val);
      return _makePath(_dir);
    });
    ['css', 'img', 'js', 'fonts', 'html'].forEach(function(val) {
      _dir = path.join(_root, Paths['debug'], val);
      return _makePath(_dir);
    });
    return ['css', 'img', 'js', 'fonts', 'html'].forEach(function(val) {
      _dir = path.join(_root, Paths['dist'], val);
      return _makePath(_dir);
    });
  },
  sprite: function(cb) {
    return new SpCtl(opts).init(function() {
      return cb && cb();
    });
  },
  img: function(cb) {
    return new ImgCtl(opts).init(function() {
      return cb && cb();
    });
  },
  css: function(cb) {
    return new CssCtl(opts).init(function() {
      return cb && cb();
    });
  },
  js: function(cb) {
    return new JsCtl(opts).init(function() {
      return cb && cb();
    });
  },
  tpl: function(cb) {
    return new TplCtl(opts).init(function() {
      return cb && cb();
    });
  },
  html: function(cb) {
    return new HtmlCtl(opts).init(function() {
      return cb && cb();
    });
  },
  fonts: function(cb) {
    return new FontsCtl(opts).init(function() {
      return cb && cb();
    });
  },
  watch: function() {
    gutil.log('进入开发模式', '文件监控中...');
    return Watcher();
  },
  clean: function(cb) {
    return new CleanCtl(opts).init(function() {
      return cb && cb();
    });
  },
  server: function() {
    var servOpt;
    servOpt = {
      livereload: false,
      directoryListing: true,
      open: true,
      host: opts.host,
      port: opts.port
    };
    if (!Cfg.openBrower) {
      servOpt.open = false;
    }
    return vfs.src(opts.root).pipe(Server(servOpt));
  },
  release: function(cb) {
    var _cb, _this;
    _this = this;
    _cb = cb || function() {};
    return _this.sprite(function() {
      return _this.tpl(function() {
        return _this.fonts(function() {
          return _this.img(function() {
            return _this.css(function() {
              return _this.js(function() {
                _this.html();
                if (opts.env !== 'local') {
                  Utils.mapToViewPath();
                }
                return cb && cb();
              });
            });
          });
        });
      });
    });
  },
  dev: function(cb) {
    var _this;
    _this = this;
    return _this.release(function() {
      if (opts.env === 'local') {
        _this.watch();
        if (opts.openBrower) {
          return setTimeout(function() {
            return _this.server();
          }, 3000);
        }
      } else {
        return cb && cb();
      }
    });
  }
};

module.exports = main;