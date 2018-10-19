import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebTesterService {

  constructor(private http: HttpClient) { }
      /**
       * Starts a performance, capacity, or scalability test depending on the type.
       * @param projectName {string} name of the project
       * @param url {string} url of the service to test
       * @param type {string} capacity or scalability.
       * @param options {object} json object representing key:value pairs needed for
       *                 either type of test
       * @returns {*} This method returns a promise. Fulfilled when http request is received.
       */
      start(projectName, url, method, params) {
        var encodedUrl = encodeURIComponent(url);
        let obj = {
          method: method,
        params: params,
        uri: url
      }
        var uri = "/v1/ws/query";
        return this.http.post(uri,JSON.stringify(obj));
      }

      save (project) {
        const url = `/v1/webprojects/${project.dbId}`
        return this.http.put(url,  {id: project.dbId, data: JSON.stringify(project)});
      }

      saveStats(project, avg){
        const url = `/v1/webprojects/${project.dbId}/save?url=${project.url}&avg=${avg}`
        return this.http.post(url, null);
      }

      getGraphData(id){
        const url = `/v1/webprojects/${id}/graph`
        return this.http.get(url);
      }

      createProjectDb(project)  {
        const url = `/v1/webprojects/add`;
        return this.http
          .post(url, {id: project.dbId, data: JSON.stringify(project)})
      }

      deleteProjectDb(id){
        return this.http.delete(`/v1/webprojects/${id}`);
      }

      getProjectsDb() {
        return this.http
          .get("/v1/webprojects/")
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
}
