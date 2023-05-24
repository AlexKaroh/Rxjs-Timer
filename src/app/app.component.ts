import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject, map, fromEvent, debounceTime, filter, buffer, switchMap, Observable, of, startWith, interval } from 'rxjs';

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
  status$ = new BehaviorSubject<Status>('stoped');
  timer$?: Observable<number>;
  lastTime = INIT_VALUE;

  constructor() {}

  ngOnInit() {
    const clicks$ = fromEvent(this.button?.nativeElement, 'click');
    clicks$.pipe(
      buffer(clicks$.pipe(
        debounceTime(CLICK_DURATION)
      )),
      filter(clicks => clicks.length === TWO_CLICKS),
    ).subscribe(() => this.status$.next('waiting'));

    this.status$.pipe(
      switchMap((status) => {
        switch(status) {
          case 'started':
            this.timer$ = interval(SECOND_DURATION).pipe(
              map(() => ++this.lastTime),
              startWith(this.lastTime),
            );
            break;
          case 'stoped':
            this.lastTime = INIT_VALUE;
            this.timer$ = of(INIT_VALUE);
            break;
          case 'waiting':
            this.timer$ = of(this.lastTime);
            break;
          case 'reset': 
            this.status$.next('stoped');
            this.status$.next('started');
            break;
        }
        return of(INIT_VALUE);
      })
    ).subscribe();
  }

  startTimer() {
    this.status$.next('started');
  }

  stopTimer() {
    this.status$.next('stoped');
  }

  waitTimer() {
    this.status$.next('waiting');
  }

  resetTimer() {
    this.status$.next('reset')
  }
}
