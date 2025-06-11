'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'limits';
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How long do mock endpoints stay active?",
      answer: "All mock endpoints automatically expire after 7 days from creation. This ensures our system stays clean and your temporary data doesn't persist indefinitely.",
      category: "general"
    },
    {
      question: "Do I need to create an account to use Mocklyst?",
      answer: "No! You can create and use mock endpoints without any registration. However, creating an account allows you to manage your endpoints, view usage analytics, and access additional features.",
      category: "general"
    },
    {
      question: "Are there any rate limits on the API endpoints?",
      answer: "For anonymous users, there are no rate limits on endpoint usage. Registered users get even higher limits and can create more concurrent endpoints.",
      category: "limits"
    },
    {
      question: "What data types can I include in my mock responses?",
      answer: "You can create any valid JSON structure including strings, numbers, booleans, arrays, nested objects, and null values. Our schema designer supports complex nested structures.",
      category: "technical"
    },
    {
      question: "Can I update my mock endpoint after creating it?",
      answer: "Currently, endpoints are immutable once created. To make changes, you'll need to create a new endpoint. This ensures consistency for any applications already using your endpoint.",
      category: "technical"
    },
    {
      question: "Is CORS enabled for all endpoints?",
      answer: "Yes! All mock endpoints have CORS enabled by default, allowing you to make requests from any domain. This makes it perfect for frontend development and testing.",
      category: "technical"
    },
    {
      question: "How many endpoints can I create?",
      answer: "Anonymous users can create up to 10 active endpoints at a time. Registered users can create up to 50 active endpoints with additional features.",
      category: "limits"
    },
    {
      question: "Can I customize the HTTP status codes?",
      answer: "Currently, all endpoints return a 200 OK status. We're working on adding support for custom status codes and error responses in future updates.",
      category: "technical"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200 dark:border-green-800 mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked
            <span className="mt-1 block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about Mocklyst. Can't find the answer you're looking for? 
            <a href="/contact" className="text-violet-600 dark:text-violet-400 hover:underline ml-1">
              Contact us
            </a>
            .
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We're here to help! Reach out to our team for any additional questions or support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-lg transition-colors duration-200"
              >
                View Documentation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
