import { Directive } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl, Validator } from '@angular/forms';

@Directive({
  selector: '[summernoteValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SummernoteValidatorDirective,
      multi: true
    }
  ]
})
export class SummernoteValidatorDirective implements Validator {
  validate(control: UntypedFormControl): { [key: string]: any } | null {
    // Ensure that the control value is a string
    const content = typeof control.value === 'string' ? control.value : '';

    // Now content is guaranteed to be a string, so replace method will work
    const strippedContent = content
      .replace(/<[^>]+>/gm, '') // Remove HTML tags
      .replace(/&nbsp;|&#160;/gi, ' ') // Replace HTML entities
      .trim(); // Trim for any starting or ending whitespace

    // Check if the resulting content is empty
    if (strippedContent === '') {
      // If it's empty after trimming and removing tags, return an error object
      return { 'summernoteEmpty': true };
    }

    // If content is not empty, return null (no error)
    return null;
  }
}
