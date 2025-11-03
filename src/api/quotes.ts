import { api } from "./client"
import type { Quote } from "../types"

export type RequestOptions = {
  signal?: AbortSignal | null 
}

type GetSpecificQuoteParams = {
  id: number
}

export type CreateNewQuoteParams = {
  body: string;
  attribution: string;
}

export type UpdateQuoteParams = {
  body?: string;
  attribution?: string;
  tag_ids?: number[];
}

export function getQuotes(reqOpts?: RequestOptions){
  return api<Quote[]>('/api/v1/quotes', {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function getRandomQuote(reqOpts?: RequestOptions){
  return api<Quote>('/api/v1/quotes/random', {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function getSpecificQuote(
  params: GetSpecificQuoteParams,
  reqOpts?: RequestOptions
){
  return api<Quote>(`/api/v1/quotes/${params.id}`, {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function createNewQuote(
  params: CreateNewQuoteParams,
  // reqOpts?: RequestOptions
){
    return api<Quote>(`/api/v1/quotes`, {
      method: 'POST',
      body: JSON.stringify({ quote: params }),
      // signal: reqOpts?.signal
  })
}

export function updateQuote(
  id: number,
  params: UpdateQuoteParams,
){
  return api<Quote>(`/api/v1/quotes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ quote: params }),
  })
}

export function deleteQuote(id: number){
  return api<void>(`/api/v1/quotes/${id}`, {
    method: 'DELETE'
  })
}


//todo

// delete quote 

// delete all quotes 

//done 

// get specific quote 

// add new quote 

// update quote 
