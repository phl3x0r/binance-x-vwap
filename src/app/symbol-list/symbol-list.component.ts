import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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

  @Input()
  searchTerm!: string;

  constructor() {}
}

export interface ListItemData {
  symbol: string;
  distance: number;
  zscore: number;
  color: string;
  delta: 'up' | 'down' | 'equal';
}

@Pipe({
  name: 'highlight',
})
export class HighlightSearch implements PipeTransform {
  constructor() {}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    if (!match) {
      return value;
    }
    return value.replace(re, '<mark>' + match[0] + '</mark>');
  }
}
