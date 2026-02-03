import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BackendconnectionService } from './backendconnection';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isBrowser: boolean;


  constructor(
    private router: Router,
    private backend: BackendconnectionService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string) {
    this.backend.login({ username, password }).subscribe({
      next: (res: any) => {
        if (!res.success) {
          alert(res.message);
          return;
        }

        if (this.isBrowser) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('userid', JSON.stringify(res.userid));
        }

        this.router.navigate(['/landing']);
      },
      error: () => alert('Server error')
    });
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }


  getRole(): string {
    if (!this.isBrowser) return '';
    return localStorage.getItem('role') || '';
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserid
(): string {
    return this.getUser()?.userid || '';
  }



  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('loggedIn') === 'true';
  }
}
