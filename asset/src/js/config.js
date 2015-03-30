require.config({
    "baseUrl": "//static.local/asset/src/js",
    "paths": {
        "base64": "../../../libs/base64/base64.min",
        "jquery": "../../../libs/jquery/jquery.min",
        "sm.mobile": "../../../libs/sm.mobile/sm.mobile",
        "sm.modern": "../../../libs/sm.modern/sm.modern",
        "smcore": "../../../libs/smcore/smcore",
        "underscore": "../../../libs/underscore/underscore.min",
        "zepto": "../../../libs/zepto/zepto.min"
    },
    "shim": {
        "jquery.cookie": [
            "jquery"
        ],
        "jquery.easing": [
            "jquery"
        ],
        "jquery.slide": [
            "jquery"
        ],
        "jquery.flexslider": [
            "jquery"
        ],
        "jquery.layer": [
            "jquery"
        ],
        "jquery.infinitescroll": [
            "jquery"
        ],
        "jquery.page": [
            "jquery"
        ],
        "jquery.calendar": [
            "jquery"
        ],
        "zepto": {
            "exports": "$"
        },
        "underscore": {
            "exports": "_"
        },
        "xss": {
            "exports": "filterXSS"
        },
        "avalon": {
            "exports": "avalon"
        }
    }
});
