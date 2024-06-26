import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ProfilePhoto } from 'src/app/services/profilePhoto';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-social-media-access',
  templateUrl: './social-media-access.component.html',
  styleUrls: ['./social-media-access.component.scss']
})
export class SocialMediaAccessComponent implements OnInit {
  infoData: any;
  userId: any;
  fbConnectedFlag: boolean = false
  linkedinConnectedFlag: boolean = false
  twitterConnectedFlag: boolean = false
  constructor(private api: ApiService,
    private util: UtilService,
    private profilePhoto: ProfilePhoto) {
    // window.scrollTo(0,0);

    
   }

  ngOnInit() {
    this.userId = localStorage.getItem('userId')
    this.photoCall()
  }

  photoCall(){
    this.api.query("user/" + this.userId).subscribe(res=>{
      this.infoData = res
      if(this.infoData.photo!=null &&
        this.infoData.photo!=undefined &&
        this.infoData.photo!=''){
          // this.profilePhoto.setPhoto(this.infoData.photo)
        }else if(this.infoData.photo==null ||
          this.infoData.photo==undefined ||
          this.infoData.photo==''){
            // this.profilePhoto.setPhoto(null)
        }
    },err => {
      this.util.stopLoader(); 
    })
  }

  connectFacebook(){
    this.fbConnectedFlag = true
  }

  disconnectFacebook(){
    this.fbConnectedFlag = false
  }

  connectLinkedin(){
    this.linkedinConnectedFlag = true
  }

  disconnectLinkedin(){
    this.linkedinConnectedFlag = false
  }

  connectTwitter(){
    this.twitterConnectedFlag = true
  }

  disconnectTwitter(){
    this.twitterConnectedFlag = false
  }
}
