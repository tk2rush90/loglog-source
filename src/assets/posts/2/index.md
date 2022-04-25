The Angular provides powerful support for Server-Side Rendering with Angular Universal.
But when getting some data via HTTP Client, I noticed that
the page calls API twice from the server and browser.
This is the solution to prevent this weirdness.

# Prerequisite

- Angular2+. I used Angular 13.2.0
- Angular Universal. I used `@nguniversal/express-engine^13.0.2`.

# The situation

```typescript
@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.scss'],
})
export class GetDataComponent implements OnInit {
  loading = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    const sub = this.http.get('{endpoint-to-get-data}')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        error: err => console.error(err),
      });

    this.loading = true;
  }
}
```

Imagine that you have the code to get some data by calling API endpoint like above.
If you're not using Angular Universal, the above code doesn't make any issue.
After the component initialized, the `loading` will be `true` until the calling API finished.

But if the Angular Universal is used,
the user may see the completed page for a short time at first,
then will encounter the loading indicator for fetching data again.

# Why it happens?

The Angular is really clever framework and so does Angular Universal.
If there are some API calls when loading the page via server,
the Angular waits until the calling API finished to show completed page.

At that time, the Angular walk through the LifeCycle hooks
from `ngOnInit()` to `ngOnDestory()` to create static HTML markups.
After the page loaded, the Angular calls the LifeCycle hooks again
to make the component's functions to be functional.

Since these works create different instances,
the properties will not be shared.

# To solve it ..

The solution is simple.
Just let Angular know if page is loaded via server or via browser.
To do this, the Angular provides `TransferState`.

# TransferState

The `TransferState` is similar with `LocalStorage`.
But it makes you to keep state between server and browser.

## Add required modules

Before using `TransferState` from your component,
you need to import `BrowserTransferStateModule` and `ServerTransferStateModule`
to the `app.module.ts` and `app.server.module.ts`.

```typescript
// app.module.ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    // Import `BrowserTransferStateModule`
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

```typescript
// app.server.module.ts
@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // Import `ServerTransferStateModule`
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}
```

## Inject TransferState

Next, inject the `TransferState` to your component.

```typescript
@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.scss'],
})
export class GetDataComponent implements OnInit {
  loading = false;

  constructor(
    private http: HttpClient,
    // Inject `TransferState`.
    private transferState: TransferState,
  ) {
  }

  ngOnInit(): void {
    const sub = this.http.get('{endpoint-to-get-data}')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        error: err => console.error(err),
      });

    this.loading = true;
  }
}
```

You can use following methods for `TransferState`.
These methods are similar with methods of `localStraoge`.

- `set<T>(key: StateKey<T>, value: T): void`.
- `get<T>(key: StateKey<T>, defaultValue: T): T`.
- `remove<T>(key: StateKey<T>): void`.

To see full documentation, check here: [TransferState](https://angular.io/api/platform-browser/TransferState).

## Create key and get/set state

Then create the `StateKey` with `makeStateKey()` function.

```typescript
const key = makeStateKey('some-key-name');
```

You can use this key to set and get data from the `TransferState` like below.

```typescript
@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.scss'],
})
export class GetDataComponent implements OnInit {
  loading = false;

  // Create the key for data which should be shared between server and browser.
  private _key = makeStateKey('data-loaded-state');

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
  ) {
  }

  ngOnInit(): void {
    // Call the API endpoint when data loaded state is not `true`
    if (!this.transferState.get<boolean>(this._key, false)) {
      const sub = this.http.get('{endpoint-to-get-data}')
        .pipe(finalize(() => {
          this.loading = false;

          // When the API call ended,
          // Set data loaded state as `true` to prevent the browser's API call.
          this.transferState.set<boolean>(this._key, true);
        }))
        .subscribe({
          error: err => console.error(err),
        });

      this.loading = true;
    }
  }
}
```

Now you don't see the duplicated API calls after the server responded.
But it's not the end.
The component can be destroyed and created again by the browser.
In this case, it won't call the API again because the `data-loaded-state` is still `true`.

You need to remove the data in key like below when the component to be destroyed.

```typescript
@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.scss'],
})
export class GetDataComponent implements OnInit, OnDestroy {
  loading = false;

  private _key = makeStateKey('data-loaded-state');

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
  ) {
  }

  ngOnInit(): void {
    if (!this.transferState.get<boolean>(this._key, false)) {
      const sub = this.http.get('{endpoint-to-get-data}')
        .pipe(finalize(() => {
          this.loading = false;

          this.transferState.set<boolean>(this._key, true);
        }))
        .subscribe({
          error: err => console.error(err),
        });

      this.loading = true;
    }
  }

  ngOnDestroy(): void {
    // Remove the key.
    this.transferState.remove<boolean>(this._key);
  }
}
```

Then everything works well.

# Conclusion

Because it shows just example, I used the loaded state to prevent calling API.
But you can set any data in `TransferState`, like the response of API call.
It means you can render initial state of the component from the server side.

Hope the Angular gets more popular than React or other frameworks 😁
