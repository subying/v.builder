ejs = require('ejs')
url = require('url')
fs = require('fs')
path = require('path')
Utils   = require '../utils'

# 匹配("" , {xx:xx})
INC_RE_STR = '\\(\\s*(?:"|\')([\\w\\/.-]*\\s*)(?:"|\')\\s*(?:,\\s*(\\{[\\s\\S]*?\\}))?\\);?'

# 如果匹配该正则，则说明是./或者../的文件，不需使用baseDir
NOBASE_RE = /^\.{0,2}\//

# 默认文件后缀
suffix = "html"

toString = Object.prototype.toString
slice = Array.prototype.slice

include = "@@include"
INC_RE = null
baseDir = null
inited = false
configName = null


# 获取文件字符串
Utils.getFileString = (filepath)->
    if /(?:\/|\\)$/.test(filepath) || !fs.existsSync(filepath)
        console.log("\x1B[31mfile is not exist：" + filepath + "\x1B[0m")
        return null
    else 
        return fs.readFileSync(filepath).toString()


# 深度拷贝
Utils.deepCopy = (obj)->
    result = {};
    type = toString.call(obj);

    if !obj || (type == "[object RegExp]") || typeof obj != "object"
        return obj

    if type == "[object Array]"
        return slice.call(obj)

    for key,val of obj 
        result[key] = Utils.deepCopy(val)

    return result



# ejs引擎处理函数
Main = 
    config: (options)->
        options = options || {}

        if options.ejs
            for k,v of options.ejs
                ejs[k] = v

        suffix = options.suffix || suffix
        include = options.include || include
        baseDir = options.baseDir
        configName = options.configName || "config.js"

        INC_RE = new RegExp("([ \\t]*)" + include + INC_RE_STR, 'g')
        inited = true

    combine: (content, filePath, opt)->
        _this = @
        fileUrl = null # include的文件地址
        templateFile = null # include的文件内容
        # 如果文件目录下存在config.js，则将以ejs模板的形式包装
        configPath = path.dirname(filePath) + path.sep + configName
        if fs.existsSync(configPath)
            delimiter = ejs.delimiter or "%"
            configFile = "<" + delimiter + fs.readFileSync(configPath).toString() + delimiter + ">"
            content = configFile + content
        

        opt = opt or {}

        try
            # console.log content
            result = ejs.render(content, opt)
        catch e
            console.log("\x1B[31mbuild " + filePath + " fail\x1B[0m")
            console.log("\x1B[31mEjs error：" + e.message + "\x1B[0m")
            return
        

        result = result.replace INC_RE, ($1,$2,$3,$4)->
            # var obj, nobj;
            # space = RegExp.$1

            # fileUrl = RegExp.$2
            # obj = RegExp.$3 || "{}"
            msg = $1
            space = $2
            fileUrl = $3
            obj = $4 || "{}"

            if !(typeof baseDir == "string") || NOBASE_RE.test(fileUrl)
                fileUrl = url.resolve(filePath, fileUrl)
            else
                fileUrl = baseDir + "/" + fileUrl
            

            # 如果文件没有文件类型扩展名，则加上
            fileUrl += `(new RegExp("." + suffix + "$")).test(fileUrl) ? "" : ("." + suffix)`

            return msg if !(templateFile = Utils.getFileString(fileUrl))

            # 获取@@include里传入的参数，并转成对象
            try
                obj = eval("(" + obj.replace(/\r\n/, '') + ")")
            catch e
                obj = {}

            # 将参数对象拷贝，并且与include里传入的参数合并
            nobj = Utils.deepCopy(opt)
            for key,val of obj
                # nobj[key] = val
                if key.indexOf('css') == 0
                    nobj[key] = Utils.init_css(val)
                else if key.indexOf('js') == 0
                    nobj[key] = Utils.init_js(val)
                else if key.indexOf('img') == 0
                    nobj[key] = Utils.init_img(val)
                else
                    nobj[key] = val
            
            # 用于保证格式
            result = _this.combine(templateFile, fileUrl, nobj)
            # console.log result
            if result
                lines = result.split(/\r?\n/g)

                result = space + lines.join("\n" + space)

            return result;
        
        return result

    # filepath：文件路径，options包括模板变量及部分参数，content:文件内容
    parse: (filepath, options, content)->
        _this = @
        if !inited
            _this.config()

        if arguments.length == 2 && (typeof options == "string")
            content = options
            options = {}

        content = content || Utils.getFileString(filepath)
        options = options || {}

        return "" if (!content) 
        return _this.combine(content, filepath, options)
  
module.exports = Main