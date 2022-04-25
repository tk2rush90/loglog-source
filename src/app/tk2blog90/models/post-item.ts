import {DateLike} from '@tk-ui/others/types';

export interface PostItem {
  id: string;
  title: string;
  tags: string[];
  created: DateLike;
  thumbnail: string;
}
