import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inr',
  templateUrl: './inr.page.html',
  styleUrls: ['./inr.page.scss'],
})
export class InrPage implements OnInit {
  id: string = localStorage.getItem('id');
  data: Array<object> = [];
  symbol: string = '';
  displaySym: Array<any> = [];
  lot_sizes: Array<any> = [];
  symbols: Array<any> = [];
  margins: Array<any> = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.id = localStorage.getItem('id');
      this.getData();

      // console.log(this.displaySym);
    }, 500);

    this.getCoins();
    this.getLotSizes();
    this.getMargins();
  }

  getData() {
    this.data = [];

    this.dataService.getData().then((res: any) => {
      var array = JSON.parse(res.data);

      for (var key in array) {
        if (array[key]['quote_unit'] === 'inr') {
          this.data.push(array[key]);
          // console.log(array[key]['base_unit'])
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
      // console.log(this.data);

      for (var j in this.symbols)
        for (var k in this.data) {
          if (this.data[k]['base_unit'] === j.toLowerCase()) {
            this.data[k] = {
              ...this.data[k],
              full_name: this.symbols[j],
            };

            this.displaySym.push(this.data[k]);
            // console.log(j);
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

            // console.log(this.displaySym);
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
    return 180;
  }

  // showSymbol(ev: any) {
  //   console.log(ev.target.value.toUpperCase());
  // }
}
