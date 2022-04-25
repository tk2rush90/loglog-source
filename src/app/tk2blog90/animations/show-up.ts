import {animate, keyframes, style, transition, trigger} from '@angular/animations';

export const showUpName = 'show-up';

export enum showUpState {
  void = 'void',
  show = 'show',
}

export const showUp = trigger(showUpName, [
  transition(`${showUpState.void} => ${showUpState.show}`, animate(150, keyframes([
    style({
      transform: 'translateY(50px)',
    }),
    style({
      transform: 'translateY(0)',
    }),
  ]))),
]);
