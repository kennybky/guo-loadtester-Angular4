import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChartDataService {

  constructor(private http: HttpClient) { }


   getChartData(url, projectId, dataSource) : Observable<any> {
   let encodedUrl = encodeURIComponent(url);
    return this.http.get("v1/test/" + dataSource + "?uri=" + encodedUrl + "&projectId=" + projectId);
  }

  /**
   * Get data for making comparisons
   * @param projectList
   * @returns {*}
   */
  getCompareData(projectList): Observable<any> {
    let encodedUrl = "v1/test/compare?projectlist=" + encodeURIComponent(projectList);
    return this.http.get(encodedUrl);
  }

  /**
   * Get chart data for  max, mins, avgs, ect.
   * @param projectList
   * @param type
   * @returns {*}
   */
   getStatsData(projectList, type): Observable<any> {
    let encodedUrl = "v1/test/stats?type=" + encodeURIComponent(type) + "&projectlist=" + encodeURIComponent(projectList);
    return this.http.get(encodedUrl);
  }

}
