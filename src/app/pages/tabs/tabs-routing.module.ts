import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'inr',
        pathMatch: 'full',
      },
      {
        path: 'inr',
        loadChildren: () =>
          import('../inr/inr.module').then((m) => m.InrPageModule),
      },
      {
        path: 'usdt',
        loadChildren: () =>
          import('../usdt/usdt.module').then((m) => m.UsdtPageModule),
      },
      {
        path: 'btc',
        loadChildren: () =>
          import('../btc/btc.module').then((m) => m.BtcPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'trade',
        loadChildren: () =>
          import('../trade/trade.module').then((m) => m.TradePageModule),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('../history/history.module').then((m) => m.HistoryPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
