import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { EleitorService } from './eleitor.service';

@Component({
  selector: 'app-eleitor',
  templateUrl: './eleitor.component.html',
  styleUrls: ['./eleitor.component.scss']
})
export class EleitorComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  eleitores: any;
  page = 1;
  previousPage: number;
  total: number;
  buscaForm: FormGroup;
  eleitor: any;

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

      );
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
      curso: [''],
      experiencia: this.fb.array([])
    });
  }

  imprimir(id: string) {
    this.spinnerService.show();
    this.subs.push(
      this.eleitorService.getEleitor(id)
        .subscribe((eleitor: any) => {

          this.eleitor = eleitor;
          this.spinnerService.hide();
          this.imprimirPdf();

        }, (err) => {
          this.spinnerService.hide();
          this.toastr.error(err.message);
        }));
  }

  imprimirPdf() {

    const doc = new jspdf('p', 'mm', 'a4');
    let atualHeight = 0;

    doc.setFontSize(22);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text(this.eleitor.nome.toUpperCase(), 105, atualHeight, { align: 'center' });

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    atualHeight += 20;
    doc.text('Idade: ', 20, atualHeight);

    if (this.eleitor.idade) {
      doc.setFontStyle('normal');
      doc.text(this.eleitor.idade.toString() + ' anos', 35, atualHeight);
    }

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text('Estado civil: ', 140, atualHeight);

    if (this.eleitor.estadoCivil) {
      doc.setFontStyle('normal');
      doc.text(this.eleitor.estadoCivil, 167, atualHeight);
    }

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    atualHeight += 7;
    doc.text('Endereço: ', 20, atualHeight);

    doc.setFontStyle('normal');
    doc.text(this.eleitor.enderecoCompleto, 42, atualHeight);

    if (this.eleitor.telefones) {
      doc.setFontSize(12);
      doc.setFontStyle('bold');
      atualHeight += 7;
      doc.text('Telefone: ', 20, atualHeight);

      doc.setFontStyle('normal');
      doc.text(this.eleitor.telefones, 40, atualHeight);
    }

    if (this.eleitor.email) {
      doc.setFontSize(12);
      doc.setFontStyle('bold');
      atualHeight += 7;
      doc.text('E-mail: ', 20, atualHeight);

      doc.setFontStyle('normal');
      doc.text(this.eleitor.email, 35, atualHeight);
    }

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 20;
    doc.text('Formação Acadêmica', 105, atualHeight, { align: 'center' });

    if (this.eleitor.escolaridade) {
      doc.setFontSize(11);
      doc.setFontStyle('normal');
      atualHeight += 10;
      doc.text(this.eleitor.escolaridade, 20, atualHeight);
    }

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 15;
    doc.text('Cursos', 105, atualHeight, { align: 'center' });

    atualHeight += 5;
    this.eleitor.curso.forEach(c => {
      doc.setFontSize(11);
      doc.setFontStyle('normal');
      atualHeight += 5;
      doc.text(c.nome, 20, atualHeight);
    });

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 15;
    doc.text('Experiências Profissionais', 105, atualHeight, { align: 'center' });

    atualHeight += 10;
    this.eleitor.experiencia.forEach(e => {
      doc.setFontSize(11);
      doc.setFontStyle('bold');
      atualHeight += 5;
      doc.text(e.empresa, 20, atualHeight);

      atualHeight += 5;
      doc.text('Função: ', 20, atualHeight);

      doc.setFontStyle('normal');
      doc.text(e.funcao, 37, atualHeight);

      if (e.inicio) {
        atualHeight += 5;
        doc.setFontStyle('bold');
        doc.text('Início: ', 20, atualHeight);

        doc.setFontStyle('normal');
        doc.text(e.inicio, 37, atualHeight);
      }

      if (e.fim) {
        doc.setFontStyle('bold');
        doc.text('Término: ', 70, atualHeight);

        doc.setFontStyle('normal');
        doc.text(e.fim, 90, atualHeight);
      }

      atualHeight += 5;
    });

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 10;
    doc.text('Observações', 105, atualHeight, { align: 'center' });

    doc.setFontSize(11);
    doc.setFontStyle('normal');
    atualHeight += 15;
    doc.text('Venho expressar meu interesse em trabalhar nessa empresa, almejando conhecimento e novas', 20, atualHeight, { align: "justify" });

    atualHeight += 8;
    doc.text('novas experiências para crescermos profissionalmente juntos.', 20, atualHeight, { align: "justify" });


    atualHeight += 8;
    doc.text('Procuro trabalhar sempre em equipe, adaptando-me às regras e contribuindo para o', 20, atualHeight, { align: "justify" });

    atualHeight += 8;
    doc.text('desenvolvimento da empresa.', 20, atualHeight, { align: "justify" });


    atualHeight += 8;
    doc.text('Na expectativa de um breve retorno agradeço essa oportunidade.', 20, atualHeight, { align: "justify" });

    // doc.output('dataurlnewwindow');

    doc.save(`${this.eleitor.nome}.pdf`);
  }

}
