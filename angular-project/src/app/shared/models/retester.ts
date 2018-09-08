import {WebService} from '../services/web.service';
import {WizardProject} from './wizard-project';
import {Injectable} from '@angular/core';

@Injectable()
export class Retester {
   webService: any;
   project: WizardProject;
   public isRetest = false;

   setProject(retest) {
    this.project = retest;
  }

  getProject() {
    return this.project;
  }

  setService(testService) {
    this.webService = testService;
  }

  getService() {
    return this.webService;
  }
}
