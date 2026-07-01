import { Component, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaState } from '../../core/services/captcha-state';

@Component({
  selector:    'app-home',              
  standalone:  true,                    // manages its own imports (modern Angular)
  imports:     [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls:   ['./home.scss']
})
export class Home implements OnInit {

  constructor(private router: Router, private captchaState: CaptchaState) {}

  ngOnInit(): void {
    // Clear any existing session state when returning to home
    this.captchaState.clearState();
  }

  navLinks = ['SYSTEM', 'PROCESS', 'PROTOCOL'];

  stats = [
    { value: '3',    label: 'Challenge Layers' },
    { value: '100%', label: 'Client Side'      },
    { value: '0ms',  label: 'Server Calls'     }
  ];

  gridItems = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  gridIcons = ['◈', '◇', '◆', '◉', '◈', '◇', '◆', '◉', '◈'];

  selectedCells = signal<Set<number>>(new Set([0, 4, 8]));
  // signal<Type>(initialValue)
  // stores which grid indexes the user selected

  // ── COMPUTED — derives from signals ───────────────────────
  // Auto-recalculates when selectedCells changes

  selectionCount = computed(() => this.selectedCells().size);
  isVerifyReady = computed(() => this.selectedCells().size >= 3);
  toggleCell(index: number): void {
    this.selectedCells.update(current => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index); 
      } else {
        next.add(index);
      }
      return next;
    });
  }

  /**
   * Check if a specific cell is selected
   * Called by [class.selected]="isCellSelected(i)" in HTML
   */
  isCellSelected(index: number): boolean {
    return this.selectedCells().has(index);
  }

  verifySelection(event?: Event): void {
    if (event) event.preventDefault();
    this.captchaState.reset(); // Reset captcha to stage 1 and navigate
  }
}