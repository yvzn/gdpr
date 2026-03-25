import { Component, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon, MatIconButton, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  menuOpened = output();

  reloadPage(): void {
    window.location.reload();
  }

  openMenu(): void {
    this.menuOpened.emit();
  }
}
