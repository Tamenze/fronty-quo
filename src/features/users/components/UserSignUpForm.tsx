import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserInput } from "../../../shared/schemas/user";
import { useCreateNewUser } from "../hooks/useCreateNewUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

//form: email, username, password and password confirmation, 
//upon submit, post to /api/v1/auth/sign_up
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
    <>
     {mutationError && <p role="alert">{mutationError}</p>}
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>Email:</label>
        <input type="text" {...register("email")} /><br/>
        {errors.email && <p>{errors.email.message}</p>}

        <label>Username:</label>
        <input type="text" {...register("username")} /><br/>
        {errors.username && <p>{errors.username.message}</p>}
      
        <label>Password:</label>
        <input type="password" {...register("password")} /><br/>
        {errors.password && <p>{errors.password.message}</p>}
        {/* add password specification info next to label */}
      
        <label>Password Confirmation:</label>
        <input type="password" {...register("password_confirmation")} /><br/>
        {errors.password_confirmation && <p>{errors.password_confirmation.message}</p>}

        <button>{isPending ? 'Creating': 'Create'}</button>
      </form>
    </>
  )
}

export default UserSignUpForm

