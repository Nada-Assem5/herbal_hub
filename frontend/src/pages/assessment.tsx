import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSubmitAssessment } from '@/api-client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import botanicalBg from '@assets/generated_images/botanical-bg.png';
import { useLang } from '@/lib/lang-context';

const assessmentSchema = z.object({
  parentName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  isParent: z.boolean(),
  childName: z.string().min(2),
  age: z.coerce.number().min(3).max(12),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'required' }),
  activityLevel: z.enum(['calm', 'average', 'very_active'], { required_error: 'required' }),
  focusDifficulty: z.enum(['never', 'sometimes', 'often'], { required_error: 'required' }),
  hyperactivity: z.enum(['never', 'sometimes', 'often'], { required_error: 'required' }),
  homework: z.enum(['yes', 'sometimes', 'no'], { required_error: 'required' }),
  diet: z.enum(['excellent', 'good', 'average', 'poor'], { required_error: 'required' }),
  vegetables: z.enum(['0', '1', '2+', '3+'], { required_error: 'required' }),
  supplements: z.enum(['yes', 'no'], { required_error: 'required' }),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const defaultValues: Partial<AssessmentFormValues> = {
  parentName: '', email: '', phone: '', isParent: false, childName: '',
  age: undefined, gender: undefined, activityLevel: undefined,
  focusDifficulty: undefined, hyperactivity: undefined, homework: undefined,
  diet: undefined, vegetables: undefined, supplements: undefined,
  allergies: '', medications: '', notes: '',
};

