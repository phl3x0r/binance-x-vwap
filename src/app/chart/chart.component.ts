import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { PointOptionsObject, XrangePointOptionsObject } from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input()
  set data(data: { volume: number[]; equal: number[]; inverse: number[] }) {
    // console.log(data);
    this.chartOptions.series = [
      {
        name: 'volume',
        data: data.volume,
        type: 'line',
        color: '#4634eb',
        animation: false,
        crisp: false,
        marker: {
          enabled: false,
          radius: 0,
        },
      },
      {
        name: 'equal',
        data: data.equal,
        type: 'line',
        color: '#34c9eb',
        animation: false,
        crisp: false,
        marker: {
          enabled: false,
          radius: 0,
        },
      },
      {
        name: 'inverse',
        data: data.inverse,
        type: 'line',
        color: '#e834eb',
        animation: false,
        crisp: false,
        marker: {
          enabled: false,
          radius: 0,
        },
      },
    ];
    this.updateFlag = true;
  }

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    title: { text: 'history', style: { fontFamily: 'consolas' } },
    xAxis: {
      title: { text: 'seconds', style: { fontFamily: 'consolas' } },
      labels: { style: { fontFamily: 'consolas' } },
    },
    yAxis: {
      title: { text: '' },
      labels: { style: { fontFamily: 'consolas' } },
    },
    legend: { itemStyle: { fontFamily: 'consolas' } },
    series: [],
  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = () => null; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  constructor() {}

  ngOnInit(): void {}
}
