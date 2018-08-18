import { Injectable } from '@angular/core';

@Injectable()
export class StatusPromisesService {

  promises: any[];
  actionTimeOut;

  constructor() {
    this.promises = [];
  }




   clear() {
    this.promises.forEach(function (promise) {
      clearInterval(promise);
    });
  }

  add(promise) {
    this.promises.push(promise);
  }

  setUpTO(message, success, time, vm) {
    clearTimeout(this.actionTimeOut);
    vm.action = message;
    vm.actionClass = this.styleResult(success);
    this.actionTimeOut = setTimeout(function() {
      vm.action = undefined;
    }, time);
  }
  styleResult(success) {
    var className = "actionMsg ";
    if (success) className += "text-success";
    else className += "text-danger";
    return className;
  }
}
