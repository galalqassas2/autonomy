import * as React from "react";

import { cn } from "@/lib/utils";

export function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("field-group", className)} {...props} />;
}

export function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("field", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("field-label", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("field-description", className)} {...props} />;
}
