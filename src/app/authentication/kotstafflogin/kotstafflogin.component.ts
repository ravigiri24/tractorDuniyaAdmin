import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-kotstafflogin',
  templateUrl: './kotstafflogin.component.html',
  styleUrls: ['./kotstafflogin.component.scss']
})
export class KotstaffloginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  invalid_login = false;
  showlogo: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public api: ApiService,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar
  ) {
    setTimeout(() => {
      this.showlogo = true;
    }, 1200);

  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      staff_rfid: [''],
      staff_user: [''],
      staff_password: [''],
      token: [''],
      staff_type: ['KITCHEN_STAFF'],
    });

  }


  get f() {
    return this.loginForm.controls;
  }

  check_authorizartion() {
    if (this.loginForm.valid) {
      this.loginForm.value.token = this.api.getsession('token');
      this.api.postapi('staff_login', this.loginForm.value)
        .subscribe((res: any) => {
          if (res.status == 1) {
            let staff_detail = res.records;
            this.share.set_session(staff_detail);
            this.share.set_staff_name(res.staff_name)
            this.router.navigate(['/authentication/kitchenkot']);
            this.showNotification('snackbar-success', "Successfully Login!", 'top', 'right');
          } else {
            this.showNotification('snackbar-danger',res.msg, 'bottom', 'center');
          }
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.invalid_login = false;
  }

  closeWidge(action_dis) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be remove this widget!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove  it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Remove!', 'Widget has been removed.', 'success');
      }
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

}
