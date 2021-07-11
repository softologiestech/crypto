import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InrPage } from './inr.page';

const routes: Routes = [
  {
    path: '',
    component: InrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InrPageRoutingModule {}
