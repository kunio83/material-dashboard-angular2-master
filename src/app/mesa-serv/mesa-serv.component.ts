import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Area } from 'app/models/area';
import { TableService } from 'app/models/tableService';
import { AreaService } from 'app/services/area.service';
import { MesaEstadoService } from 'app/services/mesa-estado.service';
import { MesaFormaService } from 'app/services/mesa-forma.service';
import { MesaService } from 'app/services/mesa.service';
import { TableServiceService } from 'app/services/table-service.service';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'mesa-serv',
  templateUrl: './mesa-serv.component.html',
  styleUrls: ['./mesa-serv.component.css']
})
export class MesaServComponent implements OnInit {

  itemForms: UntypedFormArray = this.fb.array([]);
  userList: [];
  stateList: [];
  shapeList: [];
  areaList: Area[];
  areaSelected = 0;
  mesaSelected = 0;
  areaSelectedWidth = 0;
  areaSelectedLength = 0;
  notification = null;
  factMesas = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private mesaService: MesaService,
    private userService: UserService,
    private mesaEstadoService: MesaEstadoService,
    private areaService: AreaService,
    private mesaServiceService: TableServiceService,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.userService.getUserLista(environment.tenantId)
      .subscribe(res => this.userList = res as []);

    this.mesaEstadoService.getMesaEstados()
      .subscribe(res => this.stateList = res as []);

    this.areaService.getAreaLista(environment.tenantId)
      .subscribe(res => {
        this.areaSelected = res[0].id;
        this.areaSelectedLength = res[0].length;
        this.areaSelectedWidth = res[0].width;

        this.areaList = res as []
      });


    this.mesaService.getMesas(environment.tenantId).subscribe(
      res => {
        (res as []).forEach((item: any) => {
          this.itemForms.push(this.fb.group({
            id: [item.id],
            tenantId: [item.tenantId],
            areaId: [item.areaId],
            name: [item.name],
            length: [item.length],
            width: [item.width],
            shapeId: [item.shapeId],
            stateId: [item.stateId],
            posX: [item.posX],
            posY: [item.posY],
            userId: [item.userId]
          }));
        });
      }

    );
  }


  recordSubmit(fg: UntypedFormGroup) {
    if (fg.value.id == 0)
      this.mesaService.postMesa(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ id: res.id });
          this.showNotification('insert');
        }
      );
    else
      this.mesaService.putMesa(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        }
      );
  }



  showNotification(categoria) {
    switch (categoria) {
      case 'insert':
        this.notification = { class: 'text-success', message: 'Guardado Exitosamente' };
        break;
      case 'update':
        this.notification = { class: 'text-primary', message: 'Actualizado Exitosamente' };
        break;
      case 'delete':
        this.notification = { class: 'text-danger', message: 'Eliminado Exitosamente' };
        break;
    }
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  selectArea(areaId) {
    this.areaSelected = areaId;
    this.areaSelectedLength = this.areaList.find(x => x.id == areaId).length;
    this.areaSelectedWidth = this.areaList.find(x => x.id == areaId).width;
    let clientWidth = document.getElementById('mesas').clientWidth;

    if (document.getElementById('mesas').clientWidth > 0) {
      this.factMesas = clientWidth / this.areaSelectedLength;
      console.log(document.getElementById('mesas').clientWidth);
    }
  }

  selectMesa(mesaId) {
    console.log(mesaId);
    console.log(this.itemForms.value.find(i => i.id === mesaId));
    this.mesaSelected = mesaId;

  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (document.getElementById('mesas').clientWidth > 0) {
      let clientWidth = document.getElementById('mesas').clientWidth;
      this.factMesas = clientWidth / this.areaSelectedLength;
      console.log(document.getElementById('mesas'));
      console.log(document.getElementById('mesas').clientWidth);
    }
  }


  ngAfterViewChecked() {
    if (document.getElementById('mesas').clientWidth > 0) {
      let clientWidth = document.getElementById('mesas').clientWidth;
      this.factMesas = clientWidth / this.areaSelectedLength;
    }
  }


  abrirMesa() {
    let comensales = (document.getElementById("comensales") as HTMLInputElement).valueAsNumber;

    let tableService: TableService = new TableService();
    tableService.tableId = this.mesaSelected;
    tableService.userId = this.itemForms.value.find(i => i.id === this.mesaSelected).userId;
    tableService.tenantId = environment.tenantId;
    tableService.serviceStateId = 1;
    tableService.dinerUserId = 0;
    tableService.diners = comensales;
    tableService.items = [];
    tableService.serviceStart = new Date();

    this.mesaServiceService.postTableService(tableService).subscribe(res => {
      console.log(res);
      this.router.navigateByUrl('/servicios');
    });
    
  }
}
