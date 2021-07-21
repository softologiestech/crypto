import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  info: any = {};
  data: any = {};

  constructor(
    private router: Router,
    private dataService: DataService,
    private alertController: AlertController
  ) {
    this.info = this.router.getCurrentNavigation().extras.state;
    // console.log(this.info);
  }

  ngOnInit() {
    setInterval(() => {
      this.dataService.getData().then((data: any) => {
        var array = JSON.parse(data.data);

        for (var key in array) {
          if (array[key]['name'] === this.info.value['name']) {
            this.data = {
              ...array[key],
              margin: this.info.value['margin'],
              lot_size: this.info.value['lot_size'],
            };
          }
        }

        // console.log(this.data);
      });
    }, 1000);
  }

  convert(val) {
    return parseFloat(val);
  }

  async presentAlert(d: any) {
    const alert = await this.alertController.create({
      header: d.name,
      cssClass: 'alert',
      buttons: [
        {
          text: 'Bid',
          handler: () => {},
        },
        {
          text: 'Stop Loss',
          handler: () => {},
        },
        {
          text: 'Buy',
          cssClass: 'buy',
          handler: () => {},
        },
        {
          text: 'Sell',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  goto(d: any) {
    this.router.navigate(['/new-order'], {
      state: d,
    });
  }

  goto1(d: any) {
    this.router.navigate(['/new-order1'], {
      state: d,
    });
  }
}
