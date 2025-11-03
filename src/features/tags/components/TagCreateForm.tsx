import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateNewTag } from "../hooks/useCreateNewTag";
import { createTagSchema, type CreateTagInput } from "../../../shared/schemas/tag";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";


function TagCreateForm(){

  const [mutationError, setMutationError] = useState('');
  const { mutate, isPending: isCreatingTag } = useCreateNewTag();
  const { register, handleSubmit, formState: {errors}} = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema)
  })
  const navigate = useNavigate();
  usePageTitle('Create New Tag')


  const onSubmit = (formData: CreateTagInput) => 
    mutate(formData, {
      onSuccess: (createdTag) => navigate(`/tags/${createdTag.id}`), 
      onError: (err) => setMutationError(err.message)
    })

  return (
    <>
    <h1> Create a New Tag</h1>
    {mutationError && <p role="alert">{mutationError}</p>}

    <form
      onSubmit={handleSubmit(onSubmit)}
      >
        <label>New Tag Name: </label><br/>
        <input type="text" placeholder="strength" {...register("name")} /><br/>
        {errors.name && <p>{errors.name.message}</p>}
      
      <button disabled={isCreatingTag}>{isCreatingTag ? 'Creating' : 'Create'}</button>
    </form>
    </>
  )
}

export default TagCreateForm
