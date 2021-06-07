import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { filter, map, scan, share, skipUntil, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { GaugeData } from './gauge/gauge.component';
import { ListItemData } from './symbol-list/symbol-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private chart_length = 600;

  private source$: Observable<{ [symbol: string]: Ticker }>;

  xvwap_volume$: Observable<GaugeData>;
  xvwap_equal$: Observable<GaugeData>;
  xvwap_inverse$: Observable<GaugeData>;
  chart_data = {
    volume: <number[]>new Array(this.chart_length).fill(null),
    equal: <number[]>new Array(this.chart_length).fill(null),
    inverse: <number[]>new Array(this.chart_length).fill(null),
  };

  private getDistance = (price: number, origin: number): number =>
    1 - price / origin;
  listItems$: Observable<ListItemData[]>;

  constructor() {
    this.source$ = webSocket<Tickers>(
      'wss://fstream.binance.com/ws/!ticker@arr'
    ).pipe(
      scan(
        (acc, cur) =>
          cur
            .filter((ticker) => ticker.s.indexOf('_') === -1)
            .map((ticker) => ({ [ticker.s]: ticker }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), acc),
        <{ [symbol: string]: Ticker }>{}
      ),
      share()
    );
    this.xvwap_volume$ = this.getXvwap(Weighting.VOLUME);
    this.xvwap_equal$ = this.getXvwap(Weighting.EQUAL);
    this.xvwap_inverse$ = this.getXvwap(Weighting.INVERSE);
    this.listItems$ = this.source$.pipe(
      map((x) =>
        Object.values(x)
          .map((v) => {
            const distance = this.getDistance(
              Number.parseFloat(v.w),
              Number.parseFloat(v.c)
            );
            const color = this.getColor(distance);
            return {
              symbol: v.s,
              distance,
              color,
            };
          })
          .sort((a, b) => b.distance - a.distance)
      )
    );
  }
  getXvwap(w: Weighting): Observable<GaugeData> {
    return this.source$.pipe(
      map((tickers) => {
        const reduced = Object.keys(tickers).reduce(
          (acc, key) => {
            const ticker = tickers[key];
            const volume = Number.parseFloat(ticker.q);
            const distance = this.getDistance(
              Number.parseFloat(ticker.w),
              Number.parseFloat(ticker.c)
            );
            const multiplier =
              w === Weighting.VOLUME
                ? volume
                : w === Weighting.INVERSE
                ? 1 / volume
                : 1;
            acc.distance += distance * multiplier;
            acc.volume += multiplier;
            return acc;
          },
          { distance: 0, volume: 0 }
        );
        return reduced.distance / reduced.volume;
      }),
      filter((x) => !!x),
      skipUntil(timer(3000)),
      tap((value) => {
        this.chart_data[w].push(value);
        if (this.chart_data[w].length > this.chart_length) {
          this.chart_data[w].splice(
            0,
            this.chart_data[w].length - this.chart_length
          );
        }
        this.chart_data = { ...this.chart_data };
      }),
      map((value) => ({ value, color: this.getColor(value) }))
    );
  }

  getColor(p: number, r = 0.1): string {
    const base = 60;
    const effect = Math.min(Math.round((60 * Math.abs(p)) / r), 60);
    const h = p < 0 ? base - effect : base + effect;
    const s = '90%';
    const l = '40%';
    return `hsl(${h}, ${s}, ${l})`;
  }
}

interface Ticker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

type Tickers = Array<Ticker>;

enum Weighting {
  VOLUME = 'volume',
  EQUAL = 'equal',
  INVERSE = 'inverse',
}

interface Color {
  r: number;
  g: number;
  b: number;
}
