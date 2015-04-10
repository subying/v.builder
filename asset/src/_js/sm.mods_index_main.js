/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */
define('_lib/lazyload', [], function() {

    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "src",
            skip_invisible: true,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                    $self.addClass('iLoaded');
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    $.previewport= function(element, settings) {
        return $.rightoffold(element, settings) || $.leftofbegin(element, settings) ||
            $.belowthefold(element, settings) || $.abovethetop(element, settings);
    };
    /* Custom selectors for your convenience.  为了您的方便自定义选择器。 */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold": function(a) {
            return $.belowthefold(a, {
                threshold: 0
            });
        },
        "above-the-top": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-screen": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-screen": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        },
        "in-viewport": function(a) {
            return $.inviewport(a, {
                threshold: 0
            });
        },
        "pre-viewport": function(a) {
            return $.previewport(a, {
                threshold: 0
            });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function(a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-fold": function(a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-fold": function(a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        }
    });
    return $.fn;
});define('_lib/easing', [], function() {
    $ = $ || window['$'];
    $.easing['jswing'] = $.easing['swing'];
    $.extend($.easing, {
        def: 'easeOutQuad',
        swing: function(x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
        },
        easeInExpo: function(x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
        },
        easeOutExpo: function(x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
        },
        easeInOutExpo: function(x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
        },
        easeInElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
        },
        easeOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        },
        easeInOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
        },
        easeInBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b
        },
        easeOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        },
        easeInOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
        },
        easeInBounce: function(x, t, b, c, d) {
            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b
        },
        easeOutBounce: function(x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function(x, t, b, c, d) {
            if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
    return $.easing;
});
;/*!
 * SuperSlide v2.1.1 
 * 轻松解决网站大部分特效展示问题
 * 详尽信息请看官网：http://www.SuperSlide2.com/
 */

