import { Component, OnInit } from '@angular/core';
import DateTimeFormat = Intl.DateTimeFormat;
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private app: AppComponent) { }

  date:DateTimeFormat;
  username: string;
  password: string;
  errorMsg: string;

  ngOnInit() {
  }

  login () {
    this.http.post(`/v1/login?username=${this.username}&password=${this.password}`,null)
      .subscribe( (response: any) => {
      const token = response.message;
      localStorage.setItem("Qos_token", token);
      this.app.setUser();
      this.router.navigateByUrl('newproject');
    }, error => {
      console.log(error);
    });
  }


}
