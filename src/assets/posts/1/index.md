이번 포스팅은 별도의 라이브러리 없이 자바스크립트 기본 기능만으로 달력을 만들 수 있는 함수를 만드는 것.
그러나 타입스크립트로 작성된 😁
글 전체에 설명은 타입스크립트로 진행하지만 맨 하단에 자바스크립트용 코드도 적어놨다.

# 개요

자바스크립트에서 달력을 구현할 수 있는 다양한 라이브러리들이 있지만
나는 직접 뭔가 만들어서 사용하는 것을 더 선호하는 편이다.

코딩 관련 일을 할 때면 매번 다른 디자인의 다양한 요구사항들을 처리해야하는 경우가 많은데
라이브러리들은 제한된 기능을 제공하거나, UI랑 밀접하게 연결되어 있기 때문에
제공하는 것을 수정하거나 그 외의 기능을 구현하기 위해 상당한 노력을 들여야하는 경우가 종종 있기 때문이다.

그래서 달력을 만드는 기능도 따로 만들게 되었다.

# Interfaces

우선 달력 생성 옵션을 위한 인터페이스들을 만들어주자.

## CalendarOptions

```typescript
/**
 * option to create calendar dates
 */
export interface CalendarOptions {
  /**
   * set the year to get calendar dates
   * default value is current year
   */
  year?: NumberLike;

  /**
   * set the month to get calendar dates
   * default value is current month
   * starts from `0`
   */
  month?: NumberLike;

  /**
   * set the starting day of week
   * default value is `0`
   */
  startingDayOfWeek?: number;
}
```

달력에서 특정 년/월의 날짜들을 표시하기 위해서는 '년'과 '월'이 필요하다.
그리고 종종 한 주의 시작을 월요일부터 하게 해달라는 요청도 있었기 때문에
달력 만드는 함수를 위한 옵션에 `startingDayOfWeek`라는 필드를 넣었다.

## CompletedCalendarOptions

```typescript
/**
 * calendar option with non-empty values
 */
export interface CompletedCalendarOptions {
  year: number;
  month: number;
  startingDayOfWeek: number;
}
```

그리고 개발의 편의성을 위해 `CompletedCalendarOptions` 라는 인터페이스도 만들어준다.
이 인터페이스는 `CalendarOptions`와 동일하지만
모든 필드의 값이 다 채워져있어야 한다.

# CalendarDate

```typescript
export class CalendarDate {
  /**
   * year of calendar date
   */
  year: number;

  /**
   * month of calendar date
   */
  month: number;

  /**
   * date of calendar date
   */
  date: number;

  /**
   * day of week of calendar date
   */
  dayOfWeek: number;

  /**
   * original date object
   */
  originalObject: Date;

  /**
   * create calendar date model
   * @param date date
   */
  constructor(date: Date) {
    this.originalObject = date;
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.date = date.getDate();
    this.dayOfWeek = date.getDay();
  }
}
```

다음 만든 것은 `CalendarDate`라는 클래스이다.
이 클래스는 `Date` 객체를 받아서 생성되며 달력 표시에 필요한 값들을 담는다.

# calendar 함수 (타입스크립트)

```typescript
/**
 * return the date list for specific year and month
 * @param options option to create calendar
 */
function calendar(options?: CalendarOptions): CalendarDate[] {
  // Today's date to set initial `year`, `month` of calendar options.
  const date = new Date();
  const {
    year = date.getFullYear(),
    month = date.getMonth(),
    startingDayOfWeek = 0
  } = (options || {}) as CompletedCalendarOptions;

  let calendarStartDate: Date;
  const monthStartDate = new Date(year, month, 1);
  const monthStartDayOfWeek = monthStartDate.getDay();

  // calculate starting date of calendar
  if (monthStartDayOfWeek > startingDayOfWeek) {
    calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
  } else if (monthStartDayOfWeek < startingDayOfWeek) {
    calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
  } else {
    calendarStartDate = monthStartDate;
  }

  // create calendar dates
  const dates: CalendarDate[] = [];
  const calendarStartYear = calendarStartDate.getFullYear();
  const calendarStartMonth = calendarStartDate.getMonth();
  let calendarDate = calendarStartDate.getDate();

  // create 42 dates
  while (dates.length < 42) {
    dates.push(new CalendarDate(new Date(calendarStartYear, calendarStartMonth, calendarDate)));

    calendarDate++;
  }

  return dates;
}
```

그리하여 만들어진 `calendar()` 함수는 위와 같다.

하나씩 한 번 뜯어보면,

```typescript
const date = new Date();
const {
  year = date.getFullYear(),
  month = date.getMonth(),
  startingDayOfWeek = 0
} = (options || {}) as CompletedCalendarOptions;
```

이 부분은 옵션의 각 값들을 초기화 시켜주는 부분이다.

`options`가 없을 경우 빈 객체`{}`를 생성하고, `year` 값이 없으면 오늘 날짜의 년도 값을,
`month` 값이 없으면 오늘 날짜의 월 값을,
`startingDayOfWeek` 값이 없으면 `0`을 채워준다.

그리고 타입스크립트의 이점을 사용하기 위해 이 객체를 `CompletedCalendarOptions` 타입으로 읽도록 한다.

```typescript
let calendarStartDate: Date;
const monthStartDate = new Date(year, month, 1);
const monthStartDayOfWeek = monthStartDate.getDay();

// calculate starting date of calendar
if (monthStartDayOfWeek > startingDayOfWeek) {
  calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
} else if (monthStartDayOfWeek < startingDayOfWeek) {
  calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
} else {
  calendarStartDate = monthStartDate;
}
```

그 다음 해준 일은 달력에서 특정 년/월에 표시될 시작일을 계산해주는 부분이다.