define('_lib/slide', ['_lib/easing'], function(easing) {

    $.fn.slide=function(options){
        $.fn.slide.defaults={
        type:"slide", 
        effect:"fade", 
        autoPlay:false, 
        delayTime:500, 
        interTime:2500,
        triggerTime:150,
        defaultIndex:0,
        titCell:".hd li",
        mainCell:".bd",
        targetCell:null,
        trigger:"mouseover",
        scroll:1,
        vis:1,
        titOnClassName:"on",
        autoPage:false, 
        prevCell:".prev",
        nextCell:".next",
        pageStateCell:".pageState",
        opp: false, 
        pnLoop:true, 
        easing:"swing", 
        startFun:null,
        endFun:null,
        switchLoad:null,

        playStateCell:".playState",
        mouseOverStop:true,
        defaultPlay:true,
        returnDefault:false 
        };

        return this.each(function() {

            var opts = $.extend({},$.fn.slide.defaults,options);
            var slider = $(this);
            var effect = opts.effect;
            var prevBtn = $(opts.prevCell, slider);
            var nextBtn = $(opts.nextCell, slider);
            var pageState = $(opts.pageStateCell, slider);
            var playState = $(opts.playStateCell, slider);

            var navObj = $(opts.titCell, slider);//导航子元素结合
            var navObjSize = navObj.size();
            var conBox = $(opts.mainCell , slider);//内容元素父层对象
            var conBoxSize=conBox.children().size();
            var sLoad=opts.switchLoad;
            var tarObj = $(opts.targetCell, slider);

            /*字符串转换*/
            var index=parseInt(opts.defaultIndex);
            var delayTime=parseInt(opts.delayTime);
            var interTime=parseInt(opts.interTime);
            var triggerTime=parseInt(opts.triggerTime);
            var scroll=parseInt(opts.scroll);
            var vis=parseInt(opts.vis);
            var autoPlay = (opts.autoPlay=="false"||opts.autoPlay==false)?false:true;
            var opp = (opts.opp=="false"||opts.opp==false)?false:true;
            var autoPage = (opts.autoPage=="false"||opts.autoPage==false)?false:true;
            var pnLoop = (opts.pnLoop=="false"||opts.pnLoop==false)?false:true;
            var mouseOverStop = (opts.mouseOverStop=="false"||opts.mouseOverStop==false)?false:true;
            var defaultPlay = (opts.defaultPlay=="false"||opts.defaultPlay==false)?false:true;
            var returnDefault = (opts.returnDefault=="false"||opts.returnDefault==false)?false:true;

            var slideH=0;
            var slideW=0;
            var selfW=0;
            var selfH=0;
            var easing=opts.easing;
            var inter=null;//autoPlay-setInterval 
            var mst =null;//trigger-setTimeout
            var rtnST=null;//returnDefault-setTimeout
            var titOn = opts.titOnClassName;

            var onIndex = navObj.index( slider.find( "."+titOn) );
            var oldIndex = index = onIndex==-1?index:onIndex;
            var defaultIndex = index;


            var _ind = index;
            var cloneNum = conBoxSize>=vis?( conBoxSize%scroll!=0?conBoxSize%scroll:scroll):0; 
            var _tar;
            var isMarq = effect=="leftMarquee" || effect=="topMarquee"?true:false;

            var doStartFun=function(){ if ( $.isFunction( opts.startFun) ){ opts.startFun( index,navObjSize,slider,$(opts.titCell, slider),conBox,tarObj,prevBtn,nextBtn ) } }
            var doEndFun=function(){ if ( $.isFunction( opts.endFun ) ){ opts.endFun( index,navObjSize,slider,$(opts.titCell, slider),conBox,tarObj,prevBtn,nextBtn ) } }
            var resetOn=function(){ navObj.removeClass(titOn); if( defaultPlay ) navObj.eq(defaultIndex).addClass(titOn)  }



            //单独处理菜单效果
            if( opts.type=="menu" ){

                if( defaultPlay ){ navObj.removeClass(titOn).eq(index).addClass(titOn); }
                navObj.hover(
                        function(){
                            _tar=$(this).find( opts.targetCell );
                            var hoverInd =navObj.index($(this));
                        
                            mst = setTimeout(function(){  
                                index=hoverInd;
                                navObj.removeClass(titOn).eq    (index).addClass(titOn);
                                doStartFun();
                                switch (effect)
                                {
                                    case "fade":_tar.stop(true,true).animate({opacity:"show"}, delayTime,easing,doEndFun ); break;
                                    case "slideDown":_tar.stop(true,true).animate({height:"show"}, delayTime,easing,doEndFun ); break;
                                }
                            } ,opts.triggerTime);

                        },function(){
                            clearTimeout(mst);
                            switch (effect){ case "fade":_tar.animate( {opacity:"hide"},delayTime,easing ); break; case "slideDown":_tar.animate( {height:"hide"},delayTime,easing ); break; }
                        }
                );

                if (returnDefault){ 
                    slider.hover(function(){clearTimeout(rtnST);},function(){ rtnST = setTimeout( resetOn,delayTime ); });
                }
                

                return;
            }

            
            //处理分页
            if( navObjSize==0 )navObjSize=conBoxSize;//只有左右按钮
            if( isMarq ) navObjSize=2;
            if( autoPage ){
                if(conBoxSize>=vis){
                    if( effect=="leftLoop" || effect=="topLoop" ){ navObjSize=conBoxSize%scroll!=0?(conBoxSize/scroll^0)+1:conBoxSize/scroll; }
                    else{ 
                            var tempS = conBoxSize-vis;
                            navObjSize=1+parseInt(tempS%scroll!=0?(tempS/scroll+1):(tempS/scroll)); 
                            if(navObjSize<=0)navObjSize=1; 
                    }
                }
                else{ navObjSize=1 }
                
                navObj.html(""); 
                var str="";

                if( opts.autoPage==true || opts.autoPage=="true" ){ for( var i=0; i<navObjSize; i++ ){ str+="<li>"+(i+1)+"</li>" } }
                else{ for( var i=0; i<navObjSize; i++ ){ str+=opts.autoPage.replace("$",(i+1))  } }
                navObj.html(str); 
                
                var navObj = navObj.children();//重置导航子元素对象
            }


            if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
                conBox.children().each(function(){ //取最大值
                    if( $(this).width()>selfW ){ selfW=$(this).width(); slideW=$(this).outerWidth(true);  }
                    if( $(this).height()>selfH ){ selfH=$(this).height(); slideH=$(this).outerHeight(true);  }
                });

                var _chr = conBox.children();
                var cloneEle = function(){ 
                    for( var i=0; i<vis ; i++ ){ _chr.eq(i).clone().addClass("clone").appendTo(conBox); } 
                    for( var i=0; i<cloneNum ; i++ ){ _chr.eq(conBoxSize-i-1).clone().addClass("clone").prependTo(conBox); }
                }
                
                switch(effect)
                {
                    case "fold": conBox.css({"position":"relative","width":slideW,"height":slideH}).children().css( {"position":"absolute","width":selfW,"left":0,"top":0,"display":"none"} ); break;
                    case "top": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>').css( { "top":-(index*scroll)*slideH, "position":"relative","padding":"0","margin":"0"}).children().css( {"height":selfH} ); break;
                    case "left": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').css( { "width":conBoxSize*slideW,"left":-(index*scroll)*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0"}).children().css( {"float":"left","width":selfW} ); break;
                    case "leftLoop":
                    case "leftMarquee":
                        cloneEle();
                        conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').css( { "width":(conBoxSize+vis+cloneNum)*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-(cloneNum+index*scroll)*slideW}).children().css( {"float":"left","width":selfW}  ); break;
                    case "topLoop":
                    case "topMarquee":
                        cloneEle();
                        conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>').css( { "height":(conBoxSize+vis+cloneNum)*slideH,"position":"relative","padding":"0","margin":"0","top":-(cloneNum+index*scroll)*slideH}).children().css( {"height":selfH} ); break;
                }
            }



            //针对leftLoop、topLoop的滚动个数
            var scrollNum=function(ind){ 
                var _tempCs= ind*scroll; 
                if( ind==navObjSize ){ _tempCs=conBoxSize; }else if( ind==-1 && conBoxSize%scroll!=0){ _tempCs=-conBoxSize%scroll; }
                return _tempCs;
            }

            //切换加载
            var doSwitchLoad=function(objs){ 

                    var changeImg=function(t){
                        for ( var i= t; i<( vis+ t); i++ ){
                                objs.eq(i).find("img["+sLoad+"]").each(function(){ 
                                    var _this =  $(this);
                                    _this.attr("src",_this.attr(sLoad)).removeAttr(sLoad);
                                    if( conBox.find(".clone")[0] ){ //如果存在.clone
                                        var chir = conBox.children();
                                        for ( var j=0 ; j< chir.size() ; j++ )
                                        {
                                            chir.eq(j).find("img["+sLoad+"]").each(function(){
                                                if( $(this).attr(sLoad)==_this.attr("src") ) $(this).attr("src",$(this).attr(sLoad)).removeAttr(sLoad) 
                                            })
                                        }
                                    }
                                })
                            }
                    }

                    switch(effect)
                    {
                        case "fade": case "fold": case "top": case "left": case "slideDown":
                            changeImg( index*scroll );
                            break;
                        case "leftLoop": case "topLoop":
                            changeImg( cloneNum+scrollNum(_ind) );
                            break;
                        case "leftMarquee":case "topMarquee": 
                            var curS = effect=="leftMarquee"? conBox.css("left").replace("px",""):conBox.css("top").replace("px",""); 
                            var slideT = effect=="leftMarquee"? slideW:slideH; 
                            var mNum=cloneNum;
                            if( curS%slideT!=0 ){
                                var curP = Math.abs(curS/slideT^0);
                                if( index==1 ){ mNum=cloneNum+curP }else{  mNum=cloneNum+curP-1  }
                            }
                            changeImg( mNum );
                            break;
                    }
            }//doSwitchLoad end


            //效果函数
            var doPlay=function(init){
                 // 当前页状态不触发效果
                if( defaultPlay && oldIndex==index && !init && !isMarq ) return;
                
                //处理页码
                if( isMarq ){ if ( index>= 1) { index=1; } else if( index<=0) { index = 0; } }
                else{ 
                    _ind=index; if ( index >= navObjSize) { index = 0; } else if( index < 0) { index = navObjSize-1; }
                }

                doStartFun();

                //处理切换加载
                if( sLoad!=null ){ doSwitchLoad( conBox.children() ) }

                //处理targetCell
                if(tarObj[0]){ 
                    _tar = tarObj.eq(index);
                    if( sLoad!=null ){ doSwitchLoad( tarObj ) }
                    if( effect=="slideDown" ){
                            tarObj.not(_tar).stop(true,true).slideUp(delayTime); 
                            _tar.slideDown( delayTime,easing,function(){ if(!conBox[0]) doEndFun() }); 
                    }
                    else{
                            tarObj.not(_tar).stop(true,true).hide();
                            _tar.animate({opacity:"show"},delayTime,function(){ if(!conBox[0]) doEndFun() }); 
                    }
                }
                
                if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
                    switch (effect)
                    {
                        case "fade":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().hide(); break;
                        case "fold":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().animate({opacity:"hide"},delayTime,easing);break;
                        case "top":conBox.stop(true,false).animate({"top":-index*scroll*slideH},delayTime,easing,function(){doEndFun()});break;
                        case "left":conBox.stop(true,false).animate({"left":-index*scroll*slideW},delayTime,easing,function(){doEndFun()});break;
                        case "leftLoop":
                            var __ind = _ind;
                            conBox.stop(true,true).animate({"left":-(scrollNum(_ind)+cloneNum)*slideW},delayTime,easing,function(){
                                if( __ind<=-1 ){ conBox.css("left",-(cloneNum+(navObjSize-1)*scroll)*slideW);  }else if( __ind>=navObjSize ){ conBox.css("left",-cloneNum*slideW); }
                                doEndFun();
                            });
                            break;//leftLoop end

                        case "topLoop":
                            var __ind = _ind;
                            conBox.stop(true,true).animate({"top":-(scrollNum(_ind)+cloneNum)*slideH},delayTime,easing,function(){
                                if( __ind<=-1 ){ conBox.css("top",-(cloneNum+(navObjSize-1)*scroll)*slideH);  }else if( __ind>=navObjSize ){ conBox.css("top",-cloneNum*slideH); }
                                doEndFun();
                            });
                            break;//topLoop end

                        case "leftMarquee":
                            var tempLeft = conBox.css("left").replace("px",""); 
                            if(index==0 ){
                                    conBox.animate({"left":++tempLeft},0,function(){
                                        if( conBox.css("left").replace("px","")>= 0){ conBox.css("left",-conBoxSize*slideW) }
                                    });
                            }
                            else{
                                    conBox.animate({"left":--tempLeft},0,function(){
                                        if(  conBox.css("left").replace("px","")<= -(conBoxSize+cloneNum)*slideW){ conBox.css("left",-cloneNum*slideW) }
                                    });
                            }break;// leftMarquee end

                            case "topMarquee":
                            var tempTop = conBox.css("top").replace("px",""); 
                            if(index==0 ){
                                    conBox.animate({"top":++tempTop},0,function(){
                                        if( conBox.css("top").replace("px","")>= 0){ conBox.css("top",-conBoxSize*slideH) }
                                    });
                            }
                            else{
                                    conBox.animate({"top":--tempTop},0,function(){
                                        if(  conBox.css("top").replace("px","")<= -(conBoxSize+cloneNum)*slideH){ conBox.css("top",-cloneNum*slideH) }
                                    });
                            }break;// topMarquee end

                    }//switch end
                }

                    navObj.removeClass(titOn).eq(index).addClass(titOn);
                    oldIndex=index;
                    if( !pnLoop ){ //pnLoop控制前后按钮是否继续循环
                        nextBtn.removeClass("nextStop"); prevBtn.removeClass("prevStop");
                        if (index==0 ){ prevBtn.addClass("prevStop"); }
                        if (index==navObjSize-1 ){ nextBtn.addClass("nextStop"); }
                    }

                    pageState.html( "<span>"+(index+1)+"</span>/"+navObjSize);

            };// doPlay end

            //初始化执行
            if( defaultPlay ){ doPlay(true); }

            if (returnDefault)//返回默认状态
            {
                slider.hover(function(){ clearTimeout(rtnST) },function(){
                        rtnST = setTimeout( function(){
                            index=defaultIndex;
                            if(defaultPlay){ doPlay(); }
                            else{
                                if( effect=="slideDown" ){ _tar.slideUp( delayTime, resetOn ); }
                                else{ _tar.animate({opacity:"hide"},delayTime,resetOn ); }
                            }
                            oldIndex=index;
                        },300 );
                });
            }
            
            ///自动播放函数
            var setInter = function(time){ inter=setInterval(function(){  opp?index--:index++; doPlay() }, !!time?time:interTime);  }
            var setMarInter = function(time){ inter = setInterval(doPlay, !!time?time:interTime);  }
            // 处理mouseOverStop
            var resetInter = function(){ if( !mouseOverStop ){clearInterval(inter); setInter() } }
            // 前后按钮触发
            var nextTrigger = function(){ if ( pnLoop || index!=navObjSize-1 ){ index++; doPlay(); if(!isMarq)resetInter(); } }
            var prevTrigger = function(){ if ( pnLoop || index!=0 ){ index--; doPlay(); if(!isMarq)resetInter(); } }
            //处理playState
            var playStateFun = function(){ clearInterval(inter); isMarq?setMarInter():setInter(); playState.removeClass("pauseState") }
            var pauseStateFun = function(){ clearInterval(inter);playState.addClass("pauseState"); }

            //自动播放
            if (autoPlay) {
                    if( isMarq ){ 
                        opp?index--:index++; setMarInter();
                        if(mouseOverStop) conBox.hover(pauseStateFun,playStateFun);
                    }else{
                        setInter();
                        if(mouseOverStop) slider.hover( pauseStateFun,playStateFun );
                    }
            }
            else{ if( isMarq ){ opp?index--:index++; } playState.addClass("pauseState"); }

            playState.click(function(){  playState.hasClass("pauseState")?playStateFun():pauseStateFun()  });

            //titCell事件
            if(opts.trigger=="mouseover"){
                navObj.hover(function(){ var hoverInd = navObj.index(this);  mst = setTimeout(function(){  index=hoverInd; doPlay(); resetInter();  },opts.triggerTime); }, function(){ clearTimeout(mst) });
            }else{ navObj.click(function(){ index=navObj.index(this); doPlay(); resetInter(); })  }

            //前后按钮事件
            if (isMarq){
                
                nextBtn.mousedown(nextTrigger);
                prevBtn.mousedown(prevTrigger);
                //前后按钮长按10倍加速
                if (pnLoop)
                {   
                    var st;
                    var marDown = function(){ st=setTimeout(function(){ clearInterval(inter); setMarInter( interTime/10^0 ) },150) }
                    var marUp = function(){ clearTimeout(st); clearInterval(inter); setMarInter() }
                    nextBtn.mousedown(marDown); nextBtn.mouseup(marUp);
                    prevBtn.mousedown(marDown); prevBtn.mouseup(marUp);
                }
                //前后按钮mouseover事件
                if( opts.trigger=="mouseover"  ){ nextBtn.hover(nextTrigger,function(){}); prevBtn.hover(prevTrigger,function(){}); }
            }else{
                nextBtn.click(nextTrigger);
                prevBtn.click(prevTrigger);
            }

        });//each End

    };//slide End
    return $.fn.slide
});
;// Generated by CoffeeScript 1.9.1

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
;// Generated by CoffeeScript 1.9.1

