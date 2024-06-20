import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'messageunique',
  pure: false
})
export class MessageuniquePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value !== undefined && value !== null) {
      return _.uniqBy(value, 'messageId');
    }
    return value;
  }

}
