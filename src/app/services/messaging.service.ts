import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'


@Injectable({
    providedIn: 'root'
})
export class MessagingService {
    currentMessage = new BehaviorSubject(null);
    constructor(private angularFireMessaging: AngularFireMessaging) {
        this.angularFireMessaging.messages.subscribe(
            (_messaging: AngularFireMessaging) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            })


    }
    requestPermission() {
        console.log("start token =====>");

        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log('token =====>', token);
                if (token) {
                    sessionStorage.setItem("token", JSON.stringify(token));
                }
                else {
                    console.log('no token =====>');
                }

            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload: any) => {
                console.log("new message received. ", payload);
                //    let start =   JSON.parse(sessionStorage.getItem("Staff_rfid"));
                if (payload.notification.body != "0") {
                    this.playAudio();

                    setTimeout(() => {
                        this.stopAudio();
                    }, 4000);
                }
                this.currentMessage.next(payload.notification.body);

            })
    }
    audio: any;
    playAudio() {
        this.audio = new Audio();
        this.audio.src = "assets/sound/alert_sonar.mp3";
        this.audio.load();
        this.audio.play();
    }

    stopAudio() {

        this.audio.pause();
    }
}
