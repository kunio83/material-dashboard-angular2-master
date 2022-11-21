import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AreaService } from 'app/services/area.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  itemForms : UntypedFormArray = this.fb.array([]);
  notification = null;

  constructor( private fb : UntypedFormBuilder,
    private areaService : AreaService) { }


  ngOnInit(): void {

    this.areaService.getAreas(environment.tenantId).subscribe(
      res => {
        if(res.length == 0){
          this.addItemForm();
        }
        else{
          (res as []).forEach((item: any) => {
            this.itemForms.push(this.fb.group({
              id: [item.id],
              tenantId: [item.tenantId],
              name: [item.name, Validators.required],
              length: [item.length, Validators.compose([
                Validators.required, 
                Validators.pattern(/^[0-9]+$/)
              ])],
              width: [item.width, Validators.compose([
                Validators.required,
                Validators.pattern(/^[0-9]+$/)
              ])],
              summary: [item.summary]
            }));
          });
        }
      }
    );
  }

  addItemForm(){
    this.itemForms.push(this.fb.group({
      id: [0],
      tenantId: [environment.tenantId],
      name: ['', Validators.required],
      length: ['', Validators.compose([
        Validators.required, 
        Validators.pattern(/^[0-9]+$/)])],
      width: ['', Validators.required, Validators.pattern(/^[0-9]+$/)],
      summary: ['']
    }));
  }

  recordSubmit(fg: UntypedFormGroup){
    if(fg.value.id == 0)
      this.areaService.postArea(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({id: res.id});
          this.showNotification('insert');
        }
      );
    else
      this.areaService.putArea(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({id: res.id});
          this.showNotification('update');
        }
      );
  }

  onDelete(id, i){
    if(id == 0)
      this.itemForms.removeAt(i);
    else if(confirm('Esta seguro que desea eliminar?'))
      this.areaService.deleteArea(id).subscribe(
        res => {
          this.itemForms.removeAt(i);
          this.showNotification('delete');
        }
      );
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
}