[![달력](/assets/images/posts/1/calendar.png)](/assets/images/posts/1/calendar.png)

달력을 보면 위와 같이 이전 월과 다음 월의 날짜들이 일부 표시되는데,
위 부분은 이전 월을 어디부터 표시할 지 계산하는 부분이다.

우선,

```typescript
const monthStartDate = new Date(year, month, 1);
const monthStartDayOfWeek = monthStartDate.getDay();
```

이 부분을 이용해 이번 월의 시작일이 무슨 요일인지를 구한다. `Date` 객체의 `getDay()`는
현재 날짜의 요일을 반환하는 메서드로, `0`이 일요일, `6`이 토요일이다.

`CompletedCalendarOptions`에서 `startingDayOfWeek`를 `0`으로 초기화 시켜주는 이유는
일반적으로 달력에서 한 주의 시작을 일요일로 잡기 때문이다.

```typescript
if (monthStartDayOfWeek > startingDayOfWeek) {
  calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
} else if (monthStartDayOfWeek < startingDayOfWeek) {
  calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
} else {
  calendarStartDate = monthStartDate;
}
```

그리고 여기서는 `startingDayOfWeek` 값에 따라 달력의 시작 날짜를 결정하는 부분이다.

`startingDayOfWeek`가 `monthStartDayOfWeek`와 동일한 값이라면 `x년 x월 1일`이 `startingDayOfWeek`와 같다는 말이기 때문에
`monthStartDate`를 `calendarStartDate`로 사용해준다.

만약 `monthStartDayOfWeek`가 `startingDayOfWeek`보다 크다면 아래와 같은 상황을 생각해볼 수 있다.

달력이 일요일`0`부터 시작했으면 하는데 해당 월의 1일은 위에 나온 달력 사진처럼 화요일`2`인 셈이다.
이 경우 `calendarStartDate`는 해당 월의 1일부터 차이가 나는 만큼을 빼주면 된다.

반대로 `startingDayOfWeek`가 `monthStartDayOfWeek`보다 크다면 어떨까?

그런 경우는 달력이 수요일`3`부터 시작했으면 좋겠는데 (이런 달력은 잘 없겠지만 .. ㅋㅋㅋ)
해당 월의 1일이 일요일`0`인 경우를 생각해볼 수 있다.

이때 그려져야할 달력의 모습은 아래와 같다.

[![수요일 달력](/assets/images/posts/1/wed-calendar.png)](/assets/images/posts/1/wed-calendar.png)

각 요일별 값과 변수를 여기에 대입해보면

[![수요일 달력 계산](/assets/images/posts/1/wed-calendar-calc.png)](/assets/images/posts/1/wed-calendar-calc.png)

이와 같은 모양이 나오는데, 위 그림을 보면 달력의 시작일을 구하기 위해선 `a + b`의 값을 현재 날짜에서
빼주면 된다는 결론을 얻을 수 있다.

여기서 `a` 는 `Date` 객체의 `getDay()` 메서드로 얻을 수 있는 최대값인 `6`에서 `startingDayOfWeek`를 빼면 얻을 수 있고,
`b`는 `monthStartDayOfWeek`에 `1`을 더하면 얻을 수 있다.

따라서

```typescript
calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
```

와 같은 공식이 나오게 되는 것이다.

이제 달력 표시에 필요한 년/월/일을 얻었으니 루프를 돌며 `CalendarDate` 클래스의 인스턴스를 생성해주면 끝이다.

나는 총 42개의 `CalendarDate` 인스턴스를 생성하도록 했는데, 그 이유는 이 정도 숫자면
어떤 경우에도 이전 월과 다음 월의 날짜까지 포함한 달력을 제대로 만들어낼 수 있기 때문이다.

이 부분은 윈도우즈 달력을 보고 영감을 얻어 결정된 부분이다. 이렇게 타입스크립트로 달력을 구현하는 함수 완성 !
이 뒤에 할 일은 이 함수로 생성된 `CalendarDate`들을 UI에 적절히 매핑해주면 되는 부분이기 때문에 생략한다.

# calendar 함수 (자바스크립트)

```javascript
/**
 * Calendar date object.
 * @param date {Date} Date object.
 */
function CalendarDate(date) {
  this.originalObject = date;
  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.date = date.getDate();
  this.dayOfWeek = date.getDay();
}

/**
 * Create calendar dates.
 * @param options {{
 *   year: number=,
 *   month: number=,
 *   startingDayOfWeek: number=
 * }=} Options to create calendar dates.
 * @return {CalendarDate[]}
 */
function calendar(options) {
  // Today's date to set initial `year`, `month` of calendar options.
  const date = new Date();
  const {year = date.getFullYear(), month = date.getMonth(), startingDayOfWeek = 0} = (options || {});
  
  let calendarStartDate;
  const monthStartDate = new Date(year, month, 1);
  const monthStartDayOfWeek = monthStartDate.getDay();
  
  // calculate starting date of calendar
  if (monthStartDayOfWeek > startingDayOfWeek) {
    calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
  } else if (monthStartDayOfWeek < startingDayOfWeek) {
    calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
  } else {
    calendarStartDate = monthStartDate;
  }
  
  // create calendar dates
  const dates = [];
  const calendarStartYear = calendarStartDate.getFullYear();
  const calendarStartMonth = calendarStartDate.getMonth();
  let calendarDate = calendarStartDate.getDate();
  
  // create 42 dates
  while (dates.length < 42) {
    dates.push(new CalendarDate(new Date(calendarStartYear, calendarStartMonth, calendarDate)));
    
    calendarDate++;
  }
  
  return dates;
}
```

# 실행결과

[![실행 결과 ](/assets/images/posts/1/calendar-result.png)](/assets/images/posts/1/calendar-result.png)
