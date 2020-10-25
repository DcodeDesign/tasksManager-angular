import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TasksComponent } from './Components/tasks/Tasks.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditTaskComponent } from './Components/edit-task/edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerTaskComponent } from './Components/timer-task/timer-task.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ToggleTaskItemMenuDirective } from './Directives/toggle-task-item-menu.directive';

@NgModule({
  declarations: [
    TasksComponent,
    AppComponent,
    EditTaskComponent,
    TimerTaskComponent,
    ToggleTaskItemMenuDirective
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
