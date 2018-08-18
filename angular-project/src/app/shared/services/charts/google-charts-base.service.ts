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

  setData(data: any[]){
    this.datatable = google.visualization.arrayToDataTable(data);
  }

  getData(){
    return this.datatable;
  }

  load(packages: any[],callback: Function){
    google.charts.load('current', {'packages': packages});
    google.charts.setOnLoadCallback(callback);
  }

  getGauge(el: HTMLElement){
       return  new google.visualization.Gauge(el);
  }




}
