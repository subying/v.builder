require.config({
  "baseUrl": "http://static.local/_src/_js",
  "paths": {
    "cookie": "vendor/cookie/jquery.cookie",
    "jquery": "vendor/jquery/jquery",
    "smcore": "vendor/smcore/smcore",
    "underscore": "vendor/underscore/underscore"
  },
  "shim": {
    "Zepto": {
      "exports": "$"
    },
    "smcore": {
      "exports": "smcore"
    },
    "cookie": {
      "deps": [
        "Zepto"
      ],
      "exports": "$.cookie"
    },
    "underscore": {
      "exports": "_"
    }
  }
});