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
