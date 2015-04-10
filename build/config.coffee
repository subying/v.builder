###
# FE build config
# @date 2014-12-2 15:10:14
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

path  = require 'path'
butil = require './lib/butil'

cfg   = butil.getJSONSync('config.json')

theme = cfg.theme

st_root = path.join __dirname, "..", theme

# PHP的html模板的物理路径，根据各自 PHP项目 的模板路径来修改
htmlTplPath = cfg.htmlTplPath

# css,js文件的hash地图保存的磁盘路径，根据各自的开发环境来修改
phpHashMapPath = cfg.phpHashMapPath

# 开发环境下，请求静态资源的域名
cndDomain = cfg.cndDomain

module.exports = 
  # 开发环境
  evn: cfg.evn

  # 是否开启在线combo
  isCombo: cfg.isCombo

  # 项目的主目录
  rootPath: st_root

  # PHP的模板路径
  htmlPath: htmlTplPath
  htmlSrc: '../' + theme + '/src/html/'

  # js文件前缀
  prefix: cfg.jsPrefix
  # 生产文件的hash长度
  hashLength: cfg.hashLength
  # 核心js库名，非首页时使用 
  coreJsName: cfg.jsPrefix + cfg.coreJsName

  # 首页模块生产名
  indexJsDistName: cfg.jsPrefix + cfg.indexJsName
  
  # 首页模块ID
  indexModuleName: cfg.indexJsModuleID
  
  staticRoot: "//" + cndDomain + "/"
  staticPath: "//" + cndDomain + "/" + theme + "/"


  # veCfgFileName: 've_cfg'
  # configName: '_VE_Cfg'
  # configDate: 
    

  # 一些gulp构建配置
  dataPath: './data'
  spriteDataPath: './data/sp.map.json'
  spriteHasPath: './data/sp.has.json'

  jsLibPath: '../libs/'
  docOutPath: '../' + theme + '/doc/'

  # 文件构建的生产目录
  cssDistPath: '../' + theme + '/dist/css/'
  jsDistPath: '../' + theme + '/dist/js/'
  tplDistPath: '../' + theme + '/dist/js/'
  imgDistPath: '../' + theme + '/img/'
  spriteDistPath: '../' + theme + '/img/sp/'
  cssBgDistPath: '../' + theme + '/img/bg/'

  # 文件构建的临时目录
  cssOutPath: '../' + theme + '/src/_css/'
  jsOutPath: '../' + theme + '/src/_js/'
  tplOutPath: '../' + theme + '/src/js/_tpl/'
  
  # 文件构建的源码目录
  lessPath: '../' + theme + '/src/less/'
  jsSrcPath: '../' + theme + '/src/js/'
  tplSrcPath: '../' + theme + '/src/tpl/'
  imgSrcPath: '../' + theme + '/src/_img/'
  
  spriteSrcPath: '../' + theme + '/src/sprite/'
  spriteLessOutPath: '../' + theme + '/src/less/sprite/'
  spriteImgOutPath: '../' + theme + '/src/_img/sp/'

  # Hash Map path
  mapPath: '../' + theme + '/dist/map/'
  phpMapPath: phpHashMapPath
  jsMapName : 'jsmap.json'
  cssMapName : 'cssmap.json'
  spMapName : 'spmap.json'
  cssBgMap : 'cssbgmap.json'

  # 一个大坑啊。。。
  watchFiles: [
      '../' + theme + '/src/js/**/*.js'
      '../' + theme + '/src/sprite/**/*.png'
      '../' + theme + '/src/less/**/*.less'
      '../' + theme + '/src/tpl/**/*.html'
      '../' + theme + '/src/html/**/*.html'
      '!../' + theme + '/src/**/.DS_Store'
    ]
