import { HttpStatus } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { action, makeObservable, runInAction } from 'mobx';
import { ResultAsync } from 'neverthrow';

export interface ApiError {
  error: string;
  message: string;
  statusCode: HttpStatus;
  axiosError: AxiosError<ApiError>;
}

export type JSONSerializable = string | number | null | JSON | Date | JSON[];

class Api {
  protected readonly axios: AxiosInstance;
  protected readonly apiUrl: string = 'http://localhost:8080';

  constructor(private readonly baseUrl: string, readonly config?: AxiosRequestConfig) {
    makeObservable(this, {
      get: action,
      post: action,
    });

    this.axios = axios.create({
      ...config,
      baseURL: this.baseUrl,
    });

    this.axios.interceptors.response.use(
      (res) => Promise.resolve(res),
      (err) => {
        throw err; // allows neverthrow to handle axios errors. Note: this stops onResponse interceptors from propagating.
      },
    );
  }

  @action async get<T>({ url, config, setLoading }: { url: string; config?: AxiosRequestConfig; setLoading?: (state: boolean) => void }) {
    setLoading?.(true);
    const result = await ResultAsync.fromPromise(this.axios.get<T>(this.withBaseUrl(url), config), (err) => this.handleAxiosError(err));
    runInAction(() => {
      setLoading?.(false);
    });

    return result;
  }

  @action async post<ReturnType>({
    url,
    data,
    config,
    setLoading,
  }: {
    url: string;
    data: Record<string, JSONSerializable>;
    config?: AxiosRequestConfig;
    setLoading?: (state: boolean) => void;
  }) {
    setLoading?.(true);
    const result = await ResultAsync.fromPromise(this.axios.post<ReturnType>(this.withBaseUrl(url), data, config), (err) =>
      this.handleAxiosError(err),
    );
    runInAction(() => {
      setLoading?.(false);
    });

    return result;
  }

  private withBaseUrl = <T extends Record<string, string | number | boolean>>(url: string, queryParams?: T) => {
    const baseUrl = `${this.apiUrl}${this.baseUrl}/${url}`;

    if (queryParams) {
      baseUrl.concat(
        '?',
        Object.entries(queryParams)
          .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
          .join('&'),
      );
    }

    return baseUrl;
  };

  handleAxiosError = (err: unknown): ApiError => {
    if (axios.isAxiosError(err)) {
      return {
        ...err.response?.data,
        axiosError: err,
      } as ApiError;
    }

    throw err;
  };
}

export default Api;
