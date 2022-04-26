import {Injectable} from '@angular/core';
import {ApiBaseService} from '@tk-ui/services/common/api-base.service';
import {environment} from '../../../../environments/environment';
import {combineLatest, map, Observable} from 'rxjs';
import {PagingResponse} from '@tk2blog90/models/paging-response';
import {PostItem} from '@tk2blog90/models/post-item';
import {PostDetail} from '@tk2blog90/models/post-detail';
import {HttpClient} from '@angular/common/http';
import {SortUtil} from '@tk-ui/utils/sort.util';
import {PostMeta} from '@tk2blog90/models/post-meta';
import {PlatformService} from '@tk-ui/services/universal/platform.service';

const {
  dataApi,
  localDataApi,
} = environment;

@Injectable({
  providedIn: 'root'
})
export class DataApiService extends ApiBaseService {

  constructor(
    private http: HttpClient,
    private platformService: PlatformService,
  ) {
    super('', platformService.isBrowser ? dataApi : localDataApi);
  }

  /**
   * Get post list by page.
   * @param page Page number.
   */
  getPostList(page = 0): Observable<PagingResponse<PostItem>> {
    return this.http.get<PagingResponse<PostItem>>(this.endpoint(`/list/${page}.json`));
  }

  /**
   * Get post detail by id.
   * @param id Post id.
   */
  getPostDetail(id: string): Observable<PostDetail> {
    return this.http.get<PostDetail>(this.endpoint(`/post/${id}.json`));
  }

  /**
   * Get draft post by directly access to the post data.
   * @param id Post id.
   */
  getDraftPost(id: string): Observable<PostDetail> {
    return combineLatest([
      this.http.get<PostMeta>(`/assets/posts/${id}/meta.json`),
      this.http.get(`/assets/posts/${id}/index.md`, {
        responseType: 'text',
      }),
    ]).pipe(map(([meta, contents]) => {
      return {
        ...meta,
        created: new Date(meta.publish),
        contents,
        id,
      } as PostDetail;
    }));
  }

  /**
   * Get posts which are filtered by search text.
   * @param search Search text.
   */
  getPostsBySearch(search: string): Observable<PostItem[]> {
    return this.http.get<PostItem[]>(this.endpoint('/lookups/posts.json'))
      .pipe(map(res => {
        // Return filtered data when `search` value is available.
        if (search) {
          return res.filter(post => post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        } else {
          return [];
        }
      }));
  }

  /**
   * Get posts which are filtered by selected tags.
   * @param tags Selected tags.
   */
  getPostsByTags(tags: string[]): Observable<PostItem[]> {
    return this.http.get<PostItem[]>(this.endpoint('/lookups/posts.json'))
      .pipe(map(res => {
        // Return filtered data when there are some selected tags.
        if (tags.length > 0) {
          return res.filter(post => {
            // Get the posts which have the entire selected tags.
            const postTagMap: {[k: string]: boolean} = {};

            post.tags.forEach(tag => {
              postTagMap[tag] = true;
            });

            return tags.every(tag => {
              return postTagMap[tag];
            });
          });
        } else {
          return [];
        }
      }));
  }

  /**
   * Get all available tags.
   */
  getTagList(): Observable<string[]> {
    return this.http.get<string[]>(this.endpoint('/lookups/tags.json'))
      .pipe(map(res => {
        // Order by tag name asc.
        const sortFunction = SortUtil.sortMethodWithOrder<string>('asc');

        return res.sort(sortFunction);
      }));
  }
}
