import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'singleSearch'
})
export class SingleSearchPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    return items.filter(singleItem =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }

}
