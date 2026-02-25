export function FieldError({ error, id }: { error?: string; id?: string }) {
  if (!error) return null
  return (
    <p id={id} className="text-sm text-destructive mt-1">
      {error}
    </p>
  )
}
