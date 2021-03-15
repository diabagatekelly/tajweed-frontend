import { EventEmitter, Injectable, Output } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from './auth.service';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AlreadyActive implements CanActivate {
  @Output() getAuthStatus: EventEmitter<any> = new EventEmitter();
  @Output() getUser: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService,
    private router: Router) { } 

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.authStatus().pipe(map((response: boolean) => {
          if (response["response"] === true) {
          this.getAuthStatus.emit(false);
          this.router.navigate(['/student-hub']);
          return false;
          }
          this.getAuthStatus.emit(true);
          let user = response["user"]
          this.getUser.emit(user)
          return true;
        
      
    }), catchError((error) => {
      this.getAuthStatus.emit(false);
        this.router.navigate(['/start']);
        return of(false);
    }));
}



  }
  
