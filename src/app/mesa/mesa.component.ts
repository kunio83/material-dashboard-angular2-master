import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Area } from 'app/models/area';
import { AreaService } from 'app/services/area.service';
import { MesaEstadoService } from 'app/services/mesa-estado.service';
import { MesaFormaService } from 'app/services/mesa-forma.service';
import { MesaService } from 'app/services/mesa.service';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})

export class MesaComponent implements OnInit {

  itemForms: UntypedFormArray = this.fb.array([]);
  userList: [];
  stateList: [];
  shapeList: [];
  areaList: Area[];
  areaSelected = 0;
  areaSelectedWidth = 0;
  areaSelectedLength = 0;
  notification = null;
  factMesas = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private mesaService: MesaService,
    private userService: UserService,
    private mesaFormaService: MesaFormaService,
    private mesaEstadoService: MesaEstadoService,
    private areaService: AreaService
  ) { }


  ngOnInit(): void {

    this.userService.getUserLista(environment.tenantId)
      .subscribe(res => this.userList = res as []);

    this.mesaEstadoService.getMesaEstados()
      .subscribe(res => this.stateList = res as []);

    this.mesaFormaService.getMesaFormas()
      .subscribe(res => this.shapeList = res as []);

    this.areaService.getAreaLista(environment.tenantId)
      .subscribe(res => {
        this.areaSelected = res[0].id;
        this.areaSelectedLength = res[0].length;
        this.areaSelectedWidth = res[0].width;

        this.areaList = res as []
        });


    this.mesaService.getMesas(environment.tenantId).subscribe(
      res => {
        if (res.length == 0) {
          this.addItemForm();
        }
        else {
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
              posY: [item.posY]
            }));
          });
        }
      }
    );
  }

  addItemForm() {
    console.log(this.userList);
    this.itemForms.push(this.fb.group({
      id: [0],
      tenantId: [environment.tenantId],
      areaId: [this.areaSelected],
      name: [''],
      length: [1],
      width: [1],
      shapeId: [1],
      stateId: [1],
      posX: [1],
      posY: [1]
    }));
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

  onDelete(id, i) {
    if (id == 0)
      this.itemForms.removeAt(i);
    else if (confirm('Are you sure to delete this record?'))
      this.mesaService.deleteMesa(id).subscribe(
        res => {
          this.itemForms.removeAt(i);
          this.showNotification('delete');
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

  
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      console.log(this.mesitas.nativeElement.offsetWidth);
      console.log(this.mesitas.nativeElement.offsetHeight);
      let clientWidth = document.getElementById('mesas').clientWidth;
      this.factMesas = clientWidth / this.areaSelectedLength;
      console.log(document.getElementById('mesas'));
      console.log(document.getElementById('mesas').clientWidth);
    }


  ngAfterViewChecked() {
      if (document.getElementById('mesas')) {
        let clientWidth = document.getElementById('mesas').clientWidth;
        this.factMesas = clientWidth / this.areaSelectedLength;        
      }
  }

  @ViewChild('mesitas')
  mesitas: ElementRef;

}
