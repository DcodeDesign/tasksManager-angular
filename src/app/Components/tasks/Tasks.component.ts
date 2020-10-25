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
  public arrayTasks: Array<ITasks> = [];
  public arrayOpenTimer: Array<ITasks> = [];
  public timerTaskActive: ITasks;
  public editCurrentTask: any;
  public timerCurrentTask: any;
  public actionCreate = true;
  public actionSearch = false;
  public editTaskActive: boolean;
  public values = '';
  private foundTimer: boolean;

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

  public actionPrimary(e): void {
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

  public deleteTask(e, task: ITasks): void {
    e.stopPropagation();
    this.dataTasksService.deleteTask(task.id)
      .subscribe(
        () => {
          document.getElementsByClassName('message-deleted-' + task.id)[0].classList.remove('show');
          document.getElementById('id-task-' + task.id).style.display = 'none';
          if (this.isSelectedTask(task)) {
            this.selectTask(task);
          }
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

  public multiDeletion(e): void {
    for (const arrayTask of this.arrayTasks) {
      document.getElementsByClassName('message-deleted-' + arrayTask.id)[0].classList.add('show');
      this.deleteTask(e, arrayTask);
    }
  }

  public editTask(e, task: ITasks): void {
    e.stopPropagation();
    this.editTaskActive = true;
    this.editCurrentTask = task;
    this.getId(task);
  }

  public getId(task: ITasks): number {
    return task.id;
  }

  public taskIsTerminated(e, task: ITasks): void {
    e.stopPropagation();
    task.isTerminated = task.isTerminated === false;
    this.dataTasksService.updateTask(task)
      .subscribe(
        () => {
          this.arrayTasks = [];
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

  public isSelectedTask(task: ITasks): boolean {
    return this.foundTimer = this.arrayTasks.includes(task);
  }

  public multiFinish(): void {
    for (const arrayTask of this.arrayTasks) {
      this.taskIsFinish(arrayTask);
    }
  }

  public timerDialog(e, task: ITasks): void {
    e.stopPropagation();
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
    return this.foundTimer = this.arrayOpenTimer.includes(task);
  }

  public closeTimer(task: ITasks): void {
    this.timerIsOpen(task);
  }

  public taskItemMenuShow(e, task: number): void {
    e.stopPropagation();
    document.getElementsByClassName('task-item__menu-' + task)[0].classList.toggle('show');
  }

  public taskItemMenuHidden(e, task: number): void {
    e.stopPropagation();
    document.getElementsByClassName('task-item__menu-' + task)[0].classList.toggle('show');
  }
}
