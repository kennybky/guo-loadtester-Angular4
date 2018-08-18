import {HostListener, Injectable} from '@angular/core';
import {TesterService} from './tester.service';
import {StatusPromisesService} from './status-promises.service';
import {ChartTrackerService} from './charts/chart-tracker.service';
import * as q from 'q';
// import {GoogleCharts} from 'google-charts';
import {GoogleChartsBaseService} from './charts/google-charts-base.service';
import {FusionChartsModule} from 'angular-fusioncharts';
// import * as FusionCharts from 'fusioncharts';
import {Observable} from 'rxjs/Observable';
import FusionCharts from 'fusioncharts/core';
import Column2D from 'fusioncharts/viz/column2d';

@Injectable()
export class RealTimePerformanceService {

  constructor(private tester: TesterService,
  private statusPromises: StatusPromisesService,
  private chartTracker: ChartTrackerService, private googleCharts: GoogleChartsBaseService) {
    this.dataSource = []
  }
  projectId;
  dataSource: any[]



   setProjectId(id) {
    this.projectId = id;
  }

   startPinging(){
    let pingProm = q.defer();
     let vm = this;
    this.googleCharts.load(['gauge'],function() {
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
    this.googleCharts.setData([
      ['Label', 'Value'],
      ['Resp Time (ms)', 0]
    ]);
    let data = this.googleCharts.getData();

    let options = {
      minorTicks: 10,
      max: 100
    };

    FusionCharts.ready(function () {
      let performanceChartMon = new FusionCharts({
        id: "performanceMonitorChart",
        type: 'realtimeline',
        renderAt: 'performance-monitor-div',
        width: '100%',
        height: '400',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            "caption": "Real-Time Performance",
            "subCaption": "Time vs Avg response time(ms)",
            "xAxisName": "Time",
            "yAxisName": "Avg Response Time (ms)",
            "refreshinterval": "1",
            "numdisplaysets": "10",
            "labeldisplay": "rotate",
            "showValues": "1",
            "scrollheight": "10",
            "flatScrollBars": "1",
            "scrollShowButtons": "0",
            "scrollColor": "#cccccc",
            "showRealTimeValue": "1",
            "theme": "fint"
          },
          "categories": [{
            "category": [{}]
          }],
          "dataset": [{
            "seriesname": "current",
            "showvalues": "1",
            "color" : "#0546af",
            "data": [{}]
          },
            {
              "seriesname": "avg",
              "showvalues": "1",
              "color":"#46af5b",
              "data": [{}]
            }
          ]
        },
        "events": {
          "initialized": function (e) {
            function addLeadingZero(num){
              return (num <= 9)? ("0"+num) : num;
            }
            function updateData() {
              // Get reference to the chart using its ID
              let chartRef = FusionCharts("performanceMonitorChart"),
                // We need to create a querystring format incremental update, containing
                // label in hh:mm:ss format
                currDate = new Date(),
                label = addLeadingZero(currDate.getHours()) + ":" +
                  addLeadingZero(currDate.getMinutes()) + ":" +
                  addLeadingZero(currDate.getSeconds()),
                // Build Data String in format &label=...&value=...
                strData = "";
              if (avgPerf == -1) {
                console.log(avgPerf)
                strData = "&label=" + label
                  + "&value="
                  + latestPerformance;
              } else {
                console.log(avgPerf)
                strData = "&label=" + label
                  + "&value="
                  + latestPerformance + "|" + avgPerf;
              }
              // Feed it to chart.
              chartRef.feedData(strData);
            }

            let monitorPromise = setTimeout(function () {
              updateData();
            }, 1000);
            vm.statusPromises.add(monitorPromise);
          }
        }
      }).render();
      vm.chartTracker.addFusionChart(performanceChartMon);
    });


    /* 10 / 10 = 1, 20 / 10 = 2, ... 100 / 10 = 10 , 110 / 10 = 11,/*/
    let performanceGauge = this.googleCharts.getGauge(document.getElementById('performance-gauge-div'));

    performanceGauge.draw(data, options);

    this.chartTracker.addGoogleChart(performanceGauge);
    let gaugePromise = setTimeout(function() {
      vm.tester.getPerformanceStatus(vm.projectId).subscribe(function(response) {
        if (response.running) {
          latestPerformance = response.avgResponseTime;
          avgPerf = response.cumAvgResponseTime;
          // console.log(response.avgResponseTime);
          // console.log(latestPerformance);
          if (latestPerformance <= 1) {
            options.max = 1
          }
          else if (latestPerformance >= options.max) {
            options.max = latestPerformance * 2;
          }
          data.setValue(0, 1, latestPerformance);
          performanceGauge.draw(data, options);
        } else {
          pingProm.resolve(response);
          vm.statusPromises.clear();
        }
      });
    }, 500); //check for real time update every 500 ms.
    this.statusPromises.add(gaugePromise);

    function resizeGauge () {
      console.log('Resize gauge called.');
      performanceGauge.draw(data, options);
    }


    if (document.addEventListener) {
      window.addEventListener('resize', resizeGauge);
    }
    else {
      window.onresize = resizeGauge;
    }
  }

}