/*
 * ajax接口封装
 */
define("_utils/doajax", [], function() {
  var exports;
  exports = {};
  exports.get = function(url, datas, cb) {
    var _cb;
    _cb = cb || function() {};
    return $.ajax({
      url: url,
      dataType: "json",
      data: datas || {},
      type: 'GET',
      success: function(ajaxobj) {
        return _cb(ajaxobj);
      },
      error: function(ajaxobj) {
        return _cb(ajaxobj);
      }
    });
  };
  exports.post = function(url, datas, cb) {
    var _cb;
    _cb = cb || function() {};
    return $.ajax({
      url: url,
      dataType: "json",
      data: datas || {},
      type: 'POST',
      success: function(ajaxobj) {
        return _cb(ajaxobj);
      },
      error: function(ajaxobj) {
        return _cb(ajaxobj);
      }
    });
  };
  return exports;
});
;// Generated by CoffeeScript 1.9.1

/*
 * 侧边栏的数据接口
 */
define('_data/ibar', ['_utils/doajax'], function(doAjax) {
  var cachetime, exports;
  cachetime = new Date().getTime();
  exports = {
    userInfo: function(cb) {
      var url;
      url = "/json/login.json?_" + cachetime;
      return doAjax.post(url, {}, function(data) {
        return cb(data);
      });
    },
    asset: function(cb) {
      var url;
      url = "/json/asset.json?_" + cachetime;
      return doAjax.post(url, {}, function(data) {
        return cb(data);
      });
    },
    cartList: function(cb) {
      var url;
      url = "/json/cart_6.json?_" + cachetime;
      return doAjax.post(url, {}, function(data) {
        return cb(data);
      });
    },
    favorite: function(cb) {
      var url;
      url = "/json/favorite.json?_" + cachetime;
      return doAjax.post(url, {}, function(data) {
        return cb(data);
      });
    },
    history: function(cb) {
      var url;
      url = "/json/history.json?_" + cachetime;
      return doAjax.post(url, {}, function(data) {
        return cb(data);
      });
    }
  };
  return exports;
});
;/**
 * The base Class implementation.
 * @module _utils/class
 * @date 2014-04-10 15:37:25
 * @version $Id: class.js$
 * @example
 *  var Pig = Class.create({
 *      initialize: function(name) {
 *          this.name = name;
 *      },
 *      talk: function() {
 *          alert('我是' + this.name);
 *      }
 *  });
 *  var RedPig = Pig.extend({
 *      initialize: function(name) {
 *          RedPig.superclass.initialize.call(this, name);
 *      },
 *      color: '红色'
 *  });
 *  
 */
