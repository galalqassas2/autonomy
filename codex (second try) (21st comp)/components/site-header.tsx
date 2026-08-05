"use client";

import { useEffect, useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { LeadDialog } from "@/components/lead-dialog";
import { PrimaryButton } from "@/components/primary-button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const chapters = [
  { href: "#automation", label: "Watch it run", id: "automation" },
  { href: "#work", label: "The work", id: "work" },
  { href: "#time", label: "Your time", id: "time" },
  { href: "#integrations", label: "What we connect", id: "integrations" },
  { href: "#data", label: "Your data", id: "data" },
];

export function SiteHeader() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [chaptersVisible, setChaptersVisible] = useState(false);
  const [active, setActive] = useState("automation");
  const [onDark, setOnDark] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 12;
    setScrolled((current) => current === next ? current : next);
  });

  useEffect(() => {
    const hero = document.querySelector("#hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setChaptersVisible(!entry.isIntersecting), { rootMargin: "-72px 0px 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-42% 0px -48%", threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const darkSections = ["automation", "integrations", "data"].map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const intersecting = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? intersecting.add(entry.target.id) : intersecting.delete(entry.target.id));
      setOnDark(intersecting.size > 0);
    }, { rootMargin: "-28px 0px -92%", threshold: 0 });
    darkSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={cn("site-header", scrolled && "is-scrolled", onDark && "is-dark")}>
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="Autonomy home">Autonomy</a>
        <nav className={cn("chapter-nav", chaptersVisible && "is-visible")} aria-label="Page chapters">
          {chapters.map((chapter) => (
            <a className={cn(active === chapter.id && "is-active")} href={chapter.href} key={chapter.id}>{chapter.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <Sheet>
            <SheetTrigger asChild>
              <button className="menu-button" type="button" aria-label="Open page chapters"><ListIcon aria-hidden="true" /></button>
            </SheetTrigger>
            <SheetContent>
              <nav className="sheet-nav" aria-label="Page chapters">
                {chapters.map((chapter) => <SheetClose asChild key={chapter.id}><a href={chapter.href}>{chapter.label}</a></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
          <LeadDialog>
            <PrimaryButton aria-label="Start your first automation" className="header-cta">
              <span className="header-cta-full">Start your first automation</span>
              <span className="header-cta-short">Start automation</span>
            </PrimaryButton>
          </LeadDialog>
        </div>
      </div>
      <motion.div className="header-progress" style={{ scaleX: scrollYProgress }} />
    </header>
  );
}
