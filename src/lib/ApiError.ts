export type FieldErrors = Record<string, string[] | string>;

export class ApiError extends Error {
  status: number;
  code?: string;
  title?: string;
  detail?: string;
  fields?: FieldErrors;
  raw?: unknown;

  constructor(opts: {
    status: number;
    message: string;
    code?: string;
    title?: string;
    detail?: string;
    fields?: FieldErrors;
    raw?: unknown;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.title = opts.title;
    this.detail = opts.detail;
    this.fields = opts.fields;
    this.raw = opts.raw;
  }
}

export const isApiError = (e: unknown): e is ApiError =>
  e instanceof ApiError || (!!e && typeof e === "object" && "status" in e && "message" in e);
