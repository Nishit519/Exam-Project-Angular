import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User, UserPageResponse } from '../user.service'; 
import { Router } from 'express';

@Component({
  standalone: false,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  users: User[] = [];
  page = 0;
  size = 10;
  totalPages = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUserTable(this.page, this.size).subscribe({
      next: (res: UserPageResponse) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }
  
  isValidBase64(image: string): boolean {
    const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return base64Pattern.test(image);
  }

  viewProfile(user: User): void {
    // Example: Navigate to a profile view page with the user's ID
    

    // Or, if you want to log the user data instead
    // console.log('Viewing profile for:', user);
  }

  getUserInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  goToPage(pageNum: number): void {
    this.page = pageNum;
    this.loadUsers();
  }
}
