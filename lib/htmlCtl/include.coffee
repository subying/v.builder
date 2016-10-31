through = require("through2");
path = require('path');
parser = require("./parser");
Util = require("../utils")

formateRe = (str)->
    return str.replace /\\|\.|\+/g, (m)->
        return '\\' + m
# options，传入模板变量
module.exports = (options)->
    options = `(typeof options === "object") ? options : {}`

    parser.config(options)

    ignore = options.ignore
    type = Object.prototype.toString.call(ignore)
    
    switch (type) 
        when "[object Array]"
            ignore.forEach (p, i)->
                ignore[i] = path.resolve(p)
            
            RE = new RegExp("^(?:" + formateRe(ignore.join("|")) + ")")
            
        when "[object String]"
            ignore = path.resolve(ignore);
            RE = new RegExp("^" + formateRe(ignore))
        when "[object RegExp]"
            RE = ignore;

        else
            break
    

    return through.obj (file, enc, done)->
        filepath = path.normalize(file.path)
        filepath = Util.tranFilePath file.path
        filename = path.basename(filepath)

        if (RE && RE.test(filepath) && !(RE.lastIndex = 0)) || filename.match(/^_/)
            done()
            return

        result = parser.parse(filepath, options, file.contents.toString())

        if result
            file.contents = new Buffer(result)
            this.push(file)
        done()
        