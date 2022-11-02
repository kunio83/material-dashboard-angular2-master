import {Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BusinessConfigService } from 'app/services/business-config.service';
import { environment } from 'environments/environment';


@Component({
    selector: 'businessConfig',
    templateUrl: './businessConfig.component.html',
    styleUrls: ['./businessConfig.component.css']
})

export class BusinessConfigComponent implements OnInit { 
    itemForms: UntypedFormArray = this.fb.array([]);
    notification = null;
    
    constructor(
        private fb: UntypedFormBuilder,
        private businessConfigService: BusinessConfigService) { }
    ngOnInit(): void {
        this.businessConfigService.getBusinessConfig(environment.tenantId).subscribe(
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
                            slogan: [item.slogan],
                            logo: [item.logo],
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
            slogan: [''],
            logo: [''],
            summary: ['']
        }));
    }
    recordSubmit(fg: UntypedFormGroup) {
        if (fg.value.id == 0)
            this.businessConfigService.postBusinessConfig(fg.value).subscribe(
                (res: any) => {
                    fg.patchValue({ id: res.id });
                    this.showNotification('insert');
                }
            );
        else
            this.businessConfigService.putBusinessConfig(fg.value).subscribe(
                (res: any) => {
                    this.showNotification('update');
                }
            );
    }
    showNotification(categoria) {
        switch (categoria) {
            case 'insert':
                this.notification = { class: 'text-success', message: 'Saved' };
                break;
            case 'update':
                this.notification = { class: 'text-primary', message: 'Updated' };
                break;
            default:
                break;
        }
        setTimeout(() => {
            this.notification = null;
        }, 3000);
    }
}
