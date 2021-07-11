import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BtcPage } from './btc.page';

const routes: Routes = [
  {
    path: '',
    component: BtcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BtcPageRoutingModule {}
