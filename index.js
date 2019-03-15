var _srender = require("./src/srender");

(function() {
	for (var key in _srender) {
		if (_srender == null || !_srender.hasOwnProperty(key) || key === 'default' || key === '__esModule') return;
		exports[key] = _srender[key];
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