import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  @Input() data: any;
  id: string = localStorage.getItem('id');
  serverData: Array<any> = [];
  tradeData: any; // tradedata is from the api
  counter: number;
  userData: any = {};

  constructor(
    private dataService: DataService,
    private db: AngularFirestore,
    private popoverController: PopoverController,
    private toastController: ToastController
  ) {}

  // data is sent from page

  ngOnInit() {
    console.log(this.data);

    this.counter = this.data.quantity;

    if (this.id) {
      this.db
        .doc(`user/${this.id}`)
        .valueChanges()
        .subscribe((data: any) => {
          this.userData = data;

          // console.log(this.userData);
        });
    }

    setInterval(() => {
      this.id = localStorage.getItem('id');
      this.fetchData();
    }, 500);
  }

  fetchData() {
    this.dataService.getData().then((res: any) => {
      this.serverData = JSON.parse(res.data);

      // console.log(this.serverData);

      this.tradeData = {};

      for (var key in this.serverData) {
        if (this.data.name === this.serverData[key].name) {
          this.tradeData = this.serverData[key];
          // console.log(this.tradeData);
        }
      }
    });
  }

  add(n: number) {
    this.counter = this.counter + n;
  }

  subtract(n: number) {
    if (this.counter !== 1) this.counter = this.counter - n;

    return;
  }

  buy(data: any, tradeData: any) {
    // console.log(data, tradeData);

    var buy_cost = data.margin * this.counter;

    var pl;

    var tradeSell = parseFloat(tradeData.sell);
    var dataBuy = parseFloat(data.buy);

    if (dataBuy < tradeSell)
      pl = (tradeSell - dataBuy) * data.lot_size * this.counter;
    else if (dataBuy > tradeSell)
      pl = -((dataBuy - tradeSell) * data.lot_size * this.counter);

    // console.log(pl, dataBuy, tradeSell, buy_cost);

    if (this.counter === data.quantity) {
      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(tradeData.buy),
          sell: parseFloat(data.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          buy_cost,
          quantity: data.quantity,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'buy',
          pl,
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('sell_transaction')
        .doc(data.transactionId)
        .delete();
    } else if (this.counter < data.quantity) {
      this.db
        .doc(`user/${this.id}`)
        .collection('sell_transaction')
        .doc(data.transactionId)
        .update({
          buy: dataBuy,
          sell: tradeSell,
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          buy_cost,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          pl,
          commission: data.commission + this.userData.commission,
          trade: 'sell',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(tradeData.buy),
          sell: parseFloat(data.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          buy_cost,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          commission: this.userData.commission,
          trade: 'buy',
          pl,
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });
    } else if (
      this.counter > data.quantity &&
      this.userData.free_margin >= buy_cost
    ) {
      this.db
        .doc(`user/${this.id}`)
        .collection('buy_transaction')
        .doc(data.transactionId)
        .set({
          buy: dataBuy,
          sell: tradeSell,
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          buy_cost,
          quantity: this.counter,
          lot_size: data.lot_size,
          pl,
          commission: data.commission + this.userData.commission,
          trade: 'buy',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(tradeData.buy),
          sell: parseFloat(data.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          buy_cost,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'buy',
          pl,
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('sell_transaction')
        .doc(data.transactionId)
        .delete();
    }

    if (this.userData.free_margin >= buy_cost)
      this.db.doc(`user/${this.id}`).update({
        amountInWallet:
          this.userData.amountInWallet +
          pl -
          (this.userData.net_commission + data.commission),
        net_commission:
          data.commission + (this.userData.net_commission + data.commission),
        equity:
          this.userData.equity +
          pl -
          (this.userData.net_commission + data.commission),
        free_margin:
          this.userData.equity +
          pl -
          (this.userData.margin - data.margin * this.counter) -
          (this.userData.net_commission + data.commission),
        margin: this.userData.margin - data.margin * this.counter,
      });
    else if (this.userData.free_margin <= buy_cost)
      this.presentToast('You do not have sufficient funds.');

    this.popoverController.dismiss();
    // this.router.navigate(['/']);
  }

  sell(data: any, tradeData: any) {
    var sell_cost = data.margin * this.counter;
    // console.log(data, tradeData);

    var pl;

    var tradeBuy = parseFloat(tradeData.buy);
    var dataSell = parseFloat(data.sell);

    if (dataSell < tradeBuy)
      pl = (tradeBuy - dataSell) * data.lot_size * this.counter;
    else if (dataSell > tradeBuy)
      pl = -((dataSell - tradeBuy) * data.lot_size * this.counter);

    if (this.counter === data.quantity) {
      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(data.buy),
          sell: parseFloat(tradeData.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          sell_cost,
          pl,
          quantity: data.quantity,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'sell',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('buy_transaction')
        .doc(data.transactionId)
        .delete();
    } else if (this.counter < data.quantity) {
      this.db
        .doc(`user/${this.id}`)
        .collection('buy_transaction')
        .doc(data.transactionId)
        .update({
          buy: parseFloat(data.buy),
          sell: parseFloat(tradeData.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          sell_cost,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'buy',
          pl,
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(data.buy),
          sell: parseFloat(tradeData.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          sell_cost,
          pl,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'sell',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });
    } else if (
      this.counter > data.quantity &&
      this.userData.free_margin >= sell_cost
    ) {
      this.db
        .doc(`user/${this.id}`)
        .collection('sell_transaction')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(data.buy),
          sell: parseFloat(tradeData.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          sell_cost,
          quantity: this.counter - data.quantity,
          lot_size: data.lot_size,
          pl,
          commission: data.commission + this.userData.commission,
          trade: 'sell',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('history')
        .doc(data.transactionId)
        .set({
          buy: parseFloat(data.buy),
          sell: parseFloat(tradeData.sell),
          base_unit: tradeData.base_unit,
          name: tradeData.name,
          sell_cost,
          pl,
          quantity: data.quantity - this.counter,
          lot_size: data.lot_size,
          commission: data.commission + this.userData.commission,
          trade: 'sell',
          sl: data.sl,
          tp: data.tp,
          at: Date(),
          transactionId: data.transactionId,
        });

      this.db
        .doc(`user/${this.id}`)
        .collection('buy_transaction')
        .doc(data.transactionId)
        .delete();

      // this.router.navigate(['/']);
    }

    if (this.userData.free_margin >= sell_cost)
      this.db.doc(`user/${this.id}`).update({
        amountInWallet:
          this.userData.amountInWallet +
          pl -
          (this.userData.net_commission + data.commission),
        net_commission:
          data.commission + (this.userData.net_commission + data.commission),
        equity:
          this.userData.equity +
          pl -
          (this.userData.net_commission + data.commission),
        free_margin:
          this.userData.equity +
          pl -
          (this.userData.margin - data.margin * this.counter) -
          (this.userData.net_commission + data.commission),
        margin: this.userData.margin - data.margin * this.counter,
      });
    else if (this.userData.free_margin <= sell_cost)
      this.presentToast('You do not have sufficient funds.');

    this.popoverController.dismiss();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}
