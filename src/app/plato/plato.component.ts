import { Component, OnInit } from '@angular/core';
import { ItemCategory } from 'app/models/itemCategory';
import { PlatoService } from 'app/services/plato.service';

@Component({
  selector: 'plato',
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.css']
})
export class PlatoComponent implements OnInit {

  itemCategories: ItemCategory[];
  datos: any;

  constructor(
    private platoService: PlatoService
    ) { }

  ngOnInit(): void {

    this.platoService.getItemCategories(2).subscribe(
      {
        next: data => {
          this.itemCategories = data;
          console.log(this.itemCategories);
        }
      }
    )
  }

  deletePlato(){}

}
