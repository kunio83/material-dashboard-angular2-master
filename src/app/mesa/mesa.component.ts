import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

  display = 'none';
  qrUrl ='';
  htmlCont = '';

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
              name: [item.name,Validators.required],
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
      name: ['',Validators.required],
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
    
    if (document.getElementById('mesas').clientWidth > 0) {
      this.factMesas = clientWidth / this.areaSelectedLength;
      console.log(document.getElementById('mesas').clientWidth);
    }
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
  
  //Facundo_rama
    ngAfterViewChecked() {
      if (document.getElementById('mesas').clientWidth > 0) {
        let clientWidth = document.getElementById('mesas').clientWidth;
        this.factMesas = clientWidth / this.areaSelectedLength;        
      }
  }

  generarQr(mesaId: string, mesaName: string) {
    document.getElementById('modaldiag').setAttribute('style', 'max-width: 500px');
    document.getElementById('modalBody').innerHTML= 
      `<span style="color: #00bcd4; font-size:120px">
          <i class="fa fa-spinner fa-spin"></i>
      </span>`;

    

    var settings = {
      "url": "https://ezequielm.qrc.es/api/short?secretkey=1c1cf028a8cdde3231137939b839978d&url=" + mesaId  +"&static=1",
      "method": "GET",
      "timeout": 0,
    };
    
    
    $.ajax(settings).done(function (response) {
      this.qrUrl = response.result.qr;
      console.log(this.qrUrl);

      document.getElementById('modalBody').innerHTML= 
        `<img src="` + this.qrUrl + `">
        <h3><strong> Mesa: `+ mesaName + `</h3></strong>`;
      
    });

    this.openModal();
    

  }

  generarQrs(areaId) {

    document.getElementById('modaldiag').setAttribute('style', 'max-width: 80vw');
    document.getElementById('modalBody').innerHTML= 
      `<span style="color: #00bcd4; font-size:120px">
          <i class="fa fa-spinner fa-spin"></i>
      </span>`;

    this.htmlCont = '';
    var data = '<div class="row">';
    this.itemForms.controls.forEach((item: any) => {
      if (item.value.areaId == areaId) {

        var settings = {
          "url": "https://ezequielm.qrc.es/api/short?secretkey=1c1cf028a8cdde3231137939b839978d&url=" + item.value.id  +"&static=1",
          "method": "GET",
          "timeout": 0,
        };
        
        
        $.ajax(settings).done(function (response) {
          this.qrUrl = response.result.qr;
          console.log(this.qrUrl);
          data+=`<div class="col">
                      <img src="` + this.qrUrl + `">
                      <h3><strong> Mesa: `+ item.value.name + `</h3></strong>
                    </div>`;
          console.log(data);
          
          document.getElementById('modalBody').innerHTML= data;
        });
      }
    });

    
    this.openModal();
    
  }

  stackHtmlCont(data: string){
    this.htmlCont += data;
    console.log(this.htmlCont);
  }


  openModal(){
    this.display='block';
 }

 onCloseHandled(){
  this.display='none';
}

printQR() {

  document.body.setAttribute('style', 'visibility: hidden');
  document.getElementById('modalBody').setAttribute('style', 'visibility: visible');
  
  window.print();
  document.body.setAttribute('style', 'visibility: visible');
}
  
}
