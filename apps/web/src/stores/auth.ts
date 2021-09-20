import { JWT } from '@lib/shared';
import { isPast } from 'date-fns';
import jwtDecode from 'jwt-decode';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction, toJS } from 'mobx';
import { localStored } from 'mobx-stored';
import Api from './api';

interface AuthStorage {
  token: string;
  jwt: JWT;
}

export type LoginResponse = {
  token: string;
};

class Auth extends Api {
  @observable authStorage: AuthStorage & ReturnType<typeof localStored>;

  constructor(private readonly storageKey = 'auth') {
    super('auth');
    console.log('constructor');

    makeObservable(this, {
      login: action,
      refreshToken: action,
      isRefreshingToken: observable,
      authStorage: observable,
      isLoggingIn: observable,
      setToken: action,
      logout: action,
      expiry: computed,
      token: computed,
      isExpired: computed,
    });
    this.onResponseExpired();

    this.authStorage = localStored<AuthStorage>(this.storageKey, {
      token: null,
      jwt: {},
    });

    this.bearerDisposer = reaction(
      () => !!this.authStorage.token,
      () => {
        this.addBearer();
      },
    );
  }

  @observable isLoggingIn = false;
  @action login = async (payload: { email: string; password: string }) => {
    const response = await this.post<LoginResponse>({
      setLoading: (loading) => (this.isLoggingIn = loading),
      url: '/login',
      data: payload,
    });

    if (response.isOk()) {
      const { token } = response.value.data;

      this.setToken(token);
    }

    if (response.isErr()) {
      console.error({
        ...response.error,
      });
    }

    return response;
  };

  @observable isRefreshingToken = false;
  @action refreshToken = async () => {
    if (!this.authStorage.token) return;

    const response = await this.post<LoginResponse>({
      setLoading: (loading) => (this.isRefreshingToken = loading),
      url: '/login',
      data: { token: this.authStorage.token },
    });

    if (response.isOk()) {
      const { token } = response.value.data;

      this.setToken(token);
    }

    return response;
  };

  @action setToken = (token: string) => {
    const jwt = jwtDecode<JWT>(token);
    this.authStorage.reset();

    this.authStorage.token = token;
    this.authStorage.jwt = toJS(jwt);
  };

  @action logout = () => {
    this.authStorage.destroy();
  };

  @computed get token() {
    if (!this.authStorage.token) return null;
    if (new Date().getTime() - this.authStorage.jwt.exp > 0) return null;

    const token = this.authStorage.token.match(/(?:Bearer\s+)?(\w+\.\w+\.\w+)/);
    if (token && token.length > 1) return token[1];

    return null;
  }

  @computed get expiry() {
    if (!this.authStorage.jwt.exp) return null;

    return new Date(this.authStorage.jwt.exp);
  }

  @action keepAlive() {
    if (this.canRefreshToken) {
      this.refreshToken();
    }
  }

  private addBearer = () => {
    if (!this.authStorage.token) return;

    this.axios.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${this.authStorage.token}`,
      },
    }));
  };

  private onResponseExpired = () => {
    this.axios.interceptors.response.use(
      (res) => res,
      (error) => Promise.reject(error),
    );
  };

  @computed get canRefreshToken() {
    return new Date().getTime() - this.authStorage.jwt.exp > 3600;
  }

  @computed get isExpired() {
    return isPast(this.authStorage.jwt.exp);
  }

  private bearerDisposer: IReactionDisposer;

  dispose = () => {
    this.bearerDisposer();
  };
}

export default Auth;
