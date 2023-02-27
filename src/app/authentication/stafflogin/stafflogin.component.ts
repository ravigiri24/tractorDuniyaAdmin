import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-stafflogin',
  templateUrl: './stafflogin.component.html',
  styleUrls: ['./stafflogin.component.scss']
})
export class StaffloginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public api: ApiService,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar
  ) // private authenticationService: AuthenticationService,
  // private alertService: AlertService
  {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      staff_rfid: [''],
      staff_user: [''],
      staff_password: [''],
      staff_type: ['CAPTAIN'],
      token: [''],
    });
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  check_authorizartion() {
    if (this.loginForm.valid) {
      this.loginForm.value.token = this.api.getsession("token")
      this.api
        .postapi('staff_login', this.loginForm.value)
        .subscribe((res: any) => {
          if (res.status == 1) {
            let staff_detail = res.records;
            console.log(staff_detail);
            this.share.set_session_staffQR(staff_detail);
            this.showNotification('snackbar-success', "Login Successfully", 'bottom', 'center');
            this.router.navigate(['/root/stafftables']);
          } else {
            this.showNotification('snackbar-danger', "Invalid Access!", 'bottom', 'center');
            // alert('Invalid Access!');
          }
        });
    }
  }


}
