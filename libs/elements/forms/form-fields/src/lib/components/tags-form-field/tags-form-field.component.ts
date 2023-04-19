import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { TranslateService } from '@ngfi/multi-lang';

import { Tags } from '@app/model/tags';

import { TagsService, TagsStore } from '@app/state/tags'

@Component({
  selector: 'kujali-crm-tags-form-field',
  templateUrl: './tags-form-field.component.html',
  styleUrls: ['./tags-form-field.component.scss']
})
export class TagsFormFieldComponent implements OnInit, AfterViewInit, OnDestroy {

  private _sbS = new SubSink();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  tagCtrl = new FormControl([Validators.required]);
  tags$: Observable<Tags[]>;

  selectable = false;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  filteredTags: Observable<string[]>;
  allTags: any = [];
  tags: string[] = [];

  showTagsb = false;
  canEdit: boolean = false;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService: TranslateService,
              private _cdf: ChangeDetectorRef,
              private _tags$$: TagsStore,
              private _tagsService: TagsService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.tags$ = this._tags$$.get();
    this._sbS.sink = this.tags$.subscribe((tags) => {
      this.allTags = tags.map(tag => {
        return tag.id
      })
    })

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith('' as any),
      map((tag: string | '') => {
        return tag ? this._filter(tag) : this.allTags?.slice();
      }));
  }

  ngAfterViewInit() {
    this._cdf.detectChanges();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  add(event: MatChipInputEvent): void {
    if (this.canEdit == false) {
      this._tagsService.addTag(event, this.tags, this.tagCtrl);
    }
  }

  remove(tag: string): void {
    if (this.canEdit == false) {
      this._tagsService.removeTag(tag, this.tags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._tagsService.selectedTag(event, this.tags, this.tagInput, this.tagCtrl);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}