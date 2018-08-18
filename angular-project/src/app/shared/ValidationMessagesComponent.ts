import { Component, OnInit, ContentChildren, QueryList, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'validation-message',
  template: '<div *ngIf="show"><ng-content></ng-content></div>'
})
export class ValidationMessageComponent {
  @Input() name: string;
  show: boolean = false;

  showsErrorIncludedIn(errors: string[]): boolean {
    return errors.some(error => error === this.name);
  }
}

@Component({
  selector: 'validation-messages',
  template: '<ng-content></ng-content>'
})
export class ValidationMessagesComponent implements OnInit, OnDestroy {
  @Input() form: FormControl;
  @ContentChildren(ValidationMessageComponent) messageComponents: QueryList<ValidationMessageComponent>;

  private statusChangesSubscription: Subscription;

  ngOnInit() {
    this.statusChangesSubscription = this.form.statusChanges.subscribe(x => {
      this.messageComponents.forEach(messageComponent => messageComponent.show = false);

      if (this.form.status === 'INVALID') {
        let firstErrorMessageComponent = this.messageComponents.find(messageComponent => {
          return messageComponent.showsErrorIncludedIn(Object.keys(this.form.errors));
        });

        firstErrorMessageComponent.show = true;
      }
    });
  }

  ngOnDestroy() {
    this.statusChangesSubscription.unsubscribe();
  }
}


