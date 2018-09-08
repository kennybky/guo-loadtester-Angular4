import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {TableItemsService} from './table-items.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  constructor(private http: HttpClient, private tableItems: TableItemsService) {
    
  }

        getProjects() {
        let vm = this;
        return this.http.get("v1/project/list");
      }

        deleteProjects(projects) {
        var projectIds = projects.map(function (project) {
          return project.projectid;
        });

        return this.http.post('v1/project/deleteProjects', {projectIds: projectIds},
          {headers: {'Content-Type': 'application/json'}});
      }

        updateLoadBtn(projects) {
        var selected = projects.filter(function (project) {
          return project.selected;
        });
        var action = "";
        if (selected.length > 1) {
          action = "Compare";
        }
        else if (selected.length === 1) {
          action = "Load";
        }
        return action;
      }

        getAvailability(mode, date, projectId) {
        return this.http.get('v1/test/availability?date='
          + date.toISOString() + '&mode=' + mode + '&projectId=' + projectId);
      }

        getReliability(projectId) {
        return this.http.get('v1/test/reliability?projectId=' + projectId);
      }

        filterNIP(projects) {
        return projects.filter(function(project) {
          return !project.inProgress;
        });
      }

        msToSec(interval) {
        return interval / 1000;
      }
    
  
}
