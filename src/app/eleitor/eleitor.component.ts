import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { EleitorService } from './eleitor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eleitor',
  templateUrl: './eleitor.component.html',
  styleUrls: ['./eleitor.component.scss']
})
export class EleitorComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  eleitores: any;
  page: number = 1;
  previousPage: number;
  total: number;
  buscaForm: FormGroup;

  constructor(
    private eleitorService: EleitorService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.createForm();
    this.buscarEleitores();
  }

  buscarEleitores() {
    this.spinnerService.show();
    this.subs.push(this.eleitorService.getEleitores(this.page, this.buscaForm.value)
      .subscribe((data: any) => {
        this.eleitores = data.docs;
        this.page = data.page;
        this.total = data.total;
        this.spinnerService.hide();
      }, (err) => {
        this.spinnerService.hide();
        this.toastr.error(err.message);
      }));
  }

  loadPage(page: number) {
    if (page != this.previousPage) {
      this.previousPage = page;
      this.buscarEleitores();
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  apagarEleitor(id) {
    if (confirm('Deseja realmente apagar esse eleitor?')) {
      this.subs.push(
        this.eleitorService.apagarEleitor(id).subscribe(() => {
          this.toastr.success('Eleitor removido!');
          this.buscarEleitores();
        }, err => {
          this.toastr.error(err.message || err, 'Falha ao remover eleitor!');
        })

      )
    }
  }

  createForm() {
    this.buscaForm = this.fb.group({
      nome: [''],
      cpf: [''],
      rg: [''],
      nascimento: [''],
      sexo: [''],
      estadoCivil: [''],
      nacionalidade: [''],
      naturalidade: [''],
      titulo: [''],
      zona: [''],
      secao: [''],
      telefone: [''],
      celular: [''],
      email: [''],
      cnh: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      municipio: [''],
      cep: [''],
      uf: [''],
      escolaridade: [''],
      obs: [''],
      responsavel: [''],
      curso: this.fb.array([]),
      experiencia: this.fb.array([])
    });
  }

  imprimir(id: string) {
    this.router.navigate(['/impressao', id]);
  }

}
