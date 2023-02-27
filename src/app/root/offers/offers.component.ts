import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offer_modalaction=0;
  constructor() { }

  ngOnInit(): void {
  }

  offerModal(action){
    this.offer_modalaction=action;
  }

  statusInactive(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be active Offers / Scheme!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Active it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Offers / Scheme status updated successfully...', 'success');
      }
    });
  }

  statusActive(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be inactive Offers / Scheme!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Inactive it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Offers / Scheme status updated successfully...', 'success');
      }
    });
  }

  setDefault(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be show this Offers / Scheme in default login!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Default it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success!', 'Offers / Scheme default set successfully...', 'success');
      }
    });
  }
}
