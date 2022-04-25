import {Component, OnInit} from '@angular/core';
import {SeoService} from '@tk2blog90/services/app/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    // fadeIn,
  ]
})
export class HomeComponent implements OnInit {
  /**
   * Bind fade in animation.
   */
  // @HostBinding(`@${fadeInName}`) fadeIn = fadeInState.show;

  constructor(
    private seoService: SeoService,
  ) { }

  ngOnInit(): void {
    this.seoService.update();
  }

}
