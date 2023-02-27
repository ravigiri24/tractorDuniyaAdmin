import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationExtras,
  Data,
} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnInit {

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar
  ) { }
  generatecard_loading
  show_list
  member_details:any={}
  ngOnInit(): void {
  }
  viewDetails() {
    // this.member_details = list;
  }
  member_action
  editDetails(action) {
    this.member_action = action;
    // this.share.set_member_id(list);
    // this.router.navigate(['root/addmember']);
  }

  addMember(action) {
    this.member_action = action;
    // this.router.navigate(['root/addmember']);
  }

  statusInactive() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be active member status!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Active  it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Members status updated successfully...', 'success');
      }
    });
  }

  statusActive() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be inactive member status!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Active  it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Members status updated successfully...', 'success');
      }
    });
  }
}
