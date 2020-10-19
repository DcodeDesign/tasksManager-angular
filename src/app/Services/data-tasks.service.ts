import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {ITasks} from '../Interfaces/ITasks';

@Injectable({
  providedIn: 'root'
})
export class DataTasksService {
  private apiUrlTasks = 'http://127.0.0.1:8000/api/tasks';  // URL to web api
  constructor(private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
  };

  // tslint:disable-next-line:typedef
  private log(message: string) {
    console.log(`${message}`);
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getTasks(): Observable<ITasks[]> {
    return this.http.get<ITasks[]>(this.apiUrlTasks)
      .pipe(
        map(data => data['hydra:member'],
          tap(_ => catchError(this.handleError<ITasks[]>('getTasks', [])),
          )
        )
      );
  }

  public postTask(task: ITasks): Observable<ITasks> {
    return this.http.post<ITasks>(this.apiUrlTasks, task, this.httpOptions).pipe(
      tap((newTask: ITasks) => this.log(`Post w/ id=${newTask.id}`)),
      catchError(this.handleError<ITasks>('post Task'))
    );
  }

  public updateTask(task: ITasks): Observable<any> {
    let atId;
    if (task['@id'] !== undefined) {
      atId = task['@id'];
      atId = atId.split('/').pop();
    } else {
      atId = task.id.toString();
      atId = atId.split('/').pop();
    }

    const url = `${this.apiUrlTasks}/${atId}`;
    return this.http.put(url, task, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated todo id=${task.id}`)),
        catchError(this.handleError<any>('updateTask'))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteTask(atId: number): Observable<ITasks> {
    const url = `${this.apiUrlTasks}/${atId}`;

    return this.http.delete<ITasks>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted task id=${atId}`)),
      catchError(this.handleError<ITasks>('delete task'))
    );
  }
}
