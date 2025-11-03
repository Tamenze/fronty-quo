export interface CsrfResponse {
  csrfToken: string;
}

export type ApiMethod =
  | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';

export interface ApiInit extends RequestInit {
  method?: ApiMethod;
}

export type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | Json[] | { [k: string]: Json };

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  creator: {
    id: number;
    username: string;
  }
  quotes: Quote[]
}

export interface Quote {
  id: number;
  body: string;
  attribution: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  tags: Tag[];
  user: {
    id: number;
    username: string;
  }
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  quotes: Quote[],
  created_tags: {
    id: number;
    name: string;
  }[]
}
