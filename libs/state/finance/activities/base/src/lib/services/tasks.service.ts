import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { Activity, Task } from '@app/model/finance/activities';

import { TaskStore } from '../stores/tasks.store';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _tasks$$: TaskStore) { }

  getAllTasks(): Observable<Task[]> {
    return this._tasks$$.get();
  }

  createTask(task: FormGroup): Observable<Task> {
    return this._tasks$$.add(task.value as Task);
  }

  updateActionStatus(action: Activity) {
    return this._tasks$$.update(action).subscribe();
  }
}
