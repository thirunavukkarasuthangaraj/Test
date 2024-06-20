import { Component, OnInit, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-pin-strength',
  templateUrl: './pin-strength.component.html',
  styleUrls: ['./pin-strength.component.scss']
})
export class PinStrengthComponent implements OnInit {

  @Input() public pinToCheck: string;

  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;

  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];

  constructor() { }

  ngOnInit() {
  }

  checkStrength(p) {
    // 1
    let force = 0;

    // 2
    const regex = /[!@#$%^&*()]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /\d+/.test(p);
    const symbols = regex.test(p);

    // 3
    const flags = [lowerLetters,numbers, upperLetters,  symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * p.length + ((p.length >= 4) ? 1 : 0);
    force += passedMatches * 4;

    // 6
    force = (p.length <= 4) ? Math.min(force, 4) : force;

    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;

    return force;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;
    this.setBarColors(4, '#DDD');
    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.setBarColors(c.index, c.color);
    }
  }

  private getColor(s) {
    let index = 0;
    if (s === 8) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else if (s === 30) {
      index = 3;
    } else {
      index = 4;
    }
    return {
      index: index + 1,
      color: this.colors[index]
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }

}
