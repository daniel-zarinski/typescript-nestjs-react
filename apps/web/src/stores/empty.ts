import { action, makeObservable } from 'mobx';
import Api from './api';

class Empty extends Api {
  constructor() {
    super('/users');

    makeObservable(this, { test: action });
  }

  @action async test() {
    const test = await this.post({
      url: '',
      data: {
        password: '12345666',
        email: 'daniel@test.ca',
        firstName: 'daniel',
      },
    });
    console.log({ test });
    return test;
  }
}

export default Empty;
