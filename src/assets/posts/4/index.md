The Angular can serve static html files for SEO without using server.
[Angular prerendering](https://angular.io/guide/prerendering) is key technology to make it work.
However, it is not kind enough to developers.
In some case, it doesn't provide fully detailed error,
and this makes you annoying and confusing.

Fortunately, most of the issues from prerendering is your fault.
So what you need is just the way to figure out problems.

# Http calls in Angular Universal

The Angular is the most perfect web frontend framework.
And the Angular Universal is the most perfect SSR framework with Angular.
When there are some http calls in your project,
basically the Angular Universal waits until the http calls end.

If your application doesn't wait,
there is a high possibility that an error occurred
while rendering components from the server.
Actually, it's not a bug of Angular prerendering.

# Force rendering the components

The way to find out the problems is simple.
Just force rendering the un-rendered component.
Let me show you 2 cases.

This way can show you the errors which are not notified by Angular prerendering.

## When the component is empty

Let's assume that the situation.

You're calling `GET /data` API and the following is a response of it.

```json
{
  "name": "tk2rush90",
  "job": "full-stack developer"
}
```

And your `user.component.ts` and `user-page.component.ts` looks like below.

```typescript
import {Component, Input, OnInit} from '@angular/core';

/**
 * The `user.component.ts` file to display user data.
 */
@Component({
  selector: 'app-user',
  template: `
    <div>
      {{name}}
    </div>
    <div>
      {{job}}
    </div>
  `
})
export class UserComponent implements OnInit {
  /**
   * User data to display.
   */
  @Input() user!: {name: string, job: string};

  constructor() { }

  ngOnInit(): void { }
}
```

```typescript
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * The `user-page.component.ts` file which show user profile.
 */
@Component({
  selector: 'app-user-page',
  template: `
    <app-user
      *ngIf="user"
      [user]="user"></app-user>
  `
})
export class UserPageComponent implements OnInit {
  /**
   * Fetched user data.
   */
  user?: {name: string, job: string};

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this._getData();
  }

  /**
   * Get user data from the backend.
   */
  private _getData(): void {
    this.http.get('/data')
      .subscribe({
        next: res => {
          this.user = res;
        },
      });
  }
}
```

Then, assume that you met empty `<app-user-page>` component
after prerendering your application.
(Actually, the above code will work well. It's just assumption)

In this case, what you can do is rendering `<app-user>` component with mock user data.

```typescript
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * The `user-page.component.ts` file which show user profile.
 */
@Component({
  selector: 'app-user-page',
  template: `
    <app-user
      *ngIf="user"
      [user]="user"></app-user>
  `
})
export class UserPageComponent implements OnInit {
  /**
   * Set mock data force rendering the child component.
   */
  user: {name: string, job: string} = {
    name: 'tk2rush90',
    job: 'full-stack developer',
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    // Comment out calling API.
    // this._getData();
  }

  /**
   * Get user data from the backend.
   */
  private _getData(): void {
    this.http.get('/data')
      .subscribe({
        next: res => {
          this.user = res;
        },
      });
  }
}
```

## When the `<router-outlet>` is not rendered

There may be the case of empty contents without rendering routing components like,

```html
<!-- This is prerendered HTML file of your application. -->
<html lang="en">
  <head>
    <title>Title</title>
  </head>
  <body>
    <app-root>
      <router-outlet></router-outlet>
      <!-- No page component is rendered. -->
    </app-root>
  </body>
</html>
```

Then, use same way above by forcing rendering the page component.

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-page-component><app-page-component>
  `
})
```

# Conclusion

It may not be helpful to you,
but I believe this can be the first step to solve your issues.

If you didn't get any errors with this way,
then you can try another way by searching Google God.
