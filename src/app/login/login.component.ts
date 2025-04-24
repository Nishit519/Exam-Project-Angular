import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false; // Added loading state

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onForgotPassword(): void {
    const emailControl = this.loginForm.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      alert("Please enter a valid email before requesting password reset.");
      return;
    }

    const email = emailControl.value;
    this.authService.sendResetPasswordEmail(email).subscribe({
      next: (response) => {
        alert("Password reset email sent successfully. Please check your inbox.");
        console.log("Reset email sent:", response);
      },
      error: (error) => {
        console.error("Error sending reset email:", error);
        alert("Failed to send password reset email. Please try again.");
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.loading = true; // Start loading

    const loginData: LoginRequest = this.loginForm.value;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        localStorage.setItem('jwt', response.jwt);
        localStorage.setItem('email', loginData.email);
        this.router.navigate(['/dashboard']);
        this.loading = false; // Stop loading on success
      },
      error: (error) => {
        alert("Login Failed");
        console.error('Login error:', error);
        this.loading = false; // Stop loading on error
      }
    });
  }
}
