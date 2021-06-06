import { Component } from '@angular/core';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { Observable } from 'rxjs';
import { filter, map, scan, share, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { listAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [listAnimation],
})
export class AppComponent {
  private source$: Observable<{ [symbol: string]: Ticker }>;
  gaugeType: NgxGaugeType = 'semi';

  xvwap_volume$: Observable<number>;
  xvwap_equal$: Observable<number>;
  xvwap_inverse$: Observable<number>;

  private getDistance = (price: number, origin: number): number =>
    1 - price / origin;
  listItems$: Observable<{ symbol: string; distance: number; color: string }[]>;

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
  getXvwap(w: Weighting): Observable<number> {
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
      filter((x) => !!x)
    );
  }

  getColor(p: number): string {
    const r = (1 - (p * 10 + 0.5)) * 256;
    const g = (p * 10 + 0.5) * 256;
    const b = 20;
    console.log(p, `rgb(${r}, ${g}, ${b})`);
    return `rgb(${r}, ${g}, ${b})`;
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
