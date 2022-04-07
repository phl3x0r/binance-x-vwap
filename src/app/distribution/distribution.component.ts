import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { PointOptionsObject, XrangePointOptionsObject } from 'highcharts';
import HC_histogram from 'highcharts/modules/histogram-bellcurve';
HC_histogram(Highcharts);

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
})
export class DistributionComponent implements OnInit {
  @Input()
  public dType: 'histogram' | 'bellcurve' = 'histogram';

  @Input()
  set data(data: number[]) {
    this.chartOptions.series = [
      {
        type: this.dType,
        xAxis: 0,
        yAxis: 0,
        baseSeries: 1,
      },
      {
        type: 'scatter',
        data: data,
        id: '1',
        visible: false,
        showInLegend: false,
      },
    ];
    this.updateFlag = true;
  }

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    title: { text: 'distribution', style: { fontFamily: 'consolas' } },
    xAxis: {
      title: { text: 'percent', style: { fontFamily: 'consolas' } },
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
