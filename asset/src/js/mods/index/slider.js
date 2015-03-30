// Generated by CoffeeScript 1.9.1

/*
 * 首页幻灯片效果
 */
define('mods/index/slider', ['_lib/slide'], function(slide) {
  var exports;
  exports = {};
  exports.init = function() {
    var $fullSlide, $sliderBox, _LoadError, _imgLoadimg, _loaded, _loading, _showBox, imgs, now_img;
    $sliderBox = $('.slider_box');
    $fullSlide = $('.slider_index');
    imgs = $fullSlide.find('.bd .preload');
    now_img = $fullSlide.find('.bd img').eq(0);
    $sliderBox.hide();
    $fullSlide.find('.pnBtn').hide();
    $fullSlide.find('.hd').hide();

    /*
     * 判断图片加载的函数
     * 参数说明：
     * arr：可以是存放图片路径的一个数组，也可以是选取到的img的jquery对象；
     * funLoading：每一个单独的图片加载完成后执行的操作；
     * funOnLoad：全部图片都加载完成后的操作；
     * funOnError：单个图片加载出错时的操作。
     */
    _imgLoadimg = function(arr, funLoading, funOnLoad, funOnError) {
      var a, isObject, numError, numLoaded, preload, results, src;
      numLoaded = 0;
      numError = 0;
      isObject = Object.prototype.toString.call(arr) == "[object Object]" ? true : false;
      arr = isObject ? arr.get() : arr;
      preload = function(src, obj) {
        var img;
        img = new Image();
        img.onload = function() {
          numLoaded++;
          funLoading && funLoading(numLoaded, arr.length, src, obj);
          return funOnLoad && numLoaded === arr.length && funOnLoad(numError);
        };
        img.onerror = function() {
          numLoaded++;
          numError++;
          return funOnError && funOnError(numLoaded, arr.length, src, obj);
        };
        return img.src = src;
      };
      results = [];
      for (a in arr) {
        src = isObject ? $(arr[a]).attr("data-src") : arr[a];
        console.log(src);
        results.push(preload(src, arr[a]));
      }
      return results;
    };
    _showBox = function() {
      $sliderBox.show().animate({
        height: '272px'
      }, 500);
      $fullSlide.find('.bd ul').css({
        'margin-left': '-402px'
      });
      return $fullSlide.fadeIn();
    };
    _loaded = function() {
      $fullSlide.hover(function() {
        $fullSlide.find('.pnBtn').stop().fadeIn();
      }, function() {
        $fullSlide.find('.pnBtn').fadeOut();
      });
      return $fullSlide.slide({
        titCell: ".hd ul",
        mainCell: ".bd ul",
        switchLoad: "data-src",
        effect: "leftLoop",
        autoPlay: true,
        vis: 1,
        autoPage: true,
        delayTime: 500,
        interTime: 5000,
        trigger: "click",
        startFun: function() {
          return $fullSlide.find('.hd').fadeIn();
        }
      });
    };
    _loading = function(n, total, src, obj) {
      return $(obj).attr("src", src).fadeIn();
    };
    _LoadError = function(n) {
      return console.log("the " + n + "st img loaded Error!");
    };
    _imgLoadimg(now_img, _loading, _showBox, null);
    return _imgLoadimg(imgs, _loading, _loaded, _LoadError);
  };
  return exports;
});
