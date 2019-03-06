import { Injectable } from '@angular/core';
import { Hero } from './hero';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
	providedIn: 'root'
})
export class HeroService {

	private heroUrl = 'api/heroes';

	constructor(private http: HttpClient, private messageService: MessageService) { }

	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroUrl).pipe(
			tap(_ => this.log('fetched heroes')),
			catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero with id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`update hero with id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroUrl, hero, httpOptions).pipe(
			tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	deleteHero(hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroUrl}/${id}`;
		return this.http.delete<Hero>(url, httpOptions).pipe(
			tap(_ => this.log(`deleted hero with id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	searchHero(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			return of([]);
		}
		const url = `${this.heroUrl}/?name=${term}`;
		return this.http.get<Hero[]>(url).pipe(
			tap(_ => this.log(`fetched heroes with term=${term}`)),
			catchError(this.handleError<Hero[]>('searcHero', []))
		);
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

		// TODO: send the error to remote logging infrastructure
		console.error(error); // log to console instead

		// TODO: better job of transforming error for user consumption
		this.log(`${operation} failed: ${error.message}`);

		// Let the app keep running by returning an empty result.
		return of(result as T);
		};
	}

}
