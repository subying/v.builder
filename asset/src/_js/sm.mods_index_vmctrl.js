// Generated by CoffeeScript 1.9.1

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
;