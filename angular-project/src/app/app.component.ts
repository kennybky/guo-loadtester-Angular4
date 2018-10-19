import {Component, OnInit} from '@angular/core';
import {NgbModal} from 'bootstrap';
import {User} from './shared/models/user';
import {Router} from '@angular/router';
import {DataService} from './shared/services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  user:User

  constructor(private router: Router, private dataService: DataService) {

  }

  ngOnInit(): void {
    this.setUser()
  }

  setUser () {
    const token = localStorage.getItem("Qos_token");
    if(token) {
        this.dataService.getUser(token).subscribe((response: any) => {
          this.user = new User(response.id, response.name, response.email, response.username);
        })
    } else {
      this.user = null;
    }
  }

  logout() {
    localStorage.removeItem("Qos_token");
    this.user = null;
    this.router.navigateByUrl('login');
  }
}
