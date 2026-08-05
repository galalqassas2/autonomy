"use client";

import { useState, type FormEvent } from "react";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LeadFormProps = {
  idPrefix: string;
};

export function LeadForm({ idPrefix }: LeadFormProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <strong>Thank you.</strong>
        <span>We will come back with a map.</span>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-process`}>What process</FieldLabel>
          <Input id={`${idPrefix}-process`} name="process" placeholder="Invoice chasing" required />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-tools`}>Which tools</FieldLabel>
          <Input id={`${idPrefix}-tools`} name="tools" placeholder="Xero, Outlook, HubSpot" required />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-contact`}>How to reach you</FieldLabel>
          <Input id={`${idPrefix}-contact`} name="contact" placeholder="Work email or phone" required />
          <FieldDescription>We only use this to reply.</FieldDescription>
        </Field>
      </FieldGroup>
      <button className="button button-primary form-submit" type="submit">Start your first automation</button>
    </form>
  );
}
