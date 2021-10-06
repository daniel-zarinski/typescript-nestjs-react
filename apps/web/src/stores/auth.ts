import { tokenSchema } from '@lib/schema';
import { JWT } from '@lib/shared';
import { isPast } from 'date-fns';
import jwtDecode from 'jwt-decode';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
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

    makeObservable(this, {
      login: action,
      refreshToken: action,
      isRefreshingToken: observable,
      authStorage: observable,
      isLoggingIn: observable,
      setToken: action,
      logout: action,
      expiry: computed,
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
      const tokenResponse = await this.validate(response, tokenSchema);

      if (tokenResponse.isOk()) {
        this.setToken(tokenResponse.value.token);
      }
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
      url: '/refresh',
      data: { token: this.authStorage.token },
    });

    if (response.isOk()) {
      const tokenResponse = await this.validate(response, tokenSchema);

      if (tokenResponse.isOk()) {
        this.setToken(tokenResponse.value.token);
      }
    }

    return response;
  };

  @action setToken = (token: string) => {
    const jwt = jwtDecode<JWT>(token);
    this.authStorage.reset();

    this.authStorage.token = token;
    this.authStorage.jwt = jwt;
  };

  @action logout = () => {
    this.authStorage.reset();
  };

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
