import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Leaf, FlaskConical, Sparkles, Instagram, Globe, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import focusGummiesClosed from '@/assets/Gemini_Generated_Image_ejkt2aejkt2aejkt.png';
import focusGummiesOpen from '@/assets/photo_2026-07-20_16-24-422.jpg';
import mineralGummiesClosed from '@/assets/Gemini_Generated_Image_mluxnamluxnamlux.png';
import mineralGummiesOpen from '@/assets/photo_2026-07-20_16-24-423.jpg';
import { useLang } from '@/lib/lang-context';

const focusGummiesMain = focusGummiesClosed;
const focusGummies = focusGummiesClosed;
const focusGummiesImage = focusGummiesClosed;

const mineralGummiesMain = mineralGummiesClosed;
const mineralGummies = mineralGummiesClosed;
const mineralGummiesImage = mineralGummiesClosed;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const BotanicalLineArt = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full opacity-15">
    <path d="M60,110 C60,70 30,50 15,25 C40,15 75,40 60,110 Z" />
    <path d="M60,110 C60,70 90,50 105,25 C80,15 45,40 60,110 Z" />
    <path d="M60,110 C60,80 70,60 85,45 M60,90 C60,70 50,55 35,45 M60,65 C60,50 65,40 75,32" />
  </svg>
);

const Barcode = () => (
  <div className="flex flex-col items-center bg-white p-2.5 rounded border border-border/60 select-none shadow-sm w-36">
    <div className="flex items-end h-8 gap-[1.5px] px-1">
      {[1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 4].map((width, idx) => (
        <div key={idx} className="bg-black h-full" style={{ width: `${width}px` }} />
      ))}
    </div>
    <span className="text-[8px] font-mono tracking-widest mt-1 text-black">7 12345 67890 5</span>
  </div>
);

