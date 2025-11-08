import type { RequestOptions } from "./quotes"
import type { Tag, TagShowApiResponse } from "../types"
import { api } from "./client"

type GetSpecificTagParams = {
  id: number
}
 
export type CreateNewTagParams = {
  name: string;
}

export function getSpecificTag({
  params, 
  reqOpts, 
  page = 1, 
  perPage = 10
}: {
    params: GetSpecificTagParams,
    reqOpts?: RequestOptions,
    page?: number; 
    perPage?: number; 
}){
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("per_page", String(perPage));

  return api<TagShowApiResponse>(`/api/v1/tags/${params.id}?${qs.toString()}`, {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function getAllTags(
  reqOpts?: RequestOptions
){
  return api<Tag[]>('/api/v1/tags',{
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function createNewTag(
  params: CreateNewTagParams
){
  return api<Tag>('/api/v1/tags', {
    method: 'POST',
    body: JSON.stringify({ tag: params})
  })
}

//todo
// delete tag 

