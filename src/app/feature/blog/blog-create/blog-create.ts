import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  form,
  FormField,
  minLength,
  maxLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

// Erlaubt Buchstaben (inkl. Umlaute/Akzente), Ziffern und Leerzeichen.
const TITLE_PATTERN = /^[\p{L}\p{N} ]+$/u;

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

  blogForm = form(this.blogModel, (s) => {
    required(s.title, { message: 'Titel ist erforderlich' });
    minLength(s.title, 3, { message: 'Titel muss mindestens 3 Zeichen lang sein' });
    maxLength(s.title, 100, { message: 'Titel darf maximal 100 Zeichen lang sein' });
    validate(s.title, ({ value }) => {
      const title = value();
      if (title !== '' && !TITLE_PATTERN.test(title)) {
        return {
          kind: 'noSpecialChars',
          message: 'Titel darf nur Buchstaben, Zahlen und Leerzeichen enthalten',
        };
      }
      return undefined;
    });
    required(s.content, { message: 'Inhalt ist erforderlich' });
    minLength(s.content, 10, { message: 'Inhalt muss mindestens 10 Zeichen lang sein' });
    required(s.category, { message: 'Kategorie ist erforderlich' });
  });

  onSubmit($event: SubmitEvent) {
    $event.preventDefault();

    // submit() markiert alle Felder als touched, prueft die Validierung und
    // ruft die Action nur bei einem gueltigen Formular auf.
    submit(this.blogForm, async () => {
      console.log(this.blogModel());
    });
  }
}

interface BlogData {
  title: string;
  content: string;
  category: string;
}
