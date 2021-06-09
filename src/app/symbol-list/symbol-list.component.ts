import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-symbol-list',
  templateUrl: './symbol-list.component.html',
  styleUrls: ['./symbol-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeAnimation', [
      state('in', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 1 }),
        animate('1s cubic-bezier(1, 0, 0.55, 1)'),
      ]),
    ]),
  ],
})
export class SymbolListComponent {
  @Input()
  data!: ListItemData[];

  constructor() {}
}

export interface ListItemData {
  symbol: string;
  distance: number;
  color: string;
  delta: 'up' | 'down' | 'equal';
}
