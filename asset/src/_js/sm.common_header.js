/**
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
;