import {
  Field,
  FieldLabel,
  FieldContent
} from "@/components/ui/field"

const PasswordRules = () => {
  return (
    <Field>
      <FieldLabel className="sr-only">Password Rules</FieldLabel>
      <FieldContent>
        <div
          id="password-rules"
          className="mt-1 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        >
          <div className="font-medium mb-1">Password must:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be at least <strong>8 characters</strong></li>
            <li>Contain <strong>at least one letter</strong> (A-Z)</li>
            <li>Contain <strong>at least one number</strong> (0-9)</li>
          </ul>
        </div>
      </FieldContent>
    </Field>
  )
}

export default PasswordRules;
