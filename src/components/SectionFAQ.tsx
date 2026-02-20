import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { faqData } from "@/lib/faq-data"

export function SectionFAQ() {
    return (
        <section id="faq" className="py-24 bg-[#0F1F3D]">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Perguntas <span className="text-blue-500">Frequentes</span>
                    </h2>
                    <p className="text-gray-400">
                        Tire suas dúvidas sobre como o ULTRA ADVISOR funciona.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-[#1A2B4F]/50 px-6 rounded-lg border-none hover:bg-[#1A2B4F] transition-colors">
                            <AccordionTrigger className="text-left text-lg text-gray-200">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400 leading-relaxed text-base pb-6">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
