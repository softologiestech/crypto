import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HTTP, private db: AngularFirestore) {}

  getData() {
    return this.http.get('https://api.wazirx.com/api/v2/tickers', {}, {});
  }

  getCoins() {
    return this.db.collection('coins').valueChanges();
  }

  getLotSizes() {
    return this.db.collection('lot_sizes').valueChanges();
  }
}
