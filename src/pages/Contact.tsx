import { useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { ui } from "@/content/site";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(2000),
});

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const body = `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`;
    window.location.href = `mailto:contact@phamxuananproject.org?subject=${encodeURIComponent(parsed.data.subject)}&body=${encodeURIComponent(body)}`;
    toast({ title: t(ui.sent) });
  };

  return (
    <div className="container py-16 md:py-24 max-w-2xl">
      <div className="uppercase tracking-[0.25em] text-accent mb-3 text-sm font-semibold">
        {t({ en: "Get in touch", vi: "Liên hệ" })}
      </div>
      <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
        {t({ en: "Contact Us", vi: "Liên hệ" })}
      </h1>
      <p className="text-foreground/75 leading-relaxed mb-10">
        {t({
          en: "We welcome inquiries from researchers, journalists, family members, and anyone with material to contribute.",
          vi: "Chúng tôi hoan nghênh thư từ các nhà nghiên cứu, nhà báo, gia đình và bất kỳ ai có tư liệu muốn đóng góp.",
        })}
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label={t(ui.name)} error={errors.name}>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={100}
            className="bg-background"
          />
        </Field>
        <Field label={t(ui.email)} error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={255}
            className="bg-background"
          />
        </Field>
        <Field label={t(ui.subject)} error={errors.subject}>
          <Input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            maxLength={150}
            className="bg-background"
          />
        </Field>
        <Field label={t(ui.message)} error={errors.message}>
          <Textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={2000}
            rows={6}
            className="bg-background"
          />
        </Field>

        <button
          type="submit"
          className="bg-primary text-primary-foreground px-6 py-3 text-sm tracking-wide hover:bg-secondary transition-colors"
        >
          {t(ui.send)}
        </button>
      </form>
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-wider text-foreground/60 mb-2">{label}</span>
    {children}
    {error && <span className="block text-xs text-destructive mt-1">{error}</span>}
  </label>
);

export default Contact;