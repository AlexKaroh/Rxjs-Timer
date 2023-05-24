import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject, map, fromEvent, debounceTime, filter, buffer, switchMap, Observable, of, startWith, interval, Subscription, timer } from 'rxjs';

const INIT_VALUE = 0;
const TWO_CLICKS = 2;
const CLICK_DURATION = 300;
const SECOND_DURATION = 1000;
type Status = 'started'|'stoped'|'waiting'|'reset';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  @ViewChild('button', {static: true}) button?: ElementRef;
  lastTime = INIT_VALUE;
  status$ = new BehaviorSubject<Status>('stoped');
  timer$?: Observable<number>;

  ngOnInit() {
    this.timer$ = this.status$.pipe(
      switchMap((status) => {
        const timer = interval(SECOND_DURATION).pipe(
          startWith(this.lastTime),
          map(() => this.lastTime++),
        );
        switch (status) {
          case 'started':
            return timer;
          case 'stoped':
            this.lastTime = INIT_VALUE;
            return of(0);
          case 'waiting':
            return of(--this.lastTime);
          case 'reset':
            this.lastTime = INIT_VALUE;
            return timer;
        }
      })
    );

    const clicks$ = fromEvent(this.button?.nativeElement, 'click');
    clicks$.pipe(
      buffer(clicks$.pipe(
        debounceTime(CLICK_DURATION)
      )),
      filter(clicks => clicks.length === TWO_CLICKS),
    ).subscribe(() => this.status$.next('waiting'));
  }
}
