import {animate, state, style, transition, trigger} from '@angular/animations';

export const fadeInName = 'fade-in';

export enum fadeInState {
  void = 'void',
  show = 'show',
}

export const fadeIn = trigger(fadeInName, [
  state(fadeInState.void, style({
    opacity: 0,
  })),
  state(fadeInState.show, style({
    opacity: 1,
  })),
  transition(`${fadeInState.void} => ${fadeInState.show}`, animate(150)),
]);
