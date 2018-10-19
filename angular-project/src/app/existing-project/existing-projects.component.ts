import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebService} from '../shared/services/web.service';
import {TesterService} from '../shared/services/tester.service';
import {Retester} from '../shared/models/retester';
import {UrlBuilder} from '../shared/models/url-builder';
import {RealTimePerformanceService} from '../shared/services/real-time-performance.service';
import {StatusPromisesService} from '../shared/services/status-promises.service';
import {ChartTrackerService} from '../shared/services/charts/chart-tracker.service';
import {ChartOptionsService} from '../shared/services/charts/chart-options.service';
import {TableItemsService} from '../shared/services/table-items.service';
import {WizardProject} from '../shared/models/wizard-project';
import {ChartLoaderService} from '../shared/services/charts/chart-loader.service';
import {ChartDataService} from '../shared/services/charts/chart-data.service';
import {ProjectDataService} from '../shared/services/project-data.service';
import {Router} from '@angular/router';

import {MatTabsModule, MatFormField, MatDatepicker, MatTabGroup, MatTab, MatTabChangeEvent} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-existing-projects',
  templateUrl: './existing-projects.component.html',
  styleUrls: ['./existing-projects.component.css']
})
export class ExistingProjectsComponent implements OnInit, OnDestroy {

  constructor(private webServices: WebService, private tester: TesterService, private retester: Retester, private tableItems: TableItemsService,
              private urlBuilder: UrlBuilder, private realTimePerformance: RealTimePerformanceService, private chartLoader: ChartLoaderService,
              private statusPromises: StatusPromisesService, private chartData: ChartDataService, private projectData: ProjectDataService,
              private chartTracker: ChartTrackerService, private chartOptions: ChartOptionsService, private router: Router) {}

 act = '' as any;
  loadProjects = [] as any;
  scheduledProjects = [] as any;
  options = {
    minMode: 'month'
  } as any;
  modes = [{name: 'day'}, {name: 'month'}, {name: 'year'}] as any;

  graphOverride = [
    {
      label: "Bar Chart",
      borderWidth: 1,
      type: 'bar'

    },
    {
      label: "Line Chart",
      borderWidth: 3,
      type: 'line'
    }
  ];
  projectAction = {} as any;
  timeOuts = {
    datePickerMsg:null,
    reliabilityAction:null,
    projectAction:null
  };

 projectLoaded:any;

  showLoadingBall = false as Boolean;
  datePickerMsg = {
    class:undefined,
    message:undefined

  }as any;

  projectReliability: any;

  reliabilityAction = {
    class:undefined,
    message:undefined

  }as any;

  projectAvailability = {
    projectId: null
  }as any

  dataFetched: Boolean;
  allSelected: Boolean;
  requestsGraphLabels = {} as any;
  requestsGraphOptions = {} as any;
  successScalabilityLabels = {} as any;
  successScalabilityOptions = {} as any;
  performanceScalabilityLabels = {} as any;
  performanceScalabilityOptions = {} as any;
  successScalabilityData: any;
  performanceScalabilityData:any;
  requestsGraphData: any;

  compareProjectsResults = [];
  chartsLoaded:Boolean;
  compareChartsLoaded:Boolean;
  project={} as any;
  availMode:any;
  compareResultsTable:any;
  availDate:any;
  compareCharts:Array<any>;
  sortField;
  reverse;

  ngOnInit() {
    this.activate();
  }

  ngOnDestroy(){
    this.chartTracker.clearGoogleCharts();
    this.chartTracker.clearFusionCharts();
    for (let timeOutsKey in this.timeOuts) {
      let timeo = this.timeOuts[timeOutsKey];
      if(timeo)
      clearTimeout(timeo);
    }
    this.statusPromises.clear();
  }


      activate() {
        let vm = this;
        this.projectData.getProjects().subscribe(function (projects) {
          console.log(projects)
          vm.loadProjects = projects[0].map(vm.tableItems.addSelectedAttr); //projects[0] is a list of load test projects
          vm.scheduledProjects = projects[1].map(vm.tableItems.addSelectedAttr); // projects[1] is a list of scheduled projects (for rel and avail)
          vm.dataFetched = true;
          console.log(vm.loadProjects)
        });
      }

  styleResult(success) {
    var className = "actionMsg ";
    if (success) className += "text-success";
    else className += "text-danger";
    return className;
  }



