import Promise from 'bluebird';
import fetch from 'node-fetch';
import qs from 'qs';
import prettyjson from 'prettyjson';

// Helper for default function parameters
const required = (name) => {
  throw new Error(`Argument '${name}' required`)
};

export default class Directus {

  constructor (
    instanceHost = required('instanceHost'),
    apiKey = required('apiKey'),
    apiVersion = '1'
  ) {

    this.baseUrl = `${instanceHost}/api/${apiVersion}/`;
    this.apiKey = apiKey;

  }

  async endpoint (endpoint, query = {}, silent = true) {

    // Stringify query parameters
    query = qs.stringify(query);
    if (query != "") query = '?' + query;

    // Compute request URL
    let url = this.baseUrl + endpoint + query;
    console.log('Sending GET to', url);

    try {

      // Send query and authenticate request with API key
      let response = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + this.apiKey }
      });

      // Due to the way fetch() works, we have to manually
      // throw if request succeeded but came back with a bad status
      if (response.status < 200 || response.status >= 300) {
        let e = new Error(response.statusText);
        e.response = response;
        throw e;
      }

      // Parse json body and return
      return await response.json();

    } catch (e) {

      if (e.response.status === 404) {
        throw new Error(`404: Could not reach "${url}" endpoint`)
      }

      // If error is a 401, throw a fatal error.
      if (e.response.status === 401) {
        throw new Error(`401: API key "${this.apiKey}" refused`);
      }

      // Parse the text error response
      let json = await e.response.json();
      let status = e.response.status + ": " + e.response.statusText;

      // If silent failing is disabled, throw the error instead of logging it
      if (!silent) {
        let error = new Error;
        error.message = status;
        error.json = json;
        throw error;
      }

      // Delete detailed PHP traces
      delete json.trace;

      // Log the status, error message and text trace
      console.log(prettyjson.render({ 'Error': status }));
      console.log(prettyjson.render(json));

    }

  }

  table (name) {

    let _this = this;

    class Table {

      constructor (name = required('name')) {
        this.name = name;
      }

      async info () {
        return await _this.endpoint(`tables/${this.name}`);
      }

      async preferences () {
        return await _this.endpoint(`tables/${this.name}/preferences`);
      }

      async rows (params = {}) {
        return await _this.endpoint(`tables/${this.name}/rows`, params);
      }

      async row (id) {
        return await _this.endpoint(`tables/${this.name}/rows/${id}`);
      }

    }

    return new Table(name);

  }

  async files () {
    return await this.endpoint(`files`);
  }

  async file (id) {
    return await this.endpoint(`files/${id}`);
  }

}
