import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import botanicalBg from '@assets/generated_images/botanical-bg.png';
import { useLang } from '@/lib/lang-context';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const { toast } = useToast();
  const { t } = useLang();
  const c = t.contact;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = (_data: ContactFormValues) => {
    toast({ title: c.toastTitle, description: c.toastDesc });
    form.reset();
  };

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10 pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3 rounded-full overflow-hidden blur-3xl">
        <img src={botanicalBg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">{c.title}</h1>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">{c.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-white rounded-3xl shadow-xl border border-border overflow-hidden">

            {/* Sidebar */}
            <div className="md:col-span-5 bg-primary text-primary-foreground p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif mb-6">{c.sidebarTitle}</h3>
                <p className="text-primary-foreground/80 mb-12">{c.sidebarDesc}</p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 shrink-0 text-primary-foreground/80" />
                    <div>
                      <h4 className="font-medium mb-1">{c.emailLabel}</h4>
                      <p className="text-primary-foreground/80">care@purebotanica.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 shrink-0 text-primary-foreground/80" />
                    <div>
                      <h4 className="font-medium mb-1">{c.phoneLabel}</h4>
                      <p className="text-primary-foreground/80">+1 (800) 555-1234</p>
                      <p className="text-primary-foreground/60 text-sm mt-1">{c.phoneHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 shrink-0 text-primary-foreground/80" />
                    <div>
                      <h4 className="font-medium mb-1">{c.addressLabel}</h4>
                      <p className="text-primary-foreground/80 whitespace-pre-line">{c.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-7 p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.nameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={c.namePlaceholder} className="bg-background h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.emailFieldLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={c.emailFieldPlaceholder} className="bg-background h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={c.messagePlaceholder} className="min-h-[150px] bg-background resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full rounded-full h-14 text-base mt-4">
                    {c.sendButton}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
