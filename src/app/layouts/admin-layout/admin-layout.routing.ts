import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
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

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }


    { path: 'homen',            component: HomenComponent },
    { path: 'usuario',          component: UsuarioComponent },
    { path: 'categoria',        component: CategoriaComponent },
    { path: 'menu',             component: MenuComponent },
    { path: 'area',             component: AreaComponent },
    { path: 'mesa',             component: MesaComponent },
    { path: 'mesa-servicio',    component: MesaServComponent },
    { path: 'cocina',           component: CocinaComponent },
    { path: 'servicios',        component: ServiciosComponent },
    {path:  'pedidos' ,         component: PedidosComponent},
    { path: 'notifications',    component: NotificationsComponent },

    { path: 'dashboard',        component: DashboardComponent },
    { path: 'table-list',       component: TableListComponent },
    { path: 'typography',       component: TypographyComponent },
    { path: 'icons',            component: IconsComponent },
    { path: 'notifications',    component: NotificationsComponent }

    
];
