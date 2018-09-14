import { Component, OnInit } from '@angular/core';
import DateTimeFormat = Intl.DateTimeFormat;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  date:DateTimeFormat;

  ngOnInit() {
  }

}
