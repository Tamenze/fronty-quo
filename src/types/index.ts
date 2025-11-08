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

export interface Pagination {
  url_template: string;
  first_url: string;
  previous_url: string | null;
  page_url: string;
  next_url: string | null;
  last_url: string;
  count: number;
  page: number;
  limit: number;
  last: number;
  in: number;
  from: number;
  to: number;
  previous: number | null;
  next: number | null;
  options: {
    limit: number;
    limit_key: string;
    page_key: string;
    page: number;
    client_max_limit: number;
    count: number;
  };
};


export type QuotesIndexApiResponse = { 
  quotes: Quote[]; 
  pagination: Pagination 
};

export type UserShowApiResponse = {
  user: User;
  pagination: Pagination 
}

export type TagShowApiResponse = {
  tag: Tag;
  pagination: Pagination;
}
