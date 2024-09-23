import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item1',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardActions,
    MatIcon,
    CurrencyPipe,
    MatButton,
    RouterLink
  ],
  templateUrl: './product-item1.component.html',
  styleUrls: ['./product-item1.component.scss']
})
export class ProductItem1Component {
  @Input() product?: Product;

  @Output() delete = new EventEmitter<number>(); // Emit product ID for delete
  @Output() update = new EventEmitter<number>(); // Emit product ID for update

  deleteProduct(id: number) {
    this.delete.emit(id);
  }

  updateProduct(id: number) {
    this.update.emit(id);
  }
}
