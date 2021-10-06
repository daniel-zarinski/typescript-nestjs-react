import { configure, makeAutoObservable } from 'mobx';
import { RouterStore } from 'mobx-react-router';
import Auth from './auth';

configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

// https://github.com/mobxjs/mobx-utils#frompromise
// https://www.mobxjs.com/best/actions.html
export class RootStore {
  public readonly auth: Auth;
  public readonly routingStore: RouterStore;

  constructor() {
    makeAutoObservable(this);

    this.auth = new Auth();
    this.routingStore = new RouterStore();

    // if (process.env.DEV) Object.assign(window, { rootStore: this });
    Object.assign(window, { rootStore: this });
  }

  dispose() {
    this.auth.dispose();
  }
}
