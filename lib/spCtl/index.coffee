fs = require('fs')
path = require('path')
vfs = require('vinyl-fs')
sprite = require('gulp.spritesmith')
gutil = require('gulp-util')
color = gutil.colors
SpBase = require('./spBase')

class SpCtl extends SpBase
    replaceName: (source)->
        _source = source.toString()
        # console.log(_source)
        
        return _source
    ###
    # PNGs combine to one image and build LESS demo
    ###
    outputOne: (floder,cb) =>
        _this = @
        _floder = floder
        _srcPath = @srcPath
        _imgOutPath = @imgOutPath
        _styleOutPath = @styleOutPath

        # 雪碧图在css中相对路径
        _spBgUrl = '../img/sprite/' + _floder + '.png'

        # 获取雪碧图合成算法
        _method = @getBuildMethod(_floder)
        opts =
            # engine: 'pngsmith'
            algorithm: _method
            padding: 10
            imgName: "#{_floder}.png"
            cssName: "#{_floder}.less"
            cssFormat: 'css'
            imgPath: _spBgUrl
            cssOpts:
                cssSelector: (item)->
                    return ".icon-#{_floder}-#{item.name}()"  
        spriteData = vfs.src(path.join(_srcPath, _floder, '*.png'))
                        .pipe(sprite(opts))

        try 
            ###  
                修复雪碧图合并失败
            ###
            ### 
            spriteData.img.on 'data',(imgRes)->
                _imgPath = "#{_imgOutPath}/#{imgRes.path}"
                _imgSource = imgRes.contents
                fs.writeFileSync _imgPath, imgRes.contents, 'utf8'
            ###
            spriteData.img.pipe(vfs.dest(_imgOutPath))

            spriteData.css.on 'data',(stylRes)->
                _stylPath = "#{_styleOutPath}/#{stylRes.path}"
                # console.log(_stylPath)
                _stylSource = stylRes.contents
                _contents = _this.replaceName(stylRes.contents)
                fs.writeFileSync _stylPath, _contents, 'utf8'
                cb and cb()
        catch error
                # gutil.log "Error: #{_imgFile}"
                gutil.log error
                cb and cb()
    ###*
    * 生成雪碧图和雪碧图map
    * @param  _type 1:所有未生成LESS或PNG的目录  2: 未生成PNG的目录
    * @callback 返回带上最新的雪碧图源文件map
    ###
    init: (type,cb)=>
        if typeof type  is 'function'
            _cb = type
            _type = 0
        else
            _type = type or 0
            _cb = cb or ->

        # 实例化雪碧图的构建对象 
        _this = @
        _newFolders = []
        # 本次构建的雪碧图队列
        switch _type
            when 1
                _newFolders = _this.getAllNewBuildList()  
            when 2 
                _newFolders = _this.getNewBuildPngFolders()
            else 
                _newFolders =_this.getSpSrcFolders()
        # 生成新的sp图
        total = _newFolders.length
        _num = 0
        if total > 0
            gutil.log 'Starting','\'' + color.cyan('Sprites') + '\'...'
            for folder in _newFolders
                _this.outputOne folder, ->
                    _num++
                    _num%10 == 5 and gutil.log 'Waitting...'
                    if _num == total
                        _this.setSpMap ->
                            gutil.log '\'' + color.cyan('Sprites') + '\'', 'build success.' 
                           _cb()
        else
            _cb()
    
module.exports = SpCtl