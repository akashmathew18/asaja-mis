import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private auth: AuthService) { }

  login() {
    if (!this.username || !this.password) {
      alert('Enter username and password');
      return;
    }
    this.auth.login(this.username, this.password);
  }
}
