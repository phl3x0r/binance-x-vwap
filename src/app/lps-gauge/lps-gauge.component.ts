import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-lps-gauge',
  templateUrl: './lps-gauge.component.html',
  styleUrls: ['./lps-gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LPSGaugeComponent {
  @Input()
  data: number = 0;

  @Input()
  label: string = '';

  constructor() {}
}

export interface GaugeData {
  value: number;
  color: string;
}
