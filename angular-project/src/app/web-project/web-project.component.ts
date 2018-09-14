import {Component, OnDestroy, OnInit} from '@angular/core';
import * as q from 'q';
import {WebProject} from '../shared/models/web-project';
import {WebTesterService} from '../shared/services/web-tester.service';
import {TesterService} from '../shared/services/tester.service';
import {RealTimeTrackerService} from '../shared/services/real-time-tracker.service';
import {ChartTrackerService} from '../shared/services/charts/chart-tracker.service';
import {StatusPromisesService} from '../shared/services/status-promises.service';
import {ChartLoaderService} from '../shared/services/charts/chart-loader.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-web-project',
  templateUrl: './web-project.component.html',
  styleUrls: ['./web-project.component.css']
})
export class WebProjectComponent implements OnInit, OnDestroy {


    constructor(private webtester: WebTesterService, private tester: TesterService, private realTimeTracker: RealTimeTrackerService,
                private chartTracker:ChartTrackerService, private statusPromises: StatusPromisesService,
                private chartLoader: ChartLoaderService, private http: HttpClient) {

    }

      projects:Array<WebProject>
      current_project: WebProject
      currentResponseBody: String
      paramName: any;
      paramValue: any;
      size = 1;
      RTPERF = false as Boolean;
      pingProm:any
      showLoadingBall = false as Boolean;
      loadedProject:any
  baseUrl = ""


  ngOnInit(): void {
        this.projects = []
    this.getProjects()
    let a = {
      'a':1,
      'b':2
    }
    console.log(Object.keys(a))
  }


  objectKeys(obj: Object): Array<any>{
    return Object.keys(obj)
  }





      ngOnDestroy() {
        this.chartTracker.clearGoogleCharts();
        this.chartTracker.clearFusionCharts();
        this.statusPromises.clear();
      }


       start(){
        let vm = this;
        console.log('Running test');
        let prom = q.defer();
        let current = vm.current_project;
        this.testAll(prom, vm.current_project.parameterEntries, current)

         console.log(vm.current_project)

        prom.promise.then((stats:any)=>{
          console.log(stats)
          current.stats = stats;
          vm.loadGraph(current.id);
          vm.saveProject(current)
        })
      }

       testAll(promise, urls, project){
        let stats = []
         let vm = this;
        urls.forEach((data)=>{
          vm.webtester.start(project.title, data.url, data.method, data.parameters)
            .subscribe(function (response: any) {
                console.log(response.avgResponseTime);
                let stat = {
                  url: data.url,
                type: data.method,
                responseTime : response.avgResponseTime
              }
                stats.push(stat)
                vm.saveProject(project)
                if (stats.length === urls.length){
                  promise.resolve(stats)
                }
              },
              (err)=>{
                console.log(err)
                promise.reject(err)
              })

        })
      }

       addUrl(){
        let vm = this;
        let url = vm.current_project.uri;
        let method = vm.current_project.method
        let params = vm.current_project.parameters;
        let obj = {
          url: url,
         method: method,
         parameters: params
       }
        vm.current_project.parameterEntries.push(obj)
      }

      saveProject(project = this.current_project){
        console.log('Saving Project');
        this.webtester.save(project)
          .subscribe((res)=>{
              console.log("project saved")
              console.log(res)
            },
            (err)=>{
              console.log(err)
            })
      }

      getProjects() {
        let vm = this;
        this.webtester.getProjectsDb()
          .subscribe(
            (res:any) => {
              res.projects.forEach((p) =>{

                let project = JSON.parse(p.data);
                project.dbId = p.id;
                vm.projects.push(project)
              })
              console.log(vm.projects)

            },
            () => {
              vm.projects = [];
              console.log('failed to load projects, defaulting to empty :', []);
            });
      }

      editProject(id){
        this.current_project = this.getProject(id);
        console.log(this.current_project)
        if(this.current_project.service === 'upload') {
          // $('[data-target="#uploadtab"]').tab('show');
        } else {
          //('[data-target="#tab1"]').tab('show');
        }

      }



