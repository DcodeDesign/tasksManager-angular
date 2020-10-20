import {Component, OnInit} from '@angular/core';
import {DataTasksService} from '../../Services/data-tasks.service';
import {ITasks} from '../../Interfaces/ITasks';

@Component({
  selector: 'app-tasks',
  templateUrl: './Tasks.component.html',
  styleUrls: ['./Tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasks: ITasks[] ;
  public values = '';
  public test = true;
  public editCurrentTask: any;
  public editTaskActive: boolean;

  constructor(private dataTasksService: DataTasksService) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  public getTasks(): void {
    this.dataTasksService.getTasks()
      .subscribe(
        (value: ITasks[]) => {
          this.tasks = value.reverse();
          this.editTaskActive = false;
          },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('completed !');
        }
      );
  }

  // tslint:disable-next-line:typedef
  public postTask(event: any) { // without type info
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

  public taskFinished(task: ITasks): void {
    if (task.isTerminated === false) {
      task.isTerminated = true;
    } else {
      task.isTerminated = false;
    }
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

  public multiFinish(): void {
    const elem: any = document.getElementsByClassName('multiDeleted');
    document.getElementById('deleteMessage').style.display = 'inline-block';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < elem.length; i++) {
      if (elem[i].checked === true) {
        // tslint:disable-next-line:radix
        this.taskFinished();
      }
    }
  }

}
