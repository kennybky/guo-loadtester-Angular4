import { Injectable } from '@angular/core';

@Injectable()
export class ChartOptionsService {

  constructor() { }
   requestGraphOptions(title) {
    return {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Requests'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (ms)'
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            data = data.datasets[0].data; //array of data objects.
            let toolTipDataInd = tooltipItem.index;
            return "Number of requests: " + data[toolTipDataInd];
          }
        }
      },
      title: {
        display: true,
        text: title,
        fullWidth: true
      }
    };
  }

   performanceScalabilityOptions(title) {
    return {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Average Response Time'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (ms)'
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
           data = data.datasets[0].data; //array of data objects.
            let toolTipDataInd = tooltipItem.index;
            return "Avg Response Time: " + data[toolTipDataInd] + " ms";
          }
        }
      },
      title: {
        display: true,
        text: title,
        fullWidth: true
      }
    };
  }

   successScalabilityOptions(title) {
    return {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Status Code 200 Requests'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (ms)'
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            data = data.datasets[0].data; //array of data objects.
            let toolTipDataInd = tooltipItem.index;
            return "Status code 200 requests: " + data[toolTipDataInd];
          }
        }
      },
      title: {
        display: true,
        text: title,
        fullWidth: true
      },
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(255, 99, 132)'
        }
      }
    };
  }

}
