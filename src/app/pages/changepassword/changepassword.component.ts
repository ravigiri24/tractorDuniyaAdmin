import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, NavigationExtras, Data } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from "../../services/api.service";
import { SharedataService } from "../../services/sharedata.service";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    // returnUrl: string;
    invalid_login = false;
  constructor(    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar,
    private routes: ActivatedRoute) { }
    staff_rfid:any
    sessionData:any={}
  ngOnInit() {
    //this.staff_rfid = sessionStorage.getItem('Staff_rfid');
    //this.sessionData = sessionStorage.getItem('setSession');
    this.sessionData =     this.share.get_staff_detail_session()

    
console.log("ravi",this.sessionData);

  }
  get f() { return this.loginForm.controls; }
  changepass = new FormGroup({
    new: new FormControl('',Validators.required),
    old: new FormControl('', Validators.required),
    new_confirm: new FormControl('', Validators.required),
  

  });
  onSubmit() {
    
}
showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName
  });
}

change_password(){



  if(this.changepass.get('new').value==this.changepass.get('new_confirm').value){
// let sendobj={
//   "staff_rfid":this.staff_rfid,
//   "pass_detail"
// }
console.log(this.changepass.value,this.sessionData,this.changepass.get('old').value,this.sessionData.password	);

if(this.changepass.get('old').value==this.sessionData.password	){

  if(this.changepass.get('old').value!=this.changepass.get('new').value){
    this.changepass.value.id	=this.sessionData.id
    this.changepass.value.loginCode	=this.sessionData.loginCode
    this.api.postapi("changePassword",this.changepass.value).subscribe((res:any)=>{
      if(res.status==1){
        this.showNotification('snackbar-success', res.msg, 'top', 'right');

    this.share.set_staff_detail_session(res.data)
    this.sessionData =     this.share.get_staff_detail_session()

     }
     else{
      this.showNotification('snackbar-danger',res.msg, 'top', 'right');
     }
    })
  }
else{

  this.showNotification('snackbar-danger', "Current Password and New Password should not same", 'top', 'right');
}

}else{
  this.showNotification('snackbar-danger', "Current Password Not Correct", 'top', 'right');
}

  }
else{
  this.showNotification('snackbar-danger', "New Password and Confirm Password should be same", 'top', 'right');

}
}

}
