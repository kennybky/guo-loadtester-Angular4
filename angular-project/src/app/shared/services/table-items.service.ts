import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableItemsService {

  constructor() { }

        addSelectedAttr(item) {
        item["selected"] = false;
        return item;
      }

        getSelectedItems(items) {
        if (items !== undefined) {
          var selectedItems = items.filter(function (item) {
            return item.selected === true;
          });
          return selectedItems;
        }
      }

        getSelectedItem(items) {
        return items.find(function (item) {
          return item.selected;
        });
      }

        selectAll(items, selectAll) {
        items.forEach(function (item) {
          if (selectAll) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
      }

}
