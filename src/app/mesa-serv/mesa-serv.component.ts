import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Area } from 'app/models/area';
import { AreaService } from 'app/services/area.service';
import { MesaEstadoService } from 'app/services/mesa-estado.service';
import { MesaFormaService } from 'app/services/mesa-forma.service';
import { MesaService } from 'app/services/mesa.service';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'mesa-serv',
  templateUrl: './mesa-serv.component.html',
  styleUrls: ['./mesa-serv.component.css']
})
export class MesaServComponent implements OnInit {

  itemForms: FormArray = this.fb.array([]);
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
    private fb: FormBuilder,
    private mesaService: MesaService,
    private userService: UserService,
    private mesaEstadoService: MesaEstadoService,
    private areaService: AreaService
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


  recordSubmit(fg: FormGroup) {
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
    this.factMesas = clientWidth / this.areaSelectedLength;
    console.log(document.getElementById('mesas').clientWidth);
  }

  selectMesa(mesaId) {
    console.log(mesaId);
    console.log(this.itemForms.value.find(i => i.id === mesaId));
    this.mesaSelected = mesaId;

  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let clientWidth = document.getElementById('mesas').clientWidth;
    this.factMesas = clientWidth / this.areaSelectedLength;
    console.log(document.getElementById('mesas'));
    console.log(document.getElementById('mesas').clientWidth);
  }

/*
    ngAfterViewChecked() {
      let clientWidth = document.getElementById('mesas').clientWidth;
      this.factMesas = clientWidth / this.areaSelectedLength;    
    }*/
}
