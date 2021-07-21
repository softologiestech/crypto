import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  id: string = localStorage.getItem('id');
  history: Array<any> = [];

  constructor(
    private walletService: WalletService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.id = localStorage.getItem('id');
    }, 1000);

    this.walletService
      .getHistoryDetails(this.id)
      .valueChanges()
      .subscribe((data) => {
        this.history = data;

        // console.log(this.history);
      });
  }

  itemHeightFn(item, index) {
    return 130;
  }

  remove(data: any) {
    this.walletService.removeSellHistory(this.id, data.transactionId);
  }
}
