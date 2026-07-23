import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAdminLogin } from '@workspace/api-client-react';
import { Lock, Loader2, Leaf } from 'lucide-react';
import botanicalBg from '@assets/botanical-bg.png';

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const adminLogin = useAdminLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    setError(null);
    adminLogin.mutate({ data: { password: data.password } }, {
      onSuccess: (res) => {
        if (res.authenticated) {
          setLocation("/admin");
        } else {
          setError("Invalid password");
        }
      },
      onError: () => {
        setError("Invalid password");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={botanicalBg}
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif mb-2">Admin Portal</h1>
          <p className="text-foreground/60">Enter your password to access the dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-14 bg-background text-center text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-destructive text-center bg-destructive/10 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-full text-base"
              disabled={adminLogin.isPending}
            >
              {adminLogin.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors">
            <Leaf className="w-4 h-4" /> Return to main site
          </a>
        </div>
      </motion.div>
    </div>
  );
}