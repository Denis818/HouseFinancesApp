import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ToastrService } from 'ngx-toastr';
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
    CurrencyMaskModule,
    MatSelectModule,
  ],
})
export class ModalDespesaComponent {
  despesaForm: FormGroup;

  get dsespesaValidator(): any {
    return this.despesaForm.controls;
  }

  @Output() despesaInserida = new EventEmitter<void>();

  categorias: Categoria[] = [];

  constructor(
    private painelService: PainelControleService,
    public dialogRef: MatDialogRef<ModalDespesaComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.validation();
    this.resetForm();
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
      this.painelService.insert(this.despesaForm.value, 'Despesa').subscribe({
        next: () => {
          this.toastr.success(
            ` Despesa ${this.despesaForm.value.item} criada com sucesso!`,
            'Finalizado!'
          );

          this.resetForm();
          this.despesaInserida.emit();
        },
      });
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  public validation(): void {
    this.despesaForm = this.fb.group({
      categoriaId: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],

      item: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      preco: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9,.]+$'),
          Validators.min(0.01),
          Validators.max(999999.99),
        ],
      ],
      quantidade: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(99999),
        ],
      ],
      fornecedor: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
    });
  }

  resetForm(): void {
    this.despesaForm.reset({
      item: 'item',
      preco: 1,
      quantidade: 1,
      fornecedor: 'Epa',
      categoriaId: this.despesaForm.value.categoriaId || 0,
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
