import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-author-filter',
  templateUrl: './author-filter.html',
  styleUrl: './author-filter.scss',
})
export class AuthorFilter {
  authors = input.required<string[]>();
  selected = input.required<string>();
  authorChange = output<string>();

  onChange(event: Event): void {
    this.authorChange.emit((event.target as HTMLSelectElement).value);
  }
}
