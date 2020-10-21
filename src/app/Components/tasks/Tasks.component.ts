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
  public values = '';
  public test = true;
  public editCurrentTask: any;
  public editTaskActive: boolean;
  public actionCreate = true;
  public actionSearch = false;
  private arrayTasks: any = [];

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

  public deleteTask(task: number): void {
    this.dataTasksService.deleteTask(task)
      .subscribe(
        () => {
          this.getTasks();
          document.getElementById('deleteMessage').style.display = 'none';
        },
        error => {
          console.log(error);
        }
      );
  }

  public multiDeletion(): void {
    const elem: any = document.getElementsByClassName('multiDeleted');
    document.getElementById('deleteMessage').style.display = 'inline-block';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < elem.length; i++) {
      if (elem[i].checked === true) {
        // tslint:disable-next-line:radix
        this.deleteTask(parseInt(elem[i].value));
      }
    }
  }

  public editTask(task: ITasks): void {
    this.editTaskActive = true;
    this.editCurrentTask = task;
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
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.arrayTasks.length; i++) {
      this.taskIsFinish(this.arrayTasks[i]);
    }
  }

}
