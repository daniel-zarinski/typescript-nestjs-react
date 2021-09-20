import { configure, makeAutoObservable } from 'mobx';
import Auth from './auth';
import Empty from './empty';

configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

// https://github.com/mobxjs/mobx-utils#frompromise
// https://www.mobxjs.com/best/actions.html
export class RootStore {
  public readonly auth: Auth;
  public readonly empty: Empty;

  constructor() {
    makeAutoObservable(this);

    this.auth = new Auth();
    this.empty = new Empty();

    Object.assign(window, { rootStore: this });
  }
}
