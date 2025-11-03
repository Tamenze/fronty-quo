import type { RequestOptions } from "./quotes"
import type { Tag } from "../types"
import { api } from "./client"

type GetSpecificTagParams = {
  id: number
}
 
export type CreateNewTagParams = {
  name: string;
}

//get tag 
export function getSpecificTag(
  params: GetSpecificTagParams,
  reqOpts?: RequestOptions
){
  return api<Tag>(`/api/v1/tags/${params.id}`, {
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

// create new tag 
export function createNewTag(
  params: CreateNewTagParams
){
  return api<Tag>('/api/v1/tags', {
    method: 'POST',
    body: JSON.stringify({ tag: params})
  })
}

// delete tag 