define('_utils/class', [], function(){
    // The base Class implementation.
    var Class = function(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    };

    /**
     * {@link https://github.com/aralejs/class class} 
     */
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === "[object Array]";
    };
    var isFunction = function(val) {
        return toString.call(val) === "[object Function]";
    };
    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };

    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;
        // The created class constructor
        function SubClass() {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === SubClass && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            mix(SubClass, parent, parent.StaticsWhiteList);
        }
        // Add instance properties to the subclass.
        implement.call(SubClass, properties);
        // Make subclass extendable.
        return classify(SubClass);
    };
    function implement(properties) {
        var key, value;
        for (key in properties) {
            value = properties[key];
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this;
        return Class.create(properties);
    };
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    // Mutators define special properties.
    Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype);
            // Keep existed properties.
            mix(proto, existed);
            // Enforce the constructor to be what we expect.
            proto.constructor = this;
            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto;
            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype;
        },
        Implements: function(items) {
            isArray(items) || (items = [ items ]);
            var proto = this.prototype, item;
            while (item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };
    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}
    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ? function(proto) {
        return {
            __proto__: proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };
    // Helpers
    // ------------
    function mix(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) continue;
                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== "prototype") {
                    r[p] = s[p];
                }
            }
        }
    }
    return Class; 
});
;define('_tpl/header', [], function(){ return {"_cartlist":"<script id=\"tpl_header_cartlist\" type=\"smcore\"><i class=\"cart-icons\"></i><div class=\"cart_content_null\" vm-if=\"cartInfo.quantity == 0\"> 购物车中还没有商品， <br>快去挑选心爱的商品吧！</div><div class=\"cart_content_all\" vm-if=\"cartInfo.quantity > 0\"><div class=\"cart_left_time\"><span class=\"cart_timer\">16分27.6</span>后购物车将被清空,请及时结算</div><div class=\"cart_content_center\"><div class=\"cart_con_over cart_con_single\" vm-repeat=\"cartInfo.product.items\"><div class=\"single_pic\"><a vm-attr-alt=\"el.short_name\" target=\"_blank\" vm-href=\"el.url + '?from=home_cart_float'\"><img vm-src=\"el.image_60\"></a></div><div class=\"single_info\"><a class=\"name\" vm-attr-alt=\"el.short_name\" target=\"_blank\" vm-href=\"el.url + '?from=home_cart_float'\">{{el.short_name}}</a><span class=\"price\">￥{{el.item_price}}</span><span class=\"price_plus\"> x </span><span class=\"price_num\">{{el.quantity}}</span></div></div></div><div class=\"con_all\"><div class=\"price_whole\"><span>共<span class=\"num_all\">{{cartInfo.quantity}}</span>件商品</span></div><div><span class=\"price_gongji\">共计<em>￥</em><span class=\"total_price\">{{cartInfo.total_amount}}</span></span><a rel=\"nofollow\" class=\"cart_btn\" href=\"http://cart.jumei.com/i/cart/show/?from=header_cart\">去购物车结算</a></div></div></div></script>","cartbtn":"<div class=\"cart_box\" id=\"cart_box\" vm-class=\"car-current:isOn\" ><a rel=\"nofollow\" href=\"http://cart.jumei.com/i/cart/show?from=header_cart\" class=\"cart_link\" id=\"cart\" vm-mouseover=\"movein\" vm-mouseout=\"moveout\"><img width=\"28\" height=\"28\" class=\"cart_gif\" src=\"http://p0.jmstatic.com/assets/cart.gif\"><span class=\"text\">去购物车结算</span><span class=\"num\" vm-if=\"cartInfo.quantity > 0\">{{cartInfo.quantity}}</span><s class=\"icon_arrow_right\"></s></a><div id=\"cart_content\" class=\"cart_content\" vm-include=\"tpl_cart\" data-include-rendered=\"render\" vm-mouseover=\"movein\" vm-mouseout=\"moveout\"></div></div>","userinfo":"<ul id=\"headerTopLeft\" class=\"header_top_left\" vm-if=\"isLogin\"><li class=\"signin\">欢迎您，<span class=\"col_jumei\"><a target=\"_blank\" href=\"http://www.jumei.com/i/order/list\">JM135ACCE2090</a></span> [ <a href=\"http://passport.jumei.com/i/account/logout\" class=\"signout\">退出</a> ]</li></ul><ul class=\"header_top_left\" id=\"headerTopLeft\" vm-if=\"!isLogin\"><li>欢迎来到聚美！</li><li><a href=\"http://www.jumei.com/i/account/login\" rel=\"nofollow\">请登录</a></li><li><a href=\"http://www.jumei.com/i/account/signup\" rel=\"nofollow\">快速注册</a></li></ul>"}; });;define('_tpl/ggmod', [], function(){ return {"_poptips":"<script id=\"tpl_ggmod_poptips\" type=\"smcore\"><div class=\"envelopeBubble png\" style=\"right: 200px; display: block;\"><div class=\"ebClose\"></div><div class=\"ebtime\"><i><span>23</span><strong>时</strong></i><i><span>25</span><strong>分</strong></i><i style=\"margin-right:0\"><span>59</span><strong>秒</strong></i></div><div class=\"ebbmont\"><a href=\"http://www.jumei.com/i/membership/show_promocards\"><span>查看您的</span><span class=\"price_l\">165</span><span>元现金券</span></a></div></div></script>"}; });;// Generated by CoffeeScript 1.9.1
define('ggmod/poptips', ['_utils/class', '_tpl/ggmod'], function(Class, Tpl) {
  return Class.create({
    initialize: function() {
      var $body;
      $body = $('body');
      this.tpl_poptips = $(Tpl._poptips);
      return this.tpl_poptips.appendTo($body);
    }
  });
});
;// Generated by CoffeeScript 1.9.1
define('common/header', ['smcore', '_utils/class', '_tpl/header', 'ggmod/poptips'], function(smcore, Class, hdTpl, Tips) {
    var _timer, tplInit;
    tplInit = Class.create({
        initialize: function() {
            var $body, $cartBtn, $hd_user;
            $body = $('body');
            $hd_user = $('#hd_user');
            $cartBtn = $('.header_icon_wrap');
            this.tpl_cartbtn = $(hdTpl.cartbtn);
            this.tpl_user = $(hdTpl.userinfo);
            this.tpl_cartlist = $(hdTpl._cartlist);
            this.tpl_user.appendTo($hd_user);
            this.tpl_cartbtn.appendTo($cartBtn);
            return this.tpl_cartlist.appendTo($body);
        }
    });

    /*模板实例化 */
    new tplInit();
    new Tips();
    _timer = null;

    /*header_user的vm模型 */
    _VM_.header_user = smcore.define({
        $id: "header_user",
        tpl_tips: "tpl_ggmod_userinfo",
        userInfo: {},
        isLogin: false,
        render: function() {
            return this.innerHTML;
        }
    });

    /*header_cart按钮的vm模型 */
    _VM_.header_cart = smcore.define({
        $id: "header_cart",
        tpl_cart: "",
        cartInfo: {},
        isOn: false,
        render: function() {
            return this.innerHTML;
        },
        movein: function() {
            if (_timer) {
                clearTimeout(_timer);
            }
            _VM_.header_cart.tpl_cart = "tpl_header_cartlist";
            _VM_.header_cart.isOn = true;
            return $('.cart_content_all').slideDown();
        },
        moveout: function() {
            return _timer = setTimeout(function() {
                _VM_.header_cart.tpl_cart = "";
                _VM_.header_cart.isOn = false;
                return $('.cart_content_all').slideUp();
            }, 1500);
        }
    });
    return _VM_;
});
;define('_tpl/ibar', [], function(){ return {"_asset":"<script id=\"tpl_ibar_asset\" type=\"smcore\"><a title=\"关闭\" class=\"ibar_closebtn\" href=\"javascript:;\" vm-click=\"hidePanel(20)\"></a><span class=\"ibar_loading_text\">正在为您努力加载数据！</span><div class=\"ibar-Asset-wrap ibar-moudle-wrap ibar_plugin\" id=\"iBarAsset\" style=\"display: block;\"><h2 class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">我的财产</span></h2><div class=\"ibar_plugin_content\" style=\"height: 720px; overflow-y: auto;\"><div class=\"ia-head-list clearfix\"><a href=\"http://www.jumei.com/i/membership/show_promocards?from=ibar_property_xianjinquan\" target=\"_blank\" class=\"ihl-quan fl\"><div class=\"num\">0</div><div class=\"text\">现金券</div></a><a href=\"http://www.jumei.com/i/membership/show_red_envelope?from=ibar_property_hongbao\" target=\"_blank\" class=\"ihl-hg fl\"><div class=\"num\">0</div><div class=\"text\">红包</div></a><a href=\"http://www.jumei.com/i/account/balance?from=ibar_property_yue\" target=\"_blank\" class=\"ihl-money fl\"><div class=\"num\">¥0</div><div class=\"text\">余额</div></a></div><div class=\"ga-expiredsoon\"><div class=\"es-head\">即将过期现金券</div><div class=\"ia-none\">您还没有可用的现金券哦！</div></div><div class=\"ga-expiredsoon\"><div class=\"es-head\">即将过期红包</div><div class=\"ia-none\">您还没有可用的红包哦！</div></div></div></div></script>","_cart":"<script id=\"tpl_ibar_cart\" type=\"smcore\"><a title=\"关闭\" class=\"ibar_closebtn\" href=\"javascript:;\" vm-click=\"hidePanel(20)\"></a><span class=\"ibar_loading_text\">正在为您努力加载数据！</span><div class=\"ibar_plugin ibar_cart_content\" id=\"iBarCart\"><div class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">购物车<span class=\"ibar_cart_timer\" style=\"display: inline;\">已超时，请尽快结算</span></span></div><div class=\"ibar_plugin_content ibar_cart_content\"><div class=\"ibar_cart_group_container\" style=\"position: absolute;\"><div class=\"ibar_cart_group ibar_cart_product\"><div class=\"ibar_cart_group_header clearfix\"><span class=\"ibar_cart_group_title\">聚美优品</span><span class=\"ibar_cart_group_shop ibar_text_ellipsis\"></span><span class=\"ibar_cart_group_baoyou ibar_pink\">新用户首单满<i>39</i>元包邮</span></div><ul class=\"ibar_cart_group_items\"><li class=\"ibar_cart_item clearfix\" vm-repeat=\"cartInfo.product.items\"><div class=\"ibar_cart_item_pic\"><a target=\"_blank\" vm-attr-title=\"el.short_name\" vm-href=\"el.url + '?from=ibar_cart'\"><img vm-attr-alt=\"el.short_name\" vm-src=\"el.image_100\"><span class=\"ibar_cart_item_tag png\" vm-class=\"ibar_cart_item_tag_active ibar_cart_item_tag_soldout:el.sale_status != ''\"></span></a></div><div class=\"ibar_cart_item_desc\"><span class=\"ibar_cart_item_name_wrapper\"><span class=\"ibar_cart_item_global\">[极速免税店]</span><a target=\"_blank\" class=\"ibar_cart_item_name\" vm-attr-title=\"el.short_name\" vm-href=\"el.url + '?from=ibar_cart'\">{{el.short_name}}</a></span><div class=\"ibar_cart_item_sku ibar_text_ellipsis\"><span>{{el.attribute}}</span></div><div class=\"ibar_cart_item_price ibar_pink\"><span class=\"unit_price\">￥{{el.item_price}}</span><span class=\"unit_plus\"> x </span><span class=\"ibar_cart_item_count\">{{el.quantity}}</span></div></div></li></ul></div><p class=\"ibar_cart_loading_text\">正在为您努力地加载数据！</p></div><div class=\"ibar_cart_handler ibar_cart_handler_attached\" style=\"display: block; bottom: 45px\"><div class=\"ibar_cart_handler_header clearfix\"><span class=\"ibar_cart_handler_header_left\">共 <span class=\"ibar_cart_total_quantity ibar_pink\">{{cartInfo.quantity}}</span> 件商品</span><span class=\"ibar_cart_total_price ibar_pink\">￥{{cartInfo.total_amount}}</span></div><a target=\"_blank\" href=\"http://cart.jumei.com/i/cart/show?from=ibar_cart_button\" class=\"ibar_cart_go_btn\">去购物车结算</a></div></div></div></script>","_favorite":"<script id=\"tpl_ibar_favorite\" type=\"smcore\"><a href=\"javascript:;\" class=\"ibar_closebtn\" title=\"关闭\" vm-click=\"hidePanel(20)\"></a><span class=\"ibar_loading_text\">正在为您努力加载数据！</span><div class=\"ibar-moudle-wrap ibar_plugin\" id=\"iBarFavorite\" style=\"display: block;\"><h2 class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">今日疯抢</span></h2><div class=\"ibar_plugin_content\" style=\"height: 700px; overflow-y: auto;\"><div class=\"ibar-nothing\"><div class=\"txt\">您没有在售中的 <br><span>心愿商品喔！</span></div></div><div class=\"ibar-moudle-product soon\"><h2>即将开抢</h2><div class=\"imp_item\"><div class=\"imp-starttime\">03月25日10:00:00开抢</div><a href=\"http://gz.jumei.com/i/deal/d150325p21839zc.html?from=ibar_mywish_willsale\" title=\"15ml欧莱雅复颜抗皱紧致滋润眼霜\" target=\"_blank\" class=\"pic\"><img src=\"http://p4.jmstatic.com/product/000/021/21839_std/21839_100_100.jpg\" width=\"100\" height=\"100\"></a><p class=\"tit\"><a href=\"http://gz.jumei.com/i/deal/d150325p21839zc.html?from=ibar_mywish_willsale\" title=\"15ml欧莱雅复颜抗皱紧致滋润眼霜\" target=\"_blank\">15ml欧莱雅复颜抗皱紧致滋润眼霜</a></p><p class=\"wish-num\">已有318人许愿</p><p></p><p class=\"price\"><em>¥</em>189 <del>¥210</del></p></div><div class=\"imp_item\"><div class=\"imp-starttime\">03月25日10:00:00开抢</div><a href=\"http://gz.jumei.com/i/deal/d150325p817644zc.html?from=ibar_mywish_willsale\" title=\"套欧莱雅限量清润保湿护肤礼盒套装\" target=\"_blank\" class=\"pic\"><img src=\"http://p4.jmstatic.com/product/000/817/817644_std/817644_100_100.jpg\" width=\"100\" height=\"100\"></a><p class=\"tit\"><a href=\"http://gz.jumei.com/i/deal/d150325p817644zc.html?from=ibar_mywish_willsale\" title=\"套欧莱雅限量清润保湿护肤礼盒套装\" target=\"_blank\">套欧莱雅限量清润保湿护肤礼盒套装</a></p><p class=\"wish-num\">已有1139人许愿</p><p></p><p class=\"price\"><em>¥</em>330 <del>¥509</del></p></div></div></div></div><div class=\"ibar-Asset-wrap ibar-moudle-wrap ibar_plugin\" id=\"iBarAsset\" style=\"display: none;\"><h2 class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">我的财产</span></h2><div class=\"ibar_plugin_content\" style=\"height: 700px; overflow-y: auto;\"><div class=\"ia-head-list clearfix\"><a href=\"http://www.jumei.com/i/membership/show_promocards?from=ibar_property_xianjinquan\" target=\"_blank\" class=\"ihl-quan fl\"><div class=\"num\">0</div><div class=\"text\">现金券</div></a><a href=\"http://www.jumei.com/i/membership/show_red_envelope?from=ibar_property_hongbao\" target=\"_blank\" class=\"ihl-hg fl\"><div class=\"num\">0</div><div class=\"text\">红包</div></a><a href=\"http://www.jumei.com/i/account/balance?from=ibar_property_yue\" target=\"_blank\" class=\"ihl-money fl\"><div class=\"num\">¥0</div><div class=\"text\">余额</div></a></div><div class=\"ga-expiredsoon\"><div class=\"es-head\">即将过期现金券</div><div class=\"ia-none\">您还没有可用的现金券哦！</div></div><div class=\"ga-expiredsoon\"><div class=\"es-head\">即将过期红包</div><div class=\"ia-none\">您还没有可用的红包哦！</div></div></div></div></script>","_history":"<script id=\"tpl_ibar_history\" type=\"smcore\"><a title=\"关闭\" class=\"ibar_closebtn\" href=\"javascript:;\" vm-click=\"hidePanel(20)\"></a><span class=\"ibar_loading_text\">正在为您努力加载数据！</span><div id=\"iBarHistroy\" class=\"ibar-moudle-wrap ibar_plugin\"><h2 class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">最近查看</span></h2><div class=\"ibar_plugin_content\"><div class=\"ibar-history-head\">共5件商品<a id=\"ibar-btn-clearhistory\" href=\"javascript:;\">清空</a></div><div class=\"ibar-moudle-product\"><div class=\"imp_item\"><a class=\"pic\" target=\"_blank\" title=\"小美盒碧欧泉主题盒七件套1\" href=\"http://item.jumei.com/gz150318p1309926.html?from=ibar_view_recent_product\"><img width=\"100\" height=\"100\" src=\"http://p1.jmstatic.com/product/001/309/1309926_std/1309926_100_100.jpg\"></a><p class=\"tit\"><a target=\"_blank\" title=\"小美盒碧欧泉主题盒七件套1\" href=\"http://item.jumei.com/gz150318p1309926.html?from=ibar_view_recent_product\">小美盒碧欧泉主题盒七件套1</a></p><p class=\"price\"><em>¥</em>200</p><a img=\"http://p1.jmstatic.com/product/001/309/1309926_std/1309926_100_100.jpg\" type=\"deal\" key=\"gz150318p1309926\" class=\"imp-addCart\" target=\"_blnak\" href=\"javascript:;\">加入购物车</a><div class=\"sku_box\"><select class=\"sku_select\"><option value=\"0\">型号选择</option></select></div></div><div class=\"imp_item\"><a class=\"pic\" target=\"_blank\" title=\"兰蔻奇迹香氛30ml\" href=\"http://item.jumei.com/d150318p1150zc.html?from=ibar_view_recent_product\"><img width=\"100\" height=\"100\" src=\"http://p0.jmstatic.com/product/000/001/1150_std/1150_100_100.jpg\"></a><p class=\"tit\"><a target=\"_blank\" title=\"兰蔻奇迹香氛30ml\" href=\"http://item.jumei.com/d150318p1150zc.html?from=ibar_view_recent_product\">兰蔻奇迹香氛30ml</a></p><p class=\"price\"><em>¥</em>389</p><a img=\"http://p0.jmstatic.com/product/000/001/1150_std/1150_100_100.jpg\" type=\"deal\" key=\"d150318p1150zc\" class=\"imp-addCart\" target=\"_blnak\" href=\"javascript:;\">加入购物车</a><div class=\"sku_box\"><select class=\"sku_select\"><option value=\"0\">型号选择</option></select></div></div><div class=\"imp_item\"><a class=\"pic\" target=\"_blank\" title=\"珀莱雅新柔皙美白补水套装\" href=\"http://item.jumei.com/gz150105p230856bk.html?from=ibar_view_recent_product\"><img width=\"100\" height=\"100\" src=\"http://p1.jmstatic.com/product/000/230/230856_std/230856_100_100.jpg\"></a><p class=\"tit\"><a target=\"_blank\" title=\"珀莱雅新柔皙美白补水套装\" href=\"http://item.jumei.com/gz150105p230856bk.html?from=ibar_view_recent_product\">珀莱雅新柔皙美白补水套装</a></p><p class=\"price\"><em>¥</em>99</p><a img=\"http://p1.jmstatic.com/product/000/230/230856_std/230856_100_100.jpg\" type=\"deal\" key=\"gz150105p230856bk\" class=\"imp-addCart\" target=\"_blnak\" href=\"javascript:;\">加入购物车</a><div class=\"sku_box\"><select class=\"sku_select\"><option value=\"0\">型号选择</option></select></div></div><div class=\"imp_item\"><a class=\"pic\" target=\"_blank\" title=\"完美芦荟胶一对40g*2\" href=\"http://item.jumei.com/gz150105p34bk.html?from=ibar_view_recent_product\"><img width=\"100\" height=\"100\" src=\"http://p4.jmstatic.com/product/000/000/34_std/34_100_100.jpg\"></a><p class=\"tit\"><a target=\"_blank\" title=\"完美芦荟胶一对40g*2\" href=\"http://item.jumei.com/gz150105p34bk.html?from=ibar_view_recent_product\">完美芦荟胶一对40g*2</a></p><p class=\"price\"><em>¥</em>59.9</p><a img=\"http://p4.jmstatic.com/product/000/000/34_std/34_100_100.jpg\" type=\"deal\" key=\"gz150105p34bk\" class=\"imp-addCart\" target=\"_blnak\" href=\"javascript:;\">加入购物车</a><div class=\"sku_box\"><select class=\"sku_select\"><option value=\"0\">型号选择</option></select></div></div><div class=\"imp_item\"><a class=\"pic\" target=\"_blank\" title=\"兰蔻清滢柔肤水400ml\" href=\"http://item.jumei.com/d150318p646884zc.html?from=ibar_view_recent_product\"><img width=\"100\" height=\"100\" src=\"http://p4.jmstatic.com/product/000/646/646884_std/646884_100_100.jpg\"></a><p class=\"tit\"><a target=\"_blank\" title=\"兰蔻清滢柔肤水400ml\" href=\"http://item.jumei.com/d150318p646884zc.html?from=ibar_view_recent_product\">兰蔻清滢柔肤水400ml</a></p><p class=\"price\"><em>¥</em>299</p><a img=\"http://p4.jmstatic.com/product/000/646/646884_std/646884_100_100.jpg\" type=\"deal\" key=\"d150318p646884zc\" class=\"imp-addCart\" target=\"_blnak\" href=\"javascript:;\">加入购物车</a><div class=\"sku_box\"><select class=\"sku_select\"><option value=\"0\">型号选择</option></select></div></div></div></div></div></script>","_login":"<script id=\"tpl_ibar_login\" type=\"smcore\"><div class=\"avatar_box\" vm-mouseover=\"openLogin\" vm-mouseout=\"hideLogin\"><p class=\"avatar_imgbox\"><img src=\"http://p0.jmstatic.com/product_report/default/avatar/avatar_small.png\" alt=\"头像\" width=\"62\" height=\"62\"></p><ul class=\"user_info\"><li>用户名：JM135ACCE2090</li><li>级 别：普通会员</li></ul></div><div class=\"login_btnbox\" vm-mouseover=\"openLogin\" vm-mouseout=\"hideLogin\"><a href=\"http://www.jumei.com/i/order/list\" class=\"login_order\" target=\"_blank\">我的订单</a><a href=\"http://www.jumei.com/i/product/fav_products\" class=\"login_favorite\" target=\"_blank\">我的收藏</a></div><s class=\"icon_arrow_white\"></s><a href=\"javascript:;\" class=\"ibar_closebtn\" title=\"关闭\" vm-click=\"hidePanel(20)\"></a></script>","_recharge":"<script id=\"tpl_ibar_recharge\" type=\"smcore\"><a title=\"关闭\" class=\"ibar_closebtn\" href=\"javascript:;\" vm-click=\"hidePanel(20)\"></a><span class=\"ibar_loading_text\">正在为您努力加载数据！</span><div class=\"ibar_plugin ibar_recharge_content\" id=\"iBarRecharge\"><div class=\"ibar_plugin_title\"><span class=\"ibar_plugin_name\">手机充话费</span></div><div class=\"ibar_plugin_content\"><form class=\"ibar_recharge_form \" method=\"get\" target=\"_blank\" action=\"//cart.jumei.com/m/forward/\"><div style=\"*z-index: 3; *position: relative\" class=\"ibar_recharge-field ibar_recharge-num\"><label>号码</label><div class=\"ibar_recharge-input ibar_recharge-fl\"><div class=\"ibar_recharge-iwrapper\"><input type=\"text\" autocomplete=\"off\" placeholder=\"手机号码\" name=\"hp\" maxlength=\"13\"></div><i title=\"查看充值历史\" class=\"ibar_recharge-contact\"></i><div class=\"ibar_recharge-tooltip\" style=\"display: none;\"><p class=\"no-phone ibar_pink\">请填写您的手机号码</p><p class=\"phone-error ibar_pink\">请填写正确的手机号码</p><p class=\"zoom-in ibar_pink\"></p><ul class=\"phone-list\"></ul><p class=\"no-history ibar_pink\">您还没有充值记录</p></div></div></div><div style=\"*z-index: 2\" class=\"ibar_recharge-field\"><label>面值</label><div class=\"ibar_recharge-fl ibar_recharge-vwrapper\"><p class=\"ibar_recharge-mod\"><span class=\"ibar_recharge-val\">100</span> 元</p><i class=\"ibar_recharge-arrow\"></i><div class=\"ibar_recharge-vbox clearfix\" style=\"display: none;\"><ul><li class=\"selected\"><span>100</span>元</li><li><span>200</span>元</li><li><span>300</span>元</li><li><span>500</span>元</li></ul><ul class=\"last-ul\"><li><span>10</span>元</li><li><span>20</span>元</li><li><span>30</span>元</li><li><span>50</span>元</li></ul></div></div></div><div class=\"ibar_recharge-field ibar_recharge-pwrapper\"><label>售价</label><div class=\"ibar_recharge-fl\"><p><span class=\"ibar_pink sell-status\"><span class=\"on-sell\"><span class=\"ibar_recharge-price\">98.70 ~ 99.80</span> 元</span><span class=\"sold-out\">暂时缺货</span></span><span class=\"ibar_recharge-operator\"></span></p><input type=\"hidden\" value=\"\" name=\"sku_no\"><input type=\"hidden\" value=\"\" name=\"customers_price\"><input type=\"hidden\" value=\"\" name=\"market_price\"><input type=\"hidden\" value=\"ibar_mobile_recharge\" name=\"from\"><input type=\"hidden\" value=\"\" name=\"province\"><input type=\"hidden\" value=\"\" name=\"mall_id\"></div></div><div class=\"ibar_recharge-btn\"><input type=\"submit\" value=\"立即充值\"></div></form></div></div></script>","main":"<div id=\"iBar\" class=\"ibar\" vm-controller=\"global_ibar\"><div class=\"ibar_main_panel\" style=\"left: 0px;\"><ul class=\"ibar_mp_center\"><li class=\"mpbtn_login\"><a href=\"javascript:;\" vm-click=\"openLogin\" vm-mouseout=\"hidePanel(2000)\"><s></s><span>登录ee</span></a></li><li class=\"mpbtn_cart\"><a href=\"javascript:;\" vm-click=\"openPanel(1)\" vm-mouseout=\"hidePanel(2000)\"><s></s><span class=\"text\">购物车</span><span class=\"cart_num\">{{cartInfo.quantity}}</span></a></li><li class=\"mpbtn_asset\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"openPanel(4)\" vm-mouseout=\"hidePanel(2000)\"><s></s><span>我的财产</span></a><div class=\"mp_tooltip\">我的财产 <s class=\"icon_arrow_right_black\"></s></div></li><li class=\"mpbtn_favorite\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"openPanel(2)\" vm-mouseout=\"hidePanel(2000)\"><s></s><span>我的心愿单</span></a><div class=\"mp_tooltip\">我的心愿单 <s class=\"icon_arrow_right_black\"></s></div></li><li class=\"mpbtn_histroy\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"openPanel(3)\" vm-mouseout=\"hidePanel(2000)\"><s></s><span>我看过的</span></a><div class=\"mp_tooltip\">我看过的 <s class=\"icon_arrow_right_black\"></s></div></li><li class=\"mpbtn_recharge\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"openPanel(5)\" vm-mouseout=\"hidePanel(2000)\"><s></s><span class=\"text\">充</span></a><div class=\"mp_tooltip\">我要充值 <s class=\"icon_arrow_right_black\"></s></div></li></ul><ul class=\"ibar_mp_bottom\"><li class=\"mpbtn_qrcode\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-188,-168)\" vm-mouseout=\"hideTips(-188)\" vm-click=\"hidePanel(20)\"><s></s>手机聚美</a><div class=\"mp_qrcode\"><img width=\"148\" height=\"175\" src=\"http://s0.jmstatic.com/templates/jumei/images/ibar/qrcode.png?v=0\"><s class=\"icon_arrow_white\"></s></div></li><li class=\"mpbtn_support\"><a href=\"javascript:;\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"hidePanel(20)\"><s></s>客服中心</a><div class=\"mp_tooltip\">客服中心 <s class=\"icon_arrow_right_black\"></s></div></li><li id=\"gotop\" class=\"mpbtn_gotop\"><a href=\"javascript:;\" class=\"btn_gotop\" vm-mouseover=\"showTips(-122,-92)\" vm-mouseout=\"hideTips(-122)\" vm-click=\"goTop\" vm-click-1=\"hidePanel(20)\" style=\"visibility: visible;\"><s></s>返回顶部</a><div class=\"mp_tooltip\">返回顶部 <s class=\"icon_arrow_right_black\"></s></div></li></ul></div><div class=\"ibar_tips_box\" vm-include=\"tpl_tips\" data-include-rendered=\"render\" vm-mouseout=\"hidePanel(2000)\"></div><div class=\"ibar_login_box status_login\" vm-include=\"tpl_login\" data-include-rendered=\"render\" vm-mouseout=\"hidePanel(2000)\"></div><div class=\"ibar_sub_panel\" vm-include=\"tpl_panel\" data-include-rendered=\"render\" vm-mouseover=\"openPanel()\" vm-mouseout=\"hidePanel(2000)\"></div></div>"}; });;// Generated by CoffeeScript 1.9.1

