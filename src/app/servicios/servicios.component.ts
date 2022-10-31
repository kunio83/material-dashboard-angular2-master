import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TableService } from 'app/models/tableService';
import { ItemStateService } from 'app/services/item-state.service';
import { MenuService } from 'app/services/menu.service';
import { MesaService } from 'app/services/mesa.service';
import { TableServiceStateService } from 'app/services/table-service-state.service';
import { TableServiceService } from 'app/services/table-service.service';
import { TableService2ItemService } from 'app/services/table-service2-item.service';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})

export class ServiciosComponent implements OnInit {
  itemForms: FormArray = this.fb.array([]);
  userList: any[];
  serviceStateList: any[];
  tableServiceList: TableService[];
  tablelist: any[];
  itemList: any[];
  itemStateList: any[];
  selectedService: TableService;
  serviceForms: FormArray = this.fb.array([]);
  notification = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private serviceStateService: TableServiceStateService,
    private tableServiceService: TableServiceService,
    private mesaService: MesaService,
    private tableService2ItemsService: TableService2ItemService,
    private menuService: MenuService,
    private itemStateService: ItemStateService
  ) { }


  ngOnInit(): void {
    this.userService.getUsers(environment.tenantId).subscribe(
      res => { this.userList = res as []; });

    this.serviceStateService.getTableServiceStates().subscribe(
      res => { this.serviceStateList = res as []; });

    this.itemStateService.getItemStates().subscribe(
      res => { this.itemStateList = res as []; });

    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
      res => {
        res.sort((a, b) => (a.serviceStateId < b.serviceStateId) ? 1 : ((b.serviceStateId < a.serviceStateId) ? -1 : 0));
        this.tableServiceList = res as [];
      });

    this.mesaService.getMesas(environment.tenantId).subscribe(
      res => { this.tablelist = res as []; });

    this.menuService.getMenu(environment.tenantId).subscribe(
      res => { this.itemList = res as []; });

    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
      res => {
        (res as []).forEach((serv: any) => {
          this.serviceForms.push(this.fb.group({
            id: [serv.id],
            tenantId: [serv.tenantId],
            tableId: [serv.tableId],
            dinerUserId: [serv.dinerUserId],
            diners: [serv.diners],
            userId: [serv.userId],
            serviceStateId: [serv.serviceStateId],
            serviceStart: [serv.serviceStart],
            serviceEnd: [serv.serviceEnd]
          }));
        });
      });
  }

  addItemForm() { }

  getTableName(tableId: number) {
    return this.tablelist.find(x => x.id == tableId).name;
  }

  getUserName(userId: number) {
    return this.userList.find(x => x.id == userId).firstNames;
  }

  getStateName(stateId: number) {
    return this.serviceStateList.find(x => x.id == stateId).name;
  }

  detalleServicio(servId: number) {
    this.selectedService = this.tableServiceList.find(x => x.id == servId);
    this.itemForms = this.fb.array([]);
    this.tableService2ItemsService.getTableService2Items(servId).subscribe(
      res => {
        console.log(res);
        (res as []).forEach((serv: any) => {
          this.itemForms.push(this.fb.group({
            id: [serv.id],
            tableServiceId: [serv.tableServiceId],
            itemId: [serv.itemId],
            quantity: [serv.quantity],
            price: [serv.price],
            orderTime: [serv.orderTime],
            deliveryTime: [serv.deliveryTime],
            itemStateId: [serv.itemStateId]
          }));
        });
      });
      
  }

  recordSubmit(fg: FormGroup) {
    console.log(this.tableService2ItemsService);
    this.tableServiceService.putTableService(fg.value).subscribe(
      (res: any) => {
        this.showNotification();
      }
    );
  }

  showNotification() {
    this.notification = { class: 'text-primary', message: 'Actualizado Exitosamente' };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }


}
