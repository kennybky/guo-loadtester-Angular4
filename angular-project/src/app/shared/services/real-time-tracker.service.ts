import { Injectable } from '@angular/core';
import {StatusPromisesService} from './status-promises.service';
import {TesterService} from './tester.service';
import {ChartTrackerService} from './charts/chart-tracker.service';
import * as q from 'q';
import {WebTesterService} from './web-tester.service';
import {WizardProject} from '../models/wizard-project';
import {GoogleChartsBaseService} from './charts/google-charts-base.service';
import {WebProject} from '../models/web-project';

@Injectable({
  providedIn: 'root'
})
export class RealTimeTrackerService {

  constructor(private statusPromises: StatusPromisesService, private tester: TesterService,
              private chartTracker: ChartTrackerService,  private webtester: WebTesterService,private googleCharts: GoogleChartsBaseService) {}
      projectId: Number;
       project: WebProject;
  latestPerformance: any;
  avgPerf: any;



    setProjectId(id) {
        this.projectId = id;
      }

      setProject(pj){
        this.project = pj
      }

      startPinging() {
        var pingProm = q.defer();
        let vm = this;
        this.googleCharts.load(['corechart', 'line', 'gauge'],function() {
          vm.pingPerformanceStatus(pingProm);
        });
        let pingPromise = pingProm.promise;
        pingPromise.then((response)=>{
          this.statusPromises.clear();
          console.log(response)
          this.webtester.save(this.project);

        })
        return pingProm
      }

     pingPerformanceStatus (pingProm) {
       let vm = this;
       let latestPerformance = 0;
       let avgPerf = 0;
       this.chartTracker.clearFusionCharts();
       this.chartTracker.clearGoogleCharts();
       this.statusPromises.clear();
       let data = this.googleCharts.getData([
         ['Label', 'Value'],
         ['Resp Time (ms)', 0]
       ]);

       let options = {
         minorTicks: 10,
         max: 100
       };

       let chartData = this.googleCharts.getData();
       chartData.addColumn('datetime', 'Time');
       chartData.addColumn('number', 'current');
       chartData.addColumn('number', 'average');


       var chart_options = {
         chart: {
           title: 'Real-Time Performance',
           subtitle: 'Time vs Avg response time(ms)'
         },
         width: 900,
         height: 500,
         hAxis: {
           title: 'Time'
         },

         vAxis: {
           title: 'Avg Response Time (ms)'
         },
         colors: ['#0546af', '#46af5b'],
         crosshair: {
           color: '#000',
           trigger: 'selection'
         }
       };

       let chart = this.googleCharts.getLineChart(document.getElementById('performance-monitor-div'));

       this.googleCharts.drawChart(chart,chartData, chart_options);




       function addLeadingZero(num){
         return (num <= 9)? ("0"+num) : num;
       }
       function updateData() {
         let label = new Date(),
           // label = addLeadingZero(currDate.getHours()) + ":" +
           //   addLeadingZero(currDate.getMinutes()) + ":" +
           //   addLeadingZero(currDate.getSeconds()),
           // Build Data String in format &label=...&value=...
           strData = [], avgPerf = vm.avgPerf, latestPerformance=vm.latestPerformance;
         if (avgPerf == -1) {
           console.log(avgPerf)
           strData = [label, latestPerformance, latestPerformance]
         } else {
           console.log(avgPerf);
           strData = [label, latestPerformance, avgPerf]
         }
         console.log(label)
         chartData.addRows([strData]);
         vm.googleCharts.drawChart(chart,chartData, chart_options);
       }

       let monitorPromise = setInterval(function () {
         updateData();
       }, 1000);
       vm.statusPromises.add(monitorPromise);

       //vm.chartTracker.addFusionChart(vm.performanceChartMon);




       /* 10 / 10 = 1, 20 / 10 = 2, ... 100 / 10 = 10 , 110 / 10 = 11,/*/
       let performanceGauge = this.googleCharts.getGauge(document.getElementById('performance-gauge-div'));

       performanceGauge.draw(data, options);

       this.chartTracker.addGoogleChart(performanceGauge);
       this.chartTracker.addGoogleChart(chart);
        var gaugePromise = setInterval(function() {

          vm.webtester.start(vm.project.title, vm.project.url, vm.project.method, vm.project.parameters)
            .subscribe(function (response:any) {
                vm.latestPerformance = response.avgResponseTime;
                vm.avgPerf = response.cumAvgResponseTime;

                //console.log(latestPerformance);
                if (latestPerformance <= 1) {
                  options.max = 1
                }
                else if (latestPerformance >= options.max) {
                  options.max = latestPerformance * 2;
                }
                data.setValue(0, 1, latestPerformance);
                performanceGauge.draw(data, options);
                //updateData(latestPerformance, avgPerf)
                vm.saveData(latestPerformance);
              },
              (err)=>{
                console.log(err)
                pingProm.resolve(err);
                vm.statusPromises.clear();
              });
        }, 500); //check for real time update every 500 ms.
        vm.statusPromises.add(gaugePromise);

        function resizeGauge () {
          console.log('Resize gauge called.');
          performanceGauge.draw(data, options);
        }
        if (document.addEventListener) {
          window.addEventListener('resize', resizeGauge);
        }
        // else if (document.attachEvent) {
        //   window.attachEvent('onresize', resizeGauge);
        // }
        // else {
        //   window.resize = resizeGauge;
        // }
      }

       saveData(avg){
        this.webtester.saveStats(this.project, avg).subscribe((res)=>{
          if(this.project.cumAvg === 0 || this.project.cumAvg === undefined || this.project.cumAvg === null){
            this.project.cumAvg = avg
          }
          let cumAvg = this.project.cumAvg;
          this.project.cumAvg = (cumAvg + avg)/2
        })
      }
}
