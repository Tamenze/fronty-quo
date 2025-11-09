import { useParams } from "react-router-dom";
import { useSpecificQuote } from "../hooks/useSpecificQuote";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import AsyncSelect from 'react-select/async';


import { useAllTags } from "../../tags/hooks/useAllTags";
import { useUpdateQuote } from "../hooks/useUpdateQuote"
import { updateQuoteSchema, type UpdateQuoteInput } from "../../../shared/schemas/quote";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Tag } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";


export const QuoteUpdateFormSkeleton = () => (
  <div className="p-4 sm:p-6" aria-hidden>
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32" /> {/* "Edit Quote" */}
        </div>
      </div>

      {/* Form body */}
      <CardContent className="p-0 space-y-5">
        {/* Body */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-10" />       {/* Label */}
          <Skeleton className="h-28 w-full" />    {/* Textarea */}
          <Skeleton className="h-4 w-56 opacity-0" /> {/* Error reserve */}
        </div>

        {/* Attribution */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />       {/* Label */}
          <Skeleton className="h-10 w-full" />    {/* Input */}
          <Skeleton className="h-4 w-56 opacity-0" /> {/* Error reserve */}
        </div>

        {/* Tags (AsyncSelect mimic) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />       {/* Label */}
          <Skeleton className="h-4 w-64" />       {/* Description */}
          {/* Control shell */}
          <div className="rounded-md border p-2">
            {/* Loading indicator bar / input */}
            <Skeleton className="h-6 w-full mb-2" />
            {/* Selected chips row */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-56 opacity-0" /> {/* Error reserve */}
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
    </Card>
  </div>
)

function QuoteUpdateForm(){
  const { id } = useParams<{id: string}>();
  const { data: quote, isPending: isLoadingQuote, isError: isQuoteError, error: quoteError} = useSpecificQuote(Number(id));
  const { data: allTags, isPending: isLoadingTags} = useAllTags();

  const [mutationError, setMutationError] = useState('');
  const { control, register, handleSubmit, formState: { errors } , reset } = useForm<UpdateQuoteInput>({
    resolver: zodResolver(updateQuoteSchema),
    defaultValues: {
      body: "",
      attribution: "",
      tag_ids: [],
    },
  }) 
  const navigate = useNavigate();
  const { mutate, isPending: isUpdatingQuote } = useUpdateQuote();
  usePageTitle('Update Quote')

   useEffect(() => {
    if (quote) {
      reset({
        body: quote.body,
        attribution: quote.attribution,
        tag_ids: quote.tags?.map((t: Tag) => t.id) ?? [],
      });
    }
  }, [quote, reset]);

    if (isLoadingQuote) return <QuoteUpdateFormSkeleton/>;
    if (isQuoteError) return <ErrorNotice title="Couldn't load quote" error={quoteError} />
    if (!quote) return <MissingItemNotice resourceName="quote"/>

  

    const tagOptions = allTags?.map((t) => ({ value: t.id, label: t.name})) ?? [];
    const loadTagOptions = (inputValue: string) => {
      if (!tagOptions.length) return Promise.resolve([]);
      if (!inputValue) return Promise.resolve(tagOptions);

      const lower = inputValue.toLowerCase();
      return Promise.resolve(
        tagOptions.filter((opt) => opt.label.toLowerCase().includes(lower))
      );
    };

    const arraysEqual = (a: number[], b: number[]) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i] !== sortedB[i]) return false;
      }
      return true;
    };

  const onSubmit = (formData: UpdateQuoteInput) => {
    const bodyChanged = formData.body !== quote?.body;
    const attributionChanged = formData.attribution !== quote?.attribution;

    const originalTagIds = quote?.tags?.map((t: any) => t.id) ?? [];
    const newTagIds = formData.tag_ids ?? [];
    const tagsChanged = !arraysEqual(originalTagIds, newTagIds);


    if (!bodyChanged && !attributionChanged && !tagsChanged) {
      return; //don't hit endpoint
    }
    mutate({id: Number(id), ...formData}, {
      onSuccess: (updatedQuote) => navigate(`/quotes/${updatedQuote.id}`),
      onError: (err) => setMutationError(err.message)
    })
  }

  return (
    <div className="p-4 sm:p-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Edit Quote</CardTitle>
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
                  {...register("attribution")}
                />
                {errors.attribution && (
                  <p className="text-sm text-red-600">{errors.attribution.message}</p>
                )}
              </Field>

              {/* Tags */}
              <Field>
                <FieldLabel>Tags (optional)</FieldLabel>
                <FieldDescription>Select one or more tags to categorize this quote.</FieldDescription>

                <Controller
                  name="tag_ids"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    if (isLoadingTags) {
                      return <AsyncSelect isMulti isDisabled isLoading placeholder="Loading tags..." />;
                    }

                    return (
                      <AsyncSelect
                        isMulti
                        cacheOptions
                        defaultOptions={tagOptions}
                        loadOptions={loadTagOptions}
                        value={(value ?? []).map((id) => {
                          const opt = tagOptions.find((o) => o.value === id);
                          return opt ?? { value: id, label: `Tag ${id}` };
                        })}
                        onChange={(selected) => {
                          const ids = (selected as { value: number; label: string }[]).map(opt => opt.value);
                          onChange(ids);
                        }}
                        classNamePrefix="rs"
                      />
                    )}}
                />
                {errors.tag_ids && (
                  <p className="text-sm text-red-600">
                    {errors.tag_ids.message}
                  </p>
                )}
              </Field>
            </CardContent>
            
            <CardFooter className="px-0 pt-2">
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingQuote}>
                {isUpdatingQuote ? 'Updating' : 'Update'}
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

export default QuoteUpdateForm
