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


function QuoteUpdateForm(){
  const { id } = useParams<{id: string}>();
  const { data: quote, isPending: isLoadingQuote, isError: isQuoteError, error: quoteError} = useSpecificQuote(Number(id));
  const { data: allTags, isPending: isLoadingTags, isError: isTagsError, error: tagError} = useAllTags();

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
        tag_ids: quote.tags?.map((t: any) => t.id) ?? [],
      });
    }
  }, [quote, reset]);


    if (isLoadingQuote) return <p>Loading…</p>;
    if (isQuoteError)   return <p role="alert">Error: {quoteError?.message}</p>;
    if (!quote)  return <p>No quote found.</p>;
  

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
    <>
      {mutationError && <p role="alert">{mutationError}</p>}

      <form
         onSubmit={handleSubmit(onSubmit)}
      >
        <label>Body:</label><br/>
        <textarea {...register("body")} /><br/>  {/* style this to be larger  */}
        {errors.body && <p>{errors.body.message}</p>}

        <label>Attribution:</label><br/>
        <input type="text" {...register("attribution")} /><br/>
        {errors.attribution && <p>{errors.attribution.message}</p>}



        {quote?.tags.length > 0 && (
          <>
            <label>Current Tags:</label>
            <div>
              {quote.tags.map((t: any) => (
                <span key={t.id} style={{ marginRight: "0.5rem" }}>
                  {t.name}
                </span>
              ))}
            </div>
          </>
        )}
        
        <label>Available Tags:</label>
        <Controller
          name="tag_ids"
          control={control}
          render={({ field: { onChange, value } }) => {
            if (isLoadingTags) {
              return <AsyncSelect isMulti isDisabled isLoading placeholder="Loading tags…" />;
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
                  const ids = (selected as { value: number; label: string }[]).map(
                    (opt) => opt.value
                  );
                  onChange(ids);
                }}
              />
          )}}
        />


      
        <button disabled={isUpdatingQuote}>{isUpdatingQuote ? 'Updating' : 'Update'}</button>

      </form>
    </>
  )
}

export default QuoteUpdateForm
