import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-btc',
  templateUrl: './btc.page.html',
  styleUrls: ['./btc.page.scss'],
})
export class BtcPage implements OnInit {
  data: Array<object> = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.getData();
    }, 1000);
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

  gotodata(data: any) {
    this.router.navigate(['/info'], {
      state: data,
    });
  }

  itemHeightFn(item, index) {
    return 155;
  }
}
