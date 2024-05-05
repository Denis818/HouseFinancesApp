import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { MatTooltipModule } from '@angular/material/tooltip';
import { Categoria } from 'src/app/domain/painel-controle/interfaces/categoria.interface';
import { PainelControleService } from 'src/app/domain/painel-controle/services/painel-controle.service';
import { ConfirmDeleteModal } from '../../utilities/delete/confirm-delete.modal';

@Component({
  selector: 'modal-view-categoria',
  templateUrl: './view-categoria.modal.html',
  styleUrls: ['./view-categoria.modal.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    ConfirmDeleteModal,
    MatTooltipModule,
  ],
})
export class ViewCategoriaModal {
  categorias: Categoria[];
  constructor(
    private painelService: PainelControleService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.getAllCategorias();
  }

  getAllCategorias() {
    this.painelService.getAll<Categoria>('categoria').subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
    });
  }

  //#region Update
  originalCategoria = new Map<number, Categoria>();
  openEdit(categoria: Categoria): void {
    categoria.isEditing = !categoria.isEditing;
    this.originalCategoria.set(categoria.id, { ...categoria });
  }

  updateCategoria(id: number, categoria: Categoria): void {
    if (
      this.painelService.teveAlteracoes(
        this.originalCategoria.get(id),
        categoria
      )
    ) {
      this.painelService.update(id, categoria, 'categoria').subscribe({
        next: () => {
          this.toastr.success('Atualizado com sucesso!', 'Finalizado!');
          this.getAllCategorias();
        },
        error: () => this.getAllCategorias(),
      });
    }

    categoria.isEditing = false;
  }

  isEditable(descricao: string): boolean {
    return (
      descricao !== 'Almoço/Janta' &&
      descricao !== 'Aluguel' &&
      descricao !== 'Condomínio' &&
      descricao !== 'Conta de Luz'
    );
  }
  //#endregion

  //#region Delete
  confirmDelete(idCategoria: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModal, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategoria(idCategoria);
      }
    });
  }

  deleteCategoria(categoriaId: number): void {
    this.painelService.delete(categoriaId, 'categoria').subscribe({
      next: () => {
        this.toastr.success('Deletado com sucesso!', 'Finalizado!');
        this.getAllCategorias();
      },
    });
  }

  //#endregion
}
