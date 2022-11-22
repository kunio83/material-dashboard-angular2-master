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
  orderTotal: number;

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

    this.itemStateService.getItemStates2().subscribe(
      res => { this.itemStateList = res as []; });


      /*
    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
      res => {
        res.sort((a, b) => (a.serviceStateId < b.serviceStateId) ? 1 : ((b.serviceStateId < a.serviceStateId) ? -1 : 0));
        this.tableServiceList = res as [];
      });*/

      this.updateList();

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
            serviceEnd: [serv.serviceEnd],
            paymentMethod: [serv.paymentMethod],
            paymentReference: [serv.paymentReference],
            comment: [serv. comment]
          }));
        });
      });
  }

  addItemForm() { 
    this.itemForms.push(this.fb.group({
      id: [0],
      tableServiceId: [this.selectedService.id],
      itemId: [0],
      quantity: [1],
      price: [0],
      orderTime: [new Date()],
      deliveryTime: [null],
      itemStateId: [1]
    }));
  }

  getTableName(tableId: number) {
    var tableName = this.tablelist.find(x => x.id == tableId)
    if (tableName != undefined) {
      return tableName.name;
    }

    return "";
  }

  getUserName(userId: number) {
    var userName = this.userList.find(x => x.id == userId)
    if (userName != undefined) {
      return userName.firstNames;
    }
    return "";
  }

  getStateName(stateId: number) {
    var stateName = this.serviceStateList.find(x => x.id == stateId)
    if (stateName != undefined) {
      return stateName.name;
    }
    return "";
  }

  detalleServicio(servId: number) {
    console.log(this.serviceStateList);
    this.selectedService = this.tableServiceList.find(x => x.id == servId);
    this.itemForms = this.fb.array([]);
    //this.orderTotal = 0;
    this.tableService2ItemsService.getTableService2Items(servId).subscribe(
      res => {
        console.log(res);
        (res as []).forEach((serv: any) => {
          //this.orderTotal+=serv.price * serv.quantity;
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
        this.updateTotal();  
      });   
  }


  recordSubmit(fg: FormGroup) {
    console.log(this.tableService2ItemsService);
    this.tableServiceService.putTableService(fg.value).subscribe(
      (res: any) => {
        this.showNotification('update');
      }
    );
    this.updateList();
  }

  showNotification(categoria){
    switch(categoria){
      case 'insert':
        this.notification = {class: 'text-success', message: 'Guardado Exitosamente'};
        break;
      case 'update':
        this.notification = {class: 'text-primary', message: 'Actualizado Exitosamente'};
        break;
      case 'delete':
        this.notification = {class: 'text-danger', message: 'Eliminado Exitosamente'};
        break;
    }
    setTimeout(() => {
      this.notification = null;
    },3000);
  }

  updateList() {
    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
      res => {
        res.sort((a, b) => (a.serviceStateId < b.serviceStateId) ? 1 : ((b.serviceStateId < a.serviceStateId) ? -1 : 0));
        this.tableServiceList = res as [];
      });
  }

  updateTotal(){
    this.orderTotal = 0;
    this.itemForms.value.forEach(x => {
      this.orderTotal += x.price * x.quantity;
    });
  }


  subRecordSubmit(fg: FormGroup) {
    if(fg.value.id == 0){
      this.tableService2ItemsService.addTableService2Item(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({id: res.id});
          this.showNotification('insert');
        });
    }else{
      this.tableService2ItemsService.updateTableService2Item(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }
    this.updateTotal();
  }

  onDelete(id: number, i: number) {
    if (id == 0){
      this.itemForms.removeAt(i);
      this.updateTotal();
    }
    else if (confirm('¿Seguro que desea eliminarlo definitivamente?')){
      this.tableService2ItemsService.deleteTableService2Item(id).subscribe(
        res => {
          this.itemForms.removeAt(i);
          this.showNotification('delete');
          this.updateTotal();
        });
    }
    
  }

  changeItem(id: number, i:number){
    this.itemForms.controls[i].patchValue({price: this.itemList.find(x => x.id == id).price});
    this.updateTotal();
  }

  changePayment($event, fg: FormGroup)
  {
    let paymentMethod = $event.target.value;
    if (paymentMethod == "efectivo" || paymentMethod == "mercadopago")
    {
      console.log(fg.controls);
      //fg.controls.serviceStateId.value = 4;
    }
    
  }


}
