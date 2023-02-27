import { Component } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import { ApiService } from './services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  notificationdetails;
  shownotification;
  // constructor(private messagingService: MessagingService, private api: ApiService, private router: Router) {
  //   this.messagingService.requestPermission()
  //   this.messagingService.receiveMessage();
  //   this.notificationdetails = this.messagingService.currentMessage;
  //   this.checkPushNotifications();
  // }

  // checkPushNotifications() {
  //   this.messagingService.currentMessage.subscribe(payload => {
  //     if (payload == 0) {
  //       this.api.getpushnotification("1");
  //     }
  //     if (payload && payload != 0) {
  //       this.getdetailsoforder(payload)
  //     }
  //   });
  // }
  bottom_popup_class:any
  overall_bg:any
  closeBottompopup() {
    this.shownotification = null;
  }

  orders_details: any
  // getdetailsoforder(payload) {
  //   var sendObjecttran = {
  //     staff_rfid: sessionStorage.getItem('Staff_rfid'),
  //     place_ids: payload,
  //   };

  //   this.api
  //     .postapi('get_customer_request_detail', sendObjecttran)
  //     .subscribe((res: any) => {


  //       if (res.status == 1) {
  //         this.orders_details = res
  //         this.notificationdetails;
  //         this.shownotification = payload;
  //       }
  //       else {


  //       }

  //     });
  // }

  // gotopos() {
  //   if (sessionStorage.getItem('Staff_rfid') && this.router.url == "/root/pos") {
  //     this.api.getpushnotification(this.shownotification);
  //     this.shownotification = null;
  //   }

  //   else if (sessionStorage.getItem('Staff_rfid') && this.router.url != "/root/pos") {
  //     this.shownotification = null;
  //     this.router.navigate(['root/pos']);

  //   }


  // }

}
