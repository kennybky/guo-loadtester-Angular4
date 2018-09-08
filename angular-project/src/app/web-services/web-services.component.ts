import {Component, OnDestroy, OnInit} from '@angular/core';
import * as q from 'q';
import {WebService} from '../shared/services/web.service';
import {TesterService} from '../shared/services/tester.service';
import {Retester} from '../shared/models/retester';
import {Router} from '@angular/router';
import {MatTabsModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



@Component({
  selector: 'app-web-services',
  templateUrl: './web-services.component.html',
  styleUrls: ['./web-services.component.css']
})
export class WebServicesComponent implements OnInit, OnDestroy {


    constructor(private webServices: WebService, private retester: Retester, private router: Router) {

    }
  timeouts = {} as any;
  serviceBuilders = [] as Array<any>;
  serviceNoBuilders = [] as Array<any>;
  serviceBuilderAction = {};
  serviceNoBuilderAction = {};
  dataFetched:Boolean;
  name = "" as any;
  uri = "" as any;

      ngOnDestroy() {
        for (let timeo of this.timeouts) {
     clearTimeout(timeo);
}
}

  ngOnInit(): void {
    this.activate();
  }


     activate() {
        let vm = this;
        this.webServices.getServices().subscribe(function (services:any) {
          services = vm.webServices.splitServices(services);
          vm.serviceBuilders = services.servicesWithBuilder;
          vm.serviceNoBuilders = services.servicesWithoutBuilder;
          vm.dataFetched = true;
        });
      }

      saveServiceBuilder () {
        let vm = this;
        clearTimeout(this.timeouts.serviceBuilderAction);
        this.webServices.saveWSDL(vm.name, vm.uri).subscribe(function (success:any) {
          vm.serviceActionProg(vm.serviceBuilderAction, "serviceBuilderAction", true, success);
          vm.activate();
        }, function(error) {
          vm.serviceActionProg(vm.serviceBuilderAction, "serviceBuilderAction", false, error.data);
        });
      }

      saveServiceUrl() {
        let vm = this;
        this.webServices.saveTestUrl(vm.uri).subscribe(function(success) {
          vm.serviceActionProg(vm.serviceNoBuilderAction, "serviceNoBuilderAction", true, success.data);
          this.activate();
        }, function(error) {
          vm.serviceActionProg(vm.serviceNoBuilderAction, "serviceNoBuilderAction", false, error.data);
        });
      }

      deleteService(service, builder) {
        let vm = this;
        if (builder) {
          clearTimeout(this.timeouts.serviceBuilderAction);
        }
        else  clearTimeout(this.timeouts.serviceNoBuilderAction);
        this.webServices.deleteService(service).subscribe(function (success) {
          if (builder) vm.serviceActionProg(vm.serviceBuilderAction, "serviceBuilderAction", true, success);
          else vm.serviceActionProg(vm.serviceNoBuilderAction, "serviceNoBuilderAction", true, success);
          vm.activate();
          console.log(success)
        }, function(error) {
          if (builder) vm.serviceActionProg(vm.serviceBuilderAction, "serviceBuilderAction", false, error.data);
          else vm.serviceActionProg(vm.serviceNoBuilderAction, "serviceNoBuilderAction", false, error.data);
          console.log(error)
        });
      }

      serviceActionProg(action, timeo, success, message) {
        action.class = this.styleResult(success);
        action.message = message;
        this.timeouts[timeo] = setTimeout(function() {
          action.message = undefined;
        }, 3000);
      }

     test (service) {
        this.retester.setService(service);
        console.log("here")
        this.router.navigateByUrl('/newproject');
      }

       styleResult(success) {
      var className = "actionMsg ";
        if (success) className += "text-success";
      else className += "text-danger";
      return className;
    }
}