      uploadTest(){
        let vm = this;
        //var initTestProm = $q.defer();
        vm.current_project.url = vm.constructUri(vm.current_project.url);
        //initTestProm.resolve(response);
        vm.current_project.running = true;
        vm.current_project.uploadSize = vm.size;
        vm.realTimeTracker.setProject(vm.current_project);
        vm.pingProm = vm.realTimeTracker.startPinging();
        vm.RTPERF = true;
        document.getElementById('chart-section').scrollIntoView();



      }

       stop(){
        this.current_project.running = false;
        this.pingProm.resolve("Project stopped");
        this.RTPERF = false;

      }

      /*function testProgMsg(running, message) {
          vm.testStatus = running;
          vm.initTestAction.class = styler.styleResult(running);
          vm.initTestAction.message = message;
          timeOuts.initTest = $timeout(function() {
              vm.initTestAction.message = undefined;
          }, 3000);
      }*/

     startUpload()  {
        /*  let project = {
              uri : "http://localhost:8080/loadtester/v1/upload/test",
              name : vm.current_project.title,
              type: "performance",
              method : "POST",
              options : null,
              params: null
      }

      project.uri = constructUri()
          return tester.start(project)*/
        this.current_project.url = this.constructUri(this.current_project.url);


      }

      constructUri (uri){
        let i = uri.indexOf("size")
        if( i > -1){
          uri =  uri.substr(0, i)
        }
        let size = Math.floor(this.size);
        size *= 1024;
        return `${uri}?size=${size}`;
      }

       addParam(){
        if (this.paramName !=null && this.paramValue !=null) {
          console.log(`adding {${this.paramName}, ${this.paramValue}}`)
          this.current_project.parameters[this.paramName] = this.paramValue;
        }
      }

      deleteParam(key){

      }

      deleteProject(id){
        const project = this.getProject(id);
        this.webtester.deleteProjectDb(project.dbId).subscribe((res)=>{
          console.log(res)
          this.projects = this.projects.filter((pj)=>{
            return pj.id !== id;
          })
        },(err)=>{
          console.log(err)
        })
      }

      createNewProject(service=null) {
        const project = new WebProject(this.generateTempId());
        project.service = service;
        if (service === 'upload'){
          project.url = "http://localhost:8080/loadtester/v1/upload/test";
          project.method = 'POST'
        }
        let vm = this;

        this.webtester.createProjectDb(project).subscribe(
            (res:any) => {
              console.log('Created a new project with ID ' + res.project.id);
              project.dbId = res.project.id;
              console.log(project);

              vm.projects.push(project);
            },
            (err) => console.log(err),
            () => console.log('Project Creation Finished'));

        return project;
      }

       loadGraph(id) {
        const project = this.getProject(id);
        let vm = this;
        this.loadedProject = project;
        this.current_project = project;
        if(project.service === 'upload'){
          this.webtester.getGraphData(project.dbId).subscribe((graphData:any)=>{
            console.log(graphData)
            vm.showLoadingBall = true;
            vm.statusPromises.clear();
            vm.chartTracker.clearGoogleCharts();
            vm.chartTracker.clearFusionCharts();
            let container = document.getElementById('chart-container');
            console.log(container)
            container.scrollIntoView();
            this.chartLoader.renderGoogleLineCharts(graphData.fusionChart, container );
            vm.showLoadingBall = false;


          }, (err)=>{
            console.log(err)
          })
        } else {
            let container = document.getElementById('chart-container');
            console.log(container)
            vm.chartLoader.renderBarChart(project);

        }

      }




       generateTempId() {
        return Math.trunc(Math.random() * 999999999) + 1;
      }

       createProjectDb(project)  {
        const url = `${this.baseUrl}/add`;
        return this.http
          .post(url, {id: project.dbId, data: JSON.stringify(project)});
      }

      getProject(id){
        return this.projects
          .find((project) => project.id === id);
      }

}
