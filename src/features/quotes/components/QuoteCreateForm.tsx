
import { useCreateNewQuote } from "../hooks/useCreateNewQuote"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createQuoteSchema, type CreateQuoteInput } from "../../../shared/schemas/quote";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const QuoteCreateFormSkeleton = () => (
  <div className="p-4 sm:p-6" aria-hidden>
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-40" /> {/* "Create Quote" */}
          </div>
        </div>

        {/* Form body */}
        <CardContent className="p-0 space-y-5">
          {/* Body field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />         {/* Label */}
            <Skeleton className="h-28 w-full" />      {/* Textarea */}
            <Skeleton className="h-4 w-48 opacity-0" />{/* Error line (reserve space; hidden) */}
          </div>

          {/* Attribution field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />         {/* Label */}
            <Skeleton className="h-10 w-full" />      {/* Input */}
            <Skeleton className="h-4 w-48 opacity-0" />{/* Error line (reserve space; hidden) */}
          </div>
        </CardContent>

        {/* Footer buttons */}
        <CardFooter className="px-0 pt-2">
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-10 w-20" />        {/* Cancel */}
            <Skeleton className="h-10 w-28" />        {/* Create Quote */}
          </div>
        </CardFooter>
      </Card>
    </div>
)

function QuoteCreateForm(){
  const [mutationError, setMutationError] = useState('');
  const { register, handleSubmit, formState: {errors} } = useForm<CreateQuoteInput>({
    resolver: zodResolver(createQuoteSchema)
  }) 
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateNewQuote();
  usePageTitle('Create New Quote')

  const onSubmit = (formData: CreateQuoteInput) => 
    mutate(formData, {
      onSuccess: (quote) => navigate(`/quotes/${quote.id}`),
      onError: (err) => setMutationError(err.message)
    })

    return (
      <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create Quote</CardTitle>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-0 space-y-5">

              {/* Body */}
              <Field data-invalid={!!errors.body}>
                <FieldLabel htmlFor="body">Body</FieldLabel>
                <Textarea
                  id="body"
                  rows={5}
                  aria-invalid={!!errors.body}
                  placeholder="I'm a hustler, homie; you a customer, crony. Got some... dirt on my shoulder — could you brush it off for me?"
                  {...register("body")}
                />
                {errors.body && (
                  <p className="text-sm text-red-600">{errors.body.message}</p>
                )}
              </Field>

              {/* Attribution */}
              <Field data-invalid={!!errors.attribution}>
                <FieldLabel htmlFor="attribution">Attribution</FieldLabel>
                <Input
                  type="text"
                  id="attribution"
                  aria-invalid={!!errors.attribution}
                  placeholder="Jay-Z"
                  {...register("attribution")}
                />
                {errors.attribution && (
                  <p className="text-sm text-red-600">{errors.attribution.message}</p>
                )}
              </Field>

            </CardContent>
            
            <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create Quote"}
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

export default QuoteCreateForm
