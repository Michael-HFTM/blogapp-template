import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-blog-create',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './blog-create.html',
  styleUrl: './blog-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogCreate {
  readonly categories = ['general', 'technic', 'lifestyle'];

  blogModel = signal<BlogData>({
    title: '',
    content: '',
    category: 'general',
  });

  blogForm = form(this.blogModel);

  onSubmit($event: SubmitEvent) {
    $event.preventDefault();
    console.log(this.blogModel());
  }
}

interface BlogData {
  title: string;
  content: string;
  category: string;
}
