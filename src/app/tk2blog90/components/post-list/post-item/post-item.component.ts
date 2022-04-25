import {Component, Input, OnInit} from '@angular/core';
import {PostItem} from '@tk2blog90/models/post-item';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  /**
   * Post item.
   */
  @Input() post!: PostItem;

  constructor() { }

  ngOnInit(): void {
  }

}
