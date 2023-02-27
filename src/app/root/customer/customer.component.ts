import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customer_action = 1;
  constructor() { }
  ngOnInit(): void {
  }
  editDetails(action) {
    this.customer_action = action;
  }

  addMember(action) {
    this.customer_action = action;
  }
  statusInactive(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be active customer status!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Active it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Customer status updated successfully...', 'success');
      }
    });
  }

  statusActive(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be inactive customer status!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Inactive it!',
    }).then((result) => {
      if (result.value) {
        // Swal.fire('Success!', 'Customer status updated successfully...', 'success');
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be inactive customer status sdjfdsjfjsdbf n saadsa!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Inactive it!',
        }).then((result) => {
          if (result.value) {
            // Swal.fire('Success!', 'Customer status updated successfully...', 'success');
          }
        });
      }
    });
  }

}
