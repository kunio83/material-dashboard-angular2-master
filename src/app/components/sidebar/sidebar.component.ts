import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Home',  icon: 'dashboard', class: '' },
    //{ path: '/homen', title: 'Home',  icon: 'dashboard', class: '' },
    { path: '/usuario', title: 'Usuarios',  icon:'person', class: '' },
    { path: '/categoria', title: 'Categorías',  icon:'menu_book', class: '' },
    { path: '/menu', title: 'Menú',  icon:'restaurant_menu', class: '' },
    { path: '/area', title: 'Áreas',  icon:'domain', class: '' },
    { path: '/mesa', title: 'Mesas',  icon:'table_bar', class: '' },
    { path: '/mesa-servicio', title: 'Asignación de Mesas',  icon:'dinner_dining', class: '' },
    { path: '/cocina', title: 'Cocinas',  icon:'food_bank', class: '' },
    { path: '/servicios', title: 'Mesas activas',  icon:'dinner_dining', class: '' },
    { path: '/pedidos', title: 'Pedidos',  icon:'waving_hand', class: '' },
    { path: '/businessConfig', title: 'Configuración',  icon:'settings', class: '' },

    /*
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: ''},*/
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  existUnreadedNotifications: boolean;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.notificationService.getNotifications().subscribe(notifications => {
      this.existUnreadedNotifications = notifications.some(x => x.readed == false);
    });
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
