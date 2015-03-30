define 'mods/index/main', ['_lib/lazyload','mods/index/slider','mods/index/vmctrl'], (lazyload,Slider,vmctrl)->

    exports = {}

    exports.init = ->
        Slider.init()
        $('img').lazyload({
            placeholder: STATICPATH + "img/dot.png"
        })
        vmctrl.run ->
            $(window).resize ->
                $("#iBar").css({'height':$(window).height()})
        
    return exports