import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { EleitorService } from '../eleitor.service';

@Component({
  selector: 'app-eleitor-impressao',
  templateUrl: './eleitor-impressao.component.html',
  styleUrls: ['./eleitor-impressao.component.scss']
})
export class EleitorImpressaoComponent implements OnInit {

  subs: Subscription[] = [];
  _id: string;
  eleitor: any;

  @ViewChild('boxImpressao') boxImpressao;

  constructor(
    private eleitorService: EleitorService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.subs.push(
      this.route.params.subscribe(params => {
        this._id = params['id'];

        if (!this._id) {
          this.spinnerService.hide();
          this.toastr.error('Eleitor não encontrado.');
          return;
        }

        this.subs.push(
          this.eleitorService.getEleitor(this._id)
            .subscribe((eleitor: any) => {

              this.eleitor = eleitor;
              this.spinnerService.hide();

            }, (err) => {
              this.spinnerService.hide();
              this.toastr.error(err.message);
            }));
      }));
  }

  imprimir() {

    let doc = new jspdf('p', 'mm', 'a4');
    let atualHeight = 0;

    doc.setFontSize(22);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text(this.eleitor.nome.toUpperCase(), 105, atualHeight, { align: "center" });

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text('Idade: ', 20, atualHeight);

    doc.setFontStyle('normal');
    doc.text(this.eleitor.idade.toString() + ' anos', 35, atualHeight);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text('Estado civil: ', 140, atualHeight);

    doc.setFontStyle('normal');
    doc.text(this.eleitor.estadoCivil, 167, atualHeight);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    atualHeight += 7;
    doc.text('Endereço: ', 20, atualHeight);

    doc.setFontStyle('normal');
    doc.text(this.eleitor.enderecoCompleto, 42, atualHeight);

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text('Formação Acadêmica', 105, atualHeight, { align: "center" });

    doc.setFontSize(11);
    doc.setFontStyle('normal');
    atualHeight += 10;
    doc.text(this.eleitor.escolaridade, 20, atualHeight);

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 25;
    doc.text('Cursos', 105, atualHeight, { align: "center" });

    atualHeight += 10;
    this.eleitor.curso.forEach(c => {
      doc.setFontSize(11);
      doc.setFontStyle('normal');
      atualHeight += 5;
      doc.text(c.nome, 20, atualHeight);
    });

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 25;
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

      atualHeight += 5;
    });

    doc.setFontSize(16);
    doc.setFontStyle('bold');
    atualHeight += 20;
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

    doc.output('dataurlnewwindow');

    // doc.save(`${this.eleitor.nome}.pdf`);
  }

  getOffsetCenter(doc, text) {
    return (doc.internal.pageSize.width / 2) - (doc.getTextWidth(text) / 2);
  }

}
