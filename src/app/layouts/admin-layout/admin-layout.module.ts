import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { HomenComponent } from 'app/homen/homen.component';
import { CategoriaComponent } from 'app/categoria/categoria.component';
import { MenuComponent } from 'app/menu/menu.component';
import { UsuarioComponent } from 'app/usuario/usuario.component';
import { AreaComponent } from 'app/area/area.component';
import { CocinaComponent } from 'app/cocina/cocina.component';
import { MesaComponent } from 'app/mesa/mesa.component';
import { MesaServComponent } from 'app/mesa-serv/mesa-serv.component';
import { ServiciosComponent } from 'app/servicios/servicios.component';
import { PedidosComponent } from 'app/pedidos/pedidos.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    HomenComponent,
    CategoriaComponent,
    MenuComponent,
    UsuarioComponent,
    AreaComponent,
    CocinaComponent,
    MesaComponent,
    MesaServComponent,
    ServiciosComponent,
    PedidosComponent
  ]
})

export class AdminLayoutModule {}
