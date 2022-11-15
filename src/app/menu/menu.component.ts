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

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;


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
              kitchenId: [item.kitchenId],
              title: [item.title, Validators.required],
              summary: [item.summary],
              price: [item.price, Validators.required],
              active: [item.active],
              picture: [item.picture]   
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
      kitchenId: [''],
      title: ['', Validators.required],
      summary: [''],
      price: ['', Validators.required],
      active: [true],
      picture: ['']      
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


  fileChangeEvent(fileInput: any, fg: UntypedFormGroup) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 200000;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Kb';

            return false;
        }

        /*
        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }*/

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    fg.patchValue({picture: imgBase64Path});
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                    console.log(this.cardImageBase64);
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
}
}