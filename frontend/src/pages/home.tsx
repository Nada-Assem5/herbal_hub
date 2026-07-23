import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Heart, ShieldCheck, Sparkles, Star, Award, ChevronLeft, ChevronRight, Pause, Play, Eye } from 'lucide-react';
import heroGarden from '@assets/generated_images/hero-garden.png';
import focusGummiesClosed from '@/assets/Gemini_Generated_Image_ejkt2aejkt2aejkt.png';
import focusGummiesOpen from '@/assets/photo_2026-07-20_16-24-422.jpg';
import mineralGummiesClosed from '@/assets/Gemini_Generated_Image_mluxnamluxnamlux.png';
import mineralGummiesOpen from '@/assets/photo_2026-07-20_16-24-423.jpg';
import { AnimatedProductJar } from '@/components/animated-product-jar';
import { useLang } from '@/lib/lang-context';

const focusGummiesMain = focusGummiesClosed;
const focusGummies = focusGummiesClosed;
const focusGummiesImage = focusGummiesClosed;

const mineralGummiesMain = mineralGummiesClosed;
const mineralGummies = mineralGummiesClosed;
const mineralGummiesImage = mineralGummiesClosed;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const carouselSlides = [
  {
    id: 'focus-gummies',
    nameEn: 'Pure Botànica Focus Gummies',
    nameAr: 'حلوى التركيز — بيور بوتانيكا',
    formulaEn: 'Red Strawberry Formula • Herbal Glycerite Gummies',
    formulaAr: 'تركيبة الفراولة الحمراء • حلوى الجلسريت النباتية',
    weightEn: 'Net Wt. 120g / 60 Gummies',
    weightAr: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
    descEn: 'A gentle, strawberry-infused glycerite formula crafted to help ease restlessness and support calm, centered concentration during homework or study time.',
    descAr: 'تركيبة جلسريت نباتية لطيفة بنكهة الفراولة الحمراء مُصممة للمساعدة في تخفيف التوتر ودعم تركيز هادئ ومتمركز أثناء المذاكرة.',
    accentColor: '#D93848', // Strawberry Red
    badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    image: focusGummiesMain,
    tag: 'Red / Strawberry • 120g / 60 Gummies',
    tagAr: 'فراولة حمراء • ١٢٠غ / ٦٠ حبة'
  },
  {
    id: 'mineral-gummies',
    nameEn: 'Pure Botànica Mineral Gummies',
    nameAr: 'حلوى المعادن — بيور بوتانيكا',
    formulaEn: 'Botanical Green Formula • Herbal Glycerite Gummies',
    formulaAr: 'التركيبة الخضراء • حلوى الجلسريت النباتية',
    weightEn: 'Net Wt. 120g / 60 Gummies',
    weightAr: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
    descEn: 'Nourishing herbal glycerite formula with bio-active magnesium and soothing botanicals to support physical recovery, restful sleep, and healthy growth.',
    descAr: 'تركيبة جلسريت نباتية مغذية تحتوي على المغنيسيوم الحيوي والأعشاب المهدئة لدعم التعافي الجسدي والنوم المريح والنمو الصحي.',
    accentColor: '#2D6A4F', // Forest Green
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    image: mineralGummiesMain,
    tag: 'Green Botanical • 120g / 60 Gummies',
    tagAr: 'خضراء نباتية • ١٢٠غ / ٦٠ حبة'
  }
];

