import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EleitorService {

  private baseUrl = environment.baseUrl + '/voter';

  constructor(private http: HttpClient) { }

  getEleitores(page: number) {

    const url = `${this.baseUrl}/`;

    const body = {
      page: page,
      filters: {
      },
      sort: {
        nome: 'asc'
      }
    };

    return this.http.post(url, body);
  }

  getEleitor(id: string) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url);
  }

  salvarEleitor(id, eleitor) {
    return this.http.post(this.baseUrl + '/' + id, eleitor);
  }

  apagarEleitor(id: string) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }
}
