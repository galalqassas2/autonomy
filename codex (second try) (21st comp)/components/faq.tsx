import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const questions = [
  ["What does a project cost?", "Most first projects land in a range we put in writing after we map the process. Ongoing support is a flat monthly fee agreed up front, with no hourly billing."],
  ["How long until something is running?", "Two to six weeks for a first automation, depending on how many systems it touches. You see it working on sample data before it goes near anything live."],
  ["Where does our data go?", "Onto servers in Ireland, inside the EU. We run our own AI, so nothing is passed to a third party model and nothing is used for training."],
  ["Do we have to change our current systems?", "No, and that is the point. We build around the tools your team already knows."],
  ["What happens when something breaks?", "We monitor everything we build. You get an alert and a fix from us, usually before your team notices."],
  ["Who owns the work?", "You do, entirely. It is built in your accounts under your credentials, and it stays yours whatever happens between us."],
] as const;

export function FAQ() {
  return (
    <section className="section section-soft">
      <div className="container faq-layout">
        <h2>Questions, answered.</h2>
        <Accordion collapsible type="single">
          {questions.map(([question, answer], index) => (
            <AccordionItem key={question} value={`item-${index}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent><p>{answer}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
