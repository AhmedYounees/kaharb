import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../../core/services/shop.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null; // To hold the selected file

  @Output() productCreated = new EventEmitter<void>(); // Emit event after product creation

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0]; // Store the selected file
    }
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.shopService.uploadImage(formData); // Ensure this service method returns { url: string }
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile) {
      this.uploadImage(this.selectedFile).subscribe({
        next: (response: { url: string }) => { // Specify the type of response correctly
          const imageUrl = response.url; // Extract the URL from the response
          console.log('Uploaded Image URL:', imageUrl);

          const productData = {
            ...this.productForm.value,
            pictureUrl: imageUrl
          };

          console.log('Product Data:', productData);

          this.shopService.createProduct(productData).subscribe({
            next: () => {
              console.log('Product created successfully');
              this.productCreated.emit(); // Emit event here
              this.router.navigate(['/admin/products']);
            },
            error: (err: any) => {
              console.error('Error creating product:', err);
            }
          });
        },
        error: (err: any) => {
          console.error('Error uploading image:', err);
        }
      });
    } else {
      console.error('Form is invalid or no file selected');
    }
  }
}
