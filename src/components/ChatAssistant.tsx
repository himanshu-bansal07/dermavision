"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, AlertTriangle, User, Bot, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am Derma AI, your clinical skincare assistant. Ask me anything about skin types, active ingredients (like Retinol or Niacinamide), or product application methods!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener("open_derma_chat", handleOpenChat);
    return () => window.removeEventListener("open_derma_chat", handleOpenChat);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const userMsg: IMessage = {
      sender: "user",
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate clinical AI response formulation
    setTimeout(() => {
      const responseText = processSkincareQuery(inputText);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 300);
  };

  const processSkincareQuery = (query: string): string => {
    const q = query.toLowerCase().trim();
    
    // 1. Basic greetings & bot identities
    if (q === "hi" || q === "hello" || q === "hey" || q === "yo" || q.includes("who are you") || q.includes("how are you")) {
      const greetings = [
        "Hello! I am Derma AI. How can I help you with your skincare journey today?",
        "Hi there! Ready to optimize your skincare routine? Ask me about active ingredients or skin concerns.",
        "Welcome! I can provide clinical insights on acne, dry skin, anti-aging, and product applications. What's on your mind?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 2. Identify key categories detected in the query
    const categories: string[] = [];
    if (q.includes("acne") || q.includes("pimple") || q.includes("breakout") || q.includes("zits") || q.includes("bump")) categories.push("acne");
    if (q.includes("dry") || q.includes("flaky") || q.includes("xerosis") || q.includes("dehydrat")) categories.push("dry");
    if (q.includes("oil") || q.includes("sebum") || q.includes("greasy") || q.includes("pore")) categories.push("oil");
    if (q.includes("retinol") || q.includes("wrinkle") || q.includes("age") || q.includes("aging") || q.includes("lines") || q.includes("tretinoin")) categories.push("aging");
    if (q.includes("pigment") || q.includes("dark spot") || q.includes("scar") || q.includes("mark") || q.includes("melasma") || q.includes("bright")) categories.push("pigment");
    if (q.includes("red") || q.includes("sensit") || q.includes("itch") || q.includes("irritat") || q.includes("burn") || q.includes("rashes")) categories.push("sensitive");
    if (q.includes("diet") || q.includes("food") || q.includes("sugar") || q.includes("milk") || q.includes("eat")) categories.push("diet");
    if (q.includes("scalp") || q.includes("dandruff") || q.includes("hair")) categories.push("scalp");

    // Dynamic introductory phrasing
    const intros = [
      "Here is what clinical research suggests:",
      "Based on dermatological protocols, here is an optimized path:",
      "Let's break down the science for your skin:",
      "To address this effectively, here is a targeted outline:"
    ];
    const intro = intros[Math.floor(Math.random() * intros.length)];

    if (categories.length === 0) {
      // General or conversational response with rotational variations
      const generalResponses = [
        "That's an interesting question! Skincare relies on matching the right active ingredients (like Salicylic Acid, Hyaluronic Acid, or Retinol) to your exact skin type.\n\nCould you specify if you are looking to treat acne, dryness, aging, dark spots, or skin sensitivity?",
        "To give you the most accurate answer, let me know your skin type (Oily, Dry, Combination, or Sensitive) and your primary concern!\n\nYou can also run a direct Face Scan via our 'Scan Skin' page to get a full clinical analysis automatically.",
        "Active ingredients work best when layered in the correct order: Cleansers first, then water-based Serums (like Vitamin C or Niacinamide), followed by Moisturizers, and always SPF in the morning.\n\nAre you looking for advice on a specific product class or skin issue?"
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    let responseParts: string[] = [intro];

    // Build the dynamic response based on active categories
    categories.forEach((cat) => {
      if (cat === "acne") {
        const acneTips = [
          "For active breakouts, Salicylic Acid (BHA) is highly effective as it penetrates lipid layers to exfoliate inside the pores.",
          "Benzoyl Peroxide works by introducing oxygen into the pores, which kills acne-causing anaerobic bacteria (C. acnes).",
          "Incorporate a gentle retinoid like Adapalene (0.1%) at night to regulate skin cell turnover and prevent new blockages from forming.",
          "If you experience inflamed papules, adding Niacinamide (3-5%) helps reduce swelling and calms post-inflammatory redness."
        ];
        const shuffled = [...acneTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Acne Management:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "dry") {
        const dryTips = [
          "Dry skin indicates a compromised epidermal barrier. Use non-foaming cream cleansers containing Ceramides.",
          "Apply Hyaluronic Acid onto damp skin immediately after washing to trap moisture before it evaporates.",
          "Look for moisturizers rich in lipids, Squalane, and Shea Butter to lock in hydration.",
          "Avoid hot water washes and physical scrubs, which strip natural sebum and worsen dry scaling."
        ];
        const shuffled = [...dryTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Dry Skin Protocol:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "oil") {
        const oilTips = [
          "Oily skin is caused by overactive sebaceous glands. Niacinamide (5%) is excellent for regulating sebum production.",
          "Use a clay mask (Kaolin or Bentonite) once a week to absorb excess superficial surface oils.",
          "Swap heavy creams for lightweight, gel-based moisturizers that hydrate without adding excess oil.",
          "Double cleansing at night with a gentle micellar water followed by a foaming cleanser ensures oil-based impurities are fully removed."
        ];
        const shuffled = [...oilTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Oil Control:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "aging") {
        const agingTips = [
          "Retinoids (Retinol or Tretinoin) remain the gold standard for stimulating collagen synthesis and cellular turnover.",
          "Use Peptide-rich creams to help restore skin elasticity and smooth out fine lines.",
          "Apply Vitamin C (L-Ascorbic Acid) in the morning to neutralize free radicals from UV exposure and prevent premature aging.",
          "Consistency with broad-spectrum SPF 50+ is mandatory; UV radiation accounts for up to 80% of visible skin aging."
        ];
        const shuffled = [...agingTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Anti-Aging Strategy:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "pigment") {
        const pigmentTips = [
          "Hyperpigmentation is caused by overactive melanocytes. Alpha Arbutin (2%) is a safe ingredient to inhibit melanin production.",
          "Tranexamic Acid is excellent for dark spots and melasma, especially when paired with Niacinamide.",
          "AHA exfoliants (like Glycolic or Lactic Acid) speed up the removal of pigment-loaded surface cells.",
          "Sunscreen is critical. UV rays immediately activate melanogenesis, which can darken existing scars overnight."
        ];
        const shuffled = [...pigmentTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Brightening & Dark Spots:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "sensitive") {
        const sensitiveTips = [
          "For irritated or sensitive skin, simplify your routine. Strip out all exfoliants, fragrances, and essential oils.",
          "Use soothing botanical extracts like Centella Asiatica (Cica), Allantoin, and Panthenol (Vitamin B5) to heal the skin barrier.",
          "Perform a forearm patch test for 24 hours before applying any new active ingredient to the face.",
          "Opt for mineral sunscreens (Zinc Oxide) rather than chemical ones, as zinc is naturally anti-inflammatory."
        ];
        const shuffled = [...sensitiveTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Soothing Irritation:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "diet") {
        const dietTips = [
          "High-glycemic foods (refined sugar, processed treats) spike insulin levels, which triggers sebum production.",
          "Omega-3 fatty acids (found in flaxseeds, walnuts, and salmon) are highly anti-inflammatory and nourish cell walls.",
          "For some, dairy (especially skimmed milk) contains hormones that can trigger acne flares.",
          "Antioxidant-rich foods like green tea and berries protect skin cells from oxidative stress."
        ];
        const shuffled = [...dietTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Nutritional Guidelines:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
      if (cat === "scalp") {
        const scalpTips = [
          "Scalp flaking is often Seborrheic Dermatitis, triggered by Malassezia yeast. Use Ketoconazole shampoo twice weekly.",
          "Coal Tar or Zinc Pyrithione derivatives work well to slow skin cell turnover on the scalp.",
          "Avoid leaving heavy oils on the scalp for too long, as yeast feeds on oil lipids."
        ];
        const shuffled = [...scalpTips].sort(() => 0.5 - Math.random());
        responseParts.push(`**Scalp & Dandruff Care:**\n- ${shuffled[0]}\n- ${shuffled[1]}`);
      }
    });

    const takeaways = [
      "\n*Remember: Skin cells take about 28 days to cycle. Give any new routine at least 4-6 weeks to show visible results.*",
      "\n*Tip: Always apply water-based serums before heavy oils or creams to ensure maximum absorption.*"
    ];
    responseParts.push(takeaways[Math.floor(Math.random() * takeaways.length)]);

    return responseParts.join("\n\n");
  };

  const suggestions = [
    "How do I treat severe acne?",
    "What routines heal dry skin?",
    "How to apply Retinol safely?",
    "Tips for scalp dandruff"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      
      {/* 1. FLOATING CHAT BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-cyan/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-cyber-dark bg-neon-green" />
        {/* Hover pulse glow effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-linear-to-tr from-neon-cyan to-neon-purple opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-75" />
      </button>

      {/* 2. CHAT DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-18 right-0 w-[360px] h-[520px] rounded-3xl glass-panel bg-[#0d0e15]/95 dark:bg-[#0d0e15]/95 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 dark:border-white/5 light:border-slate-100 bg-linear-to-r from-neon-cyan/10 to-neon-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-neon-cyan/25 flex items-center justify-center text-neon-cyan">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Ask Derma AI</span>
                  <span className="text-[10px] text-neon-green flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" /> Clinical Skincare Specialist
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white light:text-slate-500 light:hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>


            {/* Messages Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#090a0f]/20 dark:bg-[#090a0f]/20 light:bg-slate-50/50 scrollbar-none"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    msg.sender === "user" 
                      ? "bg-neon-purple text-white" 
                      : "bg-neon-cyan/20 text-neon-cyan"
                  }`}>
                    {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap text-left ${
                    msg.sender === "user"
                      ? "bg-neon-purple/20 dark:bg-neon-purple/20 light:bg-neon-purple/10 text-white dark:text-white light:text-neon-purple font-semibold rounded-tr-none border border-neon-purple/25 dark:border-neon-purple/25 light:border-neon-purple/20"
                      : "bg-white/5 dark:bg-white/5 light:bg-white text-gray-200 dark:text-gray-200 light:text-slate-800 rounded-tl-none border border-white/5 dark:border-white/5 light:border-slate-200/80 shadow-xs"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 max-w-[80%] mr-auto items-center">
                  <div className="h-6 w-6 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-2 bg-white/5 dark:bg-white/5 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200/80 flex gap-1 items-center h-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions buttons helper */}
            <div className="px-4 py-2 border-t border-white/5 dark:border-white/5 light:border-slate-100 bg-[#090a0f]/40 dark:bg-[#090a0f]/40 light:bg-slate-50 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {suggestions.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => { setInputText(s); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/5 dark:border-white/5 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-white text-[10px] text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-neon-cyan hover:border-neon-cyan/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <HelpCircle className="h-3 w-3" /> {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/5 dark:border-white/5 light:border-slate-200/80 bg-[#090a0f] dark:bg-[#090a0f] light:bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="Ask about skincare, acne, dry skin..."
                className="flex-1 h-10 px-3.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-neon-cyan"
              />
              
              <button
                onClick={handleSend}
                className="h-10 w-10 rounded-xl bg-linear-to-tr from-neon-cyan to-neon-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-neon-cyan/15"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
