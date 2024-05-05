import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { GrupoDespesa } from 'src/app/core/interfaces/grupo-despesa.interface';
import { UserService } from 'src/app/domain/auth/services/user/user.service';
import { HomeService } from '../../services/home/home-service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnDestroy, OnInit {
  selectedButton: string = 'dashboard';
  sidenavExpanded = false;
  isDesktop: boolean = true;

  grupoDefault: number;
  private grupoDespesasSubscriber: Subscription;
  grupoDespesas: GrupoDespesa[] = [];

  grupoDespesasForm: FormGroup = new FormGroup({
    grupoDespesaId: new FormControl(),
  });

  constructor(
    private readonly homeService: HomeService,
    private readonly storageService: StorageService,
    private readonly user: UserService,
    public readonly titleService: Title
  ) {
    this.getAllGrupoDespesas();
    this.reloadGrupoDespesas();
    this.setGrupoId();
  }

  ngOnInit() {
    this.selectedButton =
      this.storageService.getItem('selectedButton') || 'dashboard';
  }

  ngOnDestroy(): void {
    if (this.grupoDespesasSubscriber) {
      this.grupoDespesasSubscriber.unsubscribe();
    }
  }

  setSelectedButton(button: string) {
    this.selectedButton = button;
    this.storageService.setItem('selectedButton', button);
  }

  abrirSidenav() {
    this.sidenavExpanded = true;
  }

  fecharSidenav() {
    this.sidenavExpanded = false;
  }

  checkIfMobile(): boolean {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  }

  logout() {
    this.user.logout();
  }

  getAllGrupoDespesas() {
    this.homeService.getAll().subscribe({
      next: (grupoDespesas) => {
        this.grupoDespesas = grupoDespesas;
        this.grupoDefault = grupoDespesas[0].id;

        this.inicializeForm();
      },
    });
  }

  reloadGrupoDespesas() {
    this.grupoDespesasSubscriber =
      this.homeService.realoadGrupoDespesas.subscribe({
        next: (isReload) => {
          if (isReload) {
            this.getAllGrupoDespesas();
          }
        },
      });
  }

  inicializeForm(): void {
    this.grupoDespesasForm.reset({
      grupoDespesaId: this.getGrupoId(),
    });
  }

  getGrupoId(): number {
    let grupoId =
      parseInt(this.storageService.getItem('grupoDespesasId')) ||
      this.grupoDefault;

    let grupo = this.grupoDespesas.find(
      (grupoDespesa) => grupoDespesa.id === grupoId
    );

    if (grupo == null) {
      return this.grupoDefault;
    }
    return grupoId;
  }

  setGrupoId(): void {
    this.grupoDespesasForm
      .get('grupoDespesaId')
      .valueChanges.subscribe((grupoDespesasId) => {
        this.storageService.setItem(
          'grupoDespesasId',
          grupoDespesasId.toString()
        );
        this.homeService.notificarComponentesGrupoIdMudou();
      });
  }
}
