import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TradeComponent } from 'src/app/components/trade/trade.component';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage implements OnInit {
  id: string = localStorage.getItem('id');
  userData: any = {};
  filterArray: Array<any> = [];
  buyDetails: Array<any> = [];
  buyDetails1: Array<any> = [];
  sellDetails: Array<any> = [];
  sellDetails1: Array<any> = [];
  data: Array<any> = [];
  equity: number;
  margin: number;
  net_commission: number;
  net: number = 0;
  free_margin: number;
  prft_loss: number;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private walletService: WalletService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.userService.getUserData(this.id).subscribe((res) => {
      this.userData = res;

      this.equity = this.userData.equity;
      this.margin = this.userData.margin;
      this.free_margin = this.userData.free_margin;
      this.net_commission = this.userData.net_commission;
    });

    this.getBuyDetails();
    this.getSellDetails();

    setInterval(() => {
      this.getData();
      this.filterData();
      this.pAndL();

      localStorage.setItem('net', this.net.toString());
    }, 500);
  }

  getBuyDetails() {
    this.walletService
      .getBuyDetails(this.id)
      .valueChanges()
      .subscribe((res: any) => {
        this.buyDetails = res;
        // console.log(this.buyDetails);
      });
  }

  getSellDetails() {
    this.walletService
      .getSellDetails(this.id)
      .valueChanges()
      .subscribe((res: any) => {
        this.sellDetails = res;
        // console.log(this.sellDetails);
      });
  }

  getData() {
    this.dataService.getData().then((res: any) => {
      this.data = JSON.parse(res.data);

      // console.log(data);
    });
  }

  filterData() {
    // console.log(this.userData);
    this.filterArray = [];
    this.buyDetails1 = [];
    this.sellDetails1 = [];

    for (var k in this.buyDetails) {
      // console.log(this.buyDetails[k]);

      for (var j in this.data) {
        if (this.buyDetails[k].name === this.data[j].name) {
          this.filterArray.push({
            name: this.data[j].name,
            current_sell: this.data[j].sell,
            buy: this.buyDetails[k].buy,
            quantity: this.buyDetails[k].quantity,
            lot_size: this.buyDetails[k].lot_size,
          });

          // console.log(this.filterArray);
        }
      }
    }

    for (var k in this.sellDetails) {
      // console.log(this.sellDetails[k].type);

      for (var j in this.data) {
        if (this.sellDetails[k].name === this.data[j].name) {
          this.filterArray.push({
            name: this.data[j].name,
            current_buy: this.data[j].buy,
            expiry_date: this.data[j].expiry_date,
            sell: this.sellDetails[k].sell,
            quantity: this.sellDetails[k].quantity,
            lot_size: this.sellDetails[k].lot_size,
          });

          // console.log(this.filterArray);
        }
      }
    }
  }

  pAndL() {
    var profit,
      loss,
      tempProf,
      tempLoss,
      finalProf: number = 0,
      finalLoss: number = 0;

    for (var k in this.filterArray) {
      // console.log(this.filterArray);

      if (this.filterArray[k].buy) {
        if (this.filterArray[k].buy < this.filterArray[k].current_sell) {
          profit = this.filterArray[k].current_sell - this.filterArray[k].buy;

          tempProf =
            profit *
            this.filterArray[k].lot_size *
            this.filterArray[k].quantity;

          finalProf += tempProf;

          // console.log(`${this.filterArray[k].symbol} profit`, tempProf);

          for (var j in this.buyDetails) {
            if (this.buyDetails[j].name === this.filterArray[k].name) {
              this.buyDetails1.push({
                ...this.buyDetails[j],
                p: tempProf,
              });

              // console.log(this.buyDetails1);
            }
          }
        } else if (this.filterArray[k].buy > this.filterArray[k].current_sell) {
          loss = this.filterArray[k].current_sell - this.filterArray[k].buy;

          tempLoss =
            -loss * this.filterArray[k].lot_size * this.filterArray[k].quantity;

          finalLoss = tempLoss;

          for (var j in this.buyDetails) {
            if (this.buyDetails[j].name === this.filterArray[k].name) {
              this.buyDetails1.push({
                ...this.buyDetails[j],
                l: tempLoss,
              });

              // console.log(this.buyDetails1[j]);
            }
          }

          // console.log(`${this.filterArray[k].symbol} loss`, tempLoss);
        }
      } else if (this.filterArray[k].sell) {
        if (this.filterArray[k].sell < this.filterArray[k].current_buy) {
          profit = this.filterArray[k].current_buy - this.filterArray[k].sell;

          tempProf =
            profit *
            this.filterArray[k].lot_size *
            this.filterArray[k].quantity;

          finalProf += tempProf;

          // console.log(`${this.filterArray[k].symbol} profit`, tempProf);

          for (var j in this.sellDetails) {
            if (this.sellDetails[j].name === this.filterArray[k].name) {
              this.sellDetails1.push({
                ...this.sellDetails[j],
                p: tempProf,
              });

              // console.log(this.sellDetails[j]);
            }
          }
        } else if (this.filterArray[k].sell > this.filterArray[k].current_buy) {
          loss = this.filterArray[k].current_buy - this.filterArray[k].sell;

          tempLoss =
            -loss * this.filterArray[k].lot_size * this.filterArray[k].quantity;

          finalLoss = tempLoss;

          for (var j in this.sellDetails) {
            if (this.sellDetails[j].name === this.filterArray[k].name) {
              this.sellDetails1.push({
                ...this.sellDetails[j],
                l: tempLoss,
              });

              // console.log(this.sellDetails[j]);
            }
          }

          // console.log(`${this.filterArray[k].symbol} loss`, tempLoss);
        }
      }
    }

    // console.log('finalProf', finalProf);
    // console.log('finalLoss', finalLoss);

    this.net = finalProf - finalLoss;

    // console.log(this.buyDetails, this.sellDetails);
  }

  itemHeightFn(item, index) {
    return 140;
  }

  async openTrade(ev: any, data: any) {
    // console.log(data);
    const popover = await this.popoverController.create({
      component: TradeComponent,
      componentProps: { data: data },
      event: ev,
      translucent: false,
    });

    await popover.present();
  }
}
