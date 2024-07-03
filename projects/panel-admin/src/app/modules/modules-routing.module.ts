import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/layouts/layout.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/components/users.component';
import { SideBarComponent } from '../core/layouts/side-bar/side-bar.component';

const routes: Routes = [
  {
    path: '',
    component: SideBarComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'schedule',
        component: CalendarComponent,
      },

      {
        path: 'settings',
        loadChildren: () =>
          import('../core/settings/settings.module').then(
            s => s.SettingsModule
          ),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
