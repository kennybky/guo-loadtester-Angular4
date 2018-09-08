import { Component, OnInit, Input } from '@angular/core';

class ActionMessage {
  class:String;
  message: String;
}

@Component({
  selector: 'action-message',
  templateUrl: './action-message.component.html',
  styleUrls: ['./action-message.component.css']
})
export class ActionMessageComponent {

  @Input() action: ActionMessage;



}