const productDetails = {
  en: {
    heroSub: 'HERBAL WELLNESS SUPPLEMENTS FOR CHILDREN',
    plantBased: 'PLANT BASED',
    carefullyCrafted: 'CAREFULLY CRAFTED',
    inspiredNature: 'INSPIRED BY NATURE',
    ingredientsTitle: 'INGREDIENTS',
    aboutTitle: 'ABOUT THE FORMULA',
    noticeTitle: 'IMPORTANT NOTICE',
    multiHerbal: 'MULTI-HERBAL FORMULA',
    categoryPill: 'Herbal Glycerite Gummies',
    subCategory: 'PREMIUM QUALITY PEDIATRIC FORMULA',
    notices: [
      'Prototype formulation for evaluation.',
      'Research and educational use only.',
      'Not intended to diagnose, treat, or cure any condition.',
      'Keep out of reach of children.',
      'Store in a cool, dry place away from direct sunlight.'
    ],
    details: {
      focus: {
        subtitle: 'CONCENTRATION & CALM',
        netWt: 'Net Wt. 120g / 60 Gummies',
        specs: ['Naturally Flavored', 'Glycerite Based', 'Prototype Formula'],
        about: 'A gentle, non-stimulating botanical blend formulated to help ease mental restlessness and support a calm, centered attention span. Perfect for after-school homework hours or periods of overstimulation.',
        ingredients: [
          { botanical: 'Melissa officinalis', common: 'Lemon Balm' },
          { botanical: 'Passiflora incarnata', common: 'Passionflower' },
          { botanical: 'Matricaria chamomilla', common: 'Chamomile' }
        ]
      },
      mineral: {
        subtitle: 'REST & GROWTH',
        netWt: 'Net Wt. 120g / 60 Gummies',
        specs: ['Naturally Flavored', 'Glycerite Based', 'Prototype Formula'],
        about: 'Growing bodies need structural support and nervous system nourishment. Our Mineral blend pairs highly bioavailable magnesium with soothing botanicals to support physical recovery and restorative rest.',
        ingredients: [
          { botanical: 'Magnesium Glycinate', common: 'Bio-active Mineral' },
          { botanical: 'Matricaria chamomilla', common: 'Chamomile' },
          { botanical: 'Melissa officinalis', common: 'Lemon Balm' }
        ]
      },
      bundle: {
        subtitle: 'COMPLETE DAY & NIGHT WELLNESS BUNDLE',
        netWt: 'Net Wt. 240g / 120 Gummies (Dual Pack)',
        specs: ['Focus & Mineral Pair', 'Full Day Support', 'Pediatrician Approved'],
        about: 'The complete daily regimen combining our non-stimulating Focus blend for daytime concentration with our soothing Mineral blend for evening rest and physical recovery.',
        ingredients: [
          { botanical: 'Focus + Mineral Synergistic Blend', common: 'Lemon Balm, Passionflower, Chamomile, Bio-active Magnesium' }
        ]
      }
    }
  },
  ar: {
    heroSub: 'مكملات عافية نباتية للأطفال',
    plantBased: 'عضوي نباتي',
    carefullyCrafted: 'مُصنّع بعناية',
    inspiredNature: 'مستوحى من الطبيعة',
    ingredientsTitle: 'المكونات الأساسية',
    aboutTitle: 'عن التركيبة',
    noticeTitle: 'ملاحظة هامة',
    multiHerbal: 'تركيبة نباتية متعددة',
    categoryPill: 'حلوى الجلسريت النباتية',
    subCategory: 'تركيبة متميزة للأطفال',
    notices: [
      'تركيبة تجريبية لأغراض التقييم.',
      'للاستخدام البحثي والتعليمي فقط.',
      'غير مخصص لتشخيص أو علاج أو الوقاية من أي مرض.',
      'يحفظ بعيداً عن متناول الأطفال.',
      'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة.'
    ],
    details: {
      focus: {
        subtitle: 'التركيز والهدوء',
        netWt: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
        specs: ['نكهة طبيعية', 'أساس الجلسريت', 'تركيبة تجريبية'],
        about: 'مزيج نباتي لطيف غير منبّه مُصمَّم للمساعدة في تخفيف التوتر الذهني ودعم انتباه هادئ ومتمركز. مثالي لساعات الواجبات المدرسية أو فترات الإفراط في التحفيز.',
        ingredients: [
          { botanical: 'Melissa officinalis', common: 'بلسم الليمون' },
          { botanical: 'Passiflora incarnata', common: 'زهرة الآلام' },
          { botanical: 'Matricaria chamomilla', common: 'البابونج' }
        ]
      },
      mineral: {
        subtitle: 'النمو والاسترخاء',
        netWt: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
        specs: ['نكهة طبيعية', 'أساس الجلسريت', 'تركيبة تجريبية'],
        about: 'تحتاج الأجساد النامية إلى دعم هيكلي وتغذية للجهاز العصبي. يجمع مزيج المعادن لدينا بين المغنيسيوم عالي التوافر البيولوجي والنباتات المهدئة لدعم التعافي الجسدي والراحة المُعيدة للحيوية.',
        ingredients: [
          { botanical: 'Magnesium Glycinate', common: 'معدن حيوي نشط' },
          { botanical: 'Matricaria chamomilla', common: 'البابونج المهدئ' },
          { botanical: 'Melissa officinalis', common: 'مستخلص بلسم الليمون' }
        ]
      },
      bundle: {
        subtitle: 'حزمة العافية الشاملة لليوم والليل',
        netWt: 'الوزن الصافي ٢٤٠غ / ١٢٠ حبة (عبوة مزدوجة)',
        specs: ['ثنائي التركيز والمعادن', 'دعم على مدار اليوم', 'تركيبة متميزة للأطفال'],
        about: 'النظام اليومي المتكامل الذي يجمع بين مزيج التركيز غير المنبه للتركيز النهاري ومزيج المعادن المهدئ للراحة والتعافي الجسدي في المساء.',
        ingredients: [
          { botanical: 'مزيج التركيز والمعادن المتكامل', common: 'بلسم الليمون، زهرة الآلام، البابونج، المغنيسيوم الحيوي النشط' }
        ]
      }
    }
  }
};

