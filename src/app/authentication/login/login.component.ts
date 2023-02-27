import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  invalid_login = false;
  showlogo: boolean = false;
  subscription_detail: any = {};
  subscription_detail_all: any;
  subscription_popup = 0;
  subscriptionClass = 'subscription_section';
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
      userId: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  check_authorizartion() {
    this.loading = true;
    this.api.postapi('authentication', this.loginForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          this.loading = false;
          this.share.set_staff_detail_session(res.data);
          this.router.navigate(['/root/admindashboard']);
        } else {
          this.loading = false;
          this.showNotification('snackbar-danger', res.msg, 'bottom', 'center');
        }
      },
      (error) => {
        this.loading = false;
        this.showNotification(
          'snackbar-danger',
          'Something is bad..',
          'bottom',
          'center'
        );
      }
    );
  }

  closeSubscription() {
    this.subscriptionClass = 'subscription_section';
    setTimeout(() => {
      this.subscription_popup = 0;
    }, 300);
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
