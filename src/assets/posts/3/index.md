이번 포스팅에서는 [Heroku](https://www.heroku.com/home)를
이용해서 슬립모드 없이 24시간 완전 무료로 구동시킬 수 있는 방법에 대해 소개할까 한다.
이 포스팅에서는 Heroku의 기본적인 사용법에 대한 설명은 하지 않는다.

# Heroku

이미 아는 사람들은 알고 있겠지만
Heroku는 Node.js 호스팅이 가능한 상당히 괜찮은 호스팅 서비스이다.
Heroku에 가입하게 되면 기본적으로 한 달에 550시간은 무료로 Dyno를 실행할 수 있다.
이 Dyno라는 것은 리눅스 기반 가상 앱 컨테이너로 Docker 컨테이너와 유사한 개념이라고 생각하면 된다.
사용자는 대쉬보드에서 앱을 생성할 때 마다 하나의 Dyno를 생성하며,
그 안에 Node.js나 파이썬, PHP, 자바 등의 환경을 설치하고 그에 맞는 앱을 Git을 이용해 푸쉬한 뒤 실행시킬 수 있다.

Dyno 생성 개수에 제한은 없는 것으로 알고 있고
생성하는데 비용도 들지 않기 때문에 가벼운 개인 프로젝트 같은 걸 돌릴 때 종종 사용했었는데,
무료 계정으로 사용할 경우 당연히 제약이 있긴 있다.
바로 앞서 말한 월간 무료 Dyno 실행시간이 550시간이라는 것과
30분동안 앱에 아무런 요청이 없으면 앱이 슬립 상태로 들어간다는 것이다.

우선 월간 무료 Dyno 실행 시간이 550시간이라는 것은
하나의 Dyno만 돌리더라도 24시간을 돌린다면 한 달을 채 못 돌린다는 것을 의미한다.
또한 앱이 구동된 뒤에 30분 동안 아무런 요청이 없으면 슬립 상태에 들어가는데,
슬립 상태에 들어간 앱이 누군가의 요청으로 인해 다시 켜질 때는 몇 분 정도의 시간이 걸린다.

하지만 이 두 가지 문제 모두 해결 방법이 존재한다.

# 신용카드 인증

우선 첫 번째, 시간의 문제는 신용카드 인증을 하면 해결된다.
Heroku 게정을 만들고 로그인 한 다음 계정 설정으로 들어가면 Billing 탭에서 신용카드 인증란을 볼 수 있다.
여기서 신용카드 인증을 진행하면 월간 무료 Dyno 실행 시간이 1,000시간으로 늘어난다.
이 과정에서 절대 어떤 것도 결제가 되지 않으니 안심하고 인증하자.

[![신용카드인증](/assets/images/posts/3/credit-card.png)](/assets/images/posts/3/credit-card.png)

# New Relic

다음 해결해야할 과제는 30분 마다 잠드는 잠자는 숲속의 Dyno를 불면증으로 만드는 것이다.
이것을 위해선 New Relic의 애플리케이션 모니터(APM) 기능을 사용할 수 있다.
New Relic APM은 Heroku의 애드온으로 제공되기 때문에 손쉽게 설정할 수 있다.

[![Dyno 설정화면](/assets/images/posts/3/dyno-settings.png)](/assets/images/posts/3/dyno-settings.png)

Heroku에서 Dyno를 생성하고 해당 Dyno 관리 화면으로 들어가면 위와 같은 부분을 볼 수 있다.
저기서 Configure Add-ons를 클릭하면 애드온 관리 화면으로 넘어가는데,
아래와 같이 검색창에서 New Relic을 검색하고 클릭하자.

[![애드온 추가](/assets/images/posts/3/configure-add-ons.png)](/assets/images/posts/3/configure-add-ons.png)

클릭하면 아래와 같은 팝업창이 뜬다.

[![New Relic 추가](/assets/images/posts/3/add-new-relic.png)](/assets/images/posts/3/add-new-relic.png)

우리는 무료로 사용할 예정이기 때문에 다른 거 건들 필요 없이 그냥 'Submit Order Form' 버튼을 누르자.
그럼 애드온 추가가 완료된다.

[![New Relic 추가완료](/assets/images/posts/3/added-new-relic.png)](/assets/images/posts/3/added-new-relic.png)

그러고 나면 위와 같이 New Relic APM 애드온이 추가된 것을 볼 수 있는데
애드온을 사용하기 위해 New Relic APM을 클릭해주자.

클리하면 New Relic APM 페이지로 이동되는데, 거기서 차근차근 시키는대로 내 앱 세팅을 해준다.
이 부분은 새 Dyno 만들고 캡쳐하기가 귀찮아서 생략한다 ㅋㅋ
어려운 건 없기 때문에 차근차근 잘 따라해보자.

# New Relic APM Monitor 설정

[![New Relic 대시보드](/assets/images/posts/3/new-relic-dashboard.png)](/assets/images/posts/3/new-relic-dashboard.png)

설정이 완료되고 나면 아마 이 화면 아니면,

[![New Relic 앱 대시보드](/assets/images/posts/3/new-relic-app-dashboard.png)](/assets/images/posts/3/new-relic-app-dashboard.png)

이 화면을 볼 수 있을거다.

만약 두 번째 화면이 보인다면 좌측 상단에 있는 New Relic One이라고 적힌 로고를 클릭해서 첫 번째 화면으로 이동하자.
이제 우리가 할 일은 일정 시간동안 서버에 핑을 보내는 Monitor를 설정하는 것이다.

[![모니터 설정 단계 1](/assets/images/posts/3/new-relic-step-1.png)](/assets/images/posts/3/new-relic-step-1.png)

첫 번째 화면 상단에 있는 Syntethics를 클릭해주자.

[![모니터 설정 단계 2](/assets/images/posts/3/new-relic-step-2.png)](/assets/images/posts/3/new-relic-step-2.png)

그 다음 우측 상단의 Create monitor를 누르자.

[![모니터 설정 단계 3](/assets/images/posts/3/new-relic-step-3.png)](/assets/images/posts/3/new-relic-step-3.png)

모니터 생성 화면에서 첫 번째로 어떤 타입의 모니터를 생성할 지 선택할 수 있다.
우리는 Dyno를 깨우기만 하면 되기 때문에 cURL을 이용한 간단한 핑만 사용할 예정이다.
첫 번째 항목을 선택하자.

[![모니터 설정 단계 4](/assets/images/posts/3/new-relic-step-4.png)](/assets/images/posts/3/new-relic-step-4.png)

다음으로 모니터 명, 핑을 보낼 URL 주소, 핑 간격을 설정해준다.

[![모니터 설정 단계 5](/assets/images/posts/3/new-relic-step-5.png)](/assets/images/posts/3/new-relic-step-5.png)

마지막으로 어느 지역에서 핑을 보내 테스트할 지 선택하는 부분인데
귀찮으니까 Public locations를 체크해주고 모니터 생성을 완료하면 된다.

# 마무리

이제 모니터가 설정된 Dyno는
잠 들려고 하면 New Relic이 자꾸 찔러서 평생 잠들지 못하게 됐다.
월 1,000 시간 제한 때문에 여러 Dyno를 이렇게 깨워둘 수는 없지만
그래도 무료로 괜찮은 서버가 하나 생긴 셈이니 나쁘지 않지 않은가 ? ㅋㅋㅋ
