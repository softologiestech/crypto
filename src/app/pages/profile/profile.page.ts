import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  id: string = localStorage.getItem('id');

  constructor(
    public authService: AuthService,
    public popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.id = localStorage.getItem('id');
    });
  }

  // async chatPopover(ev: any) {
  //   const popover = await this.popoverCtrl.create({
  //     component: ChatPopOverComponent,
  //     event: ev,
  //     cssClass: 'popover',
  //     translucent: true,
  //     animated: true,
  //   });
  //   await popover.present();

  //   const { role } = await popover.onDidDismiss();
  //   console.log('onDidDismiss resolved with role', role);
  // }
}
