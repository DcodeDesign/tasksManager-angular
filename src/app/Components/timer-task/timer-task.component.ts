import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITasks} from '../../Interfaces/ITasks';
import {DataTasksService} from '../../Services/data-tasks.service';

@Component({
  selector: 'app-timer-task',
  templateUrl: './timer-task.component.html',
  styleUrls: ['./timer-task.component.scss']
})
export class TimerTaskComponent implements OnInit {
  @Input() timerCurrentTask: ITasks;
  @Output() updateCurrentTask = new EventEmitter();
  public IdSeconde: HTMLElement;
  public IdMinute: HTMLElement;
  public IdHeure: HTMLElement;
  public btnStart: HTMLElement;
  public btnStop: HTMLElement;
  public btnReset: HTMLElement;
  public interval = null;
  public sec = 0;
  public min = 0;
  public heure = 0;
  public task: ITasks;

  constructor(private dataTasksService: DataTasksService) {
  }

  ngOnInit(): void {
    this.IdSeconde = document.getElementById('seconde');
    this.IdMinute = document.getElementById('minute');
    this.IdHeure = document.getElementById('heure');
    this.btnStart = document.getElementById('start');
    this.btnStop = document.getElementById('stop');
    this.btnReset = document.getElementById('reset');
    this.task = this.timerCurrentTask;
    this.iniTimer();
    this.clickStartChrono();
    this.clickStopChrono();
    this.clickResetChrono();
  }

  private iniTimer(): any {
    let id: number;
    id = this.timerCurrentTask.id;
    this.dataTasksService.getTask(id)
      .subscribe(
        // @ts-ignore
        (value: ITasks) => {
          if (value.duration !== undefined) {
            this.task.duration = value.duration;
            let array: Array<string>;
            array = this.task.duration.split(':');
            // tslint:disable-next-line:radix
            this.heure = parseInt(array[0]);
            // tslint:disable-next-line:radix
            this.min = parseInt(array[1]);
            // tslint:disable-next-line:radix
            this.sec = parseInt(array[2]);
            if (this.heure < 10) {
              // @ts-ignore
              this.IdHeure.innerText = '0' + (this.heure);
            } else {
              // @ts-ignore
              this.IdHeure.innerText = this.heure;
            }
            if (this.min < 10) {
              // @ts-ignore
              this.IdMinute.innerText = '0' + this.min;
            } else {
              // @ts-ignore
              this.IdMinute.innerText = this.min;
            }
            if (this.sec < 10) {
              // @ts-ignore
              this.IdSeconde.innerText = '0' + this.sec;
            } else {
              // @ts-ignore
              this.IdSeconde.innerText = this.sec;
            }
          }
          if (value.dateStart !== undefined) {
            this.task.dateStart = value.dateStart;
          }
          if (value.dateEnd !== undefined) {
            this.task.dateEnd = value.dateEnd ;
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

  update(data: ITasks): void {
    this.dataTasksService.updateTask(data)
      .subscribe(
        () => {
          this.getTasks();
          this.updateCurrentTask.emit();
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
    this.task.dateEnd = new Date();
    this.task.duration = this.heure + ':' + this.min + ':' + this.sec;
    this.update(this.task);
  }

  private restart(): any {
    this.task.dateStart = null;
    this.task.dateEnd = null;
    this.task.duration = null;
    this.update(this.task);
  }

  private Close(): any {
    this.save();
  }

  public chronometer(): void {
    console.log(this.heure + ':' + this.min + ':' + this.sec);
    this.sec = this.sec + 1;
    let displaySec: any;
    let displayHeure;
    if (this.sec < 10) {
      displaySec = '0' + this.sec;
    } else {
      displaySec = this.sec;
    }
    this.IdSeconde.innerText = displaySec;

    if (this.sec === 59) {
      // tslint:disable-next-line:no-shadowed-variable
      let displayMin: any;
      this.sec = 0;
      this.min = this.min + 1;
      if (this.min < 10) {
        displayMin = '0' + this.min;
      } else {
        displayMin = this.min;
      }
      this.IdMinute.innerText = displayMin;
    }
    if (this.min === 59) {
      this.sec = 0;
      this.min = 0;
      this.heure = this.heure + 1;
      if (this.heure < 10) {
        displayHeure = '0' + this.heure;
      } else {
        // @ts-ignore
        displayHeure = toString(this.heure);
      }
      this.IdHeure.innerText = displayHeure;
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
    this.btnStart.addEventListener('click', () => {
      this.startChrono();
      this.play();
      // @ts-ignore
      this.btnStart.disabled = true;
    });
  }

  public clickStopChrono(): void {
    this.btnStop.addEventListener('click', () => {
      this.stopChrono();
      this.save();
      // @ts-ignore
      this.btnStart.disabled = false;
    });

  }

  public resetChrono(): void {
    this.sec = 0;
    this.min = 0;
    this.heure = 0;
    this.IdSeconde.innerText = '00';
    this.IdMinute.innerText = '00';
    this.IdHeure.innerText = '00';
  }

  public clickResetChrono(): void {
    this.btnReset.addEventListener('click', () => {
      this.resetChrono();
    });
  }

  public getTasks(): void {
    // @ts-ignore
    this.dataTasksService.getTasks()
      .subscribe(
        // @ts-ignore
        (value: ITasks) => this.editCurrentTask = value,
        (error) => {
          console.log(error);
        },
        () => {
          console.log('completed !');
        }
      );
  }
}
