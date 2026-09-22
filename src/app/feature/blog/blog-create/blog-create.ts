import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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

import { BlogService } from '../blog.service';

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
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);

  readonly categories = ['general', 'technic', 'lifestyle'];

  /** Läuft während des POST — sperrt den Submit-Button gegen Doppelklicks. */
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

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
    // Cross-Field: laeuft dank valueOf() neu, sobald sich der Titel aendert.
    validate(s.content, ({ value, valueOf }) => {
      const content = value();
      const title = valueOf(s.title);
      if (content !== '' && content.length < title.length * 2) {
        return {
          kind: 'contentTooShortForTitle',
          message: `Inhalt muss mindestens doppelt so lang wie der Titel sein (${title.length * 2} Zeichen)`,
        };
      }
      return null;
    });
    required(s.category, { message: 'Kategorie ist erforderlich' });
  });

  onSubmit($event: SubmitEvent) {
    $event.preventDefault();

    // submit() markiert alle Felder als touched, prueft die Validierung und
    // ruft die Action nur bei einem gueltigen Formular auf.
    submit(this.blogForm, async () => {
      this.submitting.set(true);
      this.submitError.set(null);

      const { title, content } = this.blogModel();
      // `category` bleibt bewusst im Formular, wird aber nicht mitgeschickt:
      // weder CreateBlogSchema noch die Blog-Antwort des Backends kennen das Feld.
      const created = await this.blogService.createBlog({ title, content });

      this.submitting.set(false);

      if (created === undefined) {
        this.submitError.set('Der Blog konnte nicht gespeichert werden. Bitte versuche es erneut.');
        return;
      }

      // Die Übersicht lädt in ngOnInit neu, der neue Eintrag ist also sofort da.
      await this.router.navigate(['/']);
    });
  }
}

interface BlogData {
  title: string;
  content: string;
  category: string;
}
