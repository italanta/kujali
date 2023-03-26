import { Injectable } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SubSink } from 'subsink';

import { flatMap as __flatMap } from 'lodash'

import { TagsStore } from '../stores/tags.store';
import { Tags } from '@volk/model/crm/tags';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private _sbS = new SubSink();

  constructor(private _tags$$: TagsStore) {}

  getTagsStore() {
    return this._tags$$.get();
  }

  addTag(event: MatChipInputEvent, tags: string[], tagCtrl: FormControl): void {
    const value = (event.value || '').trim();
    // Add tag
    if (value) {
      tags.push(value);
      tagCtrl.setValue(value);
    }
    // Clear the input value
    event.chipInput?.clear();
    tagCtrl.setValue(null);
  }

  removeTag(tag: string, tags: string[]): void {
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
    }
  }

  selectedTag(
    event: MatAutocompleteSelectedEvent,
    tags: string[],
    tagInput,
    tagCtrl: FormControl
  ): void {
    tags.push(event.option.viewValue);
    tagInput.nativeElement.value = '';
    tagCtrl.setValue(null);
  }

  createTags(tags: string[]) {
    let tagArray = tags.map((tags) => {
      return {
        id: tags,
        label: 'CONTACT.TAG.' + `${tags}`.toUpperCase(),
      };
    });

    if (tagArray.length) {
      tagArray.forEach((tag: Tags) => {
        try {
          this._sbS.sink = this._tags$$.add(tag, tag.id).subscribe();
        } catch (error) {
          throw error
        }
      });
    }
  }
}
