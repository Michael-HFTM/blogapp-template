import { bootstrapApplication } from '@angular/platform-browser';
import { z } from 'zod';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Ohne das prüft zod per `new Function('')`, ob es seinen JIT-Pfad nutzen darf.
// Unsere CSP erlaubt kein 'unsafe-eval': zod fängt den Fehler zwar ab und
// validiert korrekt weiter, der Browser meldet den Verstoss aber trotzdem in der
// Konsole. `jitless` überspringt die Probe und damit die falsche Fehlermeldung.
z.config({ jitless: true });

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
