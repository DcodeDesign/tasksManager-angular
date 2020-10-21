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
  private static log(message: string) {
    console.log(`${message}`);
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      DataTasksService.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  public getTask(id: number): Observable<ITasks> {
    const url = `${this.apiUrlTasks}/${id}`;
    return this.http.get<ITasks>(url).pipe(
      tap(_ => console.log(`fetched tasks id=${id}`)),
      catchError(this.handleError<ITasks>(`get Task id=${id}`))
    );
  }

  public getTasks(): Observable<ITasks[]> {
    return this.http.get<ITasks[]>(this.apiUrlTasks)
      .pipe(
        map(data => data['hydra:member'],
          tap(() => {
              catchError(this.handleError<ITasks[]>('getTasks', []));
            },
          )
        )
      );
  }

  public postTask(task: ITasks): Observable<ITasks> {
    return this.http.post<ITasks>(this.apiUrlTasks, task, this.httpOptions).pipe(
      tap((newTask: ITasks) => DataTasksService.log(`Post w/ id=${newTask.id}`)),
      catchError(this.handleError<ITasks>('post Task'))
    );
  }

  public updateTask(task: ITasks): Observable<any> {
    let atId;
    if (task['@id'] !== undefined) {
      atId = task['@id'];
      atId = atId.split('/').pop();
    } else {
      // @ts-ignore
      atId = task.id.toString();
      atId = atId.split('/').pop();
    }

    const url = `${this.apiUrlTasks}/${atId}`;
    return this.http.put(url, task, this.httpOptions)
      .pipe(
        // @ts-ignore
        tap(_ => DataTasksService.log(`updated todo id=${task.id}`)),
        catchError(this.handleError<any>('updateTask'))
      );
  }

  deleteTask(atId: number): Observable<ITasks> {
    const url = `${this.apiUrlTasks}/${atId}`;

    return this.http.delete<ITasks>(url, this.httpOptions).pipe(
      tap(_ => DataTasksService.log(`deleted task id=${atId}`)),
      catchError(this.handleError<ITasks>('delete task'))
    );
  }

  searchTask(searchItem: string): Observable<ITasks> {
    const url = `${this.apiUrlTasks}?name=${searchItem}`;
    return this.http.get<ITasks>(url , this.httpOptions).pipe(
      tap(_ => DataTasksService.log(`Search task name=${searchItem}`)),
      catchError(this.handleError<ITasks>('Search task error'))
    );
  }
}
