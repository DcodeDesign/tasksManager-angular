import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer-task',
  templateUrl: './timer-task.component.html',
  styleUrls: ['./timer-task.component.scss']
})
export class TimerTaskComponent implements OnInit {
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

  constructor() {
  }

  ngOnInit(): void {
    this.IdSeconde = document.getElementById('seconde');
    this.IdMinute = document.getElementById('minute');
    this.IdHeure = document.getElementById('heure');
    this.btnStart = document.getElementById('start');
    this.btnStop = document.getElementById('stop');
    this.btnReset = document.getElementById('reset');
    this.clickStartChrono();
    this.clickStopChrono();
    this.clickResetChrono();
  }

  public chronometer(): void {
    this.sec = this.sec + 1;
    let displaySec: any;
    let displayHeure = '';

    if (this.sec < 10) {
      displaySec = '0' + this.sec;
    } else {
      displaySec = this.sec;
    }
    this.IdSeconde.innerText = displaySec;

    if (this.sec === 60) {
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
    if (this.min === 60) {
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
      // @ts-ignore
      this.btnStart.disabled = true;
    });
  }

  public clickStopChrono(): void {
    this.btnStop.addEventListener('click', () => {
      this.stopChrono();
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

}
