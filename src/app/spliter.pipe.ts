import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spliter'
})
export class SpliterPipe implements PipeTransform {

  transform(value: string ): string {
    let s = value.split("_",2);
     return s[1];
  }

}


