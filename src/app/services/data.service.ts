import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HTTP) {}

  getData() {
    return this.http.get('https://api.wazirx.com/api/v2/tickers', {}, {});
  }
}
