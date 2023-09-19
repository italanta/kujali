import { Observable } from 'rxjs';

export const getIpAddressObservable$$ = new Observable(subscriber => {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      subscriber.next(data.ip);
      subscriber.complete();
    })
    .catch(error => {
      subscriber.error(error);
    });
});