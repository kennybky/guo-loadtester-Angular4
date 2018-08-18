import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TesterService {

  constructor(private http: HttpClient) {

  }


 start(project): Observable<any> {
    console.log(project);
   let projectName = project.name, url = project.uri, type = project.type, options = project.options;
    let encodedUrl = encodeURIComponent(url);

    if (type === 'performance') {
      var uri = "v1/test/startPerformanceTest?uri=" + encodedUrl
        + "&projectName=" + projectName + "&method=" + project.method;
      return this.http.get(uri);
    }

    if (type === 'capacity') {
      console.log('calling capacity url');
      var uri = "v1/test/startCapacityTest?uri=" + encodedUrl + "&projectname=" + projectName
        + "&userCount=" + options.userCount + "&warmUpTime="
        + options.warmUpTime + "&testTime=" + options.testTime + "&stepDuration=" + options.stepDuration
        + "&stepCount=" + options.stepCount + "&failuresPermitted="
        + options.failuresPermitted+ "&method=" + project.method;
      return this.http.get(uri);
    }

    if (type === 'scalability') {
      var uri = "v1/test/startScalabilityTest?uri=" + encodedUrl + "&projectname=" + projectName
        + "&distribution=" + options.distribution + "&userCount=" + options.userCount + "&warmUpTime="
        + options.warmUpTime + "&testTime=" + options.testTime + "&stepDuration=" + options.stepDuration
        + "&stepCount=" + options.stepCount + "&failuresPermitted="
        + options.failuresPermitted+ "&method=" + project.method;
      return this.http.get(uri);
    }

    if (type === 'availability' || type === 'reliability') {
      var interval = this.intervalToMs(options.interval, options.timeUnits);
      console.log("Ms interval: " + interval);
      return this.http.get('v1/test/startScheduledTest?projectName=' + projectName + '&uri=' + encodedUrl
        + '&interval=' + interval + '&timeout=' + options.timeout+ "&method=" + project.method);
    }
  }

   intervalToMs(interval, timeUnits) {
    var conversion = 1 / (1000 * 1.0); //by default, assume interval is given in seconds.
    switch(timeUnits) {
      case "Minutes":
        conversion = 1 / (60000 * 1.0);
        break;
      case "Hours":
        conversion = 1 / (3600000 * 1.0);
        break;
      default:
        console.log("Interpreting time value as seconds");
        break;
    }
    return Math.round(interval / conversion);
  }

   stop(projectId): Observable<any> {
    console.log("stop called");
    return this.http.get('v1/test/stop?projectId=' + projectId);
  }

  getPerformanceStatus(projectId): Observable<any> {
    var uri = "v1/test/realTimePerformance?projectId=" + projectId;
    return this.http.get(uri);
  }

  /**
   * Get's the current running scalability status of a test
   * @param url
   * @param projectName
   * @param projectId
   * @param requestCount
   * @returns {*}
   */
   getScalabilityStatus(url, projectId): Observable<any> {
    var uri = "v1/test/scalabilityStatus?uri=" + url + "&projectId=" + projectId;
    return this.http.get(uri);
  }

  /**
   * Get's the current running capacity status of a test
   * @param url
   * @param projectName
   * @param projectId
   * @param requestCount
   * @returns {*}
   */
 getCapacityStatus(url, projectId): Observable<any> {
    console.log('calling capacity status');
    var uri = "v1/test/capacityStatus?uri=" + url + "&projectId=" + projectId;
    return this.http.get(uri);
  }

   validateProjectName(name): Observable<any> {
    var uri = "v1/test/validateProjectName?name=" + name;
    return this.http.get(uri);
  }
}


