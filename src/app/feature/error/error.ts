import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {}
