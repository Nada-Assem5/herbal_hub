import { useParams, Link } from 'wouter';
import { useGetAssessment } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Leaf, Sparkles } from 'lucide-react';
import focusGummies from '@assets/generated_images/focus-gummies.png';
import mineralGummies from '@assets/generated_images/mineral-gummies.png';
import { Progress } from '@/components/ui/progress';
import { useLang } from '@/lib/lang-context';

export function Results() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  const { t } = useLang();
  const r = t.results;

  const { data: assessment, isLoading, error } = useGetAssessment(id, {
    query: { enabled: !!id, queryKey: ['assessment', id] }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center animate-pulse">
          <Leaf className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-serif text-foreground">{r.loading}</h2>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-border">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">{r.notFoundTitle}</h2>
          <p className="text-foreground/70 mb-6">{r.notFoundDesc}</p>
          <Link href="/assessment">
            <Button className="rounded-full">{r.takeAssessment}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFocusRecommended = assessment.recommendation === 'focus' || assessment.recommendation === 'both';
  const isMineralRecommended = assessment.recommendation === 'mineral' || assessment.recommendation === 'both';

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>{r.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            {r.title(assessment.childName)}
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">{r.subtitle}</p>
        </motion.div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-border shadow-sm mb-12"
        >
          <h3 className="text-xl font-serif mb-6">{r.profileTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium">{r.focusNeed}</span>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">{assessment.focusScore}/10</span>
              </div>
              <Progress value={assessment.focusScore * 10} className="h-3 mb-2 bg-primary/10 [&>div]:bg-primary" />
              <p className="text-sm text-foreground/60">
                {assessment.focusScore >= 6 ? r.focusHigh : r.focusLow}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium">{r.mineralNeed}</span>
                <span className="text-sm font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">{assessment.mineralScore}/10</span>
              </div>
              <Progress value={assessment.mineralScore * 10} className="h-3 mb-2 bg-secondary/10 [&>div]:bg-secondary" />
              <p className="text-sm text-foreground/60">
                {assessment.mineralScore >= 6 ? r.mineralHigh : r.mineralLow}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <div className="space-y-8 mb-16">
          <h3 className="text-2xl font-serif text-center mb-8">{r.recommendedTitle}</h3>

          {isFocusRecommended && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden border border-primary/30 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 h-64 md:h-auto relative bg-muted">
                  <img src={focusGummies} alt="Focus Gummies" className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4 self-start">
                    {r.primaryRec}
                  </div>
                  <h3 className="text-3xl font-serif mb-4 text-primary">{r.focusTitle}</h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {r.focusDesc(assessment.childName)}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">{r.focusBenefit1}</span></li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">{r.focusBenefit2}</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {isMineralRecommended && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden border border-secondary/30 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 h-64 md:h-auto relative bg-muted">
                  <img src={mineralGummies} alt="Mineral Gummies" className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-xs uppercase tracking-wider mb-4 self-start">
                    {assessment.recommendation === 'both' ? r.secondaryRec : r.primaryRec}
                  </div>
                  <h3 className="text-3xl font-serif mb-4 text-secondary">{r.mineralTitle}</h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {r.mineralDesc(assessment.childName)}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /><span className="text-sm">{r.mineralBenefit1}</span></li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /><span className="text-sm">{r.mineralBenefit2}</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/30 p-6 rounded-2xl text-center border border-border">
          <p className="text-xs text-foreground/50 max-w-3xl mx-auto leading-relaxed">
            <strong>{t.lang === 'ar' ? 'إخلاء المسؤولية الطبية:' : 'Medical Disclaimer:'}</strong>{' '}
            {r.disclaimer.replace(/^[^:]+:\s*/, '')}
          </p>
        </div>

      </div>
    </div>
  );
}
