# 项目的全局参数
fs      = require('fs')
path    = require('path')
_       = require 'lodash'
args    = require('yargs').argv


defaultConfig = require path.join(__dirname,'../config.json')
_cfgFile = global.Cache['cfgFile']
_config  = require(_cfgFile)
config = _.assign {},defaultConfig,_config

# 根路径
#_root   = process.env.INIT_CWD + '/'
_root   = process.cwd() + '/'

# 动态的配置参数
_isDebug = args.d or args.debug or false
_env = args.e or args.env or "local"
_cdn = args.c or args.cdn or config.cdnDomain
_ver = args.v or args.ver or config.version
_host = args.h or args.host or config.host
_port = args.p or args.port or config.port
_mod = args.m or args.mod
_view = args.view or config.view


# 更新配置文件
config.cdnDomain = _cdn if config.cdnDomain isnt _cdn
config.version = _ver if  config.version isnt _ver
config.host = _host if  config.host isnt _host
config.port = _port if config.port isnt _port
config.coreJs.mods = _mod.split(',') if _mod
config.view = _view if _view
fs.writeFileSync _cfgFile, JSON.stringify(config, null, 4) , 'utf8'

_cdnDomain = if _cdn then "#{_env}.#{_cdn}" else  "#{config.host}:#{config.port}"
_cdnDomain = config.cdnDomain if _env == "www"

setting = _.assign({},config)
setting.root = _root
setting.env = _env
setting.ver = _ver
setting.force = !!args.force or !!args.f or false
setting.isDebug = if setting.force then true else _isDebug
setting.cdnDomain = "//#{_cdnDomain}/"

setting['paths'] = {}
for key,val of config.paths
    setting['paths'][key] = val + '/'

# 定义全局的缓存对象
global.Cache = global.Cache or (global.Cache = {})

# 生成全局配置
(->
    _Cfg = setting
    for key,val of _Cfg.paths
        _Cfg["#{key}Path"] = val
    global.Cache['gOpts'] = _Cfg
)()

# console.log setting

module.exports = setting
