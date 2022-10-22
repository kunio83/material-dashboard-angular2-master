import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  userForms: FormArray = this.fb.array([]);
  notification = null;

  constructor(private fb: FormBuilder,
    private userService: UserService) { }
    
  ngOnInit(): void {

    this.userService.getUsers(environment.tenantId).subscribe(
      res => {
        if (res.length == 0) {
          this.addUserForm();
        }
        else {
          (res as []).forEach((user: any) => {
            this.userForms.push(this.fb.group({
              id: [user.id],
              tenantId: [user.tenantId],
              userName: [user.username, Validators.required],
              email: [user.email, Validators.required],
              passwordHash: [user.passwordHash, Validators.required],
              firstNames: [user.firstNames, Validators.required],
              lastName: [user.lastName, Validators.required],
              roleId: [user.roleId, Validators.required],
              active: [user.active]
            }));
          });
        }
      }
    );

  }

  addUserForm() {
    this.userForms.push(this.fb.group({
      id: ['0'],
      tenantId: [environment.tenantId],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      passwordHash: ['', Validators.required],
      firstNames: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: ['', Validators.required],
      active: [true]
    }));

    console.log(this.userForms);
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.id == '0') {
      this.userService.postUser(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ id: res.id });
          this.showNotification('insert');
        });
    }
    else {
      this.userService.putUser(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }
  }

  onDelete(id: number, i: number) {
    if (id == 0)
      this.userForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?'))
      this.userService.deleteUser(id).subscribe(
        res => {
          this.userForms.removeAt(i);
          this.showNotification('delete');
        });
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
