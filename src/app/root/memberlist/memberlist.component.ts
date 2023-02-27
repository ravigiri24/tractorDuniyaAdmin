import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Data} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss']
})
export class MemberlistComponent implements OnInit {
  get_member_list: any = [];
  member_details: any = [];
  generatecard_loading: false;
  show_list: any = 1;
  member_action = 0;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private share: SharedataService,
    private snackBar: MatSnackBar
  ) { }
  staff_rfid: any
  ngOnInit() {
    this.staff_rfid = sessionStorage.getItem('Staff_rfid');
    let obj = {
      "staff_rfid": this.staff_rfid
    }
    this.api.postapi('memberlist', obj).subscribe((res) => {
      console.log('memberlist', this.get_member_list);
      if (res.length > 1) {
        this.get_member_list = res;
        console.log("All Member List : ", res);
        this.show_list = 0;
      } else {
        console.log('All Members', res);
        this.show_list = 1;
      }
    });
  }

  viewDetails() {
    // this.member_details = list;
  }

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
