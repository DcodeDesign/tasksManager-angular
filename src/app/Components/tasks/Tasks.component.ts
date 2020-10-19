import {Component, OnInit} from '@angular/core';
import {DataTasksService} from '../../Services/data-tasks.service';
import {ITasks} from '../../Interfaces/ITasks';

@Component({
  selector: 'app-tasks',
  templateUrl: './Tasks.component.html',
  styleUrls: ['./Tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasks: ITasks[] = [];
  values = '';
  public arrayDeleteElem = [];
  test = true;

  constructor(private dataTasksService: DataTasksService) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  public getTasks(): void {
    this.dataTasksService.getTasks()
      .subscribe(
        (value: ITasks[]) => this.tasks = value,
        (error) => {
          console.log(error);
        },
        () => {
          console.log('completed !');
        }
      );
  }

  public add(name: string): void {
    name = name.trim();
    const isTerminated = false;
    if (!name) {
      return;
    }
    this.dataTasksService.postTask({name, isTerminated} as unknown as ITasks)
      .subscribe(task => {
        this.getTasks();
      });
  }

  // tslint:disable-next-line:typedef
  public onPressEnterPostTask(event: any) { // without type info
    if (event.keyCode === 13) {
      this.values = event.target.value;
      this.add(this.values);
      event.target.value = '';
    }
  }

  public delete(task: number): void {
    this.dataTasksService.deleteTask(task)
      .subscribe(
        () => {
          this.getTasks();
        },
        error => {
          console.log(error);
        }
      );
  }

  public multiDeleted(): void {
    const elem: any = document.getElementsByClassName('multiDeleted');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < elem.length; i++) {
      if (elem[i].checked === true) {
        // tslint:disable-next-line:radix
        this.delete( parseInt(elem[i].value));
      }
    }
  }
}
