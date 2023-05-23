import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild, ElementRef, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription, timer, BehaviorSubject, map, fromEvent, debounceTime, scan, auditTime, filter, buffer } from 'rxjs';

const INIT_VALUE = 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('button', {static: true}) button?: ElementRef;
  seconds$ = new BehaviorSubject<number>(INIT_VALUE);
  isTimerWork = false;
  private lastTime = INIT_VALUE;
  private clicksSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor( private cds: ChangeDetectorRef ) {}

  ngOnInit() {
    const clicks$ = fromEvent(this.button?.nativeElement, 'click');
    this.clicksSubscription = clicks$.pipe(
      buffer(clicks$.pipe(
        debounceTime(300)
      )),
      filter(clicks => clicks.length === 2),
    ).subscribe(() => this.waitTimer());
  }

  activateTimer() {
    this.isTimerWork = !this.isTimerWork;
    if (this.isTimerWork) {
      this.timerSubscription = timer(1, 1000).pipe(
        map(val => this.lastTime + val)
      ).subscribe(this.seconds$)
    } else {
      this.lastTime = INIT_VALUE;
      this.seconds$.next(INIT_VALUE);
      this.timerSubscription?.unsubscribe();
    }
  }

  waitTimer() {
    if (this.isTimerWork) {
      this.timerSubscription?.unsubscribe();
      this.lastTime = this.seconds$.value
      this.isTimerWork = !this.isTimerWork;
      this.cds.detectChanges();
    }
  }

  resetTimer() {
    this.lastTime = INIT_VALUE;
    this.timerSubscription?.unsubscribe();
    this.activateTimer();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.clicksSubscription?.unsubscribe();
  }

}
