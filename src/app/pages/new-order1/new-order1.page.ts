import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-order1',
  templateUrl: './new-order1.page.html',
  styleUrls: ['./new-order1.page.scss'],
})
export class NewOrder1Page implements OnInit {
  info: any = {};
  id: string = localStorage.getItem('id');
  newData: any = {};
  userData: any = {};
  counter: number = 1;
  sl: number = 0;
  tp: number = 0;

  constructor(
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
    private db: AngularFirestore,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.info = this.router.getCurrentNavigation().extras.state;
    // console.log(this.info);
  }

  ngOnInit() {
    if (this.id) {
      this.userService.getUserData(this.id).subscribe((data: any) => {
        this.userData = data;

        // console.log(this.userData);
      });
    }

    setInterval(() => {
      this.fetchData();
    }, 500);
  }

  add(n: number) {
    this.counter = this.counter + n;
  }

  subtract(n: number) {
    if (this.counter !== 1) this.counter = this.counter - n;

    return;
  }

  addSL() {
    this.sl += 1;
  }

  addTP() {
    this.tp += 1;
  }

  subtractSL() {
    this.sl -= 1;
  }

  subtractTP() {
    this.tp -= 1;
  }

  convert(val) {
    return parseFloat(val);
  }

  fetchData() {
    this.dataService.getData().then((res) => {
      var data = JSON.parse(res.data);
      // console.log(data);

      for (var k in data) {
        // console.log(data[k]);

        if (data[k].name === this.info.name) {
          this.newData = data[k];
          // console.log(this.newData);
        }
      }
    });
  }

  buy(info: any) {
    // console.log(info);

    // if (this.sl >= info.buy - info.sl)
    //   this.presentToast(`SL can't be less than ${info.sl} points`);
    // else {
    if (this.userData.free_margin >= this.counter * info.margin) {
      this.loadingSpinner();
      var transactionId = Math.random().toString(36).slice(-12);

      this.db
        .doc(`user/${this.id}`)
        .collection('buy_transaction')
        .doc(transactionId)
        .set({
          base_unit: info.base_unit,
          buy: info.buy,
          sell: info.sell,
          margin: info.margin,
          commission: this.userData.commission,
          quantity: this.counter,
          lot_size: info.lot_size,
          trade: 'buy',
          sl: this.sl,
          tp: this.tp,
          at: Date(),
          transactionId,
        })
        .then(() => {
          this.db.doc(`user/${this.id}`).update({
            net_commission:
              this.userData.net_commission + this.userData.commission,
            equity: this.userData.equity - this.userData.commission,
            margin: this.userData.margin + this.counter * info.margin,
            free_margin:
              this.userData.free_margin -
              info.margin * this.counter -
              this.userData.commission,
          });

          // this.margin += this.counter * info.margin;
          // this.free_margin = this.equity - this.margin;

          // localStorage.setItem('margin', this.margin.toString());
          // localStorage.setItem('free_margin', this.free_margin.toString());

          this.router.navigate(['/tabs/trade']);
          this.loadingController.dismiss();
        })
        .catch((err) => {
          console.log(err);
          this.loadingController.dismiss();
        });
    } else this.presentToast('You do not have sufficient funds.');
    // }
  }

  sell(info: any) {
    // var sell_cost = info.margin * this.counter;

    // if (this.sl >= info.sell - info.sl)
    //   this.presentToast(`SL can't be less than ${info.sl} points`);
    // else {
    if (this.userData.free_margin >= this.counter * info.margin) {
      this.loadingSpinner();
      var transactionId = Math.random().toString(36).slice(-12);

      this.db
        .doc(`user/${this.id}`)
        .collection('sell_transaction')
        .doc(transactionId)
        .set({
          buy: info.buy,
          sell: info.sell,
          base_unit: info.base_unit,
          margin: info.margin,
          commission: this.userData.commission,
          quantity: this.counter,
          lot_size: info.lot_size,
          trade: 'sell',
          sl: this.sl,
          tp: this.tp,
          at: Date(),
          transactionId,
        })
        .then(() => {
          this.db.doc(`user/${this.id}`).update({
            net_commission:
              this.userData.net_commission + this.userData.commission,
            equity: this.userData.equity - this.userData.commission,
            margin: this.userData.margin + this.counter * info.margin,
            free_margin:
              this.userData.free_margin -
              info.margin * this.counter -
              this.userData.commission,
          });

          // this.margin += this.counter * info.margin;
          // this.free_margin = this.equity - this.margin;

          // localStorage.setItem('margin', this.margin.toString());
          // localStorage.setItem('free_margin', this.free_margin.toString());

          this.router.navigate(['/tabs/trade']);
          this.loadingController.dismiss();
        })
        .catch((err) => {
          console.log(err);
          this.loadingController.dismiss();
        });
    } else this.presentToast('You do not have sufficient funds.');
    // }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  async loadingSpinner() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Trade In Progress ...',
      translucent: true,
      backdropDismiss: true,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }
}
