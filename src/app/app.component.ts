import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, merge, Observable, timer } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  pairwise,
  scan,
  share,
  skipUntil,
  startWith,
  tap,
} from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { GaugeData } from './gauge/gauge.component';
import { ListItemData } from './symbol-list/symbol-list.component';
import { getMean, getStd, getZscore } from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private chart_length = 600;

  private source$: Observable<{ [symbol: string]: Ticker }>;
  public lps$: Observable<number>;

  xvwap_volume$: Observable<GaugeData>;
  xvwap_equal$: Observable<GaugeData>;
  xvwap_inverse$: Observable<GaugeData>;
  chart_data = {
    volume: <number[]>new Array(this.chart_length).fill(null),
    equal: <number[]>new Array(this.chart_length).fill(null),
    inverse: <number[]>new Array(this.chart_length).fill(null),
  };

  highlightControl = new FormControl('');
  highlighter$: Observable<string>;

  private getDistance = (price: number, origin: number): number =>
    1 - price / origin;
  listItems$: Observable<ListItemData[]>;
  slider_value: number = 0;
  distribution$: Observable<number[]>;
  stats$: Observable<{ mean: string; std: string }>;

  constructor() {
    this.highlighter$ = this.highlightControl.valueChanges.pipe(
      debounceTime(20),
      startWith('')
    );

    this.lps$ = merge(
      webSocket<ForceOrder>(
        'wss://fstream.binance.com/ws/!forceOrder@arr'
      ).pipe(map((fo) => ({ count: true, time: fo.E }))),
      interval(1000).pipe(
        map(() => ({ count: false, time: new Date().getTime() }))
      )
    ).pipe(
      scan(
        (acc: number[], cur: { count: boolean; time: number }) => [
          ...acc.filter((e) => e > cur.time - 60 * 1000),
          ...(cur.count ? [cur.time] : []),
        ],
        []
      ),
      map((res) => res.length)
    );

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
      map((x) => {
        const distances = Object.values(x)
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
          .sort((a, b) => b.distance - a.distance);
        const distribution = distances.map((d) => d.distance);
        return distances.map((d) => ({
          ...d,
          zscore: getZscore(distribution, d.distance),
        }));
      }),
      pairwise(),
      map(([as, bs]) =>
        bs.map((b, b_index) => {
          const a_index = as.findIndex((a) => a.symbol === b.symbol);
          return {
            ...b,
            delta:
              b_index < a_index ? 'up' : b_index > a_index ? 'down' : 'equal',
          };
        })
      )
    );
    this.distribution$ = this.listItems$.pipe(
      map((lis) => lis.map((li) => li.distance * 100))
    );
    this.stats$ = this.distribution$.pipe(
      map((dist) => ({
        mean: getMean(dist).toFixed(2),
        std: getStd(dist).toFixed(2),
      }))
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
        this.slider_value =
          (this.chart_data.volume[this.chart_data.volume.length - 1] * -100 +
            this.chart_data.inverse[this.chart_data.inverse.length - 1] * 100) /
          (this.chart_data.volume[this.chart_data.volume.length - 1] +
            this.chart_data.inverse[this.chart_data.inverse.length - 1]);
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

interface ForceOrder {
  e: string;
  E: number;
  o: O;
}

interface O {
  s: string;
  S: string;
  o: string;
  f: string;
  q: string;
  p: string;
  ap: string;
  X: string;
  l: string;
  z: string;
  T: number;
}
