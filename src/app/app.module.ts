import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GaugeComponent } from './gauge/gauge.component';
import {
  HighlightSearch,
  SymbolListComponent,
} from './symbol-list/symbol-list.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './chart/chart.component';
import { SliderComponent } from './slider/slider.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DistributionComponent } from './distribution/distribution.component';
import { LPSGaugeComponent } from './lps-gauge/lps-gauge.component';

@NgModule({
  declarations: [
    AppComponent,
    GaugeComponent,
    LPSGaugeComponent,
    SymbolListComponent,
    ChartComponent,
    SliderComponent,
    HighlightSearch,
    DistributionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxGaugeModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    HighchartsChartModule,
    NgxSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
