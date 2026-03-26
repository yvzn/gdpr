import { Component, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
	MatDivider,
	MatListItem,
	MatListItemIcon,
	MatListItemTitle,
	MatNavList,
} from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-main-menu',
	imports: [
		MatNavList,
		MatListItem,
		MatListItemIcon,
		MatListItemTitle,
		MatIcon,
		MatIconButton,
		MatDivider,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './main-menu.html',
	styleUrl: './main-menu.scss',
})
export class MainMenuComponent {
	menuClosed = output();
	menuItems = [
		{ label: 'Home', icon: 'home', route: '/' },
		{ label: 'Organizations', icon: 'business', route: '/organizations' },
		{ label: 'People', icon: 'people', route: '/people' },
	];
	navigationLinks = [{ label: 'Source code', icon: 'code', url: 'https://github.com/yvzn/gdpr' }];

	closeMenu(): void {
		this.menuClosed.emit();
	}
}
