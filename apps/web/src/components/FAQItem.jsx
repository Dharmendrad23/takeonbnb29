import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const FAQItem = ({ question, answer, value }) => {
  return (
    <AccordionItem value={value} className="border border-border rounded-xl px-6 data-[state=open]:bg-muted/30 transition-colors mb-3">
      <AccordionTrigger className="text-left font-serif font-bold text-lg hover:no-underline py-5 text-foreground">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQItem;