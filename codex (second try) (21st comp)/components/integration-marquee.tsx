"use client";

import { useMemo, useState } from "react";
import { ArrowRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const tools = [
  ["Slack", "slack"], ["Microsoft Teams", "microsoftteams"], ["WhatsApp", "whatsapp"], ["Telegram", "telegram"], ["Gmail", "gmail"],
  ["Outlook", "microsoftoutlook"], ["Google Sheets", "googlesheets"], ["Excel", "microsoftexcel"], ["Google Drive", "googledrive"], ["OneDrive", "microsoftonedrive"],
  ["Dropbox", "dropbox"], ["Notion", "notion"], ["Airtable", "airtable"], ["Trello", "trello"], ["Asana", "asana"],
  ["Monday", "mondaydotcom"], ["ClickUp", "clickup"], ["Jira", "jira"], ["Linear", "linear"], ["Salesforce", "salesforce"],
  ["HubSpot", "hubspot"], ["Pipedrive", "pipedrive"], ["Zoho", "zoho"], ["Odoo", "odoo"], ["Zendesk", "zendesk"],
  ["Freshdesk", "freshdesk"], ["Intercom", "intercom"], ["Shopify", "shopify"], ["WooCommerce", "woocommerce"], ["Magento", "magento"],
  ["Stripe", "stripe"], ["PayPal", "paypal"], ["QuickBooks", "quickbooks"], ["Xero", "xero"], ["Wise", "wise"],
  ["Twilio", "twilio"], ["SendGrid", "sendgrid"], ["Mailchimp", "mailchimp"], ["Brevo", "brevo"], ["Typeform", "typeform"],
  ["Jotform", "jotform"], ["Calendly", "calendly"], ["Cal.com", "caldotcom"], ["Zoom", "zoom"], ["Google Calendar", "googlecalendar"],
  ["PostgreSQL", "postgresql"], ["MySQL", "mysql"], ["MongoDB", "mongodb"], ["Redis", "redis"], ["Snowflake", "snowflake"],
  ["BigQuery", "googlebigquery"], ["Supabase", "supabase"], ["AWS S3", "amazons3"], ["Google Cloud Storage", "googlecloudstorage"], ["GitHub", "github"],
  ["GitLab", "gitlab"], ["OpenAI", "openai"], ["Anthropic", "anthropic"], ["Google Gemini", "googlegemini"], ["Webhooks", "webhook"],
] as const;

const rowConfig = [
  { items: tools.slice(0, 20), duration: 60, reverse: false },
  { items: tools.slice(20, 40), duration: 75, reverse: true },
  { items: tools.slice(40, 60), duration: 90, reverse: false },
];

function ToolTile({ name, slug, withName = false }: { name: string; slug: string; withName?: boolean }) {
  const initials = name.split(/\s|\./).filter(Boolean).map((word) => word[0]).join("").slice(0, 2);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={withName ? "tool-tile with-name" : "tool-tile"} tabIndex={0}>
          <span className="logo-fallback" aria-hidden="true">{initials}</span>
          <img alt="" height="32" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} src={`/logos/${slug}.svg`} width="32" />
          {withName && <span>{name}</span>}
          <span className="sr-only">{name}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

export function IntegrationMarquee() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => tools.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 24), [query]);

  return (
    <section className="integration-section section">
      <div className="integration-island">
        <div className="container integration-inner">
          <div className="integration-heading">
            <h2>Plug your automations into<br /><span>1,000+ tools</span> you already pay for.</h2>
            <p>Pre-built connectors for the apps you use. A custom API connection for everything else.</p>
          </div>
          <TooltipProvider delayDuration={120}>
            {query ? (
              <div className="tool-search-results">
                <p>{filtered.length} tools match &quot;{query}&quot;</p>
                <div>{filtered.map(([name, slug]) => <ToolTile key={name} name={name} slug={slug} withName />)}</div>
              </div>
            ) : (
              <div className="marquee-rows" aria-label="Connected tools">
                {rowConfig.map((row, rowIndex) => (
                  <div className="marquee-row" key={rowIndex}>
                    <div className={row.reverse ? "marquee-track is-reverse" : "marquee-track"} style={{ "--marquee-duration": `${row.duration}s` } as React.CSSProperties}>
                      {[...row.items, ...row.items].map(([name, slug], index) => <ToolTile key={`${name}-${index}`} name={name} slug={slug} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TooltipProvider>
          <label className="integration-search">
            <MagnifyingGlassIcon aria-hidden="true" />
            <span className="sr-only">Search tools</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Search 1,000+ tools" type="search" value={query} />
          </label>
          <div className="integration-stats">
            <div><strong>1,000+</strong><span>tools connected</span></div>
            <div><strong>5</strong><span>step families</span></div>
            <div><strong>8</strong><span>messaging channels</span></div>
            <div><strong>Any</strong><span>REST or webhook endpoint</span></div>
          </div>
          <a className="integration-link" href="#contact">Browse every integration <ArrowRightIcon aria-hidden="true" /></a>
          <p className="integration-note">Do not see yours? Send it to us. Most new connections take under two weeks.</p>
        </div>
      </div>
    </section>
  );
}
