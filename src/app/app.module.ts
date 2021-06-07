import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GaugeComponent } from './gauge/gauge.component';
import { SymbolListComponent } from './symbol-list/symbol-list.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './chart/chart.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    GaugeComponent,
    SymbolListComponent,
    ChartComponent,
    SliderComponent,
  ],
  imports: [
    BrowserModule,
    NgxGaugeModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    HighchartsChartModule,
    NgxSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
