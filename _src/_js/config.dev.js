require.config({
  "baseUrl": "http://static.local/_src/js",
  "paths": {
    "cookie": "vendor/cookie/jquery.cookie",
    "jquery": "vendor/jquery/jquery",
    "smcore": "vendor/smcore/smcore",
    "underscore": "vendor/underscore/underscore"
  },
  "shim": {
    "smcore": {
      "exports": "smcore"
    },
    "waypoint": {
      "deps": [
        "jquery"
      ],
      "exports": "$.fn.waypoint"
    },
    "cookie": {
      "deps": [
        "jquery"
      ],
      "exports": "$.cookie"
    },
    "underscore": {
      "exports": "_"
    }
  }
});
