import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {DataTasksService} from '../../Services/data-tasks.service';
import {ITasks} from '../../Interfaces/ITasks';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  @Input() editCurrentTask: ITasks;
  @Output() updateCurrentTask = new EventEmitter();
  formValues: ITasks;
  reactForm: FormGroup;

  constructor(private dataTasksService: DataTasksService,
              private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.createForm();
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

  public onSubmit(e): any {
    e.stopPropagation();
    const contactForm = this.reactForm.value;
    this.formValues = {
      // @ts-ignore
      id: contactForm.id,
      name: contactForm.name,
      isTerminated: contactForm.isTerminated
    };

    this.update(this.formValues);
  }

  public createForm(): any {
    this.reactForm = this.formBuilder.group({
      id: this.editCurrentTask.id,
      name: [this.editCurrentTask.name, Validators.compose([Validators.required, Validators.minLength(5)])],
      isTerminated: this.editCurrentTask.isTerminated
    });
  }
}
