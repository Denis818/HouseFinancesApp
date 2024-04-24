import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Categoria } from 'src/app/domain/painel-controle/interfaces/categoria.interface';
import { PainelControleService } from 'src/app/domain/painel-controle/services/painel-controle.service';

@Component({
  selector: 'app-modal-despesa',
  templateUrl: './modal-despesa.component.html',
  styleUrls: ['./modal-despesa.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ModalDespesaComponent {
  despesaForm: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    private painelService: PainelControleService,
    public dialogRef: MatDialogRef<ModalDespesaComponent>,
    private fb: FormBuilder
  ) {
    this.despesaForm = this.fb.group({
      item: 'item',
      preco: 0.01,
      quantidade: 1,
      fornecedor: 'Epa',
      categoriaId: 0,
      dataCompra: this.formatDate(new Date()),
    });

    this.getAllCategorias();
  }

  getAllCategorias() {
    this.painelService.getAll<Categoria>('Categoria').subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
    });
  }

  onSubmit(): void {
    if (this.despesaForm.valid) {
      this.dialogRef.close(this.despesaForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  resetForm(): void {
    this.despesaForm.reset({
      item: 'item',
      preco: 0.01,
      quantidade: 1,
      fornecedor: 'Epa',
      categoriaId: this.despesaForm.value.categoriaId,
      dataCompra: this.formatDate(new Date()),
    });
  }
}
