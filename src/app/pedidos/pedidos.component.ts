import { Table } from './../models/table';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TableService2Item } from 'app/models/tablesService2Item';
import { CocinaService } from 'app/services/cocina.service';
import { ItemStateService } from 'app/services/item-state.service';
import { MesaService } from 'app/services/mesa.service';
import { SignalrService } from 'app/services/signalr.service';
import { TableService2ItemService } from 'app/services/table-service2-item.service';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})

export class PedidosComponent implements OnInit {
  //pedidoForms: FormArray = this.fb.array([]);
  pedidoList : TableService2Item [];
  notification = null;
  cocinaList: any[];
  itemStateList: any[];
  tableList: any[];
  cocinaLogin: 0;


  constructor(
    private fb: FormBuilder,
    private tableService2ItemService: TableService2ItemService,
    private itemStateService: ItemStateService,
    private kitchenService: CocinaService,
    private tableService: MesaService,
    private signalRService: SignalrService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {


    this.route.queryParams
    .subscribe(params => {
      this.cocinaLogin = params.cocinaId;
      console.log(this.cocinaLogin)
    })
  

    this.tableService2ItemService.refrestInProgressItems(environment.tenantId);

    

    if(this.cocinaLogin)
    {
      this.tableService2ItemService.getInProgressbyKitchen(this.cocinaLogin).subscribe(
      res => { this.pedidoList = res as TableService2Item[]; });
    }
    else
    {
      this.tableService2ItemService.getInProgressItems(environment.tenantId).subscribe(
      res => { this.pedidoList = res as TableService2Item[];});
    }
    
    this.tableService.getMesas(environment.tenantId).subscribe(
      res => { this.tableList = res as []; });
    
    this.itemStateService.getItemStates().subscribe(
      res => { this.itemStateList = res as []; });

    this.kitchenService.getCocinaLista(environment.tenantId).subscribe(
      res => { 
        this.cocinaList = res as []; 
        console.log(this.cocinaLogin);
        if(this.cocinaLogin)
        {
          this.cocinaList = this.cocinaList.filter(c => c.id == this.cocinaLogin);
        };
      });
  }

  getTableName(tableId: number) {
    var table = this.tableList.find(x => x.id == tableId);
    return table ? table.name : '';
  }

  dateDiff(init) {
    var dateOrder = new Date(init);
    var diff = (new Date().getTime() - dateOrder.getTime()) / (60 * 1000) + 180;
    return Math.trunc(diff) + ':' +  ("0" + Math.trunc((diff - Math.trunc(diff)) * 60)).slice(-2);
  }

  updateItemState(pedido: TableService2Item, itemStateId: number) {
    pedido.itemStateId = itemStateId;
    this.tableService2ItemService.updateTableService2Item(pedido).subscribe(
      res => {
        
        this.signalRService.sendNotificationByAppName('refreshorder', 'optirest-comensal');

        this.notification = { class: 'text-success', message: 'Pedido actualizado' };

        if (itemStateId == 3) {
          this.signalRService.sendNotificationByAppName('Pedido: ' + pedido.item.summary + ' para mesa ' + pedido.tableService.tableId + ' listo', 'optirest-mozo')  ;
        }

        setTimeout(() => this.notification = null, 4000);
      }
    );
  }

  selectCocina(cocinaId : number){
    if(cocinaId == 0){
      this.tableService2ItemService.getInProgressItems(environment.tenantId).subscribe(
        res => { this.pedidoList = res as TableService2Item[]; });
    }
    else{
      this.tableService2ItemService.getInProgressbyKitchen(cocinaId).subscribe(
        res => { this.pedidoList = res as TableService2Item[]; });
    }
  }


}
