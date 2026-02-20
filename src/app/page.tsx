import { SectionHero } from "@/components/SectionHero";
import { SectionProblem } from "@/components/SectionProblem";
import { SectionSolution } from "@/components/SectionSolution";
import { SectionComparison } from "@/components/SectionComparison";
import { SectionHowItWorks } from "@/components/SectionHowItWorks";
import { SectionLibrary } from "@/components/SectionLibrary";
import { SectionAutomations } from "@/components/SectionAutomations";
import { SectionFAQ } from "@/components/SectionFAQ";
import { SectionCTA } from "@/components/SectionCTA";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Ultra Advisor Logo" width={32} height={32} />
          <span className="font-bold text-xl tracking-tight text-white">
            ULTRA ADVISOR
          </span>
        </Link>
      </header>
      <SectionHero />
      <SectionProblem />
      <SectionSolution />
      <SectionComparison />
      <SectionHowItWorks />
      <SectionLibrary />
      <SectionAutomations />
      <SectionFAQ />
      <SectionCTA />
    </div>
  );
}
