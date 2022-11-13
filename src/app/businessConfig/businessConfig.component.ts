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

    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    
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


    fileChangeEvent(fileInput: any) {
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
