import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import focusGummies from '@assets/generated_images/focus-gummies.png';
import mineralGummies from '@assets/generated_images/mineral-gummies.png';
import { useLang } from '@/lib/lang-context';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Products() {
  const { t, isRTL } = useLang();
  const p = t.products;

  return (
    <div className="flex flex-col w-full pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 bg-background text-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6">{p.heroTitle}</h1>
          <p className="text-lg text-foreground/70 leading-relaxed">{p.heroDesc}</p>
        </motion.div>
      </section>

      {/* Focus Gummies */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                <img src={focusGummies} alt="Focus Gummies" className="w-full h-[500px] object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                {p.agesBadge}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-primary">{p.focusTitle}</h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">{p.focusDesc}</p>

              <div className="space-y-4 mb-10">
                {[p.focusBenefit1, p.focusBenefit2, p.focusBenefit3, p.focusBenefit4].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/assessment">
                <Button size="lg" className="rounded-full px-8">
                  {p.focusCta} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mineral Gummies */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6 border border-secondary/20">
                {p.agesBadge}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-secondary">{p.mineralTitle}</h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">{p.mineralDesc}</p>

              <div className="space-y-4 mb-10">
                {[p.mineralBenefit1, p.mineralBenefit2, p.mineralBenefit3, p.mineralBenefit4].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/assessment">
                <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white">
                  {p.mineralCta} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                <img src={mineralGummies} alt="Mineral Gummies" className="w-full h-[500px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-10 text-lg">{p.ctaDesc}</p>
          <Link href="/assessment">
            <Button size="lg" variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-gray-50 h-14 text-base">
              {p.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
