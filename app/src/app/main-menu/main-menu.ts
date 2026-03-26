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
		{ label: $localize`:@@app.menu.home:Home`, icon: 'home', route: '/' },
		{
			label: $localize`:@@app.menu.organizations:Organizations`,
			icon: 'business',
			route: '/organizations',
		},
		{ label: $localize`:@@app.menu.people:People`, icon: 'people', route: '/people' },
	];
	navigationLinks = [
		{
			label: $localize`:@@app.menu.sourceCode:Source code`,
			icon: 'code',
			url: 'https://github.com/yvzn/gdpr',
		},
	];

	closeMenu(): void {
		this.menuClosed.emit();
	}
}
