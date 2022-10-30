import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AreaService } from 'app/services/area.service';
import { environment } from 'environments/environment';
import { ItemCategory } from 'app/models/itemCategory';
import { CategoriaService } from 'app/services/categoria.service';
import { CocinaService } from 'app/services/cocina.service';
import { MenuService } from 'app/services/menu.service';
import { Kitchen } from 'app/models/kitchen';

@Component({
  selector: 'cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  itemForms: UntypedFormArray = this.fb.array([]);
  notification = null;

  constructor(private fb: UntypedFormBuilder,
    private cocinaService: CocinaService) { }

  ngOnInit(): void {
    this.cocinaService.getCocinas(environment.tenantId).subscribe(
      res => {
        if (res.length == 0) {
          this.addItemForm();
        }
        else {
          (res as []).forEach((item: any) => {
            this.itemForms.push(this.fb.group({
              id: [item.id],
              tenantId: [item.tenantId],
              name: [item.name, Validators.required],
              summary: [item.summary]
            }));
          });
        }
      });
      console.log(this.itemForms);
  }
  

  addItemForm() {
    this.itemForms.push(this.fb.group({
      id: [0],
      tenantId: [environment.tenantId],
      name: ['', Validators.required],
      summary: ['']
    }));
  }


  recordSubmit(fg: UntypedFormGroup) {
    if (fg.value.id == 0)
      this.cocinaService.postCocina(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ id: res.id });
          this.showNotification('insert');
        }
      );
    else
      this.cocinaService.putCocina(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        }
      );
  }

  onDelete(id, i) {
    if (id == 0)
      this.itemForms.removeAt(i);
    else if (confirm('Esta seguro que desea eliminar?'))
      this.cocinaService.deleteCocina(id).subscribe(
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
    },2000);
  }
}
