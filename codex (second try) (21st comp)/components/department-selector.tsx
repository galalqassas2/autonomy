"use client";

import { useState } from "react";

import { ConversationPlayer } from "@/components/conversation-player";
import { FeatureIcon } from "@/components/feature-icon";
import { FlowCanvas } from "@/components/flow-canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const departments = [
  { id: "finance", name: "Finance", outcome: "can issue and chase invoices without opening a spreadsheet", flow: "Invoice run" },
  { id: "sales", name: "Sales", outcome: "can route and enrich every lead the minute it lands", flow: "Lead to CRM" },
  { id: "operations", name: "Operations", outcome: "can keep stock, orders and suppliers in agreement", flow: "Stock reconciliation" },
  { id: "support", name: "Support", outcome: "can answer the same forty questions without a person", flow: "Conversation player" },
  { id: "hr", name: "HR", outcome: "can onboard a new starter across six systems in one go", flow: "Onboarding run" },
];

export function DepartmentSelector() {
  const [active, setActive] = useState("finance");
  const department = departments.find((item) => item.id === active) ?? departments[0];

  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-intro">
          <h2>Pick a department.<br />See what stops being manual.</h2>
        </div>
        <Tabs className="department-tabs" onValueChange={setActive} value={active}>
          <TabsList aria-label="Departments">
            {departments.map((item, index) => (
              <TabsTrigger key={item.id} value={item.id}>
                <FeatureIcon index={index + 4} />
                <span>{item.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="department-outcome"><strong>{department.name}</strong> {department.outcome}.</div>
          {departments.map((item) => (
            <TabsContent key={item.id} value={item.id}>
              {item.id === "support" ? <ConversationPlayer /> : <FlowCanvas compact title={item.flow} />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
