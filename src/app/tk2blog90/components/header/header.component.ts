import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
