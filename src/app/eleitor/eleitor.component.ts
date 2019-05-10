import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { EleitorService } from './eleitor.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Console } from '@angular/core/src/console';

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

  constructor(
    private eleitorService: EleitorService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.buscarEleitores();
  }

  buscarEleitores() {
    this.spinnerService.show();
    this.subs.push(this.eleitorService.getEleitores(this.page)
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

}
