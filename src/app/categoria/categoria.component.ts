import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CategoriaService } from 'app/services/categoria.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoriaForms : UntypedFormArray = this.fb.array([]);
  notification = null;

  constructor(private fb:UntypedFormBuilder,
    private categoriaService: CategoriaService
    ) { }

  ngOnInit(): void {

    this.categoriaService.getCategorias(environment.tenantId).subscribe(
      res => {
        if(res.length == 0){
          this.addCategoriaForm();
        }
        else{
          (res as []).forEach((categoria: any) => {
            this.categoriaForms.push(this.fb.group({
              id: [categoria.id],
              tenantId: [categoria.tenantId],
              name: [categoria.name, Validators.required]   
            }));
          });
        }
      }
    );
  }

  addCategoriaForm(){
    this.categoriaForms.push(this.fb.group({
      id: ['0'],
      tenantId: [environment.tenantId],
      name: ['', Validators.required],
    }));
  }

  recordSubmit(fg: UntypedFormGroup){
    if(fg.value.id == '0')
    {
      this.categoriaService.postCategoria(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({id: res.id});
          this.showNotification('insert');
        });
    }
    else{
      this.categoriaService.putCategoria(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }
  }

  onDelete(id, i){
    if(id == '0')
    {
      this.categoriaForms.removeAt(i);
    }
    else{
      if(confirm('Esta seguro que desea eliminar?')){
        this.categoriaService.deleteCategoria(id).subscribe(
          res => {
            this.categoriaForms.removeAt(i);
            this.showNotification('delete');
          });
      }
    }
  }

  showNotification(categoria){
    switch (categoria) {
      case 'insert':
        this.notification = {class:'text-success', message:'Guardado Exitosamente'};
        break;
      case 'update':
        this.notification = {class:'text-primary', message:'Actualizado Exitosamente'};
      break;
      case 'delete':
        this.notification = {class:'text-danger', message:'Eliminado Exitosamente'};
      break;
    }
  }
}
