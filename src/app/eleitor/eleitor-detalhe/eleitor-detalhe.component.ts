import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as jspdf from 'jspdf';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { EleitorService } from './../eleitor.service';

@Component({
  selector: 'app-eleitor-detalhe',
  templateUrl: './eleitor-detalhe.component.html',
  styleUrls: ['./eleitor-detalhe.component.scss']
})
export class EleitorDetalheComponent implements OnInit, OnDestroy {

  eleitorForm: FormGroup;
  subs: Subscription[] = [];
  _id: string;
  eleitor: any;

  @ViewChild('txtCurso') txtCurso;

  @ViewChild('txtEmpresa') txtEmpresa;
  @ViewChild('txtFuncao') txtFuncao;
  @ViewChild('txtInicio') txtInicio;
  @ViewChild('txtFim') txtFim;

  constructor(
    private eleitorService: EleitorService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.spinnerService.show();
    this.createForm();
    this.subs.push(
      this.route.params.subscribe(params => {
        this._id = params['id'];
        if (this._id) {
          this.subs.push(
            this.eleitorService.getEleitor(this._id)
              .subscribe((eleitor: any) => {

                this.eleitorForm.patchValue(eleitor);

                if (eleitor.curso) {
                  eleitor.curso.forEach(val => this.novoCurso(val.nome));
                }

                if (eleitor.experiencia) {
                  eleitor.experiencia.forEach(val => this.novaExperiencia(val.empresa, val.funcao, val.inicio, val.fim));
                }

                this.spinnerService.hide();

              }, (err) => {
                this.spinnerService.hide();
                this.toastr.error(err.message);
              })
          )
        } else {
          this.spinnerService.hide();
        }
      }));
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  createForm() {
    this.eleitorForm = this.fb.group({
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

  onFormSubmit(eleitor: any) {

    if (!this.eleitorForm.valid) {
      this.toastr.error('Preencha os campos obrigatorios', 'Falha ao salvar!');
      return;
    }

    this.spinnerService.show();
    this.subs.push(this.eleitorService.salvarEleitor(this._id, eleitor)
      .subscribe((eleitor: any) => {

        this._id = eleitor._id;

        this.createForm();

        this.eleitorForm.patchValue(eleitor);

        if (eleitor.curso) {
          eleitor.curso.forEach(val => this.novoCurso(val.nome));
        }

        if (eleitor.experiencia) {
          eleitor.experiencia.forEach(val => this.novaExperiencia(val.empresa, val.funcao, val.inicio, val.fim));
        }

        this.spinnerService.hide();
        this.toastr.success('Eleitor salvo com sucesso!');

      }, (err) => {
        this.toastr.error(err.message, 'Falha ao salvar!');
        this.spinnerService.hide();
      }));
  }

  novoCurso(nome: string) {
    const cursos = <FormArray>this.eleitorForm.controls['curso'];
    cursos.push(this.fb.group({
      nome: [nome]
    }));
    this.txtCurso.nativeElement.value = '';
  }

  removerCurso(index: number) {
    const cursos = <FormArray>this.eleitorForm.controls['curso'];
    cursos.removeAt(index);
  }

  cursoControls() {
    const cursos = <FormArray>this.eleitorForm.controls['curso'];
    return cursos.controls;
  }

  novaExperiencia(empresa: string, funcao: string, inicio: string, fim: string) {

    const experiencias = <FormArray>this.eleitorForm.controls['experiencia'];

    experiencias.push(this.fb.group({
      empresa: [empresa],
      funcao: [funcao],
      inicio: [inicio],
      fim: [fim]
    }));

    this.txtEmpresa.nativeElement.value = '';
    this.txtFuncao.nativeElement.value = '';
    this.txtInicio.nativeElement.value = '';
    this.txtFim.nativeElement.value = '';
  }

  removerExperiencia(index: number) {
    const experiencias = <FormArray>this.eleitorForm.controls['experiencia'];
    experiencias.removeAt(index);
  }

  experienciaControls() {
    const experiencias = <FormArray>this.eleitorForm.controls['experiencia'];
    return experiencias.controls;
  }

  cancelar() {
    if (confirm('Deseja realmente voltar? Salve os dados!')) {
      this.router.navigate(['/eleitores']);
    }
  }

  imprimir() {
    this.spinnerService.show();
    this.subs.push(
      this.eleitorService.getEleitor(this._id)
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

    let doc = new jspdf('p', 'mm', 'a4');
    let atualHeight = 0;

    doc.setFontSize(22);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text(this.eleitor.nome.toUpperCase(), 105, atualHeight, { align: "center" });

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
    doc.text('Formação Acadêmica', 105, atualHeight, { align: "center" });

    if (this.eleitor.escolaridade) {
      doc.setFontSize(11);
      doc.setFontStyle('normal');
      atualHeight += 10;
      doc.text(this.eleitor.escolaridade, 20, atualHeight);
    }

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 15;
    doc.text('Cursos', 105, atualHeight, { align: "center" });

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
    doc.text('Experiências Profissionais', 105, atualHeight, { align: "center" });

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
    doc.text('Observações', 105, atualHeight, { align: "center" });

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
