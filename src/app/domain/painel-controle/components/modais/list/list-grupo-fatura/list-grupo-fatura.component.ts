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
import { GrupoFatura } from 'src/app/core/interfaces/grupo-despesa.interface';
import { grupoFaturaNotification } from 'src/app/core/services/grupo-fatura-notification.service';
import { GrupoFaturaService } from 'src/app/core/services/grupo-fatura.service';
import { ConfirmDeleteComponent } from '../../delete/confirm-delete.component';

@Component({
  selector: 'modal-listgrupoFatura',
  templateUrl: './list-grupo-fatura.component.html',
  styleUrls: ['./list-grupo-fatura.component.scss'],
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
    ConfirmDeleteComponent,
  ],
})
export class ListgrupoFaturaComponent {
  grupoFaturas: GrupoFatura[] = [];
  nomeMes: string;

  grupoFaturaAtual: GrupoFatura;
  isEditing: boolean = false;

  constructor(
    private readonly grupoFaturaService: GrupoFaturaService,
    private readonly grupoFaturaNotification: grupoFaturaNotification,
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog
  ) {
    this.getAllgrupoFaturas();
  }

  getAllgrupoFaturas() {
    this.grupoFaturaService.getAll().subscribe((grupoFaturas) => {
      this.grupoFaturas = grupoFaturas.map((despesa) => {
        return {
          ...despesa,
          nomeEditavel: this.extrairMesDoNome(despesa.nome),
        };
      });
    });
  }
  //#region Update

  openEdit(grupoFatura: GrupoFatura): void {
    if (!this.isEditing) {
      this.isEditing = true;
      grupoFatura.isEditing = !grupoFatura.isEditing;
      this.grupoFaturaAtual = JSON.parse(JSON.stringify(grupoFatura));
    }
  }
  cancelEdit(grupoFatura: GrupoFatura) {
    Object.assign(grupoFatura, this.grupoFaturaAtual);
    this.resetPropertys(grupoFatura);
  }

  updategrupoFatura(id: number, grupoFatura: GrupoFatura): void {
    if (!this.grupoFaturaAlterado(grupoFatura)) {
      grupoFatura.nome = grupoFatura.nomeEditavel;

      this.grupoFaturaService.update(id, grupoFatura).subscribe({
        next: (grupoFaturaAtualizado) => {
          if (grupoFaturaAtualizado) {
            this.grupoFaturaNotification.recarregarListagrupoFatura();
            this.toastr.success('Atualizado com sucesso!', 'Finalizado!');
          }
          this.getAllgrupoFaturas();
        },
        error: () => this.getAllgrupoFaturas(),
      });
    }
    this.resetPropertys(grupoFatura);
  }
  //#endregion

  //#region Delete
  confirmDelete(idgrupoFatura: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        descricao:
          'Apagar o Grupo irá deletar todas as despesas relacionadas a ele, deseja continuar?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletegrupoFatura(idgrupoFatura);
      }
    });
  }

  deletegrupoFatura(grupoFaturaId: number): void {
    this.grupoFaturaService.delete(grupoFaturaId).subscribe({
      next: (hasDeleted) => {
        if (hasDeleted) {
          this.grupoFaturaNotification.recarregarListagrupoFatura();
          this.toastr.success('Deletado com sucesso!', 'Finalizado!');
        }
        this.getAllgrupoFaturas();
      },
    });
  }

  //#endregion

  extrairMesDoNome(nome: string): string {
    const regex = /Fatura de ([\wÀ-ú]+) \d{4}/i;
    const match = nome.match(regex);
    return match ? match[1] : nome;
  }

  grupoFaturaAlterado(grupoFatura: GrupoFatura): boolean {
    return this.grupoFaturaAtual.nomeEditavel === grupoFatura.nomeEditavel;
  }

  resetPropertys(grupoFatura: GrupoFatura) {
    grupoFatura.isEditing = false;
    this.isEditing = false;
    this.grupoFaturaAtual = null;
  }
}
