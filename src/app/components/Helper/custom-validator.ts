import { Input, Output, Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { CommonValues } from 'src/app/services/commonValues';

@Directive()
export class CustomValidator extends FormValidation {

  constructor() {
    super();
  }
  emailDomain: true;
  static noWhitespaceValidator: ValidatorFn;


  static emailDomainValidator(domain: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // if control value is not undefined, then check if the domain name is valid
      if (control.value !== null) {
        const [_, eDomain] = control.value.split('@'); // split the email address to get the domain name
        return eDomain !== domain // check if the domain name matches the one inside the email address
          ? { emailDomain: true } // return in case there is not match
          : null; // return null if there is a match
      }
      return null; // no error, since there was no input
    };
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    // const oldpassword: string = control.get('oldPassword').value; // get password from our password form control
    const oldpassword: string = control.get('pwd').value; // get password from our password form control
    const password: string = control.get('cpwd').value; // get password from our confirmPassword form control

    if (oldpassword !== password) {

      control.get('cpwd').setErrors({ PassswordMatch: true });
    }

  }

  static emailMatchValidator(control: AbstractControl) {
    const email: string = control.get('email').value;
    const secondaryEmail: string = control.get('secondaryEmail').value;
    // var emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    // if(secondaryEmail !== emailRegEx){
    //   control.get('secondaryEmail').setErrors({ email: true });
    // }
    if (secondaryEmail != undefined &&
      secondaryEmail != null &&
      secondaryEmail != '') {
      if (email === secondaryEmail) {
        control.get('secondaryEmail').setErrors({ emailMatches: true });
      } else {
        control.get('secondaryEmail').setErrors({ emailMatches: false });
      }
    }

  }

  static mustMismatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value == matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  static count: any = 0
  static count1: any = 0
  static stoppingCount: undefined

  static linkDetector(snippedLinkText, searchData) {
    return (formGroup: UntypedFormGroup) => {
      const processText = formGroup.controls[snippedLinkText]
      // var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      var expression = /<a[\s](?!.*\b(title)\b)[^>]+>/
      var regex = new RegExp(expression);
      if (processText.value != null) {
        var a = processText.value.match(regex) || [];

        this.count = this.count + 1

        if (a[0] != undefined) {
          this.count1 = this.count1 + 1
          if (this.count1 == 1) {
            this.stoppingCount = this.count
          }
        }

        if (this.count == this.stoppingCount) {
          var mySubString = a[0].substring(
            a[0].indexOf('href="') + 6,
            a[0].lastIndexOf('" target="_blank"')
          );
          searchData.setWebLinkURL(mySubString)
        }
      }
    }



  }

  static validateEmailDomain(website, email, controls) {
    return (formGroup: UntypedFormGroup) => {
      const webDomain = formGroup.controls[website]
      const emailDomain = formGroup.controls[email]
      const verifyBy = controls.offlineVerification.value
      if (emailDomain.value != null && emailDomain.value != '' &&
        webDomain.value != null && webDomain.value != '' &&
        (verifyBy == false)) {
        //  emailDomain.setValidators([Validators.email, Validators.required])
        var webValue = webDomain.value.split('.')
        var webDomainLength = webValue.length;
        if (webDomainLength >= 2) {
          var webRslt = webValue[webDomainLength - 2] + '.' + webValue[webDomainLength - 1]
        }
        var mailRslt = emailDomain.value.split('@')[1];
        //  console.log(' emailDomain.errors -- ',  emailDomain.errors);
        /* var emailDomainLength = mailRslt.split('.').length
        var web = '';
        console.log(webDomainLength + ' -- '+ emailDomainLength);
        var length = webDomainLength = emailDomainLength;
        if(webDomainLength>=emailDomainLength){
          for (let index = webDomainLength; index >= emailDomainLength; index--) {
               web = webValue[index-1] + web
               if(index > emailDomainLength){
                 web = '.'+web;
               }
               console.log('inside for - ', web);
          }
        }
        console.log('web',web);*/
        if (emailDomain.errors == null || emailDomain.errors['notSameDomain']) {
          if (mailRslt != webRslt) {
            emailDomain.setErrors({ notSameDomain: true })
          } else if (mailRslt == webRslt) {
            emailDomain.setErrors(null)
          }
        }
      } else if (verifyBy == true) {
        //  console.log('098098')
        emailDomain.setErrors(null)
        // if(emailDomain.errors == null){
        // }
      }
    }
  }

  static checkCharCount(v1, commonValues) {
    const data: any = {}
    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]
      var count = va1.value.length
      data.value = 1000 - count

      var temp = va1.value
      const ert = (temp.match(/&nbsp;/g) || []).length;
      if (ert > 0) {
        data.value = data.value + (5 * ert)
        va1.setValidators([Validators.maxLength(1000 + (5 * ert))])
      }

      const qwert = (temp.match('<p><br></p>') || []).length;
      if (qwert > 0) {
        data.value = data.value + (11 * qwert)
        va1.setValidators([Validators.maxLength(1000 + (11 * qwert))])
      }

      commonValues.setCharCount(data)
      // commonValues.set
    }
  }

  static checkCharCount4000(v1, commonValues) {
    const data: any = {}
    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]
      var count = va1.value.length
      data.guidelinesCountValue = 4000 - count

      var temp = va1.value
      const ert = (temp.match(/&nbsp;/g) || []).length;
      if (ert > 0) {
        data.guidelinesCountValue = data.guidelinesCountValue + (5 * ert)
        va1.setValidators([Validators.maxLength(4000 + (5 * ert))])
      }


      const qwert = (temp.match('<p><br></p>') || []).length;
      if (qwert > 0) {
        data.guidelinesCountValue = data.guidelinesCountValue + (11 * qwert)
        va1.setValidators([Validators.maxLength(4000 + (11 * qwert))])
      }


      commonValues.setCharCount(data)
      // commonValues.set
    }
  }
  static checkFormCompletion(v16, v1, v2, v3, v4, v5, v6, v7, v8, v10, v11, v12, v13, v14, v15, v17, commonValues) {
    var profileCompletion: any = {}
    var data: any = {}
    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]

      const va2 = formGroup.controls[v2]
      const va3 = formGroup.controls[v3]
      const va4 = formGroup.controls[v4]
      const va5 = formGroup.controls[v5]
      const va6 = formGroup.controls[v6]
      const va7 = formGroup.controls[v7]
      const va8 = formGroup.controls[v8]
      const va10 = formGroup.controls[v10]
      const va11 = formGroup.controls[v11]
      const va12 = formGroup.controls[v12]
      const va13 = formGroup.controls[v13]
      const va14 = formGroup.controls[v14]
      const va15 = formGroup.controls[v15]
      const va16 = formGroup.controls[v16]
      const va17 = formGroup.controls[v17]

      if (va13.value !== '' && va13.value !== undefined && va13.value !== null && va13.value !== 'null' &&
        va12.value !== '' && va12.value !== undefined && va12.value !== null && va12.value !== 'null' &&
        va11.value !== '' && va11.value !== undefined && va11.value !== null && va11.value !== 'null' &&
        va17.value !== '' && va17.value !== undefined && va17.value !== null && va17.value !== 'null') {

        profileCompletion.location = 5
      } else {
        profileCompletion.location = 0
      }


      var logo = localStorage.getItem('profilePhoto')
      if (logo !== '' && logo !== undefined && logo !== null && logo !== 'null') {
        profileCompletion.photo = 10
      } else {
        profileCompletion.photo = 0
      }

      if (va16.value !== '' && va16.value !== undefined && va16.value !== null && va16.value !== 'null') {
        if (va1.value === 'HEALTHCARE') {
          profileCompletion.pitch = 5
        } else {
          profileCompletion.pitch = 10
        }
      } else {

        profileCompletion.pitch = 0
      }

      var val: boolean;
      commonValues.getValidNPI().subscribe(res => {
        if (res.boolean == true) {
          val = true
        } else if (res.boolean == false) {
          val = false
        }
      })
      if (va2.value !== '' && va2.value !== undefined && va2.value !== null && val == true) {
        if (va1.value !== '' && va1.value !== undefined && va1.value !== null) {
          if (va1.value === 'HEALTHCARE') {
            profileCompletion.npiNo = 5
          } else {
            profileCompletion.npiNo = 0
          }
        }
      }

      if (va6.value !== '' && va6.value !== undefined && va6.value !== null) {

        var das: any = {}
        das.value = 1000 - va6.value.length

        var temp = va6.value
        const count = (temp.match(/&nbsp;/g) || []).length;
        if (count > 0) {
          das.value = das.value + (5 * count)
          va6.setValidators([Validators.maxLength(1000 + (5 * count))])
        }

        const qwert = (temp.match('<p><br></p>') || []).length;
        if (qwert > 0) {
          das.value = das.value + (11 * qwert)
          va6.setValidators([Validators.maxLength(1000 + (11 * qwert))])
        }

        commonValues.setCharCount(das)
        if (va6.value.length >= 140) {
          profileCompletion.aboutMe = 10
        } else {
          profileCompletion.aboutMe = 0
        }
      } else {
        profileCompletion.aboutMe = 0
      }
      if (va7.value !== '' && va7.value !== undefined && va7.value !== null) {
        if (va1.value === 'HEALTHCARE' || va1.value === 'adminPersonnel' || va1.value === 'student') {
          profileCompletion.phoneNo = 5
        } else if (va1.value === 'Other') {
          profileCompletion.phoneNo = 10
        }
      } else {
        profileCompletion.phoneNo = 0
      }

      if (va10.value !== '' && va10.value !== undefined && va10.value !== null) {
        profileCompletion.secondaryEmail = 5
      } else {
        profileCompletion.secondaryEmail = 0
      }

      if (va1.value !== '' && va1.value !== undefined && va1.value !== null) {
        profileCompletion.userType = 5
      } else {
        profileCompletion.userType = 10
      }

      setTimeout(() => {


        if (va14['value'][0].organisationName !== '' && va14['value'][0].organisationName !== undefined && va14['value'][0].organisationName !== null &&
          va14['value'][0].city !== '' && va14['value'][0].city !== undefined && va14['value'][0].city !== null &&
          va14['value'][0].state !== '' && va14['value'][0].state !== undefined && va14['value'][0].state !== null &&
          va14['value'][0].country !== '' && va14['value'][0].country !== undefined && va14['value'][0].country !== null &&
          va14['value'][0].zipcode !== '' && va14['value'][0].zipcode !== undefined && va14['value'][0].zipcode !== null &&
          va14['value'][0].startMonth !== '' && va14['value'][0].startMonth !== undefined && va14['value'][0].startMonth !== null) {

          if (va1.value === 'HEALTHCARE' || va1.value === 'adminPersonnel') {
            profileCompletion.workExperience = 10
          }
        } else {
          profileCompletion.workExperience = 0
        }
        if (va15['value'][0].schoolName !== '' && va15['value'][0].schoolName !== undefined && va15['value'][0].schoolName !== null &&
          va15['value'][0].degree !== '' && va15['value'][0].degree !== undefined && va15['value'][0].degree !== null &&
          va15['value'][0].city !== '' && va15['value'][0].city !== undefined && va15['value'][0].city !== null &&
          va15['value'][0].state !== '' && va15['value'][0].state !== undefined && va15['value'][0].state !== null &&
          va15['value'][0].country !== '' && va15['value'][0].country !== undefined && va15['value'][0].country !== null &&
          va15['value'][0].zipcode !== '' && va15['value'][0].zipcode !== undefined && va15['value'][0].zipcode !== null &&
          va15['value'][0].speciality !== '' && va15['value'][0].speciality !== undefined && va15['value'][0].speciality !== null &&
          va15['value'][0].startMonth !== '' && va15['value'][0].startMonth !== undefined && va15['value'][0].startMonth !== null) {
          if (va1.value === 'HEALTHCARE' || va1.value === 'adminPersonnel') {
            profileCompletion.educationDetail = 10
          } else if (va1.value === 'student') {
            profileCompletion.educationDetail = 20
          } else {
            profileCompletion.educationDetail = 0
          }
        }

        if (profileCompletion.workExperience) {
          totPercentage = totPercentage + profileCompletion.workExperience
        }
        if (profileCompletion.educationDetail) {
          totPercentage = totPercentage + profileCompletion.educationDetail
        }

        data.completePercentage = totPercentage
        commonValues.setUserData(data)
      }, 500);

      if (va1.value === 'HEALTHCARE' || va1.value === 'adminPersonnel') {
        data.organisation = va14.value[0].organisationName
        data.title = va14.value[0].title
      } else if (va1.value === 'Other') {
        profileCompletion.workExperience = 0
        data.title = va14.value[0].title
      } else if (va1.value === 'student') {
        profileCompletion.workExperience = 0
        data.title = "Student"
        data.organisation = va15.value[0].schoolName
      }

      var totPercentage = 5   // email under all circumstances is 5%
      if (profileCompletion.userType) {
        totPercentage = totPercentage + profileCompletion.userType
      }
      if (profileCompletion.npiNo) {
        totPercentage = totPercentage + profileCompletion.npiNo
      }

      if (profileCompletion.location) {
        totPercentage = totPercentage + profileCompletion.location
      }
      // For firstname and last for the given conditions
      if (va1.value === 'HEALTHCARE' || va1.value === 'adminPersonnel' || va1.value === 'student') {
        totPercentage = totPercentage + 10
      } else if (va1.value === 'Other') {
        totPercentage = totPercentage + 20
      }
      if (profileCompletion.photo) {
        totPercentage = totPercentage + profileCompletion.photo
      }
      if (profileCompletion.aboutMe) {
        totPercentage = totPercentage + profileCompletion.aboutMe
      }
      if (profileCompletion.phoneNo) {
        totPercentage = totPercentage + profileCompletion.phoneNo
      }
      if (profileCompletion.secondaryEmail) {
        totPercentage = totPercentage + profileCompletion.secondaryEmail
      }
      if (profileCompletion.pitch) {
        totPercentage = totPercentage + profileCompletion.pitch
      }


      data.completePercentage = totPercentage
      data.firstName = va3.value
      data.lastName = va4.value
      data.city = va11.value
      data.country = va13.value
      data.state = va12.value
      var count = 0
      count = count + 1
      if (count === 1) {
        setTimeout(() => {
          commonValues.setUserData(data)
        }, 500);
      } else if (count > 1) {
        commonValues.setUserData(data)
      }
    }
  }

  static checkBusincessFormCompletion(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, comVal) {
    var profileCompletion: any = {}
    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]
      const va2 = formGroup.controls[v2]
      const va3 = formGroup.controls[v3]
      const va4 = formGroup.controls[v4]
      const va5 = formGroup.controls[v5]
      const va6 = formGroup.controls[v6]
      const va7 = formGroup.controls[v7]
      const va8 = formGroup.controls[v8]
      const va9 = formGroup.controls[v9]
      const va10 = formGroup.controls[v10]
      const va11 = formGroup.controls[v11]
      const va12 = formGroup.controls[v12]
      const va13 = formGroup.controls[v13]
      const va14 = formGroup.controls[v14]
      const va15 = formGroup.controls[v15]
      //
      var data: any = {}

      if (va1.value !== '' && va1.value !== undefined && va1.value !== null) {
        var das: any = {}
        das.value = 1000 - va1.value.length



        var temp = va1.value
        const ert = (temp.match(/&nbsp;/g) || []).length;
        if (ert > 0) {
          das.value = das.value + (5 * ert)
          va1.setValidators([Validators.maxLength(1000 + (5 * ert))])
        }

        const qwert = (temp.match('<p><br></p>') || []).length;
        if (qwert > 0) {
          das.value = das.value + (11 * qwert)
          va1.setValidators([Validators.maxLength(1000 + (11 * qwert))])
        }


        comVal.setCharCount(das)

        if (va1.value.length >= 140) {
          profileCompletion.aboutCompany = 10
        } else {
          profileCompletion.aboutCompany = 0
        }
      } else {
        profileCompletion.aboutCompany = 0
      }

      if (va6.value !== '' && va6.value !== undefined && va6.value !== null) {
        profileCompletion.industryClassification = 5
      } else {
        profileCompletion.industryClassification = 0
      }


      if (Array.isArray(va15.value) && va15.value.length) {
        profileCompletion.tags = 5
      } else {
        profileCompletion.tags = 0
      }

      if (va14.value !== '' && va14.value !== undefined && va14.value !== null) {
        profileCompletion.yearStarted = 5
      } else {
        profileCompletion.yearStarted = 0
      }

      if (va2.value !== '' && va2.value !== undefined && va2.value !== null) {
        profileCompletion.businessName = 5
      } else {
        profileCompletion.businessName = 0
      }

      if (va13.value !== '' && va13.value !== undefined && va13.value !== null) {
        profileCompletion.tagLine = 5
      } else {
        profileCompletion.tagLine = 0
      }
      if (va4.value !== '' && va4.value !== undefined && va4.value !== null) {
        profileCompletion.businessBanner = 10
      } else {
        profileCompletion.businessBanner = 0
      }

      var logo = localStorage.getItem('busLogo')
      if (logo !== null && logo !== undefined && logo !== '' && logo !== 'null') {
        profileCompletion.businessLogo = 10
      } else {
        profileCompletion.businessLogo = 0
      }
      if (va7.value !== '' && va7.value !== undefined && va7.value !== null) {
      }
      if (va11.value !== '' && va11.value !== undefined && va11.value !== null) {
        profileCompletion.companySize = 5
      } else {
        profileCompletion.companySize = 0
      }

      if (va12.value !== '' && va12.value !== undefined && va12.value !== null) {
        profileCompletion.companyType = 5
      } else {
        profileCompletion.companyType = 0
      }

      setTimeout(() => {

        if (va7.value[0] !== '' && va7.value[0] !== null && va7.value[0] !== undefined) {

          if (va7['value'][0].businessPhone !== '' && va7['value'][0].businessPhone !== undefined && va7['value'][0].businessPhone !== null) {
            profileCompletion.businessPhone = 5

          } else {
            profileCompletion.businessPhone = 0
          }

          if (va7['value'][0].businessEmail !== '' && va7['value'][0].businessEmail !== undefined && va7['value'][0].businessEmail !== null) {
            profileCompletion.businessEmail = 10

          } else {
            profileCompletion.businessEmail = 0
          }

          if (va7['value'][0].address1 !== '' && va7['value'][0].address1 !== undefined && va7['value'][0].address1 !== null) {
            profileCompletion.companyLocationDetails = 5

          } else {
            profileCompletion.companyLocationDetails = 0
          }

          if (va7.value[0].primary === true) {
            profileCompletion.currentLocation = 5
          } else {
            profileCompletion.currentLocation = 0
          }

          if (va7['value'][0].businessPhone !== '' && va7['value'][0].businessPhone !== undefined && va7['value'][0].businessPhone !== null) {
            profileCompletion.businessPhone = 5

          } else {
            profileCompletion.businessPhone = 0
          }

          if (va7['value'][0].website !== '' && va7['value'][0].website !== undefined && va7['value'][0].website !== null) {
            profileCompletion.website = 5

          } else {
            profileCompletion.website = 0
          }

          if (va7['value'][0].businessEmail !== '' && va7['value'][0].businessEmail !== undefined && va7['value'][0].businessEmail !== null) {
            profileCompletion.businessEmail = 5

          } else {
            profileCompletion.businessEmail = 0
          }


        }



        if (va9.value[0] !== '' && va9.value[0] !== undefined && va9.value[0] !== null) {
          if (va9['value'][0].monWorking === true || va9['value'][0].tueWorking === true || va9['value'][0].wedWorking === true || va9['value'][0].thrWorking === true ||
            va9['value'][0].friWorking === true || va9['value'][0].satWorking === true || va9['value'][0].sunWorking === true) {
            profileCompletion.workingHours = 10
          } else {
            profileCompletion.workingHours = 0
          }
        }

        if (profileCompletion.businessEmail) {
          totPercentage = totPercentage + profileCompletion.businessEmail
        }
        if (profileCompletion.businessPhone) {
          totPercentage = totPercentage + profileCompletion.businessPhone
        }
        if (profileCompletion.companyLocationDetails) {
          totPercentage = totPercentage + profileCompletion.companyLocationDetails
        }
        if (profileCompletion.currentLocation) {
          totPercentage = totPercentage + profileCompletion.currentLocation
        }
        if (profileCompletion.workingHours) {
          totPercentage = totPercentage + profileCompletion.workingHours
        }
        if (profileCompletion.website) {
          totPercentage = totPercentage + profileCompletion.website
        }

        data.completePercentage = totPercentage
        comVal.setBusinessData(data)

      }, 500);


      var totPercentage = 0
      if (profileCompletion.aboutCompany) {
        totPercentage = profileCompletion.aboutCompany
      }
      if (profileCompletion.businessName) {
        totPercentage = totPercentage + profileCompletion.businessName
      }
      if (profileCompletion.businessBanner) {
        totPercentage = totPercentage + profileCompletion.businessBanner
      }
      if (profileCompletion.businessLogo) {
        totPercentage = totPercentage + profileCompletion.businessLogo
      }
      if (profileCompletion.tagLine) {
        totPercentage = totPercentage + profileCompletion.tagLine
      }
      if (profileCompletion.yearStarted) {
        totPercentage = totPercentage + profileCompletion.yearStarted
      }
      if (profileCompletion.tags) {
        totPercentage = totPercentage + profileCompletion.tags
      }
      if (profileCompletion.companySize) {
        totPercentage = totPercentage + profileCompletion.companySize
      }
      if (profileCompletion.companyType) {
        totPercentage = totPercentage + profileCompletion.companyType
      }

      if (profileCompletion.industryClassification) {
        totPercentage = totPercentage + profileCompletion.industryClassification
      }


      data.completePercentage = totPercentage
      data.businessName = va2.value
      data.IndustryClassifications = va6.value
      data.facilityPracticeType = va3.value
      setTimeout(() => {
        comVal.setBusinessData(data)
      }, 600);

    }

  }





  static jobDescriptionLength(v1) {

    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]
      var temp = va1.value

      if (temp != null) {
        const ert = (temp.match(/&nbsp;/g) || []).length;
        const qwert = (temp.match('<p><br></p>') || []).length;
        const qw = temp.length + (5 * ert + 11 * qwert)

        if (qw <= 200) {
          va1.setValidators([Validators.minLength(0 + ((5 * ert) + (11 * qwert)))])
        } else {
          va1.setValidators([Validators.maxLength(2600 + ((5 * ert) + (11 * qwert)))])
        }
      }
    }
  }

  // private static seperator = /\s+/gmu;
  private static seperator = /&nbsp;/g;


  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      if (value && value != "" && value.length > max) {
        return { maxword: true };
      }
      return null;
    };
  }


  static checkRemaining(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      let remainingCharacters = max;
      remainingCharacters = remainingCharacters - (value && value.length);

      if (value && value != "" && value.length > max) {
        return { maxword: true };
      }
      return { remainingCharacters };
    };
  }

  static validDecimal(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      // Updated pattern to exclude 0, 0.00, and 000000000
      const decimalPattern = /^(?!0$)(?!0\.\d{1,2}$)(?!0{2,9}$)(\d{1,9}|\d{0,8}\.\d{1,2})$/;
      const isValid = decimalPattern.test(value);
      return isValid ? null : { invalidDecimal: { value } };
    };
  }

  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value != null) {
        const wordCount = control.value ? control.value.split(/\s+/) : 0;
        const words = wordCount ? wordCount.length : 0;
        if (words < min) {
          return { minword: true };
        }
      }
      return null;
    };
  }


  static checkValidDomain(domain: Array<string>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email: string = control.value;
      // console.log(email);
      if (email != null && email != "" && email.includes("@")) {
        const dataSplit: string[] = email.split("@")[1].split('.');
        const data = dataSplit[dataSplit.length - 1];
        if (domain.includes(data)) {
          // console.log(data);
          return null;
        }
        else return { valid: true }
      }
      return null;
    }
  }

  static checkWhiteSpace(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      if (value && this.hasWhiteSpace(value) && value.trim().length === 0 && !value.includes("&nbsp;")) {
        return { minword: true }
      }

      return null;
    };
  }

  static minmaxWords(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      let temp: string = control.value;

      if (temp != null && temp != "") {
        const wordCount: number = this.countWords(super.extractContent(temp));
        if (wordCount < min) {
          return { minword: true };
        }
        if (wordCount > max) {
          return { maxword: true };
        }
        return null;
      }
    };
  }
  static maxwords(max: number): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {

      let temp: string = control.value;

      if (temp != null && temp != "") {
        const wordCount: number = this.countWords(super.extractContent(temp));

        if (wordCount > max) {
          return { maxword: true };
        }
        return null;
      }
    };

  }

  static minmaxLetters(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      let temp: string = control.value;

      if (temp != null && temp != "") {
        const wordCount: number = this.countLetters(super.extractContent(temp));
        if (wordCount < min) {
          return { minword: true };
        }
        if (wordCount > max) {
          return { maxword: true };
        }
        return null;
      }
    };
  }

  static teamminmaxLetters(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && typeof value === 'string') {
        const trimmedValue = value.trim(); // Trim leading and trailing spaces
        if (trimmedValue.length < min) {
          return { 'minLetters': true };
        }
        if (trimmedValue.length > max) {
          return { 'maxLetters': true };
        }
      }
      return null;
    };
  }


  static countWords(str : string) {
    const words = str.trim().split(/\s+/);
    return words.length;
  }

  static countLetters(str : string) {
    const words = str.trim().split(/\s+/)[0];
    return words.length;
  }

  static hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  static checkCommunityCompletion(v1, v2, v3, v4, v5, v6, v7, comVal) {
    var das: any = {}
    var profileCompletion: any = {}
    return (formGroup: UntypedFormGroup) => {
      const va1 = formGroup.controls[v1]
      const va2 = formGroup.controls[v2]
      const va3 = formGroup.controls[v3]
      const va4 = formGroup.controls[v4]
      const va5 = formGroup.controls[v5]
      const va6 = formGroup.controls[v6]
      const va7 = formGroup.controls[v7]
      var data: any = {}

      if (va1.value !== '' && va1.value !== undefined && va1.value !== null) {
        profileCompletion.communityName = 10
        data.communityName = va1.value
        comVal.setCommuityData(data)
      } else {
        profileCompletion.communityName = 0
      }

      if (va2.value !== '' && va2.value !== undefined && va2.value !== null) {
        profileCompletion.tagLine = 15
        data.tagLine = va2.value
        comVal.setCommuityData(data)
      } else {
        profileCompletion.tagLine = 0
      }
      if (va3.value !== '' && va3.value !== undefined && va3.value !== null) {
        profileCompletion.communityType = 5
        if (va3.value == false) {
          data.communityType = 'Public'
        } else if (va3.value === true) {
          data.communityType = 'Private'
        }
        comVal.setCommuityData(data)
      } else {
        profileCompletion.communityType = 0
      }

      var logo = localStorage.getItem('communityLogo')
      if (logo !== '' && logo !== undefined && logo !== null && logo !== 'null') {
        profileCompletion.banner = 15

      } else {
        profileCompletion.banner = 0
      }

      if (Array.isArray(va5.value) && va5.value.length) {
        profileCompletion.tags = 10
      } else {
        profileCompletion.tags = 0
      }
      if (va6.value !== '' && va6.value !== undefined && va6.value !== null) {
        das.aboutCountValue = 1000 - va6.value.length


        var temp = va6.value
        const ert = (temp.match(/&nbsp;/g) || []).length;
        if (ert > 0) {
          das.aboutCountValue = das.aboutCountValue + (5 * ert)
          va6.setValidators([Validators.maxLength(1000 + (5 * ert))])
        }


        const qwert = (temp.match('<p><br></p>') || []).length;
        if (qwert > 0) {
          das.aboutCountValue = das.aboutCountValue + (11 * qwert)
          va6.setValidators([Validators.maxLength(1000 + (11 * qwert))])
        }



        comVal.setCharCount(das)
        if (va6.value.length >= 140) {
          profileCompletion.aboutCommunity = 20
        } else {
          profileCompletion.aboutCommunity = 0
        }
      } else {
        profileCompletion.aboutCommunity = 0
      }
      if (va7.value !== '' && va7.value !== undefined && va7.value !== null) {
        // console.log(va7.value)
        das.guidelinesCountValue = 4000 - va7.value.length


        var temp = va7.value
        const ert = (temp.match(/&nbsp;/g) || []).length;
        if (ert > 0) {
          das.guidelinesCountValue = das.guidelinesCountValue + (5 * ert)
          va7.setValidators([Validators.maxLength(4000 + (5 * ert))])
        }

        const qwert = (temp.match('<p><br></p>') || []).length;
        if (qwert > 0) {
          das.guidelinesCountValue = das.guidelinesCountValue + (11 * qwert)
          va7.setValidators([Validators.maxLength(4000 + (11 * qwert))])
        }



        comVal.setCharCount(das)
        if (va6.value.length >= 140) {
          profileCompletion.communityGuidelines = 10
        } else {
          profileCompletion.communityGuidelines = 0
        }
      } else {
        profileCompletion.communityGuidelines = 0
      }
      var totPercentage = 0
      var numberOfFields
      if (profileCompletion.communityName) {
        totPercentage = profileCompletion.communityName
      }
      if (profileCompletion.tagLine) {
        totPercentage = totPercentage + profileCompletion.tagLine
      }
      if (profileCompletion.communityType) {
        totPercentage = totPercentage + profileCompletion.communityType
      }
      if (profileCompletion.banner) {
        totPercentage = totPercentage + profileCompletion.banner
        if (profileCompletion.banner != 0) {
          data.logoExist = true
        }
      }
      if (profileCompletion.tags) {
        totPercentage = totPercentage + profileCompletion.tags
      }
      if (profileCompletion.aboutCommunity) {
        totPercentage = totPercentage + profileCompletion.aboutCommunity
      }
      if (profileCompletion.communityGuidelines) {
        totPercentage = totPercentage + profileCompletion.communityGuidelines
      }

      data.completePercentage = totPercentage
      comVal.setCommuityData(data)
    }

  }

  @Output() completePercentage


  static pinMatch(control: AbstractControl):void {
    const pin: string = control.get('newPin').value; // get password from our password form control
    const cpin: string = control.get('verifyPin').value; // get password from our confirmPassword form control
    // compare is the password math
    if (pin !== cpin) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('verifyPin').setErrors({ NoPassswordMatch: true });
    }
  }

  trimValidator: ValidatorFn = (control: UntypedFormControl) => {
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'control has leading whitespace' }
      };
    }
    if (control.value.endsWith(' ')) {
      return {
        'trimError': { value: 'control has trailing whitespace' }
      };
    }

    return null;
  };


  public noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }


}

