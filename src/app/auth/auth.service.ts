import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl + '/auth';

  constructor(private http: HttpClient) { }

  authenticate(user, password) {

    const url = `${this.baseUrl}/authenticate/`;

    const body = { user: user, password: password };

    return this.http.post(url, body).toPromise().then((res: any) => {

      sessionStorage.setItem('iL', res.token);

      return {
        success: true
      };

    }, (err) => {
      return err.error;
    });
  }

  isLoggedIn() {

    const token = this.getToken();

    if (!token) {
      this.destroyToken();
      return false;
    }

    return true;
  }

  public getToken(): any {
    return sessionStorage.getItem('iL');
  }

  private destroyToken(): any {
    return sessionStorage.removeItem('iL');
  }

}