export function Products() {
  const { t, isRTL } = useLang();
  const p = t.products;
  const currentLang = (t.lang || 'en') as 'en' | 'ar';
  const details = productDetails[currentLang];
  const [activeFocusImage, setActiveFocusImage] = useState<string>(focusGummiesImage);
  const [activeMineralImage, setActiveMineralImage] = useState<string>(mineralGummiesImage);

  const variantsList = [
    {
      key: 'focus' as const,
      title: 'FOCUS GUMMIES',
      titleAr: 'حلوى التركيز',
      accentColor: '#D93848', // Strawberry Red
      borderColor: 'border-[#D93848]/25',
      textColor: 'text-[#D93848]',
      bgTint: 'bg-[#D93848]/5',
      mainImage: focusGummiesImage,
      openImage: focusGummiesImage,
      image: activeFocusImage,
      setImage: setActiveFocusImage,
      decorations: (
        <>
          <div className="absolute top-8 left-8 w-24 h-24 text-[#D93848]/10 pointer-events-none">
            <BotanicalLineArt />
          </div>
          <div className="absolute bottom-8 right-8 w-32 h-32 text-[#D93848]/10 pointer-events-none rotate-180">
            <BotanicalLineArt />
          </div>
          <div className="absolute -bottom-4 left-6 text-4xl select-none opacity-80 filter drop-shadow-md z-20">🍓</div>
          <div className="absolute top-12 right-6 text-3xl select-none opacity-80 filter drop-shadow-md z-20 rotate-12">🌿</div>
        </>
      )
    },
    {
      key: 'mineral' as const,
      title: 'MINERAL GUMMIES',
      titleAr: 'حلوى المعادن',
      accentColor: '#2D6A4F', // Forest Green
      borderColor: 'border-[#2D6A4F]/25',
      textColor: 'text-[#2D6A4F]',
      bgTint: 'bg-[#2D6A4F]/5',
      mainImage: mineralGummiesImage,
      openImage: mineralGummiesImage,
      image: activeMineralImage,
      setImage: setActiveMineralImage,
      decorations: (
        <>
          <div className="absolute top-8 left-8 w-24 h-24 text-[#2D6A4F]/10 pointer-events-none">
            <BotanicalLineArt />
          </div>
          <div className="absolute bottom-8 right-8 w-32 h-32 text-[#2D6A4F]/10 pointer-events-none rotate-90">
            <BotanicalLineArt />
          </div>
          <div className="absolute -bottom-4 left-6 text-4xl select-none opacity-80 filter drop-shadow-md z-20">🌿</div>
          <div className="absolute top-12 right-6 text-3xl select-none opacity-80 filter drop-shadow-md z-20 -rotate-12">🌼</div>
        </>
      )
    }
  ];

  return (
    <div className="flex flex-col w-full pt-20 bg-[#F5F2EA] min-h-screen pb-24">
      {/* Header */}
      <section className="py-16 md:py-24 bg-background text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 text-foreground leading-tight tracking-wide">{p.heroTitle}</h1>
          <p className="text-lg md:text-xl text-foreground/75 leading-relaxed max-w-2xl mx-auto">{p.heroDesc}</p>
        </motion.div>
      </section>

      {/* Products Stack */}
      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-6xl space-y-24">
        {variantsList.map((variant) => {
          const varDetails = details.details[variant.key];
          return (
            <div key={variant.key} className="flex flex-col">
              
              {/* PART 1: Hero Panel (Top Half) */}
              <div className="relative rounded-t-[2rem] overflow-hidden border-t border-l border-r border-border bg-[#FDFBF7] shadow-xl flex flex-col">
                {/* Header Band */}
                <div style={{ backgroundColor: variant.accentColor }} className="py-5 px-8 text-center text-white border-b border-black/10 select-none">
                  <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-[0.2em] uppercase">
                    {t.lang === 'ar' ? variant.titleAr : variant.title}
                  </h3>
                  <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.15em] opacity-80 uppercase mt-1">
                    {details.heroSub}
                  </p>
                </div>

                {/* Hero Panel Body */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 items-center relative min-h-[500px]">
                  
                  {/* Left Sidebar Cards */}
                  <div className="flex flex-col gap-4 order-2 md:order-1 select-none">
                    {[
                      { icon: Leaf, label: details.plantBased },
                      { icon: FlaskConical, label: details.carefullyCrafted },
                      { icon: Sparkles, label: details.inspiredNature }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-5 rounded-2xl border ${variant.borderColor} ${variant.bgTint} flex flex-col items-center text-center justify-center transition-all duration-300 hover:shadow-sm`}
                      >
                        <item.icon className={`w-6 h-6 ${variant.textColor} mb-2.5`} />
                        <span className={`text-[10px] font-sans font-bold tracking-widest ${variant.textColor} uppercase`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Center Bottle Container */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center relative min-h-[420px] order-1 md:order-2">
                    {/* Background decorations */}
                    {variant.decorations}

                    {/* Bottle Shot - Static Open Jar */}
                    <div className="relative z-10 w-full h-[320px] md:h-[380px] flex items-center justify-center">
                      <motion.img 
                        src={variant.openImage} 
                        alt={`${variant.title} Open Jar`} 
                        className="h-full w-auto max-h-[360px] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                        whileHover={{ scale: 1.04, rotate: variant.key === 'focus' ? 1.5 : -1.5 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                      />
                    </div>

                    {/* Bottle Label simulation overlay */}
                    <div className="absolute bottom-[-16px] bg-[#FCF9F2]/95 backdrop-blur-sm border border-border/80 rounded-2xl p-4 w-[85%] max-w-[280px] shadow-lg flex flex-col items-center border-t-[5px] z-20" style={{ borderTopColor: variant.accentColor }}>
                      <span className="font-serif italic text-xs tracking-wider text-foreground/80">Pure Botanica</span>
                      <span className="font-serif font-bold text-sm tracking-wide text-foreground mt-0.5" style={{ color: variant.accentColor }}>
                        {t.lang === 'ar' ? variant.titleAr : variant.title}
                      </span>
                      <span style={{ backgroundColor: variant.accentColor }} className="text-[8px] text-white px-2.5 py-0.5 rounded-full font-semibold mt-2 tracking-wider uppercase scale-90">
                        {details.categoryPill}
                      </span>
                      
                      {/* Circular icon badges row */}
                      <div className="flex justify-center gap-2.5 mt-3.5 w-full border-t border-border/60 pt-3">
                        {varDetails.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="w-12 h-12 rounded-full border border-border/80 bg-white flex flex-col items-center justify-center p-1 text-center scale-90 shadow-sm">
                            <span className="text-[6.5px] leading-tight font-sans font-bold text-foreground/75 tracking-tighter uppercase">{spec}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] text-foreground/50 mt-2.5 font-mono tracking-widest">{varDetails.netWt}</span>
                    </div>
                  </div>

                  {/* Right Sidebar Card (Ingredients) */}
                  <div className="order-3 h-full">
                    <div className={`p-6 rounded-3xl border ${variant.borderColor} ${variant.bgTint} h-full flex flex-col shadow-sm`}>
                      <h4 className={`text-xs font-serif font-bold tracking-widest ${variant.textColor} mb-5 border-b pb-2.5 ${variant.borderColor} uppercase`}>
                        {details.ingredientsTitle}
                      </h4>
                      <ul className="space-y-4 flex-grow">
                        {varDetails.ingredients.map((ing, iIdx) => (
                          <li key={iIdx} className="flex flex-col border-b border-border/40 pb-2.5 last:border-b-0">
                            <span className="text-sm font-sans font-bold text-foreground leading-tight">{ing.botanical}</span>
                            <span className="text-xs text-foreground/60 mt-0.5">({ing.common})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

              {/* PART 2: Detail Panel (Bottom Half) */}
              <div 
                className="relative rounded-b-[2rem] overflow-hidden border-b border-l border-r border-border bg-[#FDFBF7] p-8 shadow-xl flex flex-col border-t-8"
                style={{ borderTopColor: variant.accentColor }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column (Brand, Wordmarks, Handles, Barcode) */}
                  <div className="flex flex-col justify-between h-full min-h-[220px] relative">
                    <div>
                      <span className="font-serif italic text-base tracking-widest text-foreground/60 block">Pure Botanica</span>
                      <h3 className="text-3xl font-serif font-black tracking-wider text-foreground uppercase mt-1">
                        {t.lang === 'ar' ? variant.titleAr : variant.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-white px-3 py-1 rounded-full uppercase" style={{ backgroundColor: variant.accentColor }}>
                          {details.categoryPill}
                        </span>
                        <span className={`text-[9px] font-sans font-extrabold tracking-widest uppercase ${variant.textColor}`}>
                          {details.multiHerbal}
                        </span>
                      </div>

                      <p className="text-[10px] text-foreground/50 tracking-widest font-sans font-medium uppercase mt-4">
                        {details.subCategory}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8 pt-6 border-t border-border/60">
                      {/* Social handles */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-foreground/75 font-sans">
                          <Instagram className="w-4 h-4 text-foreground/60" />
                          <span className="font-medium tracking-wide">@purebotanica</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground/75 font-sans">
                          <Globe className="w-4 h-4 text-foreground/60" />
                          <span className="font-medium tracking-wide">www.purebotanica.com</span>
                        </div>
                      </div>
                      
                      {/* Barcode bottom right */}
                      <div className="self-center sm:self-auto">
                        <Barcode />
                      </div>
                    </div>
                  </div>

                  {/* Right Column (About the Formula & Important Notice Cards) */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* About card */}
                    <div className={`p-6 rounded-2xl bg-white border ${variant.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-foreground uppercase mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" style={{ color: variant.accentColor }} />
                        {details.aboutTitle}
                      </h4>
                      <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
                        {varDetails.about}
                      </p>
                    </div>

                    {/* Notice card */}
                    <div className={`p-6 rounded-2xl bg-white border ${variant.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-destructive uppercase mb-3.5 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {details.noticeTitle}
                      </h4>
                      <ul className="space-y-2 font-sans">
                        {details.notices.map((notice, nIdx) => (
                          <li key={nIdx} className="text-[11px] text-foreground/70 leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-1.5 shrink-0" />
                            <span>{notice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Explore button link */}
                <div className="mt-8 pt-6 border-t border-border/60 flex justify-end">
                  <Link href="/assessment">
                    <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all h-12 text-sm text-white border-0" style={{ backgroundColor: variant.accentColor }}>
                      {variant.key === 'focus' ? p.focusCta : p.mineralCta} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* bottom CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-6 font-medium leading-tight">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/85 mb-10 text-lg leading-relaxed">{p.ctaDesc}</p>
          <Link href="/assessment">
            <Button size="lg" variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-gray-50 h-14 text-base shadow-lg hover:shadow-xl transition-all">
              {p.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}


