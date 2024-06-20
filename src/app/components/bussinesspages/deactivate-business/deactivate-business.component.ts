import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BUSINESS_STATUS_CODE, GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { BusinessModal } from 'src/app/services/businessModal';
import { CommonValues } from 'src/app/services/commonValues';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deactivate-business',
  templateUrl: './deactivate-business.component.html',
  styleUrls: ['./deactivate-business.component.scss']
})
export class DeactivateBusinessComponent implements OnInit {

  BusinessData: any;

  constructor(
    private util: UtilService,
    private API: ApiService,
    private gigsumoService: GigsumoService,
    private commonValues: CommonValues,
    private router: Router,
  ) { }

  ngOnInit() {
    this.businessupdatedata()
  }


  businessupdatedata() {
    let buserId = localStorage.getItem('businessId');

    this.util.startLoader()
    this.API.query('business/details/' + buserId).subscribe(res => {
      this.util.stopLoader()
      this.BusinessData = res.data.businessModelList[0]
      // console.log('Data', this.BusinessData);
      // Swal.fire('Data', res)
    }, err => {
      this.util.stopLoader();
    });

  }

  deactivate() {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure you want to deactivate?',
      text: "You will still be able to retrieve the business page after by contacting Gigsumo admins via messages.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.checkSuperAdmin();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //  Swal.fire({
        //   position: 'center',
        //   icon: 'info',
        //   title: ' Business page is safe',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
      }
    })
  }


  checkSuperAdmin() {
    this.util.startLoader();
    let data = { userId: localStorage.getItem('userId'), organisationId: this.BusinessData.organisationId };
    this.gigsumoService.isSuperAdmin(data).subscribe(Adminresponse => {

      if (Adminresponse && Adminresponse.code === GigsumoConstants.SUCESSCODE) {
        let businessCode: BUSINESS_STATUS_CODE =
          Adminresponse.data ? Adminresponse.data.businessStatusCode : (Adminresponse.data === null && "00000");


        const adminData: BusinessModal = Adminresponse.data ? Adminresponse.data.businessData : null;
        if (businessCode !== "10003" && adminData && adminData.status === GigsumoConstants.INACTIVE) {
          businessCode = "10003";
        }
        this.util.stopLoader();
        this.showInfoMessage({
          AdminData: adminData,
          content: businessCode
        });

      } else {
        // Handle case where Adminresponse or Adminresponse.code is null
        console.error("Adminresponse or Adminresponse.code is null.");
        this.util.stopLoader();
      }
    });
  }

  showInfoMessage(value: { AdminData: any, content: BUSINESS_STATUS_CODE }) {
    value.content = value.content === "10003" ? "10000" : value.content;
    let data: "NO_MEMBER" | "HAS_MEMBER" | "NOTHING";
    data = (value.content === "10000" || value.content === "00000") ? "NOTHING" :
      value.content === "10001" ? "NO_MEMBER" : "HAS_MEMBER";

    if (data === "NO_MEMBER" || data === "NOTHING") {
      this.deacivateBusiness();
    } else if (data === "HAS_MEMBER") {
      const response = this.gigsumoService.getResponseMessage("DEACTIVATED_BUSINESS", value.AdminData.businessName);
      if (response && response.then) {
        response.then(response => {
          if (response && response.isConfirmed) {
            let data: { businessId: string; businessName: string; menu: string } =
            {
              businessId: value.AdminData.businessId,
              businessName: value.AdminData.businessName,
              menu: "pageadmin"
            };
            this.commonValues.businessid(data);
          }
        });
      }
    }
  }

  deacivateBusiness() {
    this.util.startLoader()
    let deactivateBusinessID = localStorage.getItem('businessId');
    this.API.delete('business/remove/' + deactivateBusinessID).subscribe(res => {
      if (res.code === '00000') {
        this.util.stopLoader()
        this.router.navigate(['landingPage/business'])
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Business page has been deactivated.',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Oops..",
          text: "Something went wrong. Please, try again later.",
          showConfirmButton: false,
          timer: 1500,
        })
      }

    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
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
  }

}
