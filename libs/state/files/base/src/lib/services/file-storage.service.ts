import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {

  constructor(private _aFStorage$$: AngularFireStorage) {}

  async uploadSingleFile(uploadPath: string, file: File) {
    const task = await this._aFStorage$$.upload(uploadPath, file);
    return task.ref;
  }
  
  deleteSingleFile(imageUrl: string) {
    const task = this._aFStorage$$.refFromURL(imageUrl);
    return task.delete();
  }
}
