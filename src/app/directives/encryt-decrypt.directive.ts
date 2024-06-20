import * as CryptoJS from 'crypto-js';
import { HostListener, Input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Directive } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { window } from 'rxjs/operators';


@Directive({
  selector: '[formValues]'
})
export class EncrytDecryptDirective implements OnInit {

  @Input() formName: any

  constructor(private el: ElementRef, private formgroup: FormGroupDirective) { }

  ngOnInit() {

  }

  @HostListener('change') onkeyup() {
    var userid = localStorage.getItem('userId')
    var encrypt = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.formgroup.value), "secret key").toString());
    // console.log(encrypt);
    localStorage.setItem(userid + "_" + this.formName, JSON.stringify(encrypt));

    // var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);



    // var temp : CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(encrypt),"secret key");
    // var decrypt = JSON.parse(temp.toString(CryptoJS.enc.Utf8));

    // localStorage.setItem("Bytes",temp.sigBytes.toString())
    // console.log("decrypt")
    // console.log(decrypt);
  }


  //  @HostListener('click') onclik(){

  //    var name : string= this.formName;
  //   var data  = localStorage.getItem(name);
  //    data = data.slice(1,-1);
  //    console.log(name+"    " +data)

  //   var tempdata= CryptoJS.AES.decrypt(decodeURIComponent(data),"secret key");
  //    var  decrypt = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));
  //   console.log("decrypted data");
  //   console.log(decrypt)
  //   console.log(this.formgroup.value.primarySkills);
  //  }




}
