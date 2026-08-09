# UI and State Rules

- Represent loading, success, empty, and error states explicitly.
- Keep state local to the smallest component that needs it.
- Use controlled form fields when validation or submitted values depend on
  React state.
- Validate user input and show a clear message near the relevant field.
- Associate every form control with a visible label.
- Use semantic HTML elements and preserve keyboard navigation.
- Buttons must have an explicit `type` when placed inside a form.
- Use `aria-live` for important asynchronous status or error messages when
  appropriate.
- Do not include `pending` or `rejected` amounts in total paid revenue, but make
  their presence and status visible when requested.
