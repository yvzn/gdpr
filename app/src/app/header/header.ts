import { Component, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { getLocale, setLocale, SupportedLocale } from '../i18n/locale';

@Component({
	selector: 'app-header',
	imports: [MatToolbar, MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger, RouterLink],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class HeaderComponent {
	menuOpened = output();
	currentLocale = getLocale();

	reloadPage(): void {
		window.location.reload();
	}

	openMenu(): void {
		this.menuOpened.emit();
	}

	switchLanguage(locale: SupportedLocale): void {
		if (locale !== this.currentLocale) {
			setLocale(locale);
		}
	}
}
