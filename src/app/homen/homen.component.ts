import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Country } from 'app/models/country';
import { State } from 'app/models/state';
import { HomeService } from 'app/services/home.service';

@Component({
  selector: 'homen',
  templateUrl: './homen.component.html',
  styleUrls: ['./homen.component.css']
})
export class HomenComponent implements OnInit {
  countries: Country[];
  currentCountry: Country = new Country;
  currentState: State = new State;
  contactForm:UntypedFormGroup;

  constructor(
    private homeService: HomeService,
    private formBuilder:UntypedFormBuilder
    ) { }

  ngOnInit(): void {

    this.homeService.getCountries().subscribe(
      {
        next: data => {
          this.countries = data;
          console.log(this.countries);
        }
      }
    )
    this.contactForm = this.formBuilder.group({
            country: [null],
            state: [null]
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

  filterCities = (): void => {
    this.homeService.getCities(this.contactForm.controls.state.value).subscribe(
      {
        next: data => {
          this.currentState = data;
        }
      }
    )
  }




 
  submit() {
    console.log("Form Submitted")
    console.log(this.contactForm.value)
  }
  
}
