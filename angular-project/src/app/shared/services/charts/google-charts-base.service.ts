declare var google: any;
import { Injectable } from '@angular/core';



@Injectable()
export class GoogleChartsBaseService {

  private datatable: any;

  constructor() {

  }

  protected buildChart(data: any[], chartFunc: any, options: any): void {
    var func = (chartFunc, options) => {
      this.datatable = google.visualization.arrayToDataTable(data);
      chartFunc().draw(this.datatable, options);
    };
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }

  getData(data: any[] = undefined){
    if(data!== undefined)
    return google.visualization.arrayToDataTable(data);
    else{
      return new google.visualization.DataTable();
    }
  }


  load(packages: any[],callback: Function){
    google.charts.load('current', {'packages': packages});
    google.charts.setOnLoadCallback(callback);
  }

  getGauge(el: HTMLElement){
       return  new google.visualization.Gauge(el);
  }

  getLineChart(el: HTMLElement){
    return new google.visualization.LineChart(el);
  }

  drawChart(chart,data,options){
    chart.draw(data, options);
  }

  getBarChart(el: HTMLElement){
   return new google.visualization.BarChart(el);
  }

  getAreaChart(el: HTMLElement) {
    new google.visualization.AreaChart(el);
  }




}
