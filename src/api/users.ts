import { api } from "./client"
import type { User, UserShowApiResponse } from "../types/index"

export type RequestOptions = {
  signal?: AbortSignal | null 
}

export type CreateNewUserParams = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type UpdateUserParams = {
  username?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export type LoginParams = {
  email: string;
  password: string;
}

type GetSpecificUserParams = {
  id: number
}

type DeleteSpecificUserParams = {
  id: number
}

export type FetchCurrentUserResponse = {
  user?: User,
  logged_in: boolean;
}


// login/create session 
export function logIn(
  params: LoginParams,
){
  return api<User>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ user: params})
  })
}

export function logOut(){
  return api('/api/v1/auth/logout', {
    method: 'DELETE',
  })
}

export function createNewUser(
  params: CreateNewUserParams
){
  return api<User>('/api/v1/auth/sign_up', {
    method: 'POST',
    body: JSON.stringify({ user: params})
  })
}

export function updateUser(
  id: number,
  params: UpdateUserParams
){
  return api<User>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ user: params})
  })
}

export function deleteSpecificUser(
  params: DeleteSpecificUserParams
){
    return api<void>(`/api/v1/users/${params.id}`, {
    method: 'DELETE',
  })
}

export function getSpecificUser({
  params, 
  reqOpts, 
  page = 1, 
  perPage = 10
}:{
  params: GetSpecificUserParams,
  reqOpts?: RequestOptions,
  page?: number; 
  perPage?: number; 
}){
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("per_page", String(perPage));

  return api<UserShowApiResponse>(`/api/v1/users/${params.id}?${qs.toString()}`, {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function fetchCurrentUser(){
  return api<FetchCurrentUserResponse>('/api/v1/auth/me', {
    method: 'GET',
  })
}
