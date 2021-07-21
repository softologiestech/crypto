import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-btc',
  templateUrl: './btc.page.html',
  styleUrls: ['./btc.page.scss'],
})
export class BtcPage implements OnInit {
  id: string = localStorage.getItem('id');
  data: Array<object> = [];
  displaySym: Array<any> = [];
  lot_sizes: Array<any> = [];
  margins: Array<any> = [];
  symbols: Array<any> = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.id = localStorage.getItem('id');
      this.getData();
    }, 500);

    this.getCoins();
    this.getLotSizes();
    this.getMargins();
  }

  getData() {
    this.dataService.getData().then((res: any) => {
      this.data = [];

      var array = JSON.parse(res.data);

      for (var key in array) {
        if (array[key]['quote_unit'] === 'btc') {
          this.data.push(array[key]);
        }
      }

      // console.log(this.data);
    });
  }

  getMargins() {
    this.userService.getMargins().subscribe((res: any) => {
      this.margins = res[0];
      // console.log(this.margins);

      for (var j in this.margins)
        for (var k in this.displaySym) {
          if (this.displaySym[k]['base_unit'] === j.toLowerCase()) {
            this.displaySym[k] = {
              ...this.displaySym[k],
              margin: this.margins[j],
            };

            // console.log(this.displaySym);
          }
        }
    });
  }

  getCoins() {
    this.displaySym = [];

    this.dataService.getCoins().subscribe((res: any) => {
      this.symbols = res[0];
      // console.log(this.symbols);

      for (var j in this.symbols)
        for (var k in this.data) {
          if (this.data[k]['base_unit'] === j.toLowerCase()) {
            this.displaySym.push(this.data[k]);
            // console.log(this.displaySym);
          }
        }
    });
  }

  getLotSizes() {
    this.dataService.getLotSizes().subscribe((res: any) => {
      this.lot_sizes = res[0];
      // console.log(this.lot_sizes);

      for (var j in this.lot_sizes)
        for (var k in this.displaySym) {
          if (this.displaySym[k].base_unit === j.toLowerCase()) {
            this.displaySym[k] = {
              ...this.displaySym[k],
              lot_size: this.lot_sizes[j],
            };

            // console.log(this.displaySym[k]);
          }
        }
    });
  }

  gotodata(data: any) {
    this.router.navigate(['/info'], {
      state: data,
    });
  }

  itemHeightFn(item, index) {
    return 160;
  }
}
