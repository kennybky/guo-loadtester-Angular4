import {Injectable} from '@angular/core';

@Injectable()
export class UrlBuilder {
   baseUrl;
  baseMethodUrl;
   finalUrl;
   method;


  getBaseUrl() {
    return this.baseUrl;
  }

  formatParams(parameters) {
    var params = [];
    parameters.forEach(function (param) {
      if (param && param !== '') {
        params.push({
          key: param,
          value: ''
        })
      }
    });
    return params;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

 setMethod(service) {
    this.method = service;
  }

  getMethod() {
    return this.method;
  }

  setBaseMethodUrl(method) {
    this.baseMethodUrl = this.baseUrl + method;
  }

  getBaseMethodUrl() {
    return this.baseMethodUrl;
  }

 getFinalUrl() {
    return this.finalUrl;
  }

 setFinalUrl(paramStr) {
   this.finalUrl = this.baseMethodUrl + paramStr;
  }
}
