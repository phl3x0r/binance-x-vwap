import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeComponent {
  @Input()
  data: GaugeData = { value: 0, color: '' };

  constructor() {}
}

export interface GaugeData {
  value: number;
  color: string;
}
