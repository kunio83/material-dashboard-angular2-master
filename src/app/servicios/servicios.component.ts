import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MesaEstadoService } from 'app/services/mesa-estado.service';
import { MesaService } from 'app/services/mesa.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})

export class ServiciosComponent implements OnInit {
  itemForms: FormArray = this.fb.array([]);
  userList: [];
  serviceStateList: [];
  tablelist: [];

  constructor(
    private fb:FormBuilder,
    private userService: UserService,
    private mesaEstadoService: MesaEstadoService,
    private mesaService: MesaService
  ) { }
  

  ngOnInit(): void {

  }

  addItemForm(){}

}
