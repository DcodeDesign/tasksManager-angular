import {Component, OnInit} from '@angular/core';
import {DataTasksService} from '../../Services/data-tasks.service';
import {ITasks} from '../../Interfaces/ITasks';

@Component({
  selector: 'app-tasks',
  templateUrl: './Tasks.component.html',
  styleUrls: ['./Tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasks: ITasks[];
  private arrayTasks: Array<ITasks> = [];
  public arrayOpenTimer: Array<ITasks> = [];
  public timerTaskActive: ITasks;
  public editCurrentTask: any;
  public timerCurrentTask: any;
  public actionCreate = true;
  public actionSearch = false;
  public editTaskActive: boolean;
  public values = '';

  constructor(private dataTasksService: DataTasksService) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  public getTasks(): void {
    this.dataTasksService.getTasks()
      .subscribe(
        (value: ITasks[]) => {
          this.tasks = value;
          this.editTaskActive = false;
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Get task is completed !');
        }
      );
  }

  // tslint:disable-next-line:typedef
  public actionPrimary(e) {
    const valueActionPrimary = e.target.value;
    console.log(valueActionPrimary);
    if (valueActionPrimary === 'createTask') {
      this.getTasks();
      this.actionCreate = true;
      this.actionSearch = false;
    }

    if (valueActionPrimary === 'searchTask') {
      this.getTasks();
      this.actionCreate = false;
      this.actionSearch = true;
    }
  }


  public actionPrimaryExecute(event: any): void {
    if (this.actionCreate) {
      this.postTask(event);
    }

    if (this.actionSearch) {
      this.saerchTask(event);
    }
  }

  private postTask(event: any): void {
    if (event.key === 'Enter') {
      this.values = event.target.value;
      event.target.value = '';
      const name = this.values.trim();
      const isTerminated = false;
      if (!name) {
        return;
      }
      this.dataTasksService.postTask({name, isTerminated} as unknown as ITasks)
        .subscribe(() => {
          this.getTasks();
        });
    }
  }

  private saerchTask(event: any): void {
    if (event.key === 'Enter') {
      this.values = event.target.value;
      event.target.value = '';
      const name = this.values.trim();

      if (!name) {
        return;
      }

      this.dataTasksService.searchTask(this.values)
        .subscribe(
          // @ts-ignore
          (value: ITasks[]) => this.tasks = value,
          (error) => {
            console.log(error);
          },
          () => {
            console.log('completed !');
          });
    }
  }

  public deleteTask(task: ITasks): void {
    this.dataTasksService.deleteTask(task.id)
      .subscribe(
        () => {
          if (this.timerIsOpen(task)) {
            this.selectTimers(task);
          }
          this.getTasks();
        },
        error => {
          console.log(error);
        }
      );
  }

  public multiDeletion(): void {
    for (let i = 0; i < this.arrayTasks.length; i++) {
      this.deleteTask(this.arrayTasks[i]);
    }
  }

  public editTask(task: ITasks): void {
    this.editTaskActive = true;
    this.editCurrentTask = task;
    this.getId(task);
  }

  public getId(task: ITasks): number {
    return task.id;
  }

  public taskIsTerminated(task: ITasks): void {
    task.isTerminated = task.isTerminated === false;
    this.dataTasksService.updateTask(task)
      .subscribe(
        () => {
          this.getTasks();
        },
        error => {
          console.log(error);
        }
      );
  }

  public taskIsFinish(task: ITasks): void {
    task.isTerminated = true;
    this.dataTasksService.updateTask(task)
      .subscribe(
        () => {
          this.getTasks();
        },
        error => {
          console.log(error);
        }
      );
  }

  public selectTask(task: ITasks): void {
    const found = this.arrayTasks.includes(task);
    if (found) {
      const elem = this.arrayTasks.indexOf(task);
      console.log(this.arrayTasks.splice(elem, 1));
    } else {
      this.arrayTasks.push(task);
    }
    this.arrayTasks = [...new Set(this.arrayTasks)];
    console.log(this.arrayTasks);
  }

  public multiFinish(): void {
    for (let i = 0; i < this.arrayTasks.length; i++) {
      this.taskIsFinish(this.arrayTasks[i]);
    }
  }

  public timerDialog(task: ITasks): void {
    this.selectTimers(task);
    this.timerCurrentTask = task;
    this.timerTaskActive = task;
    console.log('Timer ouvert : ' + this.timerCurrentTask.id);
  }

  public selectTimers(task: ITasks): void {
    const foundTimer = this.arrayOpenTimer.includes(task);
    if (foundTimer) {
      const elem = this.arrayOpenTimer.indexOf(task);
      this.arrayOpenTimer.splice(elem, 1);
    } else {
      this.arrayOpenTimer.push(task);
    }
    this.arrayOpenTimer = [...new Set(this.arrayOpenTimer)];
    console.log(this.arrayOpenTimer);
  }

  public timerIsOpen(task: ITasks): boolean {
    const foundTimer = this.arrayOpenTimer.includes(task);
    if (foundTimer) {
      return true;
    } else {
      return false;
    }
  }

  public closeTimer(task: ITasks): void {
    this.timerIsOpen(task);
  }
}
