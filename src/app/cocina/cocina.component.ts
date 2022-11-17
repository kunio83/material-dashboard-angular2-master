import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { CocinaService } from 'app/services/cocina.service';
import { UserService } from 'app/services/user.service';
import { User } from 'app/models/user';
import { Kitchen } from 'app/models/kitchen';


@Component({
  selector: 'cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  itemForms: UntypedFormArray = this.fb.array([]);
  notification = null;
  userList: User[];
  kitchenList: Kitchen[];
  selectedKitchen = null;
  listUsers = [];

  constructor(private fb: UntypedFormBuilder,
    private cocinaService: CocinaService,
    private userService: UserService) { }


  ngOnInit(): void {

    this.cocinaService.getCocinaLista(environment.tenantId)
      .subscribe(res => this.kitchenList = res as []);

    this.userService.getUserLista(environment.tenantId)
      .subscribe(res => this.userList = res as []);

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
              summary: [item.summary],
              users: [item.users]
            }));
          });
        }
      });

  }


  addItemForm() {
    this.itemForms.push(this.fb.group({
      id: [0],
      tenantId: [environment.tenantId],
      name: ['', Validators.required],
      summary: [''],
      users: [[]]
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

  chngCoc(evt) {
    this.selectedKitchen = evt;
    this.listUsers = [];
    this.userList.forEach((user: any) => {
      this.listUsers.push({ id: user.id, username: user.username, selected: false });
    });

    this.kitchenList.filter((kitchen: any) => {
      if (kitchen.id == evt) {
        kitchen.users.forEach((usercoc: any) => {
          this.listUsers.forEach((user: any) => {
            if (user.id == usercoc.id) {
              user.selected = true;
            }
          });
        });
      }
    });


  }

  chngUser(id) {
    this.listUsers.forEach((user: any) => {
      if (user.id == id) {
        user.selected = !user.selected;
      }
    });
  }

  saveUsers() {
    let userSelected = [];
    let kitchenSelected = this.kitchenList.filter(k => k.id == this.selectedKitchen)[0];

    console.log(kitchenSelected);

    this.userList.forEach((user: any) => {
      this.listUsers.forEach((userlist: any) => {
        if (user.id == userlist.id && userlist.selected == true) {
          userSelected.push(user);
        }
      });
    });

    
    kitchenSelected.users = userSelected;  

    this.cocinaService.putCocina(kitchenSelected).subscribe(
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
    }, 2000);
  }
}
