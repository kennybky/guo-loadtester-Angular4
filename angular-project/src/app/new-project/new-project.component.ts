///<reference path="../shared/models/wizard-project.ts"/>
import {Component, OnInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {WebService} from '../shared/services/web.service';
import {ProjectOptions, WizardProject} from '../shared/models/wizard-project';
import { ArchwizardModule } from 'angular-archwizard';
import {Retester} from '../shared/models/retester';
import {TesterService} from '../shared/services/tester.service';
import * as q from 'q';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {UrlBuilder} from '../shared/models/url-builder';
import {RealTimePerformanceService} from '../shared/services/real-time-performance.service';
import {ChartTrackerService} from '../shared/services/charts/chart-tracker.service';
import {ChartOptionsService} from '../shared/services/charts/chart-options.service';
import * as Chart from 'chart.js';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/find';
import 'rxjs/add/observable/from';
import {StatusPromisesService} from '../shared/services/status-promises.service';
import {ChartConfiguration, ChartData} from 'chart.js';





@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit, OnDestroy, OnChanges {
  urlSelectType: string;
  names = [] as any;
  serviceName: any;
  methodSelected = "" as string;
  baseMethodUrl: any;
  baseUrl: any;
  savedUrl: any;
  savedUrls = [] as any;
  testTypes = ['availability', 'capacity', 'performance', 'reliability', 'scalability'];
  testStatus: any;
   project = {} as WizardProject;
  methods = [] as any;
  timeOuts = {} as any;
  skipValidation = false;
  validation = {} as any;
  validateName  = {} as any;
  services: any;
  params =[] as any;
  RTPERF: boolean;
  loadTestMessage: any;
  requestsGraphData: any;
  projectLoadedName: any;
  successTitle: any;
  successScalabilityData: any;
  performanceScalabilityData:any;
  private savedUrlAction: any;
  private initTestAction  = {} as any;
  charts  = [] as any;
  requestsGraphLabels = {} as any;
  requestsGraphOptions = {} as any;
  successScalabilityLabels = {} as any;
  successScalabilityOptions = {} as any;
  performanceScalabilityLabels = {} as any;
  performanceScalabilityOptions = {} as any;
  testTypeValidAction= {} as any;
  project_option_distribution = "" as string;
   webParams = [] as any;
   paramName: string;
   paramValue: string;
   urlValid = false as boolean;
  webUrl = "" as any;
  project_options: ProjectOptions;
  dataSource = {} as any;

  constructor(private webServices: WebService, private tester: TesterService, private retester: Retester,
              private urlBuilder: UrlBuilder, private realTimePerformance: RealTimePerformanceService,
              private statusPromises: StatusPromisesService,private chartTracker: ChartTrackerService, private chartOptions: ChartOptionsService) {
    // this.activate();
    // this.getSavedUrls();
    // this.project = new WizardProject(null,null,null);
    // this.validation = {
    //   name:""
    // }
  }


  ngOnInit() {
    this.activate();
    this.getSavedUrls();
    this.project = new WizardProject(null,null,null);
    this.validation = {
      name:""
    }
  }



  ngOnDestroy() {
    this.retester.setProject(null);
    this.retester.setService(null);
    for (var timeo in this.timeOuts) clearTimeout(this.timeOuts[timeo]);
  /*chartTracker.clearGoogleCharts();
 chartTracker.clearFusionCharts();
 statusPromises.clear();*/

}

  ngOnChanges(changes: SimpleChanges): void {
  }


  getSavedUrls() {
    this.webServices.getSavedUrls().subscribe((response)=> {
      this.savedUrls = response;
    });
  }

   activate() {
    /**
     * Get the services from the backend
     */
    console.log("here")
    this.webServices.getServices().subscribe((services) => {
      this.services = services.servicesWithBuilder;
      this.names = this.webServices.serviceDisplays(this.services);

      var serviceRetest = this.retester.getService();
      if (serviceRetest) {
        if (serviceRetest.baseUri) {
          this.urlSelectType = 'Url Builder';
          this.project = new WizardProject("default", null, null, null);
          this.serviceName = serviceRetest.name;
          this.getMethods(this.serviceName);
        } else {
          this.urlSelectType = 'Saved Test Urls';
          this.project = new WizardProject("default", null, null, serviceRetest.testUri);
          this.savedUrl = serviceRetest.testUri;
        }
      } else {
        this.project  = new WizardProject("default", null, null, null);
      }
    });


    this.project = this.retester.getProject();

    /**
     * If there's a project to retester, go to the last step in the Wizard.
     */
    if (this.project && this.project.options) {
      this.skipValidation = true;
      /*$scope.$watch(
        function () {
          return WizardHandler.wizard();
        },
        function (wizard) {
          if (wizard) wizard.goTo("Review & Start Testing");
        });*/
    }
  }

  resetConfiguredUrl() {
    this.savedUrl = undefined;
  }

  styleResult(success) {
    var className = "actionMsg ";
    if (success) className += "text-success";
    else className += "text-danger";
    return className;
  }

  nameValidation = ()=> {
    let vm = this;
    console.log(this);
    if (this.skipValidation) {
      this.skipValidation = false;
      return true;
    }
    if (!this.validation.name) {
      return false;
    } else {
      clearTimeout(this.timeOuts.nameValidation);
      let d = q.defer();
      this.tester.validateProjectName(this.validation.name).subscribe(function (response) {
        console.log(response)
        vm.validateName.class = vm.styleResult(response.valid);
        if (!response.valid) {
          vm.validateName.message = response.message;
          vm.timeOuts.nameValidation = setTimeout(function () {
           vm.validateName.message = undefined;
          }, 3000);
        } else {
          vm.createProject(vm.validation.name);
        }
        return d.resolve(response.valid);
      });
      return d.promise;
    }
  }

  /**
   * Create a new project object if one d oesn't yet exist.
   * @param name
   */
   createProject(name) {
    if (this.project) {
      this.project.name = name;
    } else {
      this.project = new WizardProject(name, null, null, null);
    }
  }

  addWebParam(name, value){
    let param = {
      key:name,
      value:value
    };
    this.webParams.push(param);
  }

  removeWebParam(id) {
    this.webParams = this.webParams.filter((obj) => {
      return obj.key !== id
    });
  }

   saveWebUrl() {
    if(this.validUrl()) {
      this.urlValid = true;
      this.project.uri = this.webUrl;
      this.project.params = this.webParams;
      this.project.uri = this.constructUrl(this.project.uri, this.webParams)
    } else {
      this.urlValid = false;
    }
  }

  constructUrl(uri, params) {
    let first = true;
    params.forEach((param)=>{
      if(first){
        first = false;
        uri +="?"
      } else {
        uri +="&"
      }
      uri+= `${param.key}=${param.value}`
    })

    return uri;
  }

  validUrl() {
    if (this.webUrl === null || this.webUrl === undefined || this.webUrl === "")
    {return false;}
    else return !(this.webUrl.indexOf("localhost:") === -1 && this.webUrl.indexOf("https://") === -1);
  }

  saveUrl(uri, selectType) {
    clearTimeout(this.timeOuts.saveUrl);
    let saveUrlProm = q.defer();
    this.savedUrlAction = {} as any;
    if (selectType === 'Url Builder' && this.urlBuilder.getMethod()) {
      this.webServices.saveTestUrl(uri, this.urlBuilder.getMethod().id).subscribe(function (success) {
        saveUrlProm.resolve(success);
      }, function(error) {
        saveUrlProm.reject(error);
      });
    } else {
      this.webServices.saveTestUrl(uri).subscribe(function (success) {
        saveUrlProm.resolve(success);
      }, function(error) {
        saveUrlProm.reject(error);
      });
    }
    let message;
    let vm = this;
    saveUrlProm.promise.then(function(response) {
      message = response;
      vm.getSavedUrls();
      vm.savedUrlAction.class = vm.styleResult(true);
    }).catch(function(response){
      message = response.data;
      vm.savedUrlAction.class = vm.styleResult(false);
    }).finally(function () {
      vm.savedUrlAction.message = message;
      vm.timeOuts.saveUrl = setTimeout(function() {
        vm.savedUrlAction.message = undefined;
      }, 3000);
    });
  }

  /**
   * Make a call to the back end to initiate a load test. If back end
   * returns "RUNNING", then a test has been successfully intiated, and
   * we'll call vm.start to constantly get test statuses.
   */
  initTest() {
    let vm = this;
    vm.loadTestMessage = null;
    vm.RTPERF = false;
    setTimeout(vm.timeOuts.initTest);
    let initTestProm = q.defer();
    this.initTestAction = {};
    switch (vm.project.type) {
      case 'performance':
        vm.tester.start(
         this.project).subscribe(function (response) {
          initTestProm.resolve(response);
          if (response.running) {
            vm.realTimePerformance.setProjectId(response.projectid, vm);
            let pingProm = vm.realTimePerformance.startPinging();
            pingProm.then(function(response: any) {
              clearTimeout(vm.timeOuts.initTest);
              vm.testProgMsg(response.running, response.message);
            });
            vm.RTPERF = true;
          }
        });
        break;
      case 'capacity':
        vm.tester.start(
         this.project).subscribe(function (response) {
          initTestProm.resolve(response);
          if (response.running) {
            vm.pingCapacityStatus(response.uri, response.projectid);
          }
        });
        break;
      case 'scalability':
        vm.tester.start(
         this.project).subscribe(function (response) {
          initTestProm.resolve(response);
          if (response.running) {
            vm.pingScalabilityStatus(response.uri, response.projectid);
          }
        });
        break;
      case 'reliability':
      case 'availability':
        vm.tester.start(this.project).subscribe(function (response) {
          initTestProm.resolve(response);
          if (response.running) {
            vm.statusPromises.clear();
            vm.chartTracker.clearFusionCharts();
            vm.chartTracker.clearGoogleCharts();
          }
        });
        break;
      default:
        let response = {projectid: -1, running: false, message: "Invalid or empty test type."};
        initTestProm.resolve(response);
        break;
    }
    initTestProm.promise.then(function(response:any) {
      if (response.projectid !== -1) vm.project.id = response.projectid;
      vm.testProgMsg(response.running, response.message);
    });
  }

 stop() {
    let vm = this;
    clearTimeout(this.timeOuts.initTest);
    this.tester.stop(this.project.id).subscribe(function (response) {
      vm.testProgMsg(response.running, response.message);
      if (!response.running) {
        vm.statusPromises.clear();
      }
    });
  }

  /**
   * @param url {string} url to test
   * @param projectName {string} name of the project
   * @param projectId {number} id of the project}. This is received from back end after calling vm.initTest
   * @param requestCount {number} number of requests to make. this should probably deprecate.
   */
 pingCapacityStatus(url, projectId) {
   let vm = this;
    this.chartTracker.clearFusionCharts();
    this.chartTracker.clearGoogleCharts();
    this.statusPromises.clear();
    //hide the performance graph. we don't need it here.
    this.performanceScalabilityData = null;
    // keep checking for status updates for new data until the test duration + margin is over.
    let crq = document.getElementById("capacityRequests") as HTMLCanvasElement;
    let crqCtx = crq.getContext('2d');
    vm.requestsGraphData = [];
    vm.requestsGraphLabels = [];
    vm.requestsGraphOptions = vm.chartOptions.requestGraphOptions("Request input: " + url);
    let chartReq = new Chart(crqCtx, {
      type:'line',
      data: {
        labels: vm.requestsGraphLabels,
        datasets: [{
          fillColor :220,
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data: vm.requestsGraphData
        }]
      },
      options: vm.requestsGraphOptions
    });

    let crs = document.getElementById("capacityScalability") as HTMLCanvasElement;
    let crsCtx = crs.getContext('2d');

    vm.successScalabilityLabels = []
    vm.successScalabilityData = []
    vm.successScalabilityOptions = vm.chartOptions.successScalabilityOptions("# of successful requests: " + url);

    let chartSca = new Chart(crsCtx, {
      type:'line',
      data: {
        labels: vm.successScalabilityLabels,
        datasets: [{
          data: vm.successScalabilityData
        }]
      },
      options: vm.successScalabilityOptions
    });

    var capacityPromise = setInterval(function () {
      vm.tester.getCapacityStatus(url, projectId).subscribe(function (response) {
        if (response.statusResponse.running && (vm.charts = response.charts.length) !== 0) {
          vm.successTitle = "Capacity"
          vm.charts = response.charts; //array of three charts: one for requests, another for performance, and another for success rate
          console.log(vm.charts)

          vm.requestsGraphLabels = vm.charts[0].labels;
          vm.requestsGraphData = [vm.charts[0].data];


          chartReq.data.labels =  vm.requestsGraphLabels
          chartReq.data.datasets.forEach((dataset) => {
            dataset.data = vm.requestsGraphData
          });


          chartReq.update();


          vm.successScalabilityLabels = vm.charts[1].labels;
          vm.successScalabilityData = [vm.charts[1].data];

          chartSca.data.labels =  vm.successScalabilityLabels;
          chartSca.data.datasets.forEach((dataset) => {
            dataset.data = vm.successScalabilityData;
          });


          chartSca.update();

          vm.loadTestMessage = "Current known capacity: " + Math.max.apply(null, vm.successScalabilityData[0]) + " requests.";
        } else {
          clearTimeout(vm.timeOuts.initTest);
          vm.testProgMsg(response.statusResponse.running, response.statusResponse.message);
          vm.statusPromises.clear();
        }
      });
    }, 2000); //check every 2 second.
    this.statusPromises.add(capacityPromise);
  }

  /**
   * @param url {string} url to test
   * @param projectName {string} name of the project
   * @param projectId {number} id of the project}. This is received from back end after calling vm.initTest
   * @param requestCount {number} number of requests to make. this should probably deprecate.
   */
 pingScalabilityStatus(url, projectId) {
   let vm = this;
    this.chartTracker.clearFusionCharts();
    this.chartTracker.clearGoogleCharts();
    this.statusPromises.clear();
    // keep checking for status updates for new data until the test duration + margin is over.
    let scalabilityPromise = setInterval(function () {
      vm.tester.getScalabilityStatus(url, projectId).subscribe(function (response) {
        if (response.statusResponse.running && (vm.charts = response.charts.length) !== 0) {
          vm.successTitle = "Success Scalability";
          vm.charts = response.charts; //array of three charts: one for requests, another for performance, and another for success rate
          vm.requestsGraphLabels = vm.charts[0].labels;
          vm.requestsGraphData = [vm.charts[0].data];
          vm.requestsGraphOptions = vm.chartOptions.requestGraphOptions("Request input: " + url);

          // console.log(JSON.stringify(response));
          vm.performanceScalabilityLabels = vm.charts[1].labels;
          vm.performanceScalabilityData = [vm.charts[1].data];
          vm.performanceScalabilityOptions = vm.chartOptions.performanceScalabilityOptions("Performance Scalability: " + url);

          vm.successScalabilityLabels = vm.charts[2].labels;
          vm.successScalabilityData = [vm.charts[2].data];
          vm.successScalabilityOptions = vm.chartOptions.successScalabilityOptions("Success Scalability: " + url);
        } else {
          setTimeout(vm.timeOuts.initTest);
          vm.testProgMsg(response.statusResponse.running, response.statusResponse.message);
          vm.statusPromises.clear();
        }
      });
    }, 2000); //check every 2000 ms, or 2 seconds
    vm.statusPromises.add(scalabilityPromise);
  }

/*scrollToCharts() {
    $anchorScroll('chartsDiv');
  }*/

  /**
   * For a particular Webservice, get the methods.
   */
  getMethods(serviceName) {
    let vm = this;
    if (serviceName) {
      vm.methods = vm.webServices.getMethods(vm.services, serviceName);
      vm.urlBuilder.setBaseUrl(vm.methods[0].baseUri);
      vm.baseUrl = vm.urlBuilder.getBaseUrl();
      vm.project.uri = vm.baseUrl;
    }
  };


  /**
   * For a particular method, get the parameters.
   * @param method
   */
 getParams(method) {
   let vm = this;
    if (method) {
      vm.urlBuilder.setMethod(method);
      vm.params = vm.urlBuilder.formatParams(method.parameters);
      vm.urlBuilder.setBaseMethodUrl(method.method);
      vm.baseMethodUrl = vm.urlBuilder.getBaseMethodUrl();
      vm.project.uri = vm.baseMethodUrl;
    }
  }

  /**
   * Dynamically update the parameters.
   */
 updateParams() {
   let vm = this;
    let paramString = '';
    vm.params.forEach(function (param, index) {
      if (index === 0) {
        paramString += "?" + param.key + "=" + param.value;
      } else {
        paramString += "&" + param.key + "=" + param.value;
      }
    });
    vm.urlBuilder.setFinalUrl(paramString);
    vm.project.uri = vm.urlBuilder.getFinalUrl().trim();
  };

  initProjectOptions() {
    let vm = this;
    let options = new ProjectOptions();

    //sets up project defaults depending on the type of t est
    switch (vm.project.type) {
      case "availability":
      case "reliability":
        options.timeUnits = "Seconds";
        options.interval = 2;
        options.timeout = 500;
        break;
      case "capacity":
        options.userCount = 1; //1 user
        options.warmUpTime = 1; //1second warm up time
        options.testTime = 10; //10 second test time
        options.failuresPermitted = 0; // 0% permitted, anything else triggers a failure
        options.stepDuration = 500; //500 ms step duration
        options.stepCount = 2; //exponential factor
        break;
      case "scalability":
        options.userCount = 1000; //1000 users
        options.warmUpTime = 1; //1second warm up time
        options.testTime = 10; //10 second test time
        options.failuresPermitted = 0; // 0% permitted, anything else triggers a failure
        options.stepDuration = 500; //500 ms step duration
        options.stepCount = 10;
        options.distribution = "Normal";
        break;
    }
    vm.project.options = options;
  }

 serviceConfigValidation = ()=> {
    if(!this.project) return false;
    return this.project.uri !== undefined;
  }

 testTypeValidation = ()=> {
    let vm = this;
    let valid = true;
    let message = '';
    setTimeout(this.timeOuts.testType);
    if (!this.project) {
      valid = false;
      message = "No project was ever created.";
    } else {
      if (!this.project.type) {
        valid = false;
        message = "You must select a test type.";
      } else {
        if (vm.project.type !== 'performance') {
          for (let option in vm.project.options) {
            if (vm.project.options[option] === undefined || vm.project.options[option] < 0 || String(vm.project.options[option]).length === 0 ) {
              valid = false;
              message = "All options must be configured for the " + vm.project.type + " test.";
            }
          }
        }
      }
    }
    vm.testTypeValidAction.class = vm.styleResult(valid);
    vm.testTypeValidAction.message = message;
    vm.timeOuts.testType = setTimeout(function() {
      vm.testTypeValidAction.message = undefined;
    }, 3000);
    return valid;
  }

   testProgMsg(running, message) {
    let vm = this;
    vm.testStatus = running;
    vm.initTestAction.class = vm.styleResult(running);
    vm.initTestAction.message = message;
    vm.timeOuts.initTest = setTimeout(function() {
      vm.initTestAction.message = undefined;
    }, 3000);
  }

  finishFunction() {

  }
}
