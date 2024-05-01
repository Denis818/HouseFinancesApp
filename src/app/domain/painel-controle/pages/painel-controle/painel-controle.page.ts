import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPaginator } from 'src/app/shared/utilities/paginator/custom-paginator';
import { CreateCategoriaModal } from '../../modal/create/categoria/create-categoria.modal';
import { CreateDespesaModal } from '../../modal/create/despesa/create-despesa.modal';
import { CreateMembroModal } from '../../modal/create/membro/create-membro.modal';
import { ChecarFaturaCartaoModal } from '../../modal/utilities/checar-fatura-cartao/checar-fatura-cartao.modal';
import { ViewCategoriaModal } from '../../modal/view/view-categoria/view-categoria.modal';
import { ViewDespesaModal } from '../../modal/view/view-despesa/view-despesa.modal';
import { ViewMembroModal } from '../../modal/view/view-membro/view-membro.modal';
@Component({
  selector: 'app-painel-controle-page',
  templateUrl: './painel-controle.page.html',
  styleUrls: ['./painel-controle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ViewDespesaModal,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class PainelControlePage {
  constructor(private dialog: MatDialog) {}

  //#region  Views
  openViewCategoriaModal() {
    const dialogRef = this.dialog.open(ViewCategoriaModal, {
      width: '400px',
    });
    dialogRef.afterClosed();
  }

  openViewMembroModal() {
    const dialogRef = this.dialog.open(ViewMembroModal, {
      width: '400px',
    });
    dialogRef.afterClosed();
  }
  //#endregion

  //#region Create
  openCreateDespesaModal(): void {
    this.dialog.open(CreateDespesaModal, {
      width: '400px',
    });
  }

  openCreateMembroModal(): void {
    this.dialog.open(CreateMembroModal, {
      width: '400px',
    });
  }

  openCreateCategoriaModal(): void {
    this.dialog.open(CreateCategoriaModal, {
      width: '400px',
    });
  }
  //#endregion

  openChecarFaturaCartaoModal(): void {
    this.dialog.open(ChecarFaturaCartaoModal, {
      width: '400px',
    });
  }
}
