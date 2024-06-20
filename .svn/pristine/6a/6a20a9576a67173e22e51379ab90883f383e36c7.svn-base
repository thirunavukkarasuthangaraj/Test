import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => {
      let name = item.name && item.name != null ? item.name : item.groupName;
      return name.indexOf(filter) !== -1;
    });
  }
}
