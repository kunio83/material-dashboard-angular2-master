import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ItemCategory } from 'app/models/itemCategory';
import { CategoriaService } from 'app/services/categoria.service';
import { CocinaService } from 'app/services/cocina.service';
import { MenuService } from 'app/services/menu.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  itemForms : UntypedFormArray = this.fb.array([]);
  categoryList: [];
  kitchenList: [];
  notification = null;


  constructor(private fb : UntypedFormBuilder,
    private menuService : MenuService,
    private categoriaService : CategoriaService,
    private cocinaService : CocinaService
  ) { }



  ngOnInit(): void {

    this.categoriaService.getCategoriaLista(environment.tenantId)
    .subscribe(res => this.categoryList = res as []);

    this.cocinaService.getCocinaLista(environment.tenantId)
    .subscribe(res => this.kitchenList = res as []);

      
    this.menuService.getMenu(environment.tenantId).subscribe(
      res => {
        
        if(res.length == 0){
          this.addItemForm();
        }
        else{
          res.sort((a,b) => (a.itemCategory.name > b.itemCategory.name) ? 1 : ((b.itemCategory.name > a.itemCategory.name) ? -1 : 0));
          (res as []).forEach((item: any) => {
            this.itemForms.push(this.fb.group({
              id: [item.id],
              tenantId: [item.tenantId],
              code: [item.code, Validators.required],
              itemCategoryId: [item.itemCategoryId, Validators.required],
              kitchenId: [item.kitchenId, Validators.required],
              title: [item.title, Validators.required],
              summary: [item.summary],
              price: [item.price, Validators.compose([
                                  Validators.required,
                                  Validators.pattern(/^[0-9]+$/)])],  
              active: [item.active]      
            }));
          });
        }
        
      }
    );
  }

  addItemForm(){
    this.itemForms.push(this.fb.group({
      id: ['0'],
      tenantId: [environment.tenantId],
      code: ['', Validators.required],
      itemCategoryId: ['', Validators.required],
      kitchenId: ['', Validators.required],
      title: ['', Validators.required],
      summary: [''],
      price: ['', Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[0-9]+$/)])],
      active: [true]      
    }));
  }

  recordSubmit(fg: UntypedFormGroup){
    if(fg.value.id == '0')
    {
      this.menuService.postItem(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({id: res.id});
          this.showNotification('insert');
        });
    }
    else{
      this.menuService.putItem(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }
  }

  onDelete(id, i){
    if(id == '0')
    {
      this.itemForms.removeAt(i);
    }
    else if(confirm('Esta seguro que desea eliminar?')){
      this.menuService.deleteItem(id).subscribe(
        res => {
          this.itemForms.removeAt(i);
          this.showNotification('delete');
        });
    }
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