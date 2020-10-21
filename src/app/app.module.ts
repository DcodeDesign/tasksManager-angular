// @ts-ignore
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// COMPONENTS
import { TasksComponent } from './Components/tasks/Tasks.component';

// IMPORTS
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditTaskComponent } from './Components/edit-task/edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