      /**
       * Updates the button between load and compare depending on the
       * number of projects selected.
       */
     selected(projects, type) {
        this.allSelected = false;
        if (type === 'load') {
          this.act = this.projectData.updateLoadBtn(projects);
        } else if (type === 'scheduled') {

        }
      }

      /**
       * Used to trigger the selection of all projects if the top check-box
       * is selected. Also updates the load or compare button accordingly.
       * @param allSelected {boolean} True or false indicating if all projects selected or not
       */
      selectAll(projects, allSelected, type) {
        this.tableItems.selectAll(projects, allSelected);
        if (type === 'load') {
          this.act = this.projectData.updateLoadBtn(projects);
        }
      }




      getAvailability() {
        let mode = this.availMode, jsonDate = this.availDate
        let date = new Date(jsonDate.year, (jsonDate.month-1), jsonDate.day)
        console.log(date)

        let vm = this;
        if(this.timeOuts.datePickerMsg) {
          clearTimeout(this.timeOuts.datePickerMsg);
        }
        this.datePickerMsg = {};
        if (!mode || !date) {
          this.datePickerMsg.class = this.styleResult(false);
          this.datePickerMsg.message = "You must select a mode and date.";
          this.timeOuts.datePickerMsg = setTimeout(function() {
            vm.datePickerMsg.message = undefined;
          }, 3000);
        }
        else {
          this.projectData.getAvailability(mode, date, this.projectAvailability.projectid).subscribe(function (response:any) {
            vm.datePickerMsg.class = vm.styleResult(response.running);
            console.log(response);
            if (response.running) {
              switch (mode) {
                case 'day':
                  vm.datePickerMsg.message = "Availability for " + date.getFullYear() + '-' +
                    (date.getMonth() + 1) + '-' + date.getDate() + ': ' + response.message;
                  break;
                case 'month':
                  vm.datePickerMsg.message = "Availability for " + date.getFullYear() + '-' +
                    (date.getMonth() + 1) + ': ' + response.message;
                  break;
                case 'year':
                  vm.datePickerMsg.message = "Availability for " + date.getFullYear() + ': ' + response.message;
                  break;
              }
            } else {
              vm.datePickerMsg.message = response.message;
            }
          });
        }
      }

      clearAvailability() {
        this.datePickerMsg.message = null;
        this.availMode = null;
        this.availDate = null;
      }

      getReliability(project) {
       clearTimeout(this.timeOuts.reliabilityAction);
       let vm = this;
        this.projectReliability = project;
        this.projectData.getReliability(project.projectid).subscribe(function (response:any) {
          vm.reliabilityAction.class = vm.styleResult(response.running);
          vm.reliabilityAction.message = response.message;
        });
      }

       stopProject(project) {
        let vm = this;
         clearTimeout(this.timeOuts.projectAction);
        this.tester.stop(project.projectid).subscribe(function (response) {
          vm.projectMsg(response.running, response.message);
          if (!response.running) {
            if (project.testType === 'performance') {
              vm.statusPromises.clear();
            }
            vm.activate();
          }
        });
      }

  projectMsg(running, message) {
        let vm = this;
    vm.projectAction.class = this.styleResult(running);
    vm.projectAction.message = message;
    this.timeOuts.projectAction = setTimeout(function() {
      vm.projectAction.message = undefined;
    }, 3000);
  }


       selectProjectForAvail(project) {
        this.projectAvailability = project;
      }

      /**
       * Delete the selected projects when the delete button is pressed.
       */
      deleteProjects(projects) {
        clearTimeout(this.timeOuts.projectAction);
        if (this.allSelected) {
          this.allSelected = false;
        }
        let vm = this;
        var selectedProjects = this.tableItems.getSelectedItems(projects);
        if (selectedProjects.length == 0) {
          this.projectMsg(false, "You haven't selected any projects to delete.");
        } else {
          this.projectData.deleteProjects(this.projectData.filterNIP(selectedProjects)).subscribe(function (response:any) {
            vm.activate();
            vm.projectMsg(true, response);
          }, function(error) {
            vm.projectMsg(false, error.data);
          });
        }
      }

  initRequestGraph(url): Chart{
    let vm = this;
    let crq = document.getElementById("capacityRequests") as HTMLCanvasElement;
    let crqCtx = crq.getContext('2d');
    vm.requestsGraphOptions = vm.chartOptions.requestGraphOptions("Request input: " + url);

    return new Chart(crqCtx, {
      type:'line',
      data: {
        labels: vm.requestsGraphLabels,
        datasets: [{

          label:'Number of Requests',
          backgroundColor: "#ade",
          fill: 'origin',
          borderColor :"rgba(220,220,220,0.5)",
          borderWidth: 10,
          data: vm.requestsGraphData
        }]
      },
      options: vm.requestsGraphOptions
    });
  }

