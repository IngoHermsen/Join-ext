import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private authService: AuthService) {
      
    }

    


  }
