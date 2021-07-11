import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BtcPageRoutingModule } from './btc-routing.module';

import { BtcPage } from './btc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BtcPageRoutingModule
  ],
  declarations: [BtcPage]
})
export class BtcPageModule {}
