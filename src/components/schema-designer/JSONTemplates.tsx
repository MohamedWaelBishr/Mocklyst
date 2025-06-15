'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileCode,
  Search,
  Sparkles,
  User,
  ShoppingBag,
  FileText,
  Globe,
  Building,
  ChevronDown,
  ChevronRight,
  Film,
  Music,
  Gamepad2,
  DollarSign,
  CreditCard,
  TrendingUp,
  Plane,
  Hotel,
  UtensilsCrossed,
  Heart,
  Calendar,
  GraduationCap,
  BookOpen,
  Smartphone,
  MessageCircle,
  Trophy,
  Medal,
  ChefHat,
  Pizza,
  Cloud,
  Sun,
  Home,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MockSchema } from "@/types";
import {
  jsonTemplates,
  getTemplatesByCategory,
  searchTemplates,
  type JSONTemplate,
} from "@/lib/templates/json-templates";

interface JSONTemplatesProps {
  onTemplateSelectAction: (schema: MockSchema) => void;
  className?: string;
}

const categoryIcons = {
  user: User,
  ecommerce: ShoppingBag,
  blog: FileText,
  api: Globe,
  business: Building,
  entertainment: Film,
  finance: DollarSign,
  travel: Plane,
  health: Heart,
  education: GraduationCap,
  social: Smartphone,
  sports: Trophy,
  food: ChefHat,
  weather: Cloud,
  realestate: Home,
} as const;

const categoryColors = {
  user: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  ecommerce:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  blog: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  api: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  business:
    "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300",
  entertainment:
    "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  finance:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  travel: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  health: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  education:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  social:
    "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  sports:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  food: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  weather: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
  realestate:
    "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
} as const;

export function JSONTemplates({
  onTemplateSelectAction,
  className = "",
}: JSONTemplatesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    JSONTemplate["category"] | "all"
  >("all");

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === "all"
    ? jsonTemplates
    : getTemplatesByCategory(selectedCategory);

  const categories = [
    "all",
    "user",
    "ecommerce",
    "blog",
    "api",
    "business",
    "entertainment",
    "finance",
    "travel",
    "health",
    "education",
    "social",
    "sports",
    "food",
    "weather",
    "realestate",
  ] as const;

  const handleTemplateSelect = (template: JSONTemplate) => {
    onTemplateSelectAction(template.schema);
    setIsExpanded(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
      >
        <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <span>JSON Templates</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
        <Badge
          variant="secondary"
          className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
        >
          {jsonTemplates.length}
        </Badge>
      </Button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white/70 dark:bg-slate-900/70 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Choose a template to get started quickly
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((category) => {
                  const Icon =
                    category === "all"
                      ? FileCode
                      : categoryIcons[category as keyof typeof categoryIcons];
                  const isActive = selectedCategory === category;

                  return (
                    <Button
                      key={category}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        flex items-center gap-2 text-xs transition-all duration-200
                        ${
                          isActive
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        }
                      `}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="capitalize">
                        {category === "all" ? "All" : category}
                      </span>
                    </Button>
                  );
                })}
              </div>{" "}
              {/* Templates Grid */}
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template, index) => {
                      const IconComponent = categoryIcons[template.category];

                      return (
                        <motion.div
                          key={template.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.05,
                            layout: { duration: 0.3 },
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => handleTemplateSelect(template)}
                            className="h-auto p-3 flex flex-col items-start gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-full"
                          >
                            {/* Template Header */}
                            <div className="flex items-center gap-2 w-full">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{template.icon}</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {template.name}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  categoryColors[template.category]
                                } ml-auto`}
                              >
                                <IconComponent className="h-3 w-3 mr-1" />
                                {template.category}
                              </Badge>
                            </div>

                            {/* Template Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-400 text-left">
                              {template.description}
                            </p>

                            {/* Template Tags */}
                            <div className="flex items-center gap-1 flex-wrap w-full">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-1 py-0 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  +{template.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* No Results */}
                {filteredTemplates.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <FileCode className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      No templates found
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Try adjusting your search or category filter
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
