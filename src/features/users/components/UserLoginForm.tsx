import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginUserSchema, type LoginUserInput } from "../../../shared/schemas/user";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";



function UserLoginForm(){
    const [mutationError, setMutationError] = useState('');
    const { register, handleSubmit, formState: {errors} } = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema)
      }) 
    const { mutate, isPending } = useLogin(); 
    const navigate = useNavigate();
    usePageTitle('Log In')

    const onSubmit = (formData: LoginUserInput) => 
      mutate(formData, {
        onSuccess: () => navigate('/'),
        onError: (err) => setMutationError(err.message)
      })

    return (
      <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Log in</CardTitle>
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
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </Field>


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
            </CardContent>
            
          <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Logging In': 'Log In'}
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

export default UserLoginForm
