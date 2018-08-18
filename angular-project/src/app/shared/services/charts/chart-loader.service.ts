import { Injectable } from '@angular/core';
import * as FusionCharts from 'fusioncharts';
import * as $ from 'jquery'

@Injectable()
export class ChartLoaderService {

  constructor() { }

   renderFusionChart(data) {
    FusionCharts.ready(function () {
      var fusionChart = new FusionCharts(data);
      fusionChart.render();
    });
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


}
