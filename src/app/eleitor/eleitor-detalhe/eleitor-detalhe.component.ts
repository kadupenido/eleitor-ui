import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    const cursos = <FormArray>this.eleitorForm.controls['experiencia'];
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

}
