import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WebServicesComponent } from './web-services/web-services.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ExistingProjectsComponent } from './existing-project/existing-projects.component';
import { WebProjectComponent } from './web-project/web-project.component';
import {ValidationMessagesComponent, ValidationMessageComponent} from './shared/ValidationMessagesComponent';
import { HttpClientModule } from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ChartDataService} from './shared/services/charts/chart-data.service';
import {ChartLoaderService} from './shared/services/charts/chart-loader.service';
import {ChartOptionsService} from './shared/services/charts/chart-options.service';
import {ChartTrackerService} from './shared/services/charts/chart-tracker.service';
import {RealTimePerformanceService} from './shared/services/real-time-performance.service';
import {StatusPromisesService} from './shared/services/status-promises.service';
import {TesterService} from './shared/services/tester.service';
import {WebService} from './shared/services/web.service';
import {GoogleChartsBaseService} from './shared/services/charts/google-charts-base.service';
import {UrlBuilder} from './shared/models/url-builder';
import {Retester} from './shared/models/retester';
import { ActionMessageComponent } from './action-message/action-message.component';
import { LoginComponent } from './login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptorService} from './shared/services/token-interceptor.service';



@NgModule({
  declarations: [
    AppComponent,
    WebServicesComponent,
    NewProjectComponent,
    ExistingProjectsComponent,
    WebProjectComponent,
    ValidationMessagesComponent,
    ValidationMessageComponent,
    ActionMessageComponent,
    LoginComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    ArchwizardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    ChartDataService,
    ChartLoaderService,
    ChartOptionsService,
    ChartTrackerService,
    RealTimePerformanceService,
    StatusPromisesService,
    TesterService,
    WebService,
    GoogleChartsBaseService,
    UrlBuilder,
    Retester,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
