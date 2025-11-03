import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginUserSchema, type LoginUserInput } from "../../../shared/schemas/user";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";


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
        onSuccess: (user) => navigate(`/users/${user.id}`),
        onError: (err) => setMutationError(err.message)
      })


  return (
    <>
    <h1> Login Page </h1>
      {mutationError && <p role="alert">{mutationError}</p>}

      <form
         onSubmit={handleSubmit(onSubmit)}
      >
        <label>Email:</label>
        <input type="text" {...register("email")} /><br/>
        {errors.email && <p>{errors.email.message}</p>}


        <label>Password:</label>
        <input type="password" {...register("password")} /><br/>
        {errors.password && <p>{errors.password.message}</p>}
      
        <button>{isPending ? 'Logging In': 'Log In'}</button>
      </form>
    </>
  )
}

export default UserLoginForm
