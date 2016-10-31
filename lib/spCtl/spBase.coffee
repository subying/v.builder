###*
 * 雪碧图构建基类
 * @author pangjg
 * @date 2015-11-26 22:09:36
###

fs      = require('fs')
path    = require('path')
_       = require 'lodash'
gutil   = require('gulp-util')
color   = gutil.colors
Utils   = require '../utils'


### 单个雪碧图的状态检查类库 ###  
class SpInit
    # 参数初始化
    constructor:(@opts)->
        # console.log @opts
        @srcPath = @opts.srcPath + 'sprite'
        @imgOutPath = @opts.debugPath + 'img/sprite'
        @styleOutPath = @opts.srcPath + 'less/_sprite'
        @spMap = @opts.mapPath + 'spmap.json'
        Utils.mkdirsSync(@imgOutPath)
        Utils.mkdirsSync(@styleOutPath)

    ###*
    * 获取所有雪碧图的源目录
    ###
    getSpSrcFolders: ->
        _folders = []
        fs.readdirSync(@srcPath).forEach (file)->
            _folders.push file if file.indexOf('.') is -1
        return _folders

    ###*
    * 获取已合成的雪碧图
    ###
    getSpPngFiles: ->
        _list = []
        fs.readdirSync(@imgOutPath).forEach (v)->
            if v.indexOf('.png') != -1
                name = v.replace('.png', '')
                _list.push name
        return _list
    ###*
    * 获取已生成的雪碧图LESS
    ###
    getSpLessFiles: ->
        _list = []
        fs.readdirSync(@styleOutPath).forEach (v)->
            if v.indexOf('.less') != -1
                name = v.replace('.less', '')
                _list.push name
        return _list   


###*
 * 雪碧图的状态检查类
###
class SpBase extends SpInit

    # 检查雪碧图less是否存在
    lessIsBuild: (folder)->
        _spLess = path.join @outPath, folder + ".less"
        return fs.statSync(_spLess).isFile()

    # 检查雪碧图是否生成
    imgIsBuild: (folder)->
        _spImg = path.join(@outPath, folder + '.png')
        return fs.statSync(_spImg).isFile()

    # 获取雪碧图源目录结构的Map
    getSpMap: ->
        Utils.getMap('spMap') if not _.has global.Cache,'spMap'
        _spriteMap = global.Cache['spMap']
        return _spriteMap

    # 生成雪碧图原始文件的结构map
    setSpMap: (cb)->
        @getSpMap()
        _map = {}
        _spFolders = @getSpSrcFolders()
        for key in _spFolders
            _map[key] = @getSpSrcList(key)

        Utils.updateMap(_map,'spMap')
        Utils.saveMapFile('spMap')
        cb && cb(_map)

    # 获取目录下的雪碧图队列
    getSpSrcList: (folder)->
        _list = []
        _pngsPath = path.join(@srcPath, folder)
        fs.readdirSync(_pngsPath).forEach (file)->
            pngFile = path.join(_pngsPath, file)
            if file.indexOf('.') != 0 and file.indexOf('.png') != -1 and fs.statSync(pngFile)
                _list.push file
        return _list

    ###*
    * 返回雪碧图的生成算法 共三个：
    * 默认 binary-tree
    * 目录名的最后包含'_y'，即为Y轴，则为top-down
    * 目录名的最后包含'_x'，即为X轴，则为left-right
    ###
    getBuildMethod: (folder)->
        method = switch 
                when (/_x$/).test(folder) then 'left-right'
                when (/_y$/).test(folder) then 'top-down'
                else 'binary-tree'
        return method

    ###*
    * 获取需要生成雪碧图的目录
    ###
    getNewBuildPngFolders: =>
        _list = []
        _spriteMap = @getSpMap()
        newList = @getSpSrcFolders()
        oldList = @getSpPngFiles()
        for folder_name in newList
            if folder_name.indexOf('.') is -1
                if not _spriteMap.hasOwnProperty(folder_name) or folder_name not in oldList
                    _list.push folder_name
                else
                    ### 获取当前目录下的所有png文件 ###
                    _getPngs = @getSpSrcList(folder_name)
                    if _spriteMap[folder_name].length != _getPngs.length
                        _list.push folder_name
        return _list
        
    ###*
    * 获取需要生成LESS的目录
    ###
    getNewBuildLessFloders: =>
        _list = []
        newList = @getSpSrcFolders()
        oldList = @getSpLessFiles()
        for folder_name in newList
            if folder_name not in oldList and folder_name.indexOf('.') is -1
                 _list.push folder_name
        return _list

    ###*
    * 获取需要生成雪碧图和LESS的目录
    ###
    getAllNewBuildList: =>
        _buildLessFolders = @getNewBuildLessFloders()
        _buildSpPngFolders = @getNewBuildPngFolders()
        # 队列排重
        _allFolders = _buildLessFolders.concat(_buildSpPngFolders)
        _allFolders = _allFolders.sort()
        _list = []
        for file in _allFolders
            if file not in _list
                _list.push file
        return _list

module.exports = SpBase 