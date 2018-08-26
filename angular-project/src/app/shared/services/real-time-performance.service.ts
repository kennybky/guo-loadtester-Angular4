import {Component, HostListener, Injectable} from '@angular/core';
import {TesterService} from './tester.service';
import {StatusPromisesService} from './status-promises.service';
import {ChartTrackerService} from './charts/chart-tracker.service';
import * as q from 'q';
import {GoogleChartsBaseService} from './charts/google-charts-base.service';
import {Observable} from 'rxjs/Observable';
import {NewProjectComponent} from '../../new-project/new-project.component';
import Chart from 'chart.js';

@Injectable()
export class RealTimePerformanceService {

  constructor(private tester: TesterService,
  private statusPromises: StatusPromisesService,
  private chartTracker: ChartTrackerService, private googleCharts: GoogleChartsBaseService) {
    this.dataSource = []
  }
  projectId;
  dataSource: any[];
  component: NewProjectComponent;
  latestPerformance: any;
  avgPerf: any;



   setProjectId(id, component) {
    this.projectId = id;
    this.component = component;
  }



   startPinging(){
    let pingProm = q.defer();
     let vm = this;
    this.googleCharts.load(['corechart', 'line', 'gauge'],function() {
      vm.pingPerformanceStatus(pingProm);
    });

    return pingProm.promise;
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
    chartData.addColumn('string', 'Time');
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

      this.googleCharts.drawLineChart(chart,chartData, chart_options);




            function addLeadingZero(num){
              return (num <= 9)? ("0"+num) : num;
            }
            function updateData() {
              let currDate = new Date(),
                label = addLeadingZero(currDate.getHours()) + ":" +
                  addLeadingZero(currDate.getMinutes()) + ":" +
                  addLeadingZero(currDate.getSeconds()),
                // Build Data String in format &label=...&value=...
                strData = [], avgPerf = vm.avgPerf, latestPerformance=vm.latestPerformance;
              if (avgPerf == -1) {
                console.log(avgPerf)
                strData = [label, latestPerformance, latestPerformance]
              } else {
                console.log(avgPerf);
                 strData = [label, latestPerformance, avgPerf]
              }
               chartData.addRows([strData]);
               vm.googleCharts.drawLineChart(chart,chartData, chart_options);
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
      vm.tester.getPerformanceStatus(vm.projectId).subscribe(function(response) {
        if (response.running) {
          vm.latestPerformance = response.avgResponseTime;
          vm.avgPerf = response.cumAvgResponseTime;
          // console.log(response.avgResponseTime);
          // console.log(latestPerformance);
          if (vm.latestPerformance <= 1) {
            options.max = 1
          }
          else if (vm.latestPerformance >= options.max) {
            options.max = vm.latestPerformance * 2;
          }
          data.setValue(0, 1, vm.latestPerformance);
          performanceGauge.draw(data, options);
        } else {
          pingProm.resolve(response);
          vm.statusPromises.clear();
        }
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

}
