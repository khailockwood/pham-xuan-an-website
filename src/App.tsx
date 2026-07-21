import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import AboutPxa from "./pages/AboutPxa";
import AboutProject from "./pages/AboutProject";
import Exhibits from "./pages/Exhibits";
import ExhibitDetail from "./pages/ExhibitDetail";
import Interviews from "./pages/Interviews";
import InterviewDetail from "./pages/InterviewDetail";
import Contact from "./pages/Contact";
import OhmsPreview from "./pages/OhmsPreview";
import OhmsNative from "./pages/OhmsNative";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about-pxa" element={<AboutPxa />} />
              <Route path="/about-project" element={<AboutProject />} />
              <Route path="/exhibits" element={<Exhibits />} />
              <Route path="/exhibits/:slug" element={<ExhibitDetail />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/interviews/:slug" element={<InterviewDetail />} />
              <Route path="/contact" element={<Contact />} />
              {/* Unlisted technical preview of the live OHMS embed; remove before launch. */}
              <Route path="/ohms-preview" element={<OhmsPreview />} />
              {/* Unlisted technical preview of the native (XML-only) player; remove before launch. */}
              <Route path="/ohms-native" element={<OhmsNative />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
