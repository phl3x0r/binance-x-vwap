import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-symbol-list',
  templateUrl: './symbol-list.component.html',
  styleUrls: ['./symbol-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
