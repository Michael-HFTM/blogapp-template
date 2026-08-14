import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-create',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './blog-create.html',
  styleUrl: './blog-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogCreate {
  readonly #formBuilder = inject(FormBuilder);
  readonly #blogService = inject(BlogService);
  readonly #router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly failed = signal(false);

  protected readonly form = this.#formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.failed.set(false);

    const created = await this.#blogService.createBlog(this.form.getRawValue());

    this.saving.set(false);

    if (!created) {
      this.failed.set(true);
      return;
    }

    await this.#router.navigate(['/']);
  }
}
