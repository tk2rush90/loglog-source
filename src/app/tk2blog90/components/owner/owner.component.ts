import {Component, HostBinding, OnInit} from '@angular/core';
import {fadeIn, fadeInName, fadeInState} from '@tk2blog90/animations/fade-in';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss'],
  animations: [
    fadeIn,
  ],
})
export class OwnerComponent implements OnInit {
  /**
   * Bind fade in-out animation.
   */
  @HostBinding(`@${fadeInName}`) fadeIn = fadeInState.show;

  constructor() { }

  ngOnInit(): void {
  }

}
