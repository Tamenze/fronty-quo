import { api } from "./client"
import type { User } from "../types/index"

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

// logout/delete session 
export function logOut(){
  return api('/api/v1/auth/logout', {
    method: 'DELETE',
  })
}

// create user 
export function createNewUser(
  params: CreateNewUserParams
){
  return api<User>('/api/v1/auth/sign_up', {
    method: 'POST',
    body: JSON.stringify({ user: params})
  })
}

// update user 
export function updateUser(
  id: number,
  params: UpdateUserParams
){
  return api<User>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ user: params})
  })
}

// delete user 
export function deleteSpecificUser(
  params: DeleteSpecificUserParams
){
    return api<void>(`/api/v1/users/${params.id}`, {
    method: 'DELETE',
  })
}

//get specific user 
export function getSpecificUser(
  params: GetSpecificUserParams,
  reqOpts?: RequestOptions
){
  return api<User>(`/api/v1/users/${params.id}`, {
    method: 'GET',
    signal: reqOpts?.signal
  })
}

export function fetchCurrentUser(){
  return api<FetchCurrentUserResponse>('/api/v1/auth/me', {
    method: 'GET',
  })
}
