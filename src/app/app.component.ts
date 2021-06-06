import { Component } from '@angular/core';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { Observable } from 'rxjs';
import { filter, map, scan, share, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private source$: Observable<{ [symbol: string]: Ticker }>;
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue = 28.3;
  gaugeLabel = 'VWAP';
  gaugeAppendText = '%';
  thresholdConfig = {
    '-20': { color: 'red' },
    '-2': { color: 'orange' },
    '2': { color: 'green' },
  };

  xvwap$: Observable<number>;

  private getDistance = (price: number, origin: number): number =>
    1 - price / origin;
  foo$: Observable<{ symbol: string; distance: number }[]>;

  constructor() {
    this.source$ = webSocket<Tickers>(
      'wss://fstream.binance.com/ws/!ticker@arr'
    ).pipe(
      scan(
        (acc, cur) =>
          cur
            .map((ticker) => ({ [ticker.s]: ticker }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), acc),
        <{ [symbol: string]: Ticker }>{}
      ),
      share()
    );
    this.xvwap$ = this.getXvwap();
    this.foo$ = this.source$.pipe(
      map((x) =>
        Object.values(x)
          .map((v) => ({
            symbol: v.s,
            distance: this.getDistance(
              Number.parseFloat(v.w),
              Number.parseFloat(v.c)
            ),
          }))
          .sort((a, b) => b.distance - a.distance)
      )
    );
  }
  getXvwap(): Observable<number> {
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
            console.log(distance);
            if (distance > 1) {
              console.log(ticker.s, ticker.c, ticker.w);
            }
            acc.distance += distance * volume;
            // console.log(acc.distance);
            acc.volume += volume;
            return acc;
          },
          { distance: 0, volume: 0 }
        );
        // console.log(reduced.distance);
        return (reduced.distance / reduced.volume) * 100;
      }),
      filter((x) => !!x)
      // tap(console.log)
    );
  }
}

// BTCBUSD 35485.0 2119.044
// app.component.ts:53 BTCUSDT_210625 35467.6 2584.477
// app.component.ts:53 YFIUSDT 42157.0 2323.534
// app.component.ts:53 BTCBUSD 35485.0 2119.044
// app.component.ts:53 BTCUSDT_210625 35467.6 2584.477
// app.component.ts:53 YFIUSDT 42157.0 2323.535
// app.component.ts:53 BTCBUSD 35485.0 2119.044
// app.component.ts:53 BTCUSDT_210625 35467.6 2584.477

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
