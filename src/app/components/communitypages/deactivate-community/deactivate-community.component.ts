import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deactivate-community',
  templateUrl: './deactivate-community.component.html',
  styleUrls: ['./deactivate-community.component.scss']
})
export class DeactivateCommunityComponent implements OnInit {

  communityId:any;
  values: any;
  communityName: any;

  constructor(
    private util:UtilService,
    private API: ApiService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

      // this.route.queryParams.subscribe((res) => {
      //   this.communityId=res.communityId;

      //   if(res.menu){
      //     this.values.menu="communityabout"
      //   }


      //   this.values.communityId=res.communityId;
      //   this.values.userId=res.communityId;
      //     });
        this.communityId=localStorage.getItem('communityId');
        this.companydetailsapicall();
  }

  deactivate(){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure you want to deactivate?',
      text: "You will still be able to retrieve the community after deactivation if you change your mind.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        let deactivatecommunityID= localStorage.getItem('communityId');
        this.API.delete('community/remove/'+ deactivatecommunityID).subscribe(res =>{
          if(res.code==='00000'){
            this.router.navigate(['landingPage'])
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Deactivated successfully.',
              showConfirmButton: false,
              timer: 1500
            })
          }

         },err => {
          this.util.stopLoader();
          if(err.status==500){
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while processing your request. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire({
        //   position: 'center',
        //   icon: 'error',
        //   title: 'Community page is safe ',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
      }
    },err => {
      this.util.stopLoader();
    });

   }

   companydetailsapicall(){
     var data= this.communityId
     if(this.communityId){
        data=  this.communityId;
     }
     this.util.startLoader()
     this.API.query("community/details/"+data).subscribe(res=>{
      this.util.stopLoader()
      //  //// console.log('Community Data :',res)
      //  //// console.log('Logo Data ;',res.logo)
      //  this.communitydata=res;
      //  this.communityTypes=res.communityType;
       this.communityName=res.data.communityDetails.communityName;
      //  this.communitytag=res.tagLine;
      //  this.values.userId=this.userId
      //  this.businesslogs = {  src :AppSettings.photoUrl   + res.logo  }
      //  this.bannerimg = { src :AppSettings.photoUrl   + res.banner }
      //  this.companyHome(res.communityId,res.communityType)

     },err => {
      this.util.stopLoader();
    });

  }

}
