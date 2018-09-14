import { Injectable } from '@angular/core';
import FusionCharts from 'fusioncharts/core';
import * as $ from 'jquery'
import {GoogleChartsBaseService} from './google-charts-base.service';

@Injectable()
export class ChartLoaderService {

  constructor(private googleCharts:GoogleChartsBaseService) {
    let vm = this;
    googleCharts.load(['corechart', 'line', 'gauge'],function() {
      vm.chartsLoaded = true;
    });
  }

  private chartsLoaded:Boolean;

   renderFusionChart(data) {
    FusionCharts.ready(function () {
      var fusionChart = new FusionCharts(data);
      fusionChart.render();
    });
  }

  renderGoogleLineCharts(chart, container:HTMLElement){
     console.log(chart)
    let strData = [];
    let categories = chart.dataSource.categories[0].category;
    let data = chart.dataSource.dataset[0].data;
    let caption= chart.dataSource.chart.caption;
    let xAxisName = chart.dataSource.chart.xAxisName;
    let yAxisName = chart.dataSource.chart.yaxisname;
    strData.push([
      {label:xAxisName, id:xAxisName, type:'datetime'},
      {label:yAxisName, id:yAxisName, type:'number'}
    ])

    for(let i=0; i < categories.length; i++){
      if(categories[i] === undefined || data[i] == undefined){
        break;
      }
      strData.push([new Date(categories[i].label), Number(data[i].value)])
    }
    if(this.chartsLoaded) {
      this.render(strData, caption, yAxisName, xAxisName,container)
     }
  }

  render(strData, caption, yAxisName, xAxisName, container:HTMLElement, plotType="line") {
    let chartData = this.googleCharts.getData(strData);




    // chartData.addColumn('string', xAxisName);
    // chartData.addColumn('number', yAxisName);
    // chartData.addRows(strData);


    var chart_options = {
      title: caption,
      pointSize: 4,
      legend: "none",
      height: 500,
      width:900,
      hAxis: {
        title: xAxisName,
        allowContainerBoundaryTextCufoff:false,
        minTextSpacing: 5
      },
      explorer: {
        axis:'horizontal',
        keepInBounds:'true'
      },
      viewWindowMode:'maximized',

      vAxis: {
        title: yAxisName
      },
      colors: ['#0546af'],
      crosshair: {
        color: '#000',
        trigger: 'selection'
      }
    };

    let google_chart;
    switch(plotType){
      case 'line':
        google_chart = this.googleCharts.getLineChart(container);
        break;
      case 'bar':
        google_chart = this.googleCharts.getBarChart(container);
        break;
      case 'area':
        google_chart = this.googleCharts.getAreaChart(container);
        break;
      default:
        google_chart = this.googleCharts.getLineChart(container);
        break;


    }



    this.googleCharts.drawChart(google_chart, chartData, chart_options);
  }


  updateFusionChart(data, chartType, plotType) {
    var seriesObject;
    if (typeof data.series === 'undefined' || data.series === null) {
      seriesObject = data.dataset;
    } else {
      seriesObject = data.series;
      seriesObject.seriesname = data.uri;
    }

    var categoryObject = data.category;

    var seriesArray;
    if (seriesObject.constructor === Array) {
      seriesArray = seriesObject;
    } else {
      seriesArray = [seriesObject];
    }

    let chart = data.chart;

    let caption= chart.caption;
    let xAxisName = chart.xAxisName;
    let yAxisName = chart.yaxisname;

    let seriesData = data.series.data;
    let strData = []
    strData.push([yAxisName, xAxisName])
    for (let i=0; i < seriesData.length; i++){
      let set = seriesData[i];
      strData.push([set.label, Number(set.value)]);
    }



    let container = document.getElementById(chartType + "");


    if(this.chartsLoaded) {
      this.render(strData, caption, yAxisName, xAxisName,container, plotType)
    }


  }

  updateGoogleChart(data, chartType, plotType) {
    var seriesObject;
    if (typeof data.series === 'undefined' || data.series === null) {
      seriesObject = data.dataset;
    } else {
      seriesObject = data.series;
      seriesObject.seriesname = data.uri;
    }

    var categoryObject = data.category;

    var seriesArray;
    if (seriesObject.constructor === Array) {
      seriesArray = seriesObject;
    } else {
      seriesArray = [seriesObject];
    }


    $("#" + chartType).insertFusionCharts({
      type: plotType,
      renderAt: 'chart-container',
      width: '100%',
      height: '550',
      dataFormat: 'json',
      dataSource: {
        "chart": data.chart,
        "categories": [categoryObject],
        "dataset": seriesArray
      }
    });
  }


   generateColors(){
    let colors = []
    for (var i = 0; i < 20; i++){
      colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
    }
    return colors;
  }

  renderBarChart(project) {
    let data = project.stats
    console.log(project)
    let datum = []
    let colors = this.generateColors()
    let i = 0;

    let strData = []
    let xAxisName = "Urls";
    let yAxisName = "Response Time (in ms)";
    strData.push([yAxisName, xAxisName, {role: 'style'}])
    data.forEach((stat) => {
      let bar = {
        label: stat.url,
        value: stat.responseTime,
        color: colors[i]
      };
      strData.push([stat.url, Number(stat.responseTime), colors[i]]);
      i++
    })

    let container = document.getElementById('chart-container');
    console.log(container)
    let caption = `Comparison of Response Times for ${project.title}`;


    if (this.chartsLoaded) {
      this.render(strData, caption, yAxisName, xAxisName, container, 'bar')
    }


  }

}
