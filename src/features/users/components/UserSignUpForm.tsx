import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserInput } from "../../../shared/schemas/user";
import { useCreateNewUser } from "../hooks/useCreateNewUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import PasswordRules from "./PasswordRules";


function UserSignUpForm(){
  const [mutationError, setMutationError] = useState('');
  const { register, handleSubmit, formState: {errors} } = useForm<CreateUserInput>({
      resolver: zodResolver(createUserSchema)
    }) 
  const { mutate, isPending } = useCreateNewUser(); 
  const navigate = useNavigate();
  usePageTitle('Sign Up')

  const onSubmit = (formData: CreateUserInput) => 
    mutate(formData, {
      onSuccess: (user) => navigate(`/users/${user.id}`),
      onError: (err) => setMutationError(err.message)
    })

    return (
      <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Sign up for aWord</CardTitle>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-0 space-y-5">

              {/* Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  aria-invalid={!!errors.email}
                  placeholder="tree59@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </Field>

              {/* Username */}
              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  type="text"
                  id="username"
                  aria-invalid={!!errors.username}
                  placeholder="nnamdiWuzHere"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </Field>

              {/* Grouped password create area */}
              <FieldSet> 
                <PasswordRules />

                {/*Password */}
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    type="password"
                    id="password" //future: are these needed? why?
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </Field>

                {/* Password Confirmation*/}
                <Field data-invalid={!!errors.password_confirmation}>
                  <FieldLabel htmlFor="password_confirmation">Password Confirmation</FieldLabel>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Signing up...': 'Sign up'}
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

export default UserSignUpForm

