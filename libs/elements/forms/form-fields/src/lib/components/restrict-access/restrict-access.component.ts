import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-restrict-access',
  templateUrl: './restrict-access.component.html',
  styleUrls: ['./restrict-access.component.scss'],
})
export class RestrictAccessComponent {
  @Input() restrictionFormGroup: FormGroup;

  accessRestricted() {
    const access = this.restrictionFormGroup.get('restricted')?.value;

    if (!access) this.restrictionFormGroup.get('accessibleBy')?.setValue([]);
    
    return access;
  }
}
