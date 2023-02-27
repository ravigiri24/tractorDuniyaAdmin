import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'LockFilter'
})

export class SearchPipe implements PipeTransform {
    transform(value: any, args?: any): any {

        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter(function(item){
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
    // transform(list: any[], filterText: string): any {
    //     return list ? list.filter(item => item.name.search(new RegExp(filterText, 'i')) > -1) : [];}
}
