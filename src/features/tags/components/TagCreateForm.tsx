import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateNewTag } from "../hooks/useCreateNewTag";
import { createTagSchema, type CreateTagInput } from "../../../shared/schemas/tag";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";


export const TagCreateFormSkeleton = () => (
  <div className="p-4 sm:p-6" aria-hidden>
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32" /> {/* "Create Tag" */}
        </div>
      </div>

      {/* Form body */}
      <CardContent className="p-0 space-y-5">
        {/* Name field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />  {/* Label */}
          <Skeleton className="h-10 w-full" />{/* Input */}
          <Skeleton className="h-4 w-48 opacity-0" /> {/* Error reserve */}
        </div>
      </CardContent>

      {/* Footer buttons */}
      <CardFooter className="px-0 pt-2">
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-20" /> {/* Cancel */}
          <Skeleton className="h-10 w-28" /> {/* Create Tag */}
        </div>
      </CardFooter>

      {/* Mutation error reserve */}
      <Skeleton className="mt-2 h-4 w-64 opacity-0" />
    </Card>
  </div>
)

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
      <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create Tag</CardTitle>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} > 
            <CardContent className="p-0 space-y-5">

              {/* Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  type="text"
                  id="name"
                  aria-invalid={!!errors.name}
                  placeholder="e.g. braggadocio"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </Field>

            </CardContent>
            
            <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingTag}>
                {isCreatingTag ? "Creating..." : "Create Tag"}
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

export default TagCreateForm
