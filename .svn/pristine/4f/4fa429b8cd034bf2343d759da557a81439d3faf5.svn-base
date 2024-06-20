import { AbstractControl, ValidationErrors } from '@angular/forms';

export class whiteSpaceValidator {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        // if((control.value as string).indexOf(' ') >= 0){
          if((control.value || '').match(/\s/g)){
            return {cannotContainSpace: true};
        }

        return null;
    }

    // static spaceInvalid(control: AbstractControl) : ValidationErrors | null {
    //   if((control.value || '').match((/\?=[a-zA-Z0-9._]/g))){
    //     return {spaceInvalid : true}
    //   }
    //   return null;
    // }
    
}
