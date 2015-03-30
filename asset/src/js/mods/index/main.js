// Generated by CoffeeScript 1.9.1
define('mods/index/main', ['_lib/lazyload', 'mods/index/slider', 'mods/index/vmctrl'], function(lazyload, Slider, vmctrl) {
  var exports;
  exports = {};
  exports.init = function() {
    Slider.init();
    $('img').lazyload({
      placeholder: STATICPATH + "img/dot.png"
    });
    return vmctrl.run(function() {
      return $(window).resize(function() {
        return $("#iBar").css({
          'height': $(window).height()
        });
      });
    });
  };
  return exports;
});
