import { UtilService } from './../../services/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-reset-confirmed',
  templateUrl: './password-reset-confirmed.component.html',
  styleUrls: ['./password-reset-confirmed.component.scss',  "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css"]
})
export class PasswordResetConfirmedComponent implements OnInit {

  constructor(private util: UtilService) { }

  ngOnInit() {
    this.util.stopLoader()
  }

}
