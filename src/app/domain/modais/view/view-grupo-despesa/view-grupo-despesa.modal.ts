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
import { GrupoDespesa } from 'src/app/core/interfaces/grupo-despesa.interface';
import { HomeService } from 'src/app/core/services/home/home-service';
import { ConfirmDeleteModal } from '../../utilities/delete/confirm-delete.modal';

@Component({
  selector: 'modal-view-GrupoDespesa',
  templateUrl: './view-grupo-despesa.modal.html',
  styleUrls: ['./view-grupo-despesa.modal.scss'],
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
export class ViewGrupoDespesaModal {
  grupoDespesas: GrupoDespesa[];
  nomeMes: string;

  originalGrupoDespesa = new Map<number, GrupoDespesa>();
  isEditing: boolean = false;

  constructor(
    private homeService: HomeService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.getAllGrupoDespesas();
  }

  getAllGrupoDespesas() {
    this.homeService.getAll().subscribe((grupoDespesas) => {
      this.grupoDespesas = grupoDespesas.map((despesa) => {
        return {
          ...despesa,
          nomeEditavel: this.extrairMesDoNome(despesa.nome),
        };
      });
    });
  }
  //#region Update

  openEdit(grupoDespesa: GrupoDespesa): void {
    if (!this.isEditing) {
      this.isEditing = true;
      grupoDespesa.isEditing = !grupoDespesa.isEditing;
      this.originalGrupoDespesa.set(grupoDespesa.id, { ...grupoDespesa });
    }
  }
  cancelEdit(grupoDespesa: GrupoDespesa) {
    grupoDespesa.isEditing = false;
    this.isEditing = false;
  }

  updateGrupoDespesa(id: number, grupoDespesa: GrupoDespesa): void {
    grupoDespesa.nome = grupoDespesa.nomeEditavel;
    if (this.originalGrupoDespesa.get(id).nome !== grupoDespesa.nome) {
      this.homeService.update(id, grupoDespesa).subscribe({
        next: (grupoDespesaAtualizado) => {
          if (grupoDespesaAtualizado) {
            this.toastr.success('Atualizado com sucesso!', 'Finalizado!');
          }
          this.getAllGrupoDespesas();
        },
        error: () => this.getAllGrupoDespesas(),
      });
    }
    grupoDespesa.isEditing = false;
    this.isEditing = false;
  }
  //#endregion

  //#region Delete
  confirmDelete(idGrupoDespesa: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModal, {
      width: '400px',
      data: {
        descricao:
          'Apagar o Grupo irá deletar todas as despesas relacionadas a ele, deseja continuar?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteGrupoDespesa(idGrupoDespesa);
      }
    });
  }

  deleteGrupoDespesa(grupoDespesaId: number): void {
    this.homeService.delete(grupoDespesaId).subscribe({
      next: (hasDeleted) => {
        if (hasDeleted) {
          this.toastr.success('Deletado com sucesso!', 'Finalizado!');
        }
        this.getAllGrupoDespesas();
      },
    });
  }

  //#endregion

  extrairMesDoNome(nome: string): string {
    const regex = /Fatura de ([\wÀ-ú]+) \d{4}/i;
    const match = nome.match(regex);
    return match ? match[1] : nome;
  }
}
