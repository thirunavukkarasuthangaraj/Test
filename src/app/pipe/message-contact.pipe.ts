import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageContact'
})
export class MessageContactPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter == '') {
      return items;
    }
    return items.filter(item => item.groupType === filter);
  }

}
