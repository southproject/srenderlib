var _zrender = require("./src/zrender");

(function() {
	for (var key in _zrender) {
		if (_zrender == null || !_zrender.hasOwnProperty(key) || key === 'default' || key === '__esModule') return;
		exports[key] = _zrender[key];
	}
})();
/*
var _export = require("./src/export");

(function () {
  for (var key in _export) {
    if (_export == null || !_export.hasOwnProperty(key) || key === 'default' || key === '__esModule') return;
    exports[key] = _export[key];
  }
})();

require("./lib/svg/svg");

require("./lib/vml/vml");
*/