import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useState, useEffect } from "react";
import { updateUserSchema, type UpdateUserInput } from "../../../shared/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";


function UserEditForm(){
  const { id } = useParams<{id: string}>();
  const { data: currentUser, isPending: isLoadingCurrentUser } = useFetchCurrentUser();

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

  
  
  
  if (isLoadingCurrentUser) return <p>Loading…</p>;
  if (!isLoadingCurrentUser && !currentUser)  return <p> No user found.</p>;


  return (
    <>
      {mutationError && <p role="alert">{mutationError}</p>}

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>User Edit Form</h1> 

      <label>Username:</label>
      <input type="text" {...register("username")} /><br/>
      {errors.username && <p>{errors.username.message}</p>}

      <label>Current Password:</label>
      <input type="password" {...register("current_password")} /><br/>
      {errors.current_password && <p>{errors.current_password.message}</p>}
      
      <label>New Password:</label>  {/* add password specification info next to label */}
      <input type="password" {...register("password")} /><br/>
      {errors.password && <p>{errors.password.message}</p>}

      <label>New Password Confirmation:</label>
      <input type="password" {...register("password_confirmation")} /><br/>
      {errors.password_confirmation && <p>{errors.password_confirmation.message}</p>}
 
      <button disabled={isUpdatingUser}> {isUpdatingUser ? 'Updating': 'Update'} </button>
    </form>
    </>
  )
}

export default UserEditForm
