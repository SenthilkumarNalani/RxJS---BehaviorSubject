import { fromEvent, Subject, BehaviorSubject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

const loggedInSpan: HTMLElement = document.querySelector('span#logged-in');
const loginButton: HTMLElement = document.querySelector('button#login');
const logoutButton: HTMLElement = document.querySelector('button#logout');
const printStateButton: HTMLElement =
  document.querySelector('button#print-state');

// Note: However, there is one issue. If we refresh the app, we can see both buttons and we don't see the current login state in the navigation bar. That's due to the nature of the regular Subject. It's good for multicasting some value or some event, but it doesn't have the memory to keep the latest emitted state or the initial value. In our example, the BehaviorSubject would be a better match.
// const isLoggedIn$ = new Subject<Boolean>();
const isLoggedIn$ = new BehaviorSubject<Boolean>(false);

fromEvent(loginButton, 'click').subscribe(() => isLoggedIn$.next(true));
fromEvent(logoutButton, 'click').subscribe(() => isLoggedIn$.next(false));

// Consider Navigation bar is a separate component to understand the power of RxJS Subject
isLoggedIn$.subscribe(
  (isLoggedIn) => (loggedInSpan.innerText = isLoggedIn.toString())
);

// Buttons component
isLoggedIn$.subscribe((isloggedIn) => {
  logoutButton.style.display = isloggedIn ? 'block' : 'none';
  loginButton.style.display = !isloggedIn ? 'block' : 'none';
});

// fromEvent(printStateButton, 'click').subscribe(
//   () => console.log('User is logged in: ', isLoggedIn$.value)
// );
// or
// Another way of achieving this in a more reactive way is to use the 'pipe' method on the 'fromEvent' Observable and to add the 'withLatestFrom' operator imported from 'rxjs/operators'. And let's pass our 'isLoggedIn$' BehaviorSubject.
fromEvent(printStateButton, 'click')
  .pipe(withLatestFrom(isLoggedIn$))
  .subscribe(([event, islOggedIn]) => {
    console.log('User is logged in: ', islOggedIn);
  });
// Note: Above are the two ways how we could get the stored value from the BehaviorSubject's memory
