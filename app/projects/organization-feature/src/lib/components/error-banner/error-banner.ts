import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'lib-error-banner',
	standalone: true,
	imports: [MatIcon, MatButton],
	templateUrl: './error-banner.html',
	styleUrl: './error-banner.scss',
})
export class ErrorBannerComponent {
	message = input.required<string>();
	retried = output();

	retry() {
		this.retried.emit();
	}
}
