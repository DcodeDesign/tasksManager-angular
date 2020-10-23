import {AfterViewInit, OnInit, Component, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import {ITasks} from '../../Interfaces/ITasks';
import {DataTasksService} from '../../Services/data-tasks.service';

@Component({
  selector: 'app-timer-task',
  templateUrl: './timer-task.component.html',
  styleUrls: ['./timer-task.component.scss']
})
export class TimerTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() timerCurrentTask: ITasks;
  @Output() updateCurrentTask = new EventEmitter();
  @Output() closeCurrentTask = new EventEmitter();
  public task: ITasks;
  public IdSeconde: HTMLCollectionOf<Element>;
  public IdMinute: HTMLCollectionOf<Element>;
  public IdHeure: HTMLCollectionOf<Element>;
  public btnStart: HTMLCollectionOf<Element>;
  public btnStop: HTMLCollectionOf<Element>;
  public btnReset: HTMLCollectionOf<Element>;
  private btnClose: HTMLCollectionOf<Element>;
  private IdTimer: HTMLElement;
  public interval = null;
  public sec = 0;
  public min = 0;
  public heure = 0;
  private closeDialogClose = false;

  constructor(private dataTasksService: DataTasksService) {
  }

  ngOnInit(): void {
    this.task = this.timerCurrentTask;
  }

  ngAfterViewInit(): void {
    this.IdTimer = document.getElementById(`${this.task.id}`);
    console.log(this.IdTimer);
    this.IdSeconde = this.IdTimer.getElementsByClassName('seconde');
    this.IdMinute = this.IdTimer.getElementsByClassName('minute');
    this.IdHeure = this.IdTimer.getElementsByClassName('heure');
    this.btnStart = this.IdTimer.getElementsByClassName('start');
    this.btnStop = this.IdTimer.getElementsByClassName('stop');
    this.btnReset = this.IdTimer.getElementsByClassName('reset');
    this.btnClose = this.IdTimer.getElementsByClassName('close');
    this.iniTimer();
    this.btnStop[0].setAttribute('disabled', String(true));
    this.clickStartChrono();
    this.clickStopChrono();
    this.clickResetChrono();
    this.clickCloseChrono();
  }

  private iniTimer(): any {
    let id: number;
    id = this.timerCurrentTask.id;
    this.dataTasksService.getTask(id)
      .subscribe(
        (value: ITasks) => {
          if (value.duration !== undefined) {
            this.task.duration = value.duration;
            let array: Array<string>;
            array = this.task.duration.split(':');
            this.heure = parseInt(array[0], null);
            this.min = parseInt(array[1], null);
            this.sec = parseInt(array[2], null);
            if (this.heure < 10) {
              this.IdHeure[0].innerHTML = '0' + this.heure.toString();
            } else {
              this.IdHeure[0].innerHTML = this.heure.toString();
            }
            if (this.min < 10) {
              this.IdMinute[0].innerHTML = '0' + this.min.toString();
            } else {
              this.IdMinute[0].innerHTML = this.min.toString();
            }
            if (this.sec < 10) {
              this.IdSeconde[0].innerHTML = '0' + this.sec.toString();
            } else {
              this.IdSeconde[0].innerHTML = this.sec.toString();
            }
          }
          if (value.dateStart !== undefined) {
            this.task.dateStart = value.dateStart;
          }
          if (value.dateEnd !== undefined) {
            this.task.dateEnd = value.dateEnd;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Get task is completed !');
        }
      );
  }

  private update(data: ITasks): void {
    this.dataTasksService.updateTask(data)
      .subscribe(
        () => {
          if (this.closeDialogClose) {
            this.closeCurrentTask.emit(this.task);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  private play(): any {
    this.task.dateStart = new Date();
    this.update(this.task);
  }

  private save(): any {
    console.log(this.sec);
    if (this.sec !== 0) {
      this.task.dateEnd = new Date();
      this.task.duration = this.heure + ':' + this.min + ':' + this.sec;
      this.update(this.task);
    } else {
      if (this.closeDialogClose) {
        this.closeCurrentTask.emit(this.task);
      }
    }
  }

  private restart(): any {
    this.task.dateStart = null;
    this.task.dateEnd = null;
    this.task.duration = null;
    this.update(this.task);
  }

  public chronometer(): void {
    let displaySec: string;
    let displayMin: string;
    let displayHeure: string;
    this.sec = this.sec + 1;
    if (this.sec < 10) {
      displaySec = '0' + this.sec;
    } else {
      displaySec = this.sec.toString();
    }
    this.IdSeconde[0].innerHTML = displaySec;

    if (this.sec === 59) {
      this.sec = 0;
      this.min = this.min + 1;
      if (this.min < 10) {
        displayMin = '0' + this.min;
      } else {
        displayMin = this.min.toString();
      }
      this.IdMinute[0].innerHTML = displayMin;
    }
    if (this.min === 59) {
      this.sec = 0;
      this.min = 0;
      this.heure = this.heure + 1;
      if (this.heure < 10) {
        displayHeure = '0' + this.heure.toString();
      } else {
        displayHeure = this.heure.toString();
      }
      this.IdHeure[0].innerHTML = displayHeure;
    }
  }

  public startChrono(): void {
    this.interval = setInterval(() => {
      this.chronometer();
    }, 1000);
    /*
        const myNotification = new Notification('Start Chrono', {
            //body: 'Lorem Ipsum Dolor Sit Amet'
        })
        myNotification.onclick = () => {
            console.log('Notification clicked')
        }
    */
  }

  public stopChrono(): void {
    clearInterval(this.interval);
    /*
    const myNotification = new Notification('Stop Chrono', {
        //body: 'Lorem Ipsum Dolor Sit Amet'
    })
    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
    */
  }

  public clickStartChrono(): void {
      this.btnStart[0].addEventListener('click', () => {
      this.btnStart[0].setAttribute('disabled', String(true));
      this.btnStop[0].removeAttribute('disabled');
      this.startChrono();
      this.play();
    });
  }

  public clickStopChrono(): void {
    this.btnStop[0].addEventListener('click', () => {
      this.stopChrono();
      this.save();
      this.btnStart[0].removeAttribute('disabled');
      this.btnStop[0].setAttribute('disabled', String(true));
    });
  }

  public resetChrono(): void {
    this.sec = 0;
    this.min = 0;
    this.heure = 0;
    (this.IdSeconde[0] as HTMLElement).innerText = '00';
    (this.IdMinute[0] as HTMLElement).innerText = '00';
    (this.IdHeure[0] as HTMLElement).innerText = '00';
    this.restart();
  }

  public clickResetChrono(): void {
    this.btnReset[0].addEventListener('click', () => {
      this.resetChrono();
    });
  }

  public clickCloseChrono(): void {
    this.btnClose[0].addEventListener('click', () => {
      this.stopChrono();
      this.closeDialogClose = true;
      this.save();
    });
  }

  ngOnDestroy(): void {
    console.log('close');
    clearInterval(this.interval);
  }
}
