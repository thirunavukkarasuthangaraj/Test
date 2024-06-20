import { UntypedFormGroup } from '@angular/forms';

export  function pwdMatch(oldPassword: string, newpwd: string) {
  return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[oldPassword];
      const matchingControl = formGroup.controls[newpwd];

      if (matchingControl.errors && !matchingControl.errors.pwdMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      if (control.value === matchingControl.value) {
          matchingControl.setErrors({ pwdMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  };
}