  initSuccessScalabilityGraph(url): Chart{
    let crs = document.getElementById("capacityScalability") as HTMLCanvasElement;
    let crsCtx = crs.getContext('2d');

    let vm = this;

    vm.successScalabilityOptions = vm.chartOptions.successScalabilityOptions("# of successful requests: " + url);

    return new Chart(crsCtx, {
      type:'line',
      data: {
        labels: vm.successScalabilityLabels,
        datasets: [{
          label:'Successful Requests',
          backgroundColor: "#ade",
          fill: 'origin',
          borderColor :"rgba(220,220,220,0.5)",
          borderWidth: 10,
          data: vm.successScalabilityData
        }]
      },
      options: vm.successScalabilityOptions
    });
  }

  initPerformanceScalabilityGraph(url): Chart{
    let crs = document.getElementById("performanceScalability") as HTMLCanvasElement;
    let crsCtx = crs.getContext('2d');

    let vm = this;

    vm.performanceScalabilityOptions = vm.chartOptions.performanceScalabilityOptions("Performance Scalability: " + url);

    return new Chart(crsCtx, {
      type:'bar',
      data: {
        labels:  vm.performanceScalabilityLabels,
        datasets: [{
          label:'Performance Scalability',
          backgroundColor: "#ade",
          data: vm.performanceScalabilityData
        },
          {
            label:'Average Performance Scalability',
            type:'line',
            data: vm.performanceScalabilityData
          },
        ]
      },
      options: vm.performanceScalabilityOptions
    });
  }


  /**
       * Load charts for selected project.
       */
       load() {
         let vm = this;
        this.showLoadingBall = true;
        this.projectLoaded = this.tableItems.getSelectedItem(this.loadProjects);
        if (this.projectLoaded) {
          this.statusPromises.clear();
          this.chartTracker.clearGoogleCharts();
          this.chartTracker.clearFusionCharts();

          document.querySelector('#chart-section').scrollIntoView();

          var type = this.projectLoaded.testType;
          if (type == 'performance') {
            if (this.projectLoaded.inProgress) {
              this.realTimePerformance.setProjectId(this.projectLoaded.projectid);
              this.realTimePerformance.startPinging();
            }
            this.chartData.getChartData(this.projectLoaded.uri, this.projectLoaded.projectid, "performanceHistory").subscribe(function(response) {
              console.log(response.fusionChart)
             // vm.chartLoader.renderFusionChart(response.fusionChart);
              let container = document.getElementById("chart-container")
              vm.chartLoader.renderGoogleLineCharts(response.fusionChart, container);
              vm.showLoadingBall = false;
            });
          } else if (type == 'scalability' || 'capacity') {
            // requests input, either in a uniform, normal, or poisson distributed manner.
            this.chartData.getChartData(vm.projectLoaded.uri, vm.projectLoaded.projectid, "requestsGraph").subscribe(function (response) {
              // console.log(JSON.stringify(response));
              vm.requestsGraphLabels = response.chart.labels;
              vm.requestsGraphData = response.chart.data
              vm.initRequestGraph(vm.project.uri)
            });

            // Performance Scalability
            this.chartData.getChartData(vm.projectLoaded.uri, vm.projectLoaded.projectid, "performanceScalabilityGraph").subscribe(function (response:any) {
              // console.log(JSON.stringify(response));
              vm.performanceScalabilityLabels = response.chart.labels;
              vm.performanceScalabilityData = response.chart.data, response.chart.data;
              //some misc message or info about the data. optional.
            vm.initPerformanceScalabilityGraph(vm.projectLoaded.uri);
            });

            // Success Scalability
            this.chartData.getChartData(vm.projectLoaded.uri, vm.projectLoaded.projectid, "successScalabilityGraph").subscribe(function (response) {
              // console.log(JSON.stringify(response));
              vm.successScalabilityLabels = response.chart.labels;
              vm.successScalabilityData = response.chart.data, response.chart.data;
             vm.initSuccessScalabilityGraph(vm.projectLoaded.uri);
            });
            vm.showLoadingBall = false;
          }
        }
      }

      /**
       * For each project selected, compare its name with those in the list
       *     projects in the database. If there is a match, generate the series
       *     and category object for that project URL. Once this is done for each
       *     project selected, generate the chart.
       */

      tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        let index = tabChangeEvent.index;
        if (this.compareCharts && this.compareCharts[index]) {
          let data = this.compareCharts[index];
          this.renderChart(data);
        }
      }

       renderChart ([compareData, chartType, plotType]){

         this.chartLoader.updateFusionChart(compareData, chartType, plotType);

  }


       compare() {
        //alert("This functionality has not been implemented yet.");
        let vm = this;
        vm.compareProjectsResults = [];
        vm.chartsLoaded = false;
        vm.compareChartsLoaded = true;
        var projectsCompared = [];

        vm.loadProjects.forEach(function (project) {
          if (project.selected) {
            var projectName = project.projectname;
            projectsCompared.push(projectName);
            vm.compareProjectsResults.push({
              projectName: project.projectname,
              maxConnectionCt: project.maxConnCount,
              avgRspTime: project.avgResponseTime
            });
          }
        });


        var projectList = projectsCompared.join(";");
         vm.compareCharts = []
        vm.chartData.getCompareData(projectList).subscribe(function (compareData) {
          console.log(compareData)
          // vm.chartLoader.updateFusionChart(compareData, "compareProjectsChart", "area");
          vm.compareCharts[0] = [compareData, "compareProjectsChart", "area"]
        });

        vm.chartData.getStatsData(projectList, "avg").subscribe(function (compareData) {
          console.log(compareData, "avg")
          // vm.chartLoader.updateFusionChart(compareData, "avgProjectsChart", "bar");
          vm.compareCharts[1] = [compareData, "avgProjectsChart", "bar"];
        });

        vm.chartData.getStatsData(projectList, "min").subscribe(function (compareData) {
          console.log(compareData, "min")
          // vm.chartLoader.updateFusionChart(compareData, "minProjectsChart", "bar");
          vm.compareCharts[2] =  [compareData, "minProjectsChart", "bar"]
        });

        vm.chartData.getStatsData(projectList, "max").subscribe(function (compareData) {
          // vm.chartLoader.updateFusionChart(compareData, "maxProjectsChart", "bar");
          vm.compareCharts[3] = [compareData, "maxProjectsChart", "bar"]
        });

        vm.chartData.getStatsData(projectList, "capacity").subscribe(function (compareData) {
          //vm.chartLoader.updateFusionChart(compareData, "capacityProjectsChart", "bar");
         vm.compareCharts[4]= [compareData, "capacityProjectsChart", "bar"];
        });

        vm.chartData.getStatsData(projectList, "reliability").subscribe(function (compareData) {
          //vm.chartLoader.updateFusionChart(compareData, "reliabilityProjectsChart", "bar");
          vm.compareCharts[5]= [compareData, "reliabilityProjectsChart", "bar"];
        });

      }

      /**
       * Allows user to re-test a saved load test project. It'll
       * navigate to the new project page and configure the wizard
       * depending on if a project is a capacity or scalability test.
       */
       retest(projects) {
         let vm = this;
        clearTimeout(this.timeOuts.projectAction);
        var selected = vm.tableItems.getSelectedItem(projects);
        if (selected) {
          if (!(vm.tableItems.getSelectedItems(projects).length === 1)) {
            vm.projectMsg(false, "Cannot select more than one project for retesting.");
          } else if (selected.inProgress) {
            vm.projectMsg(false, "Cannot re-test a project that's already running.");
          } else {
            let options = {} as any;
            if (selected.testType === 'capacity' || selected.testType === 'scalability') {
              options = {
                userCount: selected.maxConcurrentUsers,
                warmUpTime: selected.warmUpTime,
                testTime: selected.testDuration,
                failuresPermitted: selected.failuresPermitted,
                stepDuration: selected.stepDuration,
                stepCount: selected.stepCount
              };
              if (selected.testType == 'scalability') options.distribution = selected.distribution;
            } else if (selected.testType == 'scheduled') {
              selected.testType = 'availability';
              options = {
                timeUnits: 'Seconds',
                timeout: 500,
                interval: vm.projectData.msToSec(selected.scheduleInterval)
              };
            }
            var project = new WizardProject(selected.projectname, selected.testType, selected.uri, options, selected.method);

            this.retester.setProject(project);
            this.retester.isRetest = true;
            this.router.navigateByUrl('/newproject');
          }
        }
        else {
          this.projectMsg(false, "Select exactly one project to retest.");
        }
      }

}
