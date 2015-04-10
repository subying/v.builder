/***v.build@v0.2.0, @description A FrontEnd builder in gulp, @author Pang.J.G, @blog https://github.com/lmtdit/v.builder***/
define("_lib/easing",[],function(){return $=$||window.$,$.easing.jswing=$.easing.swing,$.extend($.easing,{def:"easeOutQuad",swing:function(e,t,n,a,i){return $.easing[$.easing.def](e,t,n,a,i)},easeInQuad:function(e,t,n,a,i){return a*(t/=i)*t+n},easeOutQuad:function(e,t,n,a,i){return-a*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,a,i){return(t/=i/2)<1?a/2*t*t+n:-a/2*(--t*(t-2)-1)+n},easeInCubic:function(e,t,n,a,i){return a*(t/=i)*t*t+n},easeOutCubic:function(e,t,n,a,i){return a*((t=t/i-1)*t*t+1)+n},easeInOutCubic:function(e,t,n,a,i){return(t/=i/2)<1?a/2*t*t*t+n:a/2*((t-=2)*t*t+2)+n},easeInQuart:function(e,t,n,a,i){return a*(t/=i)*t*t*t+n},easeOutQuart:function(e,t,n,a,i){return-a*((t=t/i-1)*t*t*t-1)+n},easeInOutQuart:function(e,t,n,a,i){return(t/=i/2)<1?a/2*t*t*t*t+n:-a/2*((t-=2)*t*t*t-2)+n},easeInQuint:function(e,t,n,a,i){return a*(t/=i)*t*t*t*t+n},easeOutQuint:function(e,t,n,a,i){return a*((t=t/i-1)*t*t*t*t+1)+n},easeInOutQuint:function(e,t,n,a,i){return(t/=i/2)<1?a/2*t*t*t*t*t+n:a/2*((t-=2)*t*t*t*t+2)+n},easeInSine:function(e,t,n,a,i){return-a*Math.cos(t/i*(Math.PI/2))+a+n},easeOutSine:function(e,t,n,a,i){return a*Math.sin(t/i*(Math.PI/2))+n},easeInOutSine:function(e,t,n,a,i){return-a/2*(Math.cos(Math.PI*t/i)-1)+n},easeInExpo:function(e,t,n,a,i){return 0==t?n:a*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,a,i){return t==i?n+a:a*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,a,i){return 0==t?n:t==i?n+a:(t/=i/2)<1?a/2*Math.pow(2,10*(t-1))+n:a/2*(-Math.pow(2,-10*--t)+2)+n},easeInCirc:function(e,t,n,a,i){return-a*(Math.sqrt(1-(t/=i)*t)-1)+n},easeOutCirc:function(e,t,n,a,i){return a*Math.sqrt(1-(t=t/i-1)*t)+n},easeInOutCirc:function(e,t,n,a,i){return(t/=i/2)<1?-a/2*(Math.sqrt(1-t*t)-1)+n:a/2*(Math.sqrt(1-(t-=2)*t)+1)+n},easeInElastic:function(e,t,n,a,i){var s=1.70158,r=0,o=a;if(0==t)return n;if(1==(t/=i))return n+a;if(r||(r=.3*i),o<Math.abs(a)){o=a;var s=r/4}else var s=r/(2*Math.PI)*Math.asin(a/o);return-(o*Math.pow(2,10*(t-=1))*Math.sin(2*(t*i-s)*Math.PI/r))+n},easeOutElastic:function(e,t,n,a,i){var s=1.70158,r=0,o=a;if(0==t)return n;if(1==(t/=i))return n+a;if(r||(r=.3*i),o<Math.abs(a)){o=a;var s=r/4}else var s=r/(2*Math.PI)*Math.asin(a/o);return o*Math.pow(2,-10*t)*Math.sin(2*(t*i-s)*Math.PI/r)+a+n},easeInOutElastic:function(e,t,n,a,i){var s=1.70158,r=0,o=a;if(0==t)return n;if(2==(t/=i/2))return n+a;if(r||(r=.3*i*1.5),o<Math.abs(a)){o=a;var s=r/4}else var s=r/(2*Math.PI)*Math.asin(a/o);return 1>t?-.5*o*Math.pow(2,10*(t-=1))*Math.sin(2*(t*i-s)*Math.PI/r)+n:o*Math.pow(2,-10*(t-=1))*Math.sin(2*(t*i-s)*Math.PI/r)*.5+a+n},easeInBack:function(e,t,n,a,i,s){return void 0==s&&(s=1.70158),a*(t/=i)*t*((s+1)*t-s)+n},easeOutBack:function(e,t,n,a,i,s){return void 0==s&&(s=1.70158),a*((t=t/i-1)*t*((s+1)*t+s)+1)+n},easeInOutBack:function(e,t,n,a,i,s){return void 0==s&&(s=1.70158),(t/=i/2)<1?a/2*t*t*(((s*=1.525)+1)*t-s)+n:a/2*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+n},easeInBounce:function(e,t,n,a,i){return a-$.easing.easeOutBounce(e,i-t,0,a,i)+n},easeOutBounce:function(e,t,n,a,i){return(t/=i)<1/2.75?7.5625*a*t*t+n:2/2.75>t?a*(7.5625*(t-=1.5/2.75)*t+.75)+n:2.5/2.75>t?a*(7.5625*(t-=2.25/2.75)*t+.9375)+n:a*(7.5625*(t-=2.625/2.75)*t+.984375)+n},easeInOutBounce:function(e,t,n,a,i){return i/2>t?.5*$.easing.easeInBounce(e,2*t,0,a,i)+n:.5*$.easing.easeOutBounce(e,2*t-i,0,a,i)+.5*a+n}}),$.easing}),define("_lib/slide",["_lib/easing"],function(){return $.fn.slide=function(e){return $.fn.slide.defaults={type:"slide",effect:"fade",autoPlay:!1,delayTime:500,interTime:2500,triggerTime:150,defaultIndex:0,titCell:".hd li",mainCell:".bd",targetCell:null,trigger:"mouseover",scroll:1,vis:1,titOnClassName:"on",autoPage:!1,prevCell:".prev",nextCell:".next",pageStateCell:".pageState",opp:!1,pnLoop:!0,easing:"swing",startFun:null,endFun:null,switchLoad:null,playStateCell:".playState",mouseOverStop:!0,defaultPlay:!0,returnDefault:!1},this.each(function(){var t,n=$.extend({},$.fn.slide.defaults,e),a=$(this),i=n.effect,s=$(n.prevCell,a),r=$(n.nextCell,a),o=$(n.pageStateCell,a),u=$(n.playStateCell,a),l=$(n.titCell,a),c=l.size(),f=$(n.mainCell,a),d=f.children().size(),p=n.switchLoad,h=$(n.targetCell,a),v=parseInt(n.defaultIndex),m=parseInt(n.delayTime),g=parseInt(n.interTime),w=(parseInt(n.triggerTime),parseInt(n.scroll)),I=parseInt(n.vis),M="false"==n.autoPlay||0==n.autoPlay?!1:!0,C="false"==n.opp||0==n.opp?!1:!0,b="false"==n.autoPage||0==n.autoPage?!1:!0,x="false"==n.pnLoop||0==n.pnLoop?!1:!0,O="false"==n.mouseOverStop||0==n.mouseOverStop?!1:!0,y="false"==n.defaultPlay||0==n.defaultPlay?!1:!0,q="false"==n.returnDefault||0==n.returnDefault?!1:!0,P=0,k=0,T=0,S=0,L=n.easing,B=null,Q=null,D=null,F=n.titOnClassName,E=l.index(a.find("."+F)),_=v=-1==E?v:E,W=v,j=v,z=d>=I?d%w!=0?d%w:w:0,A="leftMarquee"==i||"topMarquee"==i?!0:!1,N=function(){$.isFunction(n.startFun)&&n.startFun(v,c,a,$(n.titCell,a),f,h,s,r)},U=function(){$.isFunction(n.endFun)&&n.endFun(v,c,a,$(n.titCell,a),f,h,s,r)},H=function(){l.removeClass(F),y&&l.eq(W).addClass(F)};if("menu"==n.type)return y&&l.removeClass(F).eq(v).addClass(F),l.hover(function(){t=$(this).find(n.targetCell);var e=l.index($(this));Q=setTimeout(function(){switch(v=e,l.removeClass(F).eq(v).addClass(F),N(),i){case"fade":t.stop(!0,!0).animate({opacity:"show"},m,L,U);break;case"slideDown":t.stop(!0,!0).animate({height:"show"},m,L,U)}},n.triggerTime)},function(){switch(clearTimeout(Q),i){case"fade":t.animate({opacity:"hide"},m,L);break;case"slideDown":t.animate({height:"hide"},m,L)}}),void(q&&a.hover(function(){clearTimeout(D)},function(){D=setTimeout(H,m)}));if(0==c&&(c=d),A&&(c=2),b){if(d>=I)if("leftLoop"==i||"topLoop"==i)c=d%w!=0?(d/w^0)+1:d/w;else{var G=d-I;c=1+parseInt(G%w!=0?G/w+1:G/w),0>=c&&(c=1)}else c=1;l.html("");var J="";if(1==n.autoPage||"true"==n.autoPage)for(var K=0;c>K;K++)J+="<li>"+(K+1)+"</li>";else for(var K=0;c>K;K++)J+=n.autoPage.replace("$",K+1);l.html(J);var l=l.children()}if(d>=I){f.children().each(function(){$(this).width()>T&&(T=$(this).width(),k=$(this).outerWidth(!0)),$(this).height()>S&&(S=$(this).height(),P=$(this).outerHeight(!0))});var R=f.children(),V=function(){for(var e=0;I>e;e++)R.eq(e).clone().addClass("clone").appendTo(f);for(var e=0;z>e;e++)R.eq(d-e-1).clone().addClass("clone").prependTo(f)};switch(i){case"fold":f.css({position:"relative",width:k,height:P}).children().css({position:"absolute",width:T,left:0,top:0,display:"none"});break;case"top":f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+I*P+'px"></div>').css({top:-(v*w)*P,position:"relative",padding:"0",margin:"0"}).children().css({height:S});break;case"left":f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+I*k+'px"></div>').css({width:d*k,left:-(v*w)*k,position:"relative",overflow:"hidden",padding:"0",margin:"0"}).children().css({"float":"left",width:T});break;case"leftLoop":case"leftMarquee":V(),f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+I*k+'px"></div>').css({width:(d+I+z)*k,position:"relative",overflow:"hidden",padding:"0",margin:"0",left:-(z+v*w)*k}).children().css({"float":"left",width:T});break;case"topLoop":case"topMarquee":V(),f.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+I*P+'px"></div>').css({height:(d+I+z)*P,position:"relative",padding:"0",margin:"0",top:-(z+v*w)*P}).children().css({height:S})}}var X=function(e){var t=e*w;return e==c?t=d:-1==e&&d%w!=0&&(t=-d%w),t},Y=function(e){var t=function(t){for(var n=t;I+t>n;n++)e.eq(n).find("img["+p+"]").each(function(){var e=$(this);if(e.attr("src",e.attr(p)).removeAttr(p),f.find(".clone")[0])for(var t=f.children(),n=0;n<t.size();n++)t.eq(n).find("img["+p+"]").each(function(){$(this).attr(p)==e.attr("src")&&$(this).attr("src",$(this).attr(p)).removeAttr(p)})})};switch(i){case"fade":case"fold":case"top":case"left":case"slideDown":t(v*w);break;case"leftLoop":case"topLoop":t(z+X(j));break;case"leftMarquee":case"topMarquee":var n="leftMarquee"==i?f.css("left").replace("px",""):f.css("top").replace("px",""),a="leftMarquee"==i?k:P,s=z;if(n%a!=0){var r=Math.abs(n/a^0);s=1==v?z+r:z+r-1}t(s)}},Z=function(e){if(!y||_!=v||e||A){if(A?v>=1?v=1:0>=v&&(v=0):(j=v,v>=c?v=0:0>v&&(v=c-1)),N(),null!=p&&Y(f.children()),h[0]&&(t=h.eq(v),null!=p&&Y(h),"slideDown"==i?(h.not(t).stop(!0,!0).slideUp(m),t.slideDown(m,L,function(){f[0]||U()})):(h.not(t).stop(!0,!0).hide(),t.animate({opacity:"show"},m,function(){f[0]||U()}))),d>=I)switch(i){case"fade":f.children().stop(!0,!0).eq(v).animate({opacity:"show"},m,L,function(){U()}).siblings().hide();break;case"fold":f.children().stop(!0,!0).eq(v).animate({opacity:"show"},m,L,function(){U()}).siblings().animate({opacity:"hide"},m,L);break;case"top":f.stop(!0,!1).animate({top:-v*w*P},m,L,function(){U()});break;case"left":f.stop(!0,!1).animate({left:-v*w*k},m,L,function(){U()});break;case"leftLoop":var n=j;f.stop(!0,!0).animate({left:-(X(j)+z)*k},m,L,function(){-1>=n?f.css("left",-(z+(c-1)*w)*k):n>=c&&f.css("left",-z*k),U()});break;case"topLoop":var n=j;f.stop(!0,!0).animate({top:-(X(j)+z)*P},m,L,function(){-1>=n?f.css("top",-(z+(c-1)*w)*P):n>=c&&f.css("top",-z*P),U()});break;case"leftMarquee":var a=f.css("left").replace("px","");0==v?f.animate({left:++a},0,function(){f.css("left").replace("px","")>=0&&f.css("left",-d*k)}):f.animate({left:--a},0,function(){f.css("left").replace("px","")<=-(d+z)*k&&f.css("left",-z*k)});break;case"topMarquee":var u=f.css("top").replace("px","");0==v?f.animate({top:++u},0,function(){f.css("top").replace("px","")>=0&&f.css("top",-d*P)}):f.animate({top:--u},0,function(){f.css("top").replace("px","")<=-(d+z)*P&&f.css("top",-z*P)})}l.removeClass(F).eq(v).addClass(F),_=v,x||(r.removeClass("nextStop"),s.removeClass("prevStop"),0==v&&s.addClass("prevStop"),v==c-1&&r.addClass("nextStop")),o.html("<span>"+(v+1)+"</span>/"+c)}};y&&Z(!0),q&&a.hover(function(){clearTimeout(D)},function(){D=setTimeout(function(){v=W,y?Z():"slideDown"==i?t.slideUp(m,H):t.animate({opacity:"hide"},m,H),_=v},300)});var et=function(e){B=setInterval(function(){C?v--:v++,Z()},e?e:g)},tt=function(e){B=setInterval(Z,e?e:g)},nt=function(){O||(clearInterval(B),et())},at=function(){(x||v!=c-1)&&(v++,Z(),A||nt())},it=function(){(x||0!=v)&&(v--,Z(),A||nt())},st=function(){clearInterval(B),A?tt():et(),u.removeClass("pauseState")},rt=function(){clearInterval(B),u.addClass("pauseState")};if(M?A?(C?v--:v++,tt(),O&&f.hover(rt,st)):(et(),O&&a.hover(rt,st)):(A&&(C?v--:v++),u.addClass("pauseState")),u.click(function(){u.hasClass("pauseState")?st():rt()}),"mouseover"==n.trigger?l.hover(function(){var e=l.index(this);Q=setTimeout(function(){v=e,Z(),nt()},n.triggerTime)},function(){clearTimeout(Q)}):l.click(function(){v=l.index(this),Z(),nt()}),A){if(r.mousedown(at),s.mousedown(it),x){var ot,ut=function(){ot=setTimeout(function(){clearInterval(B),tt(g/10^0)},150)},lt=function(){clearTimeout(ot),clearInterval(B),tt()};r.mousedown(ut),r.mouseup(lt),s.mousedown(ut),s.mouseup(lt)}"mouseover"==n.trigger&&(r.hover(at,function(){}),s.hover(it,function(){}))}else r.click(at),s.click(it)})},$.fn.slide}),define("mods/index/slider",["_lib/slide"],function(){var e;return e={},e.init=function(){var e,t,n,a,i,s,r,o,u;return t=$(".slider_box"),e=$(".slider_index"),o=e.find(".bd .preload"),u=e.find(".bd img").eq(0),t.hide(),e.find(".pnBtn").hide(),e.find(".hd").hide(),a=function(e,t,n,a){var i,s,r,o,u,l,c;o=0,r=0,s="[object Object]"==Object.prototype.toString.call(e)?!0:!1,e=s?e.get():e,u=function(i,s){var u;return u=new Image,u.onload=function(){return o++,t&&t(o,e.length,i,s),n&&o===e.length&&n(r)},u.onerror=function(){return o++,r++,a&&a(o,e.length,i,s)},u.src=i},l=[];for(i in e)c=s?$(e[i]).attr("data-src"):e[i],console.log(c),l.push(u(c,e[i]));return l},r=function(){return t.show().animate({height:"272px"},500),e.find(".bd ul").css({"margin-left":"-402px"}),e.fadeIn()},i=function(){return e.hover(function(){e.find(".pnBtn").stop().fadeIn()},function(){e.find(".pnBtn").fadeOut()}),e.slide({titCell:".hd ul",mainCell:".bd ul",switchLoad:"data-src",effect:"leftLoop",autoPlay:!0,vis:1,autoPage:!0,delayTime:500,interTime:5e3,trigger:"click",startFun:function(){return e.find(".hd").fadeIn()}})},s=function(e,t,n,a){return $(a).attr("src",n).fadeIn()},n=function(e){return console.log("the "+e+"st img loaded Error!")},a(u,s,r,null),a(o,s,i,n)},e});