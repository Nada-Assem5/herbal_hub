import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import heroGarden from '@assets/generated_images/hero-garden.png';
import focusGummies from '@assets/generated_images/focus-gummies.png';
import mineralGummies from '@assets/generated_images/mineral-gummies.png';
import { useLang } from '@/lib/lang-context';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export function Home() {
  const { t, isRTL } = useLang();
  const h = t.home;

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroGarden}
            alt="Sun-drenched lush herb garden"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Leaf className="w-4 h-4" />
              <span>{h.badge}</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              {h.heroTitle1} <span className="text-primary italic">{h.heroTitleEmphasis}</span> {h.heroTitle2}
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-foreground/70 mb-10 max-w-xl leading-relaxed">
              {h.heroDesc}
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/assessment">
                <Button size="lg" className="rounded-full text-base px-8 h-14 shadow-lg hover:shadow-xl transition-all">
                  {h.ctaAssessment}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 bg-background/50 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary/5">
                  {h.ctaExplore}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust/Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: h.trust1Title, desc: h.trust1Desc },
              { icon: Leaf,        title: h.trust2Title, desc: h.trust2Desc },
              { icon: Heart,       title: h.trust3Title, desc: h.trust3Desc },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif mb-4">{h.productSectionTitle}</h2>
            <p className="text-foreground/70">{h.productSectionDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Focus */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="h-64 relative overflow-hidden bg-muted">
                <img src={focusGummies} alt="Focus Gummies" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-3xl font-serif text-white">{h.focusTag1.includes('Lemon') ? 'Focus Gummies' : 'حلوى التركيز'}</h3>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs uppercase tracking-wider font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{h.focusTag1}</span>
                  <span className="text-xs uppercase tracking-wider font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{h.focusTag2}</span>
                </div>
                <p className="text-foreground/70 mb-6 leading-relaxed">{h.focusDesc}</p>
                <Link href="/products">
                  <Button variant="ghost" className="group/btn text-primary hover:bg-primary/5 -mx-4">
                    {h.learnMore} <ArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Mineral */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="h-64 relative overflow-hidden bg-muted">
                <img src={mineralGummies} alt="Mineral Gummies" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-3xl font-serif text-white">{h.mineralTag1.includes('Magnesium') ? 'Mineral Gummies' : 'حلوى المعادن'}</h3>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs uppercase tracking-wider font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md">{h.mineralTag1}</span>
                  <span className="text-xs uppercase tracking-wider font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md">{h.mineralTag2}</span>
                </div>
                <p className="text-foreground/70 mb-6 leading-relaxed">{h.mineralDesc}</p>
                <Link href="/products">
                  <Button variant="ghost" className="group/btn text-secondary hover:bg-secondary/5 -mx-4">
                    {h.learnMore} <ArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-serif mb-16">{h.howTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-px bg-primary-foreground/20" />

            {[
              { num: '1', title: h.step1Title, desc: h.step1Desc },
              { num: '2', title: h.step2Title, desc: h.step2Desc },
              { num: '3', title: h.step3Title, desc: h.step3Desc },
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-xl font-serif mb-6 shadow-lg">
                  {step.num}
                </div>
                <h4 className="text-xl font-medium mb-3">{step.title}</h4>
                <p className="text-primary-foreground/80">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/assessment">
              <Button size="lg" variant="secondary" className="rounded-full text-primary bg-white hover:bg-gray-50 px-8 h-14 text-base">
                {h.startAssessment}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-1 mb-4 text-secondary">
              {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif">{h.trustedTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-background border border-border">
              <p className="text-lg italic text-foreground/80 mb-6">{h.review1}</p>
              <div>
                <p className="font-medium text-foreground">{h.review1Author}</p>
                <p className="text-sm text-foreground/50">{h.review1Role}</p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border">
              <p className="text-lg italic text-foreground/80 mb-6">{h.review2}</p>
              <div>
                <p className="font-medium text-foreground">{h.review2Author}</p>
                <p className="text-sm text-foreground/50">{h.review2Role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
