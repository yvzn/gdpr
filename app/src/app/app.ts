import { Component, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import '@angular/localize';

import { HeaderComponent } from './header/header';
import { MainMenuComponent } from './main-menu/main-menu';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		MatSidenavContainer,
		MatSidenav,
		MatSidenavContent,
		HeaderComponent,
		MainMenuComponent,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	sidenav = viewChild.required(MatSidenav);

	openMenu(): void {
		this.sidenav().open();
	}

	closeMenu(): void {
		this.sidenav().close();
	}
}
