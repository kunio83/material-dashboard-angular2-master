import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'app/models/country';
import { HomeService } from 'app/services/home.service';

@Component({
  selector: 'homen',
  templateUrl: './homen.component.html',
  styleUrls: ['./homen.component.css']
})
export class HomenComponent implements OnInit {
  countries: Country[];
  currentCountry: Country = new Country;
  contactForm:FormGroup;

  constructor(
    private homeService: HomeService,
    private formBuilder:FormBuilder
    ) { }

  ngOnInit(): void {

    this.homeService.getCountries().subscribe(
      {
        next: data => {
          this.countries = data;
        }
      }
    )
    this.contactForm = this.formBuilder.group({
            country: [null]
    }); 
  }

  
  filterProvincias = (): void => {
    this.homeService.getCountry(this.contactForm.controls.country.value).subscribe(
      {
        next: data => {
          this.currentCountry = data;
        }
      }
    )
  }


 
  submit() {
    console.log("Form Submitted")
    console.log(this.contactForm.value)
  }
  
}
