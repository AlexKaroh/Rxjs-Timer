import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription, timer, BehaviorSubject, map, fromEvent, debounceTime, filter, buffer, interval, switchMap } from 'rxjs';

const INIT_VALUE = 0;
const TWO_CLICKS = 2;
const CLICK_DURATION = 300;

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
  private lastTime = INIT_VALUE;
  private timerSubscription?: Subscription;

  constructor() {}

  ngOnInit() {
    const clicks$ = fromEvent(this.button?.nativeElement, 'click');
    clicks$.pipe(
      buffer(clicks$.pipe(
        debounceTime(CLICK_DURATION)
      )),
      filter(clicks => clicks.length === TWO_CLICKS),
    ).subscribe(() => this.seconds$.next('waiting'));
  }

  activateTimer() {
    this.timerSubscription = this.status$.pipe(
      switchMap((el) => {
        switch(el) {
          case 'started':
            interval(1000).pipe(
              map(() => ++this.lastTime)
            )
          
        }
      })
    ).subscribe()
  }

}
