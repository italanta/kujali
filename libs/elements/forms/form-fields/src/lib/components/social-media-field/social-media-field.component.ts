import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngfi/multi-lang';

@Component({
  selector: 'kujali-crm-social-media-field',
  templateUrl: './social-media-field.component.html',
  styleUrls: ['./social-media-field.component.scss'],
})

export class SocialMediaFieldComponent implements OnInit {

  @Input() socialMediaFields: FormGroup

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService: TranslateService) 
  {}

  ngOnInit() {
    this.lang = this._translateService.initialise();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }
}
