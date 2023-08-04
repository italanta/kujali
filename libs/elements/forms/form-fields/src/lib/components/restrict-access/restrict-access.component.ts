import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-restrict-access',
  templateUrl: './restrict-access.component.html',
  styleUrls: ['./restrict-access.component.scss'],
})
export class RestrictAccessComponent implements OnChanges {

  @Input() restrictionFormGroup: FormGroup;

  isAccessRestricted: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['restrictionFormGroup'].currentValue) {
      this.isAccessRestricted = this.restrictionFormGroup.get('restricted')?.value;
    }
  }

  accessRestricted(restricted: MatSlideToggleChange) {
    this.isAccessRestricted = restricted.checked;
    if (!this.isAccessRestricted) this.restrictionFormGroup.get('accessibleBy')?.setValue([]);    
  }
}
