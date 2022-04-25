import {PostItem} from '@tk2blog90/models/post-item';

export interface PostDetail extends PostItem {
  description: string;
  keywords: string[];
  contents: string;
  banner: string;
  bannerCredit?: {
    name: string;
    id: string;
  };
}
