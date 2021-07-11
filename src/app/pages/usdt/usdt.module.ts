import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsdtPageRoutingModule } from './usdt-routing.module';

import { UsdtPage } from './usdt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsdtPageRoutingModule
  ],
  declarations: [UsdtPage]
})
export class UsdtPageModule {}
