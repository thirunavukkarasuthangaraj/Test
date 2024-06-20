import { environment } from 'src/environments/environment';
import { Console } from 'console';
import { Component, OnInit} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import  pakageJson  from '../../../../package.json';
 @Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss' ,  "../../../assets/newassets/custom.css",  "../../../assets/newassets/bootstrap/css/bootstrap.min.css"]
})
export class FooterComponent implements OnInit {

  newslatter: UntypedFormGroup;

  // to get version from package file
  public versions:any=pakageJson.version;
  public envName:any=environment.name;

  constructor(private fb: UntypedFormBuilder ,private router: Router,private aroute: ActivatedRoute) { }

  letterArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  profDirectoryUrl :String = environment.directoryUrl + 'directory/hcp';
  orgDirectoryUrl :String = environment.directoryUrl + 'directory/hco'

  ngOnInit() {
     this.newslatter = this.fb.group({
      news: ['', Validators.required]
    });

  }

  scrollTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  getvalue(value){
    // window.location.href = environment.directoryUrl +`directory/hcp/specality/all/professional?name=${value}&page=1`
  }

}