/*初始化ibar模板 */
define('mods/ibar/tplinit', ['_utils/class', '_tpl/ibar'], function(Class, Tpl) {
  var tplInit;
  return tplInit = Class.create({
    initialize: function() {
      var $body;
      $body = $("body");

      /*
       * 注入主模块，注入依赖
       */

      /* 载入主模板 */
      this.tpl_main = $(Tpl.main);

      /* 载入子模板 - 用户信息 */
      this.tpl_login = $(Tpl._login);

      /* 载入子模板 - 购物车信息 */
      this.tpl_cart = $(Tpl._cart);

      /* 载入子模板 - 我的财产 */
      this.tpl_asset = $(Tpl._asset);

      /* 载入子模板 - 我的心愿单 */
      this.tpl_favorite = $(Tpl._favorite);

      /* 载入子模板 - 我的浏览记录 */
      this.tpl_history = $(Tpl._history);

      /* 载入子模板 - 附属信息 */
      this.tpl_recharge = $(Tpl._recharge);

      /* 将模板注入到页面中 */
      this.tpl_main.appendTo($body);
      this.tpl_login.appendTo($body);
      this.tpl_cart.appendTo($body);
      this.tpl_asset.appendTo($body);
      this.tpl_favorite.appendTo($body);
      this.tpl_history.appendTo($body);
      return this.tpl_recharge.appendTo($body);
    }
  });
});
;// Generated by CoffeeScript 1.9.1
define('mods/ibar/main', ['smcore', 'mods/ibar/tplinit', '_data/ibar'], function(smcore, ibarTpl, getData) {
  var _timer, timer;
  new ibarTpl();
  timer = null;
  _timer = null;

  /*全局的ibar购物车模型 */
  _VM_.ibar = smcore.define({
    $id: "global_ibar",
    userInfo: {},
    cartInfo: {},
    myAsset: {},
    myFavorite: {},
    myHistory: {},
    tpl_login: "",
    tpl_panel: "",
    tpl_tips: "",
    isLogin: false,
    iscurrent: false,
    render: function() {
      return this.innerHTML;
    },
    openLogin: function() {
      var _top;
      if (timer) {
        clearTimeout(timer);
      }
      _top = $('.mpbtn_login').offsetTop;
      _VM_.ibar.tpl_login = 'tpl_ibar_login';
      $('.ibar_login_box').css({
        top: _top,
        visibility: 'visible'
      }).fadeIn();
      return $('.ibar_sub_panel').fadeOut().css({
        left: 0,
        visibility: 'hidden'
      });
    },
    hideLogin: function() {},
    openPanel: function(type) {
      var _this, _type;
      _this = $(this);
      _this.next('div').stop().animate({
        opacity: 0
      }, 'fast').css({
        left: -92,
        visibility: 'hidden'
      });
      if (timer) {
        clearTimeout(timer);
      }
      _type = type || 1;
      switch (_type) {
        case 1:
          _VM_.ibar.tpl_panel = 'tpl_ibar_cart';
          break;
        case 2:
          _VM_.ibar.tpl_panel = 'tpl_ibar_favorite';
          getData.favorite(function(data) {
            return _VM_.ibar.myFavorite = data;
          });
          break;
        case 3:
          _VM_.ibar.tpl_panel = 'tpl_ibar_history';
          getData.history(function(data) {
            return _VM_.ibar.myHistory = data;
          });
          break;
        case 4:
          _VM_.ibar.tpl_panel = 'tpl_ibar_asset';
          getData.asset(function(data) {
            return _VM_.ibar.myAsset = data;
          });
          break;
        case 5:
          _VM_.ibar.tpl_panel = 'tpl_ibar_recharge';
      }
      $('.ibar_login_box').fadeOut().css({
        visibility: 'hidden'
      });
      return $('.ibar_sub_panel').css({
        visibility: 'visible'
      }).fadeIn().animate({
        left: -287
      }, 250);
    },
    hidePanel: function(t) {
      var _t;
      if (timer) {
        clearTimeout(timer);
      }
      _t = t || 1500;
      timer = setTimeout(function() {
        _VM_.ibar.tpl_panel = '';
        _VM_.ibar.tpl_login = '';
        $('.ibar_login_box').fadeOut().css({
          visibility: 'hidden'
        });
        return $('.ibar_sub_panel').fadeOut().css({
          left: 0,
          visibility: 'hidden'
        });
      }, _t);
    },
    showTips: function(start, end) {
      var _this;
      _this = $(this);
      _this.addClass('current');
      return _this.next('div').css({
        left: start,
        opacity: 0,
        visibility: 'visible'
      }).stop().animate({
        left: end,
        opacity: 1
      }, 400);
    },
    hideTips: function(end) {
      var _this;
      _this = $(this);
      _this.next('div').stop().animate({
        opacity: 0
      }, 'fast').css({
        left: end,
        visibility: 'hidden'
      });
      return _this.removeClass('current');
    },
    goTop: function() {
      return $("body,html").animate({
        scrollTop: 0
      }, 400);
    }
  });
  return _VM_;
});
;// Generated by CoffeeScript 1.9.1
define('mods/index/vmctrl', ['smcore', '_data/ibar', 'common/header', 'mods/ibar/main'], function(smcore, getData, header, iBar) {
  var exports;
  exports = {};
  exports.run = function(cb) {
    var timer;
    smcore.scan();
    timer = null;
    getData.cartList(function(data) {
      return _VM_.ibar.cartInfo = _VM_.header_cart.cartInfo = data;
    });
    getData.userInfo(function(data) {
      _VM_.ibar.userInfo = _VM_.header_user.userInfo = data;
      if (data.status === 1) {
        return _VM_.ibar.isLogin = _VM_.header_user.isLogin = true;
      }
    });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      return $("#iBar").css({
        'height': $(window).height()
      }).slideDown(500);
    }, 400);
    return cb();
  };
  return exports;
});
;// Generated by CoffeeScript 1.9.1
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
;