import { Component, Output, EventEmitter, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge, GridCell } from '../../core/services/interface';

const SYMBOL_POOL = [
  { symbol: '◆', label: 'filled diamond' },
  { symbol: '●', label: 'filled circle'  },
  { symbol: '■', label: 'filled square'  },
  { symbol: '▲', label: 'filled triangle'},
  { symbol: '★', label: 'star' },
];

@Component({
  selector:    'app-image-captcha',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './image-captcha.html',
  styleUrls:   ['./image-captcha.scss'],
})
export class ImageCaptcha implements OnInit {

  @Output() passed = new EventEmitter<void>();
  challenge   = signal<Challenge>(this.buildChallenge());
  showError   = signal(false);
  showSuccess = signal(false);
  errorMsg    = signal('');

  ngOnInit(): void {
    this.refresh();
  }
  selectedCount = computed(() =>
    this.challenge().cells.filter(c => c.selected).length
  );
  correctCount = computed(() =>
    this.challenge().cells.filter(c => c.isTarget).length
  );

  canVerify = computed(() => this.selectedCount() > 0);
  toggleCell(index: number): void {
    if (this.showSuccess()) return; 
    this.showError.set(false);

    this.challenge.update(prev => {
      const cells = [...prev.cells];
      cells[index] = { ...cells[index], selected: !cells[index].selected };
      return { ...prev, cells };
    });
  }
  verify(): void {
    if (!this.canVerify()) return;

    const cells   = this.challenge().cells;
    const correct = cells.every(c => c.isTarget === c.selected);

    if (correct) {
      this.showSuccess.set(true);
      this.showError.set(false);
      setTimeout(() => this.passed.emit(), 800);
    } else {
      this.showError.set(true);
      this.showSuccess.set(false);
      this.errorMsg.set('Some selections are incorrect — try again');
      setTimeout(() => this.refresh(), 800);
    }
  }

  // ── REFRESH ─────────────────────────────────────────────────
  refresh(): void {
    this.challenge.set(this.buildChallenge());
    this.showError.set(false);
    this.showSuccess.set(false);
    this.errorMsg.set('');
  }

  private buildChallenge(): Challenge {
    const targetEntry = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];

    // pick 2–4 random positions out of 9 to be correct
    const positions   = this.pickPositions(9, this.randInt(2, 4));
    const otherPool   = SYMBOL_POOL.filter(s => s.symbol !== targetEntry.symbol);

    const cells: GridCell[] = Array.from({ length: 9 }, (_, i) => {
      const isTarget = positions.includes(i);
      const sym      = isTarget
        ? targetEntry.symbol
        : otherPool[Math.floor(Math.random() * otherPool.length)].symbol;

      return { symbol: sym, isTarget, selected: false };
    });

    return {
      target:      targetEntry.symbol,
      targetLabel: targetEntry.label,
      cells,
    };
  }

  private pickPositions(total: number, n: number): number[] {
    const all = Array.from({ length: total }, (_, i) => i);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, n);
  }

  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}