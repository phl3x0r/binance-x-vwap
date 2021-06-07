import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() value: number = 0;

  constructor() {}

  ngOnInit(): void {}

  options: Options = {
    floor: -100,
    ceil: 100,
    animate: true,
    animateOnMove: true,
    hidePointerLabels: true,
    hideLimitLabels: true,
  };
}
