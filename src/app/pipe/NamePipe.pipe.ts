import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namefilter',
  pure: false
})
export class NamePipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item =>
      item.firstName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      item.lastName.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      );
  }
}
