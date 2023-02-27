import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  submitMessage(){
    Swal.fire('Massage!', 'Massage send successfully for applier.', 'success');
  }
}
