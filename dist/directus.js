'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// Helper for default function parameters
const required = name => {
  throw new Error(`Argument '${ name }' required`);
};

class Directus {

  constructor(instanceHost = required('instanceHost'), apiKey = required('apiKey'), apiVersion = '1') {

    this.baseUrl = `${ instanceHost }/api/${ apiVersion }/`;
    this.apiKey = apiKey;
  }

  endpoint(endpoint, query = {}) {
    var _this2 = this;

    return _asyncToGenerator(function* () {

      // Stringify query parameters
      query = _qs2.default.stringify(query);
      if (query != "") query = '?' + query;

      try {

        // Send query and authenticate request with API key
        let response = yield (0, _nodeFetch2.default)(_this2.baseUrl + endpoint + query, {
          headers: { 'Authorization': 'Bearer ' + _this2.apiKey }
        });

        // Due to the way fetch() works, we have to manually
        // throw if request succeeded but came back with a bad status
        if (response.status < 200 || response.status >= 300) {
          let e = new Error(response.statusText);
          e.response = response;
          throw e;
        }

        // Parse json body and return
        return yield response.json();
      } catch (e) {

        // Parse the json error response
        let json = yield e.response.json();

        // Delete lengthy PHP traces
        delete json.trace;
        delete json.traceAsString;

        // Log them to the console
        console.error(e.response.status + ":" + e.response.statusText);
        console.error(json);
      }
    })();
  }

  table(name) {

    let _this = this;

    class Table {

      constructor(name = require('name')) {
        this.name = name;
      }

      info() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
          return yield _this.endpoint(`tables/${ _this3.name }`);
        })();
      }

      preferences() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
          return yield _this.endpoint(`tables/${ _this4.name }/preferences`);
        })();
      }

      rows(params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
          return yield _this.endpoint(`tables/${ _this5.name }/rows`, params);
        })();
      }

      row(id) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
          return yield _this.endpoint(`tables/${ _this6.name }/rows/${ id }`);
        })();
      }

    }

    return new Table(name);
  }

}
exports.default = Directus;