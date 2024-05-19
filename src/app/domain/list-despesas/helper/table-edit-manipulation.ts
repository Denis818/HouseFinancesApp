import { BooleanInput } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import {
  CategoriasMensais,
  ValorInputFornecedor,
  ValorInputItem,
} from 'src/app/shared/enums/enumInputValues';
import { Categoria } from '../../painel-controle/interfaces/categoria.interface';
import { Despesa } from '../../painel-controle/interfaces/despesa.interface';

@Injectable({ providedIn: 'root' })
export class TableEditManipulation {
  private categoriaSelecionada: string;

  aoAlterarCategoria(
    categorias: Categoria[],
    despesa: Despesa,
    categoriaId: number
  ) {
    const categoria = categorias.find((c) => c.id === categoriaId);
    const novaCategoria = categoria?.descricao;

    this.atualizarInputItemEhFornecedor(
      despesa,
      novaCategoria,
      despesa.categoria.descricao
    );

    despesa.categoria.descricao = novaCategoria;
    this.categoriaSelecionada = novaCategoria;
  }
  aoAlterarItem(despesa: Despesa) {
    this.atualizarFornecedor(despesa);
  }

  inputSomenteLeitura(inputCampo: string = ''): BooleanInput {
    if (
      (this.categoriaSelecionada == CategoriasMensais.internet &&
        inputCampo == 'fornecedor') ||
      inputCampo == 'item'
    ) {
      return false;
    }

    if (
      this.categoriaSelecionada == CategoriasMensais.contaDeLuz ||
      this.categoriaSelecionada == CategoriasMensais.condominio ||
      this.categoriaSelecionada == CategoriasMensais.internet ||
      this.categoriaSelecionada == CategoriasMensais.aluguel
    ) {
      return true;
    }

    return false;
  }

  private atualizarInputItemEhFornecedor(
    despesa: Despesa,
    novaCategoria: string,
    categoriaAnterior: string
  ) {
    switch (novaCategoria) {
      case CategoriasMensais.aluguel:
        this.salvarValorAnteriorEAtualizar(
          despesa,
          ValorInputItem.parcelaApPonto
        );
        break;

      case CategoriasMensais.condominio:
        this.salvarValorAnteriorEAtualizar(despesa, ValorInputItem.condominio);
        break;

      case CategoriasMensais.contaDeLuz:
        this.salvarValorAnteriorEAtualizar(despesa, ValorInputItem.contaDeLuz);
        break;

      default:
        this.salvarValorAnteriorEAtualizar(despesa, 'Compra');
        if (
          categoriaAnterior === CategoriasMensais.aluguel ||
          categoriaAnterior === CategoriasMensais.condominio
        ) {
          this.restaurarValorAnterior(despesa);
        }
        break;
    }
  }

  private salvarValorAnteriorEAtualizar(despesa: any, novoItem: string) {
    if (despesa.item !== novoItem) {
      despesa.valorAnteriorItem = despesa.item;
      despesa.item = novoItem;
    }
    this.atualizarFornecedor(despesa);
  }

  private atualizarFornecedor(despesa: any) {
    switch (despesa.item) {
      case ValorInputItem.condominio:
      case ValorInputItem.parcelaApPonto:
        despesa.fornecedor = ValorInputFornecedor.apPonto;
        break;
      case ValorInputItem.parcelaCaixa:
        despesa.fornecedor = ValorInputFornecedor.caixa;
        break;
      case ValorInputItem.contaDeLuz:
        despesa.fornecedor = ValorInputFornecedor.cemig;
        break;
      default:
        despesa.fornecedor = 'Epa';
        break;
    }
  }

  private restaurarValorAnterior(despesa: any) {
    if (
      despesa.valorAnteriorItem &&
      (despesa.item === ValorInputItem.parcelaApPonto ||
        despesa.item === ValorInputItem.condominio)
    ) {
      despesa.item = despesa.valorAnteriorItem;
    }
    this.atualizarFornecedor(despesa);
  }
}
