import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxGaugeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
