import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { single } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'  , "../../../assets/newassets/custom.css"]
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    const signup = document.getElementById('signupFree');
    signup.addEventListener('click' , ()=>{
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/signUp"]));
     })
  }

}
