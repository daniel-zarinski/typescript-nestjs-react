import { ApiError } from '@lib/shared';
import { YupValues } from '@lib/schema';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { action, makeObservable, runInAction } from 'mobx';
import { Ok, Result, ResultAsync } from 'neverthrow';
import { AnyObjectSchema, ValidationError } from 'yup';

export type JSONSerializable = string | number | null | JSON | Date | JSON[];
export type Loading = (state: boolean) => void;

export interface GetParams {
  url?: string;
  config?: AxiosRequestConfig;
  setLoading?: Loading;
}
export interface PostParams extends GetParams {
  data: Record<string, JSONSerializable>;
}

class Api {
  protected readonly axios: AxiosInstance;
  private readonly baseUrl: string = process.env.API_URL ?? 'http://localhost:8080';
  private readonly apiVersion = process.env.API_VERSION ?? 'v1';
  protected readonly apiUrl: string;

  constructor(private readonly basePath: string, readonly config?: AxiosRequestConfig) {
    makeObservable(this, {
      get: action,
      post: action,
    });

    this.apiUrl = [this.baseUrl, this.apiVersion, this.basePath].join('/');

    this.axios = axios.create({
      ...config,
      baseURL: this.apiUrl,
    });

    this.axios.interceptors.response.use(
      (res) => Promise.resolve(res),
      (err) => {
        throw err; // allows neverthrow to handle axios errors. Note: this stops onResponse interceptors from propagating.
      },
    );
  }

  @action async get<T>({ url, config, setLoading }: GetParams) {
    setLoading?.(true);
    const result = await ResultAsync.fromPromise(
      this.axios.get<T>(this.withBaseUrl(url), config),
      (err) => this.handleAxiosError(err),
    );
    runInAction(() => {
      setLoading?.(false);
    });

    return result;
  }

  @action async post<ReturnType>({ url, data, config, setLoading }: PostParams) {
    setLoading?.(true);
    const result = await ResultAsync.fromPromise(
      this.axios.post<ReturnType>(this.withBaseUrl(url), data, config),
      this.handleAxiosError,
    );
    runInAction(() => {
      setLoading?.(false);
    });

    return result;
  }

  @action async validate<Schema extends AnyObjectSchema>(
    result: Ok<AxiosResponse<Record<string, unknown>>, ApiError>,
    schema: Schema,
  ): Promise<Result<YupValues<Schema>, ValidationError>> {
    return ResultAsync.fromPromise(schema.validate(result.value.data), this.handleYupError);
  }

  private withBaseUrl = <T extends Record<string, string | number | boolean>>(
    url = '',
    queryParams?: T,
  ) => {
    if (queryParams) {
      return url.concat(
        '?',
        Object.entries(queryParams)
          .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
          .join('&'),
      );
    }

    return url;
  };

  private handleAxiosError = (err: unknown): ApiError => {
    if (axios.isAxiosError(err)) {
      return {
        ...err.response?.data, // TODO: Validate data
        axiosError: err,
      } as ApiError;
    }

    throw err;
  };

  private handleYupError = (e: unknown) => {
    if (ValidationError.isError(e)) {
      return e;
    }

    throw e;
  };
}

export default Api;
