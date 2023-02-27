import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedataService } from '../services/sharedata.service';
import { MessagingService } from '../services/messaging.service';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent {
  printstatus: any;
  shownotification: any;
  notificationdetails;
  staff_name;
  staff_img: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private share: SharedataService, private messagingService: MessagingService, private api: ApiService) {
    this.share.title.subscribe(updatedTitle => {
      this.printstatus = updatedTitle;
    });

    this.share.staff_na.subscribe(staff_name => {
      this.staff_name = staff_name
    })

    this.share.staff_img.subscribe(img => {
      // this.staff_img = img
      this.staff_img = 'assets/imgs/default-pic.png'
    })
  }

  title = 'hotelOnlineApplication';
  apic_sync_success = false;
  loading = false;
  staff_detail: any

  ngOnInit(): void {
    this.staff_detail = JSON.parse(sessionStorage.getItem('Staff_all_detail'));
    this.staff_name = this.staff_detail.staff_fname
    this.staff_img = this.staff_detail.full_image
    console.log("    aathis.staff_detail", this.staff_detail);
  }

  onLetfMenuClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "A") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }
  }

  logout() {
    this.api.clearStorage();
    this.api.removesession("Staff_rfid");
    this.router.navigate(['/authentication']);
  }
}

