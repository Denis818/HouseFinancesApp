import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export abstract class BaseService {
  constructor(private http: HttpClient) {}

  protected urlBase: string = 'https://family-finance-api.up.railway.app';

  protected SendHttpRequest(
    metodo: string,
    url: string,
    dados?: any,
    contentType?: any,
    params?: HttpParams
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set(
      'Content-Type',
      contentType ?? 'application/json'
    );

    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    let request = this.http.request(metodo, url, {
      body: dados,
      headers: headers,
      params: params,
    });

    return request.pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(() => error))
    );
  }
}