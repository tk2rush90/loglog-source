import {animate, state, style, transition, trigger} from '@angular/animations';

export const fadeOutName = 'fade-out';

export enum fadeOutState {
  void = 'void',
  show = 'show',
}

export const fadeOut = trigger(fadeOutName, [
  state(fadeOutState.void, style({
    opacity: 0,
  })),
  state(fadeOutState.show, style({
    opacity: 1,
  })),
  transition(`${fadeOutState.show} => ${fadeOutState.void}`, animate(150)),
]);
