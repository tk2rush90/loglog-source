import {animate, state, style, transition, trigger} from '@angular/animations';

export const fadeInOutName = 'fade-in-out';

export enum fadeInOutState {
  void = 'void',
  show = 'show',
}

export const fadeInOut = trigger(fadeInOutName, [
  state(fadeInOutState.void, style({
    opacity: 0,
  })),
  state(fadeInOutState.show, style({
    opacity: 1,
  })),
  transition(`${fadeInOutState.void} <=> ${fadeInOutState.show}`, animate(150)),
]);
