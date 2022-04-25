import {Component, Input, OnInit} from '@angular/core';
import {TagService} from '@tk2blog90/services/app/tag.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class TagListComponent implements OnInit {
  /**
   * Post tags.
   */
  @Input() tags: string[] = [];

  /**
   * Label for tag list.
   */
  @Input() label = 'Tags';

  constructor(
    private tagService: TagService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Get empty state.
   */
  get empty(): boolean {
    return this.tags.length === 0;
  }

  /**
   * Toggle tag selection.
   * @param tag Tag to toggle selection.
   */
  toggleTag(tag: string): void {
    this.tagService.toggleTag(tag);
  }
}
