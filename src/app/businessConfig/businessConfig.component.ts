import {Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
    fg;

    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    
    constructor(
        private fb: UntypedFormBuilder,
        private businessConfigService: BusinessConfigService) { }


    ngOnInit(): void {
        this.businessConfigService.getBusinessConfig(environment.tenantId).subscribe(
            res => {
                if (res == null) {
                }
                else {
                    this.itemForms.push(this.fb.group({
                        id : [res.id],
                        tenantId : [res.tenantId],
                        displayName : [res.displayName],
                        slogan: [res.slogan],
                        logo: [res.logo],
                        summary: [res.summary]
                    }));
                }
            }
            
        );
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
                        fg.patchValue({logo: imgBase64Path});
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
