import { api } from "./client"

interface Tag {
  id: number;
  name: string;
  created_by_id: bigint;
}

export interface Quote {
  id: number;
  body: string;
  attribution: string;
  created_at: string;
  user_id: bigint;
  tags: Tag[]
}


export function getQuotes(){
  return api<Quote[]>('/api/v1/quotes')
}
