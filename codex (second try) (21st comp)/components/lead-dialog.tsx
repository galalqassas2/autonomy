"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/lead-form";

export function LeadDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Start your first automation</DialogTitle>
        <DialogDescription>Tell us one process your team repeats.</DialogDescription>
        <LeadForm idPrefix="dialog" />
      </DialogContent>
    </Dialog>
  );
}
