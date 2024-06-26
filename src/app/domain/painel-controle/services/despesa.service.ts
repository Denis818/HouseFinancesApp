import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CrudService } from 'src/app/core/services/base/crud.service';
import { environment } from 'src/app/environments/environment';
import { ApiResponse } from 'src/app/shared/interfaces/api/api-response';
import { PaginationResponse } from '../../../shared/utilities/paginator/pagination-response.interface';
import { Despesa } from '../interfaces/despesa.interface';
import { EnumFiltroDespesa } from 'src/app/shared/enums/enum-status-fatura';

@Injectable({ providedIn: 'root' })
export class DespesaService extends CrudService<Despesa> {
  constructor() {
    super(`${environment.base_url_financy}/despesa`);
  }

  public getListDespesasAllGrupos(
    filterItem: string,
    paginaAtual: number,
    itensPorPagina: number,
    tipoFilter: EnumFiltroDespesa
  ): Observable<PaginationResponse<Despesa>> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString())
      .set('filter', filterItem)
      .set('tipoFiltro', tipoFilter);

    return this.sendHttpRequest<ApiResponse<PaginationResponse<Despesa>>>(
      'GET',
      `${this.url}/todos-grupos`,
      null,
      params
    ).pipe(map((response) => response.dados));
  }

  public getListDespesasPorGrupo(
    filterItem: string,
    tipoFilter: EnumFiltroDespesa,
    paginaAtual: number,
    itensPorPagina: number
  ): Observable<PaginationResponse<Despesa>> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString())
      .set('filter', filterItem)
      .set('tipoFiltro', tipoFilter);

    return this.sendHttpRequest<ApiResponse<PaginationResponse<Despesa>>>(
      'GET',
      `${this.url}/por-grupo`,
      null,
      params
    ).pipe(map((response) => response.dados));
  }

  public conferirFaturaDoCartao(faturaCartao: number): Observable<string> {
    const params = new HttpParams().set(
      'faturaCartao',
      faturaCartao.toString()
    );

    return this.sendHttpRequest(
      'GET',
      `${this.url}/calcular-fatura`,
      null,
      params
    ).pipe(map((response: any) => response.dados));
  }
}