function HomeProductCarousel({ currentLang }: { currentLang: 'en' | 'ar' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isRTL = currentLang === 'ar';

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4500); // 4.5s rotation
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = carouselSlides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div 
      className="relative w-full rounded-[2.5rem] bg-white border border-border/80 shadow-2xl overflow-hidden p-6 md:p-12 transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Pause indicator pill */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm text-[10px] font-mono tracking-wider text-foreground/70 select-none">
        {isPaused ? (
          <>
            <Pause className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{currentLang === 'ar' ? 'موقوف مؤقتاً (تفاعل)' : 'PAUSED (HOVER)'}</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>{currentLang === 'ar' ? 'تعديل تلقائي ٤.٥ ث' : 'AUTO ROTATING 4.5s'}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
        {/* Left Column Text details */}
        <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: isRTL ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 25 : -25 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${currentSlide.badgeBg}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentLang === 'ar' ? currentSlide.tagAr : currentSlide.tag}
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-serif font-medium text-foreground tracking-wide leading-tight">
                {currentLang === 'ar' ? currentSlide.nameAr : currentSlide.nameEn}
              </h3>

              <p className="text-xs md:text-sm font-semibold tracking-widest uppercase opacity-75" style={{ color: currentSlide.accentColor }}>
                {currentLang === 'ar' ? currentSlide.formulaAr : currentSlide.formulaEn}
              </p>

              <p className="text-foreground/75 text-sm md:text-base leading-relaxed max-w-xl font-sans">
                {currentLang === 'ar' ? currentSlide.descAr : currentSlide.descEn}
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link href="/products">
                  <Button 
                    style={{ backgroundColor: currentSlide.accentColor }} 
                    className="rounded-full px-7 h-12 text-xs font-bold tracking-widest text-white shadow-lg hover:opacity-90 hover:scale-102 transition-all"
                  >
                    {currentLang === 'ar' ? 'عرض الكتالوج الكامل' : 'VIEW PRODUCT CATALOG'}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
                <span className="text-xs font-mono tracking-widest text-foreground/50">
                  {currentLang === 'ar' ? currentSlide.weightAr : currentSlide.weightEn}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column Image with Smooth Fade & Glow */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 relative min-h-[300px] select-none">
          <div 
            className="absolute inset-0 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none" 
            style={{ backgroundColor: currentSlide.accentColor }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-full h-[280px] md:h-[340px] flex items-center justify-center"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.nameEn}
                className="max-h-full w-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel Controls & Pagination Dots */}
      <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrev}
            className="rounded-full w-10 h-10 border-border hover:bg-muted"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext}
            className="rounded-full w-10 h-10 border-border hover:bg-muted"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-3">
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 rounded-full transition-all duration-500 ${
                currentIndex === idx 
                  ? 'w-10 bg-primary' 
                  : 'w-3 bg-foreground/20 hover:bg-foreground/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide count indicator */}
        <div className="text-xs font-mono text-foreground/50 tracking-wider">
          0{currentIndex + 1} / 0{carouselSlides.length}
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const { t, isRTL, lang } = useLang();
  const h = t.home;
  const currentLang = (lang || 'en') as 'en' | 'ar';

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

      {/* Scroll-Triggered 2-Product Reveal Showcase ("Lid pops open, gummies reveal") */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {currentLang === 'ar' ? 'العروض التفاعلية للمنتجين' : 'PURE BOTÀNICA 2 FORMULAS'}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-foreground font-medium">
              {currentLang === 'ar' ? 'مجموعتنا المحددة: حلوى التركيز وحلوى المعادن' : 'Our 2 Signature Formulations'}
            </h2>
            <p className="text-foreground/75 text-base md:text-lg">
              {currentLang === 'ar'
                ? 'مُصممة خصيصاً لتلبية احتياجات طفلك اليومية والليلية. تمرر للأسفل لرؤية فتح العبوة وتفاصيل الحلوى.'
                : 'Carefully crafted for daytime focus and evening rest. Scroll into view to watch the jars open and reveal the herbal gummies inside.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* 1. Pure Botànica Focus Gummies */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[2.5rem] bg-[#FCFBF8] border border-border/80 shadow-lg p-8 flex flex-col items-center relative overflow-hidden"
            >
              <div className="w-full flex items-center justify-between mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D93848]/10 text-[#D93848] border border-[#D93848]/20">
                  {currentLang === 'ar' ? 'فراولة حمراء • للتركيز' : 'Red / Strawberry • Daytime Focus'}
                </span>
                <span className="text-xs font-semibold text-foreground/60">Net Wt. 120g / 60 Gummies</span>
              </div>

              {/* Scroll-Triggered Animated Product Jar */}
              <div className="w-full h-80 my-4">
                <AnimatedProductJar
                  mainImg={focusGummiesMain}
                  openImg={focusGummiesOpen}
                  alt="Pure Botànica Focus Gummies"
                  accentColor="#D93848"
                  className="w-full h-full"
                />
              </div>

              <div className="text-center mt-6 flex flex-col flex-grow">
                <h3 className="text-3xl font-serif font-medium mb-3 text-foreground">
                  {currentLang === 'ar' ? 'حلوى التركيز' : 'Pure Botànica Focus Gummies'}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6">
                  {currentLang === 'ar'
                    ? 'تركيبة جلسريت نباتية لطيفة بنكهة الفراولة الطبيعية مُصممة للمساعدة في تخفيف التوتر ودعم تركيز هادئ ومتمركز أثناء المذاكرة.'
                    : 'A gentle, strawberry-infused glycerite formula crafted to help ease restlessness and support calm, centered concentration during homework or study time.'}
                </p>
                <Link href="/products#focus">
                  <Button className="w-full rounded-full bg-[#D93848] hover:bg-[#b82b3a] text-white shadow-md">
                    <span>{h.learnMore}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* 2. Pure Botànica Mineral Gummies */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[2.5rem] bg-[#FCFBF8] border border-border/80 shadow-lg p-8 flex flex-col items-center relative overflow-hidden"
            >
              <div className="w-full flex items-center justify-between mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">
                  {currentLang === 'ar' ? 'خضراء نباتية • للمعادن والنوم' : 'Green Botanical • Rest & Growth'}
                </span>
                <span className="text-xs font-semibold text-foreground/60">Net Wt. 120g / 60 Gummies</span>
              </div>

              {/* Scroll-Triggered Animated Product Jar */}
              <div className="w-full h-80 my-4">
                <AnimatedProductJar
                  mainImg={mineralGummiesMain}
                  openImg={mineralGummiesOpen}
                  alt="Pure Botànica Mineral Gummies"
                  accentColor="#2D6A4F"
                  className="w-full h-full"
                />
              </div>

              <div className="text-center mt-6 flex flex-col flex-grow">
                <h3 className="text-3xl font-serif font-medium mb-3 text-foreground">
                  {currentLang === 'ar' ? 'حلوى المعادن' : 'Pure Botànica Mineral Gummies'}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6">
                  {currentLang === 'ar'
                    ? 'تركيبة جلسريت نباتية مغذية تحتوي على المغنيسيوم الحيوي والأعشاب المهدئة لدعم التعافي الجسدي والنوم المريح والنمو الصحي.'
                    : 'Nourishing herbal glycerite formula with bio-active magnesium and soothing botanicals to support physical recovery, restful sleep, and healthy growth.'}
                </p>
                <Link href="/products#mineral">
                  <Button className="w-full rounded-full bg-[#2D6A4F] hover:bg-[#21523c] text-white shadow-md">
                    <span>{h.learnMore}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Auto-Rotating Product Carousel Section */}
      <section className="py-20 bg-[#F5F2EA] border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {currentLang === 'ar' ? 'عرض ترويجي تفاعلي' : 'FEATURED PRODUCT CAROUSEL'}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-medium">
              {currentLang === 'ar' ? 'استكشف منتجاتنا بالتفصيل' : 'Explore Pure Botànica Formulas'}
            </h2>
          </div>

          <HomeProductCarousel currentLang={currentLang} />
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
    </div>
  );
}
