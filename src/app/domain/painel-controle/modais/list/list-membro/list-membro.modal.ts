import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Membro } from 'src/app/domain/painel-controle/interfaces/membro.interface';
import { PainelControleService } from 'src/app/domain/painel-controle/services/painel-controle.service';
import { ConfirmDeleteModal } from '../../utilities/delete/confirm-delete.modal';

@Component({
  selector: 'modal-list-membro',
  templateUrl: './list-membro.modal.html',
  styleUrls: ['./list-membro.modal.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    ConfirmDeleteModal,
  ],
})
export class ListMembroModal {
  membros: Membro[];

  membroAtual: Membro;
  isEditing: boolean = false;

  constructor(
    private painelService: PainelControleService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.getAllMembros();
  }

  getAllMembros() {
    this.painelService
      .getAll<Membro>('membro')
      .subscribe((membros) => (this.membros = membros));
  }

  //#region Update

  openEdit(membro: Membro): void {
    if (!this.isEditing) {
      this.isEditing = true;
      membro.isEditing = !membro.isEditing;
      this.membroAtual = JSON.parse(JSON.stringify(membro));
    }
  }

  cancelEdit(membro: Membro) {
    Object.assign(membro, this.membroAtual);
    this.resetPropertys(membro);
  }

  updateMembro(id: number, membro: Membro): void {
    if (!this.membroAlterado(membro)) {
      this.painelService.update(id, membro, 'membro').subscribe({
        next: (membroAtualizado) => {
          if (membroAtualizado) {
            this.toastr.success('Atualizado com sucesso!', 'Finalizado!');
          }
          this.getAllMembros();
        },
        error: () => this.getAllMembros(),
      });
    }
    this.resetPropertys(membro);
  }
  //#endregion

  //#region Delete
  confirmDelete(idMembro: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModal, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMembro(idMembro);
      }
    });
  }

  deleteMembro(membroId: number): void {
    this.painelService.delete(membroId, 'membro').subscribe({
      next: (hasDeleted) => {
        if (hasDeleted) {
          this.toastr.success('Deletado com sucesso!', 'Finalizado!');
        }
        this.getAllMembros();
      },
    });
  }
  //#endregion

  membroAlterado(membro: Membro) {
    return this.membroAtual.nome === membro.nome;
  }

  resetPropertys(membro: Membro) {
    membro.isEditing = false;
    this.isEditing = false;
    this.membroAtual = null;
  }
}