export function Assessment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const submitAssessment = useSubmitAssessment();
  const { t, isRTL, lang } = useLang();
  const a = t.assessment;

  const STEPS = a.steps.map((title, i) => ({ id: i + 1, title }));

  const savedValues = (() => {
    const saved = sessionStorage.getItem('assessment-form');
    if (saved) {
      try { return { ...defaultValues, ...JSON.parse(saved) }; }
      catch { return defaultValues; }
    }
    return defaultValues;
  })();

  const currentLang = lang || 'en';
  const dynamicSchema = useMemo(() => z.object({
    parentName: z.string().min(2, { message: currentLang === 'ar' ? 'الاسم يجب أن يكون ثنائياً على الأقل' : 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: currentLang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address.' }),
    phone: z.string().optional(),
    isParent: z.boolean().refine(val => val === true, {
      message: currentLang === 'ar' ? 'يجب تأكيد أنك الوالد أو ولي الأمر' : 'You must confirm that you are the parent or guardian.'
    }),
    childName: z.string().min(2, { message: currentLang === 'ar' ? 'الاسم يجب أن يكون ثنائياً على الأقل' : 'Name must be at least 2 characters.' }),
    age: z.coerce.number()
      .min(3, { message: t.assessment.ageError })
      .max(12, { message: t.assessment.ageError }),
    gender: z.enum(['male', 'female', 'other'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    activityLevel: z.enum(['calm', 'average', 'very_active'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    focusDifficulty: z.enum(['never', 'sometimes', 'often'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    hyperactivity: z.enum(['never', 'sometimes', 'often'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    homework: z.enum(['yes', 'sometimes', 'no'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    diet: z.enum(['excellent', 'good', 'average', 'poor'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    vegetables: z.enum(['0', '1', '2+', '3+'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    supplements: z.enum(['yes', 'no'], { required_error: currentLang === 'ar' ? 'مطلوب' : 'Required' }),
    allergies: z.string().optional(),
    medications: z.string().optional(),
    notes: z.string().optional(),
  }), [t, currentLang]);

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: savedValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      sessionStorage.setItem('assessment-form', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleNext = async () => {
    const fieldMap: Record<number, (keyof AssessmentFormValues)[]> = {
      1: ['parentName', 'email', 'phone', 'isParent'],
      2: ['childName', 'age', 'gender'],
      3: ['activityLevel', 'focusDifficulty', 'hyperactivity', 'homework'],
      4: ['diet', 'vegetables', 'supplements'],
      5: ['allergies', 'medications', 'notes'],
    };
    const isValid = await form.trigger(fieldMap[currentStep]);
    if (isValid) setCurrentStep((p) => Math.min(p + 1, STEPS.length));
  };

  const handlePrev = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const onSubmit = (data: AssessmentFormValues) => {
    const { isParent, ...submitData } = data as any;
    if (typeof submitData.phone === 'string') submitData.phone = submitData.phone.trim() || null;
    if (typeof submitData.allergies === 'string') submitData.allergies = submitData.allergies.trim() || null;
    if (typeof submitData.medications === 'string') submitData.medications = submitData.medications.trim() || null;
    if (typeof submitData.notes === 'string') submitData.notes = submitData.notes.trim() || null;

    submitAssessment.mutate({ data: submitData }, {
      onSuccess: (result) => {
        sessionStorage.removeItem('assessment-form');
        setLocation(`/results/${result.id}`);
      },
      onError: (err: any) => {
        console.error("Submission failed:", err);
        toast({
          variant: "destructive",
          title: lang === 'ar' ? 'فشل إرسال التقييم' : 'Submission Failed',
          description: err.message || (lang === 'ar' 
            ? 'حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' 
            : 'Could not connect to the server. Please check your network and try again.'),
        });
      }
    });
  };

  /* Card radio style */
  const cardItem = 'flex items-center space-x-0 space-y-0 relative border border-input rounded-xl bg-background hover:bg-accent/5 transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5';

  return (
    <div className="flex flex-col w-full pt-20 min-h-[100dvh] relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-5 pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3 rounded-full overflow-hidden blur-3xl">
        <img src={botanicalBg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl flex-1 flex flex-col">

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-foreground/60">
            <span>{a.stepOf(currentStep, STEPS.length)}</span>
            <span>{STEPS[currentStep - 1]?.title}</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${((currentStep - 1) / STEPS.length) * 100}%` }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >

                  {/* Step 1 — Parent Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <h2 className="text-3xl font-serif mb-2">{a.step1Title}</h2>
                        <p className="text-foreground/70">{a.step1Desc}</p>
                      </div>
                      <FormField control={form.control} name="parentName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.parentName}</FormLabel>
                          <FormControl><Input placeholder={a.parentNamePlaceholder} {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.email}</FormLabel>
                          <FormControl><Input type="email" placeholder={a.emailPlaceholder} {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.phone}</FormLabel>
                          <FormControl><Input type="tel" placeholder={a.phonePlaceholder} {...field} value={field.value || ''} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="isParent" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-background select-none mt-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer font-medium text-sm text-foreground/80">
                              {lang === 'ar' ? 'أؤكد أنني والد أو ولي أمر هذا الطفل' : 'I confirm I am the parent or legal guardian of this child.'}
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* Step 2 — Child Info */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <h2 className="text-3xl font-serif mb-2">{a.step2Title}</h2>
                        <p className="text-foreground/70">{a.step2Desc}</p>
                      </div>
                      <FormField control={form.control} name="childName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.childName}</FormLabel>
                          <FormControl><Input placeholder={a.childNamePlaceholder} {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-6">
                        <FormField control={form.control} name="age" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{a.age}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={a.agePlaceholder}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="gender" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{a.gender}</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...field}
                                value={field.value || ''}
                              >
                                <option value="" disabled>{a.genderSelect}</option>
                                <option value="female">{a.genderFemale}</option>
                                <option value="male">{a.genderMale}</option>
                                <option value="other">{a.genderOther}</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Lifestyle */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="mb-8">
                        <h2 className="text-3xl font-serif mb-2">{a.step3Title}</h2>
                        <p className="text-foreground/70">{a.step3Desc}</p>
                      </div>

                      <FormField control={form.control} name="activityLevel" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-serif">{a.activityQ}</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { value: 'calm', label: a.activityCalm },
                                { value: 'average', label: a.activityAverage },
                                { value: 'very_active', label: a.activityActive },
                              ].map((opt) => (
                                <FormItem key={opt.value} className={cardItem}>
                                  <FormControl><RadioGroupItem value={opt.value} className="sr-only" /></FormControl>
                                  <FormLabel className="w-full h-full p-4 text-center cursor-pointer">{opt.label}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {([
                        { name: 'focusDifficulty' as const, question: a.focusQ },
                        { name: 'hyperactivity' as const, question: a.hyperQ },
                      ]).map(({ name, question }) => (
                        <FormField key={name} control={form.control} name={name} render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-serif">{question}</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 flex-wrap">
                                {[
                                  { value: 'never', label: a.optNever },
                                  { value: 'sometimes', label: a.optSometimes },
                                  { value: 'often', label: a.optOften },
                                ].map((opt) => (
                                  <FormItem key={opt.value} className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      ))}

                      <FormField control={form.control} name="homework" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-serif">{a.homeworkQ}</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 flex-wrap">
                              {[
                                { value: 'no', label: a.optNo },
                                { value: 'sometimes', label: a.optSometimes },
                                { value: 'yes', label: a.optYes },
                              ].map((opt) => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* Step 4 — Nutrition */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="mb-8">
                        <h2 className="text-3xl font-serif mb-2">{a.step4Title}</h2>
                        <p className="text-foreground/70">{a.step4Desc}</p>
                      </div>

                      <FormField control={form.control} name="diet" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-serif">{a.dietQ}</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { value: 'excellent', label: a.dietExcellent },
                                { value: 'good', label: a.dietGood },
                                { value: 'average', label: a.dietAverage },
                                { value: 'poor', label: a.dietPoor },
                              ].map((opt) => (
                                <FormItem key={opt.value} className={cardItem}>
                                  <FormControl><RadioGroupItem value={opt.value} className="sr-only" /></FormControl>
                                  <FormLabel className="w-full h-full p-4 text-center cursor-pointer">{opt.label}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="vegetables" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-serif">{a.vegQ}</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 flex-wrap">
                              {[
                                { value: '0', label: a.vegNone },
                                { value: '1', label: a.veg1 },
                                { value: '2+', label: a.veg2 },
                                { value: '3+', label: a.veg3 },
                              ].map((opt) => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="supplements" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-serif">{a.suppQ}</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              {[
                                { value: 'yes', label: a.optYes },
                                { value: 'no', label: a.optNo },
                              ].map((opt) => (
                                <FormItem key={opt.value} className="flex items-center space-x-2">
                                  <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* Step 5 — Health */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <h2 className="text-3xl font-serif mb-2">{a.step5Title}</h2>
                        <p className="text-foreground/70">{a.step5Desc}</p>
                      </div>
                      <FormField control={form.control} name="allergies" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.allergies}</FormLabel>
                          <FormControl><Input placeholder={a.allergiesPlaceholder} {...field} value={field.value || ''} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="medications" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.medications}</FormLabel>
                          <FormControl><Input placeholder={a.medicationsPlaceholder} {...field} value={field.value || ''} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{a.notes}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={a.notesPlaceholder}
                              className="bg-background resize-none"
                              rows={4}
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                        <p className="text-[10.5px] md:text-[11.5px] text-foreground/50 leading-relaxed">
                          {lang === 'ar' 
                            ? 'خصوصيتك تهمنا. تُستخدم المعلومات التي يتم جمعها في هذا التقييم فقط لتقديم اقتراحات مخصصة لطفلك ويتم تخزينها بشكل آمن في قاعدة البيانات الخاصة بنا. نحن لا نبيع أو نشارك أو نكشف عن بيانات طفلك لأي خدمات خارجية أو برامج تتبع.' 
                            : "Your privacy is important to us. The information collected in this assessment is used solely to generate child-specific wellness suggestions and is stored securely in our database. We do not sell, share, or disclose your child's data to any third-party services or analytics scripts."}
                        </p>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrev} className="rounded-full gap-2">
                    {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {a.back}
                  </Button>
                ) : <div />}

                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={handleNext} className="rounded-full px-8 gap-2">
                    {a.next}
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white gap-2"
                    disabled={submitAssessment.isPending}
                  >
                    {submitAssessment.isPending ? (
                      <>{a.analyzing}<Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>{a.getResults}{isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
