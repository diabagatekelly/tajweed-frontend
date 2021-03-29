// import { EventEmitter, Injectable, Output } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { Observable, fromEvent, of } from 'rxjs';
// import { filter, pluck } from "rxjs/operators";
// import {AuthService} from './auth.service';
// import { catchError, map } from 'rxjs/operators';
// import { StorageService } from '../storage.service';


// @Injectable({
//   providedIn: 'root'
// })
// export class AlreadyActive implements CanActivate {
//   @Output() getAuthStatus: EventEmitter<any> = new EventEmitter();
//   @Output() getUser: EventEmitter<any> = new EventEmitter();

//   auth

//   constructor(private storage: StorageService, private router: Router) { } 

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//       this.auth = this.storage.storageChange$.pipe(
//         filter(({ storageArea }) => storageArea === "localStorage"),
//         filter(({ key }) => key === "isAuthenticated"),
//         pluck("value")
//       ).subscribe(res => {
//         console.log(res)
//         if (res === "true") {
//           this.getAuthStatus.emit(false);
//           this.router.navigate(['/student-hub']);
//           return false;
//         }
//         this.getAuthStatus.emit(true);
//         let user = this.storage.storageChange$.pipe(
//           filter(({ storageArea }) => storageArea === "localStorage"),
//           filter(({ key }) => key === "user"),
//           pluck("value")
//         )
//         this.getUser.emit(user)
//         return true;
//       }), 
//       catchError((error) => {
//         this.getAuthStatus.emit(false);
//           this.router.navigate(['/start']);
//           return of(false);
//       });
//       return
//     }
    
//   }
  
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { filter, map, pluck } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { AuthService } from './auth.service';

@Injectable()
export class AlreadyActive implements CanActivate {

constructor(private authService: AuthService,
private Router: Router,
private storage: StorageService) { }


canActivate(route: ActivatedRouteSnapshot, snap: RouterStateSnapshot) {
  let isLoggedIn = localStorage.getItem('isAuthenticated')
  
  
  if (isLoggedIn !== 'true') {
    // this.getAuthStatus.emit(false)
    return true;
    }

    this.Router.navigate(["/student-hub"]);
    return false;

}
}