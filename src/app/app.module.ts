import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// COMPONENTS
import { TasksComponent } from './Components/tasks/Tasks.component';

// IMPORTS
import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditTaskComponent } from './Components/edit-task/edit-task.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TimerTaskComponent } from './Components/timer-task/timer-task.component';

@NgModule({
  declarations: [
    TasksComponent,
    AppComponent,
    EditTaskComponent,
    TimerTaskComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
