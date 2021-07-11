import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsdtPage } from './usdt.page';

const routes: Routes = [
  {
    path: '',
    component: UsdtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsdtPageRoutingModule {}
