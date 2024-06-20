import { UntypedFormGroup } from '@angular/forms';

export function MustMatch(pwd: string, cpwd: string) {
  return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[pwd];
      const matchingControl = formGroup.controls[cpwd];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  };
}
