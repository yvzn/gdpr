import { loadTranslations } from '@angular/localize';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { bootstrapApplication } from '@angular/platform-browser';

import { getLocale } from './app/i18n/locale';
import appFr from './app/i18n/fr.json';
import orgFr from '../projects/organization-feature/src/lib/i18n/fr.json';
import paFr from '../projects/processing-activity-feature/src/lib/i18n/fr.json';

import { appConfig } from './app/app.config';
import { App } from './app/app';

const locale = getLocale();

if (locale === 'fr') {
	registerLocaleData(localeFr);
	loadTranslations({ ...appFr, ...orgFr, ...paFr });
}

$localize.locale = locale;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
