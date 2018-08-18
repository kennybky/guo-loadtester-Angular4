import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NewProjectComponent} from './new-project/new-project.component';
import {ExistingProjectsComponent} from './existing-project/existing-projects.component';
import {WebProjectComponent} from './web-project/web-project.component';
import {WebServicesComponent} from './web-services/web-services.component';


const routes: Routes = [
  {
    path: 'newproject',
    component: NewProjectComponent
  },
  {
    path: 'existingprojects',
    component: ExistingProjectsComponent
  },
  {
    path: 'webproject',
    component: WebProjectComponent
  },
  {
    path: 'services',
    component: WebServicesComponent
  },
  {
    path: '',
    redirectTo: 'newproject',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
