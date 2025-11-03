
import { useCreateNewQuote } from "../hooks/useCreateNewQuote"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createQuoteSchema, type CreateQuoteInput } from "../../../shared/schemas/quote";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";



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
    <> 
      {mutationError && <p role="alert">{mutationError}</p>}

      <form 
        onSubmit={handleSubmit(onSubmit)}
      > 
        <label>Body:</label><br/>
        <input type="text" {...register("body")} /><br/>  {/* style this to be larger  */}
        {errors.body && <p>{errors.body.message}</p>}


        <label>Attribution:</label><br/>
        <input type="text" {...register("attribution")} /><br/>
        {errors.attribution && <p>{errors.attribution.message}</p>}

        <button disabled={isPending}>{isPending ? 'Saving…' : 'Create'}</button>

      </form>
    </>
  )

}

export default QuoteCreateForm
