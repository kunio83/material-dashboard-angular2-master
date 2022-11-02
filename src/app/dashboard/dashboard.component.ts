import { Component, OnInit } from '@angular/core';
import { TableService } from 'app/models/tableService';
import { TableService2Item } from 'app/models/tablesService2Item';
import { MesaService } from 'app/services/mesa.service';
import { TableServiceService } from 'app/services/table-service.service';
import { TableService2ItemService } from 'app/services/table-service2-item.service';
import * as Chartist from 'chartist';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  tableList: any = [];
  totMesas = 0;
  mesasOcup = 0;
  pedidoList: TableService2Item[];
  itemsSolicitados = 0;
  itemsPreparacion = 0;
  itemsListos = 0;
  tableServiceList: TableService[];
  enservicio = 0;
  esperaMozo = 0;
  esperaCobro = 0;
  comensales = 0;

  constructor(
    private tableService: MesaService,
    private tableService2ItemService: TableService2ItemService,
    private tableServiceService: TableServiceService
  ) { }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {


    this.tableService.getMesas(environment.tenantId).subscribe(
      res => {
        this.tableList = res as [];

        this.tableList.forEach(element => {
          this.totMesas++;
          if (element.stateId > 1) {
            this.mesasOcup++;
          }
        });
      });

    this.tableService2ItemService.getInProgressItems(environment.tenantId).subscribe(
      res => {
        this.pedidoList = res as TableService2Item[];
        this.pedidoList.forEach(element => {
          switch (element.itemStateId) {
            case 1:
              this.itemsSolicitados += element.quantity;
              break;
            case 2:
              this.itemsPreparacion += element.quantity;
              break;
            case 3:
              this.itemsListos += element.quantity;
              break;
          }
        });
      });

    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
      res => {
        this.tableServiceList = res as TableService[];
        this.tableServiceList.forEach(element => {
          switch (element.serviceStateId) {
            case 1:
              this.enservicio++;
              break;
            case 2:
              this.esperaMozo++;
              break;
            case 3:
              this.esperaCobro++;
              break;
          }
          this.comensales += element.diners;
        });
      });











    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

}
