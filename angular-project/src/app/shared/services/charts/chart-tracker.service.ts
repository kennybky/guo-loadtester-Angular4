import { Injectable } from '@angular/core';



@Injectable()
export class ChartTrackerService {

  constructor() {}
    fusionCharts = [];
    googleCharts = [];


     addGoogleChart(googleChart) {
      this.googleCharts.push(googleChart);
    }

    addFusionChart(fusionChart) {
      this.fusionCharts.push(fusionChart);
    }

    clearFusionCharts() {
       let vm = this;
      this.fusionCharts.forEach(function(fusionChart) {
        let index = vm.fusionCharts.indexOf(fusionChart);
        if (index > -1) {
          vm.fusionCharts.splice(index, 1);
          fusionChart.dispose();
        }
      });
    }

    clearGoogleCharts() {
      let vm = this;
      this.googleCharts.forEach(function(googleChart) {
        let index = vm.googleCharts.indexOf(googleChart);
        if (index > -1) {
          vm.googleCharts.splice(index, 1);
          googleChart.clearChart();
        }
      });
    }

}
