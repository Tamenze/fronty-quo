import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useState, useEffect } from "react";
import { updateUserSchema, type UpdateUserInput } from "../../../shared/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldSet,
  FieldSeparator
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PasswordRules from "./PasswordRules";
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";

export const UserUpdateFormSkeleton = () => (
    <div className="p-4 sm:p-6" aria-hidden>
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" /> {/* "Edit User Info" */}
        </div>

        <form className="space-y-6">
          <CardContent className="p-0 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />      {/* Label */}
              <Skeleton className="h-10 w-full" />   {/* Input */}
              <Skeleton className="h-4 w-64 opacity-0" /> {/* Error reserve */}
            </div>

            {/* Grouped password change area */}
            <div className="space-y-4 rounded-md border p-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />     {/* Label */}
                <Skeleton className="h-10 w-full" />  {/* Input */}
                <Skeleton className="h-4 w-64 opacity-0" /> {/* Error reserve */}
              </div>

              {/* FieldSeparator: "Update Password:" */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px w-full bg-muted" />
                <Skeleton className="h-4 w-36 shrink-0" />
                <div className="h-px w-full bg-muted" />
              </div>

              {/* PasswordRules (mimic as list) */}
              <div className="space-y-2 pl-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-52" />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />     {/* Label */}
                <Skeleton className="h-10 w-full" />  {/* Input */}
                <Skeleton className="h-4 w-64 opacity-0" /> {/* Error reserve */}
              </div>

              {/* New Password Confirmation */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-56" />     {/* Label */}
                <Skeleton className="h-10 w-full" />  {/* Input */}
                <Skeleton className="h-4 w-64 opacity-0" /> {/* Error reserve */}
              </div>
            </div>
          </CardContent>

          {/* Footer buttons */}
          <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Skeleton className="h-10 w-20" /> {/* Cancel */}
              <Skeleton className="h-10 w-24" /> {/* Update */}
            </div>
          </CardFooter>

          {/* Mutation error reserve */}
          <Skeleton className="mt-2 h-4 w-64 opacity-0" />
        </form>
      </Card>
    </div>
)


function UserUpdateForm(){
  const { id } = useParams<{id: string}>();
  const { data: currentUser, isPending: isLoadingCurrentUser, isError, error } = useFetchCurrentUser();

  const [mutationError, setMutationError] = useState('');
  const { reset, register, handleSubmit, formState: { errors }} = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
    }
  })
  
  const navigate = useNavigate();
  const { mutate, isPending: isUpdatingUser } = useUpdateUser();
  usePageTitle(`Update ${currentUser?.username}`)

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username
      })
    }
  }, [currentUser, reset]);

  const onSubmit = (formData: UpdateUserInput) => 
    mutate({id: currentUser?.id || Number(id), ...formData}, {
      onSuccess: (updatedUser) => navigate(`/users/${updatedUser.id}`),
      onError: (err) => {
        setMutationError(err.message);
        reset();
      }
    }) 

  
  
  
  if (isLoadingCurrentUser) return <UserUpdateFormSkeleton/>;
  if (isError) return <ErrorNotice title="Couldn't load user update form" error={error} />
  if (!currentUser) return <MissingItemNotice resourceName="user"/>


  return (
    <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Edit User Info</CardTitle>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="p-0 space-y-6">
              {/* Username */}
              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  type="text"
                  id="username"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </Field>

              {/* Grouped password change area */}
              <FieldSet>
                {/* Current Password */}
                <Field data-invalid={!!errors.current_password}>
                  <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
                  <Input
                    type="password"
                    id="current_password"
                    aria-invalid={!!errors.current_password}
                    {...register("current_password")}
                  />
                  {errors.current_password && (
                    <p className="text-sm text-red-600">{errors.current_password.message}</p>
                  )}
                </Field>

                <FieldSeparator>Update Password:</FieldSeparator>

                <PasswordRules />

                {/* New Password */}
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    type="password"
                    id="password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </Field>

                {/* New Password Confirmation*/}
                <Field data-invalid={!!errors.password_confirmation}>
                  <FieldLabel htmlFor="password_confirmation">New Password Confirmation</FieldLabel>
                  <Input
                    type="password"
                    id="password_confirmation"
                    aria-invalid={!!errors.password_confirmation}
                    {...register("password_confirmation")}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
                  )}
                </Field>
              </FieldSet>
            </CardContent>
            
            <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingUser}>
                {isUpdatingUser ? 'Updating': 'Update'}
              </Button>
            </div>
          </CardFooter>
          {mutationError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {mutationError}
            </p>
          )}
        </form>
      </Card>
    </div>
  )
}

export default UserUpdateForm
