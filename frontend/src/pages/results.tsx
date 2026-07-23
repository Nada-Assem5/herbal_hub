import { useParams, Link } from 'wouter';
import { useGetAssessment } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Leaf, Sparkles, Star, Award, Instagram, Globe, FlaskConical, ArrowLeft } from 'lucide-react';
import focusGummiesClosed from '@/assets/Gemini_Generated_Image_ejkt2aejkt2aejkt.png';
import focusGummiesOpen from '@/assets/photo_2026-07-20_16-24-422.jpg';
import mineralGummiesClosed from '@/assets/Gemini_Generated_Image_mluxnamluxnamlux.png';
import mineralGummiesOpen from '@/assets/photo_2026-07-20_16-24-423.jpg';
import { Progress } from '@/components/ui/progress';
import { useLang } from '@/lib/lang-context';

const focusGummiesMain = focusGummiesClosed;
const focusGummies = focusGummiesClosed;
const focusGummiesImage = focusGummiesClosed;

const mineralGummiesMain = mineralGummiesClosed;
const mineralGummies = mineralGummiesClosed;
const mineralGummiesImage = mineralGummiesClosed;

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
        about: 'A gentle, strawberry-infused glycerite formula crafted to help ease restlessness and support calm, centered concentration for your child.',
        netWt: 'Net Wt. 120g / 60 Gummies',
        specs: ['Naturally Flavored', 'Glycerite Based', 'Prototype Formula'],
        ingredients: [
          { botanical: 'Melissa officinalis', common: 'Lemon Balm' },
          { botanical: 'Passiflora incarnata', common: 'Passionflower' },
          { botanical: 'Matricaria chamomilla', common: 'Chamomile' }
        ]
      },
      mineral: {
        subtitle: 'REST & GROWTH',
        about: 'Nourishing herbal glycerite formula with bio-active magnesium and soothing botanicals to support physical recovery, restful sleep, and healthy growth for your child.',
        netWt: 'Net Wt. 120g / 60 Gummies',
        specs: ['Naturally Flavored', 'Glycerite Based', 'Prototype Formula'],
        ingredients: [
          { botanical: 'Magnesium Glycinate', common: 'Bio-active Mineral' },
          { botanical: 'Matricaria chamomilla', common: 'Chamomile' },
          { botanical: 'Melissa officinalis', common: 'Lemon Balm' }
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
        about: 'تركيبة جلسريت نباتية لطيفة بنكهة الفراولة الطبيعية مُصممة للمساعدة في تخفيف التوتر ودعم تركيز هادئ ومتمركز لطفلك.',
        netWt: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
        specs: ['نكهة طبيعية', 'أساس الجلسريت', 'تركيبة تجريبية'],
        ingredients: [
          { botanical: 'Melissa officinalis', common: 'بلسم الليمون' },
          { botanical: 'Passiflora incarnata', common: 'زهرة الآلام' },
          { botanical: 'Matricaria chamomilla', common: 'البابونج' }
        ]
      },
      mineral: {
        subtitle: 'النمو والاسترخاء',
        about: 'تركيبة جلسريت نباتية مغذية تحتوي على المغنيسيوم الحيوي والأعشاب المهدئة لدعم التعافي الجسدي والنوم المريح لطفلك.',
        netWt: 'الوزن الصافي ١٢٠غ / ٦٠ حبة',
        specs: ['نكهة طبيعية', 'أساس الجلسريت', 'تركيبة تجريبية'],
        ingredients: [
          { botanical: 'Magnesium Glycinate', common: 'معدن حيوي نشط' },
          { botanical: 'Matricaria chamomilla', common: 'البابونج المهدئ' },
          { botanical: 'Melissa officinalis', common: 'مستخلص بلسم الليمون' }
        ]
      }
    }
  }
};

function getFocusReason(assessment: any, lang: 'en' | 'ar'): string {
  if (!assessment) return '';
  const reasonsEn: string[] = [];
  const reasonsAr: string[] = [];

  if (assessment.activityLevel === 'very_active') {
    reasonsEn.push('high activity levels');
    reasonsAr.push('مستوى نشاط مرتفع جداً');
  }
  if (assessment.focusDifficulty === 'often') {
    reasonsEn.push('frequent difficulty focusing on tasks');
    reasonsAr.push('صعوبة متكررة في التركيز والمهام');
  } else if (assessment.focusDifficulty === 'sometimes') {
    reasonsEn.push('occasional focus challenges');
    reasonsAr.push('تحديات متقطعة في التركيز');
  }
  if (assessment.hyperactivity === 'often') {
    reasonsEn.push('frequent restlessness');
    reasonsAr.push('تشتت وحركة زائدة متكررة');
  }
  if (assessment.homework === 'yes') {
    reasonsEn.push('struggles with homework or quiet time');
    reasonsAr.push('صعوبة في وقت الواجبات المدرسية');
  }

  if (lang === 'ar') {
    if (reasonsAr.length === 0) {
      return `بناءً على التقييم، أظهر ملف ${assessment.childName} مؤشرات لطيفة للاستفادة من تركيبة بلسم الليمون وزهرة الآلام لدعم التركيز الهادئ.`;
    }
    return `بناءً على إجاباتك التي أظهرت ${reasonsAr.join('، و')} لدى ${assessment.childName}، يُوصى بمزيج حلوى التركيز (بلسم الليمون وزهرة الآلام) لدعم التركيز الهادئ بدون منبهات.`;
  } else {
    if (reasonsEn.length === 0) {
      return `Based on ${assessment.childName}'s profile, our Focus blend of Lemon Balm and Passionflower provides gentle, non-stimulating support for calm attention.`;
    }
    return `Based on your responses showing ${reasonsEn.join(', and ')} for ${assessment.childName}, our Focus blend of Lemon Balm and Passionflower is specifically recommended to support calm concentration.`;
  }
}

function getMineralReason(assessment: any, lang: 'en' | 'ar'): string {
  if (!assessment) return '';
  const reasonsEn: string[] = [];
  const reasonsAr: string[] = [];

  if (assessment.diet === 'poor') {
    reasonsEn.push('picky eating habits');
    reasonsAr.push('عادات غذائية انتقائية');
  } else if (assessment.diet === 'average') {
    reasonsEn.push('average dietary quality');
    reasonsAr.push('توازن غذائي متوسط');
  }

  if (assessment.vegetables === '0') {
    reasonsEn.push('no daily vegetable intake');
    reasonsAr.push('قلة تناول الخضروات اليومية');
  } else if (assessment.vegetables === '1') {
    reasonsEn.push('low daily vegetable intake');
    reasonsAr.push('تناول محدود للخضروات');
  }

  if (assessment.supplements === 'no') {
    reasonsEn.push('a lack of daily nutrient supplements');
    reasonsAr.push('عدم تناول مكملات غذائية يومية');
  }

  if (lang === 'ar') {
    if (reasonsAr.length === 0) {
      return `بناءً على الملف الغذائي لـ ${assessment.childName}، يُوصى بمزيج حلوى المعادن (المغنيسيوم والبابونج) لدعم نمو الجسم والترميم الجسدي.`;
    }
    return `بناءً على الإجابات التي سلطت الضوء على ${reasonsAr.join('، و')} لدى ${assessment.childName}، يُوصى بحلوى المعادن لدعم استرخاء الجهاز العصبي والتعافي الجسدي.`;
  } else {
    if (reasonsEn.length === 0) {
      return `Based on ${assessment.childName}'s nutrition profile, our Mineral blend of Magnesium and Chamomile is recommended to support restorative growth and evening calm.`;
    }
    return `Based on your responses highlighting ${reasonsEn.join(', and ')} for ${assessment.childName}, our Mineral blend of Magnesium and Chamomile is recommended to support physical recovery and restorative rest.`;
  }
}

export function Results() {
  const params = useParams();
  const rawId = params.id ? parseInt(params.id, 10) : 0;
  const id = !isNaN(rawId) && rawId > 0 ? rawId : 0;
  const { t, isRTL, lang } = useLang();
  const { toast } = useToast();
  const r = t.results;
  const currentLang = (lang || 'en') as 'en' | 'ar';

  const { data: assessment, isLoading, error } = useGetAssessment(id, {
    query: { enabled: !!id } as any
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: currentLang === 'ar' ? 'خطأ في تحميل النتائج' : 'Failed to Load Results',
        description: (error as any)?.message || (currentLang === 'ar'
          ? 'عذراً، تعذر الاتصال بالخادم لجلب تفاصيل التقييم. يرجى إعادة المحاولة.'
          : 'Could not connect to the server to fetch assessment details. Please try again.'),
      });
    }
  }, [error, toast, currentLang]);

  const [activeFocusResImg, setActiveFocusResImg] = useState<string>(focusGummiesImage);
  const [activeMineralResImg, setActiveMineralResImg] = useState<string>(mineralGummiesImage);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F5F2EA]">
        <div className="flex flex-col items-center animate-pulse">
          <Leaf className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-serif text-foreground">{r.loading}</h2>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F5F2EA]">
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

  const childName = assessment.childName || (currentLang === 'ar' ? 'طفلك' : 'your child');
  const details = productDetails[currentLang] || productDetails.en;
  const focusAbout = (details.details?.focus?.about || '').replace(/your child/g, childName).replace(/طفلك/g, childName);
  const mineralAbout = (details.details?.mineral?.about || '').replace(/your child/g, childName).replace(/طفلك/g, childName);

  const isFocusRecommended = assessment.recommendation === 'focus' || assessment.recommendation === 'both';
  const isMineralRecommended = assessment.recommendation === 'mineral' || assessment.recommendation === 'both';
  const hasCaution = !!(assessment.allergies?.trim() || assessment.medications?.trim());

  const whyRecommendTitle = currentLang === 'ar' ? 'سبب توصيتنا بهذه التركيبة' : 'WHY WE RECOMMEND THIS';

  const dynamicNoticesFocus = [...details.notices];
  const dynamicNoticesMineral = [...details.notices];
  if (hasCaution) {
    const cautionBullet = currentLang === 'ar'
      ? 'استشر طبيب الأطفال قبل البدء في تناول أي مكمل، خاصةً في ظل ملاحظات الحساسية/الأدوية التي قدمتها.'
      : 'Consult a pediatrician before starting any supplement, especially given the allergy/medication notes you submitted.';
    dynamicNoticesFocus.splice(3, 0, cautionBullet);
    dynamicNoticesMineral.splice(3, 0, cautionBullet);
  }

  // Variant color definitions
  const focusTheme = {
    key: 'focus' as const,
    title: 'FOCUS GUMMIES',
    titleAr: 'حلوى التركيز',
    accentColor: '#D93848', // Red / Strawberry
    borderColor: 'border-[#D93848]/25',
    textColor: 'text-[#D93848]',
    bgTint: 'bg-[#D93848]/5',
    image: activeFocusResImg,
    decorations: (
      <>
        <div className="absolute top-8 left-8 w-24 h-24 text-[#D93848]/10 pointer-events-none">
          <BotanicalLineArt />
        </div>
        <div className="absolute bottom-8 right-8 w-32 h-32 text-[#D93848]/10 pointer-events-none rotate-180">
          <BotanicalLineArt />
        </div>
        <div className="absolute -bottom-4 left-6 text-4xl select-none opacity-85 filter drop-shadow-md z-20">🍓</div>
        <div className="absolute top-12 right-6 text-3xl select-none opacity-85 filter drop-shadow-md z-20 rotate-12">🌿</div>
      </>
    )
  };

  const mineralTheme = {
    key: 'mineral' as const,
    title: 'MINERAL GUMMIES',
    titleAr: 'حلوى المعادن',
    accentColor: '#2D6A4F', // Forest Green
    borderColor: 'border-[#2D6A4F]/25',
    textColor: 'text-[#2D6A4F]',
    bgTint: 'bg-[#2D6A4F]/5',
    image: activeMineralResImg,
    decorations: (
      <>
        <div className="absolute top-8 left-8 w-24 h-24 text-[#2D6A4F]/10 pointer-events-none">
          <BotanicalLineArt />
        </div>
        <div className="absolute bottom-8 right-8 w-32 h-32 text-[#2D6A4F]/10 pointer-events-none rotate-90">
          <BotanicalLineArt />
        </div>
        <div className="absolute -bottom-4 left-6 text-4xl select-none opacity-85 filter drop-shadow-md z-20">🌿</div>
        <div className="absolute top-12 right-6 text-3xl select-none opacity-85 filter drop-shadow-md z-20 -rotate-12">🌼</div>
      </>
    )
  };

  // Determine dominant winning accent color
  let winningColor = '#D93848'; // Default focus red
  if (assessment.recommendation === 'mineral') {
    winningColor = '#2D6A4F'; // Mineral green
  } else if (assessment.recommendation === 'both') {
    winningColor = 'linear-gradient(90deg, #D93848 0%, #2D6A4F 100%)';
  }

  const isLightRecommendation = assessment.focusScore < 6 && assessment.mineralScore < 4;

  const focusReason = getFocusReason(assessment, currentLang);
  const mineralReason = getMineralReason(assessment, currentLang);

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-[#F5F2EA] pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        {/* Personalized Header band in winning product's accent color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] overflow-hidden shadow-xl mb-12 border border-border select-none"
        >
          <div 
            style={{ background: winningColor }} 
            className="py-10 px-8 text-center text-white relative"
          >
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLightRecommendation ? (currentLang === 'ar' ? 'توصية نباتية خفيفة' : 'Light Botanical Recommendation') : r.badge}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-wide uppercase leading-tight">
              {currentLang === 'ar' 
                ? `خطة التوصية لـ ${assessment.childName}` 
                : `${assessment.childName}'s Recommended Formula`}
            </h1>
            <p className="text-xs md:text-sm font-sans font-light tracking-widest opacity-90 uppercase mt-2 max-w-xl mx-auto">
              {isLightRecommendation 
                ? (currentLang === 'ar' 
                    ? `يظهر ${assessment.childName} مؤشرات خفيفة. إليك الخيار الأنسب كبداية رقيقة.` 
                    : `${assessment.childName} shows mild indicators. Here is our gentle starting recommendation.`) 
                : r.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Dynamic Medical Caution Note */}
        {hasCaution && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFEBEB] border border-[#FFCCD0] text-[#7A1C25] rounded-[1.5rem] p-6 mb-12 shadow-sm flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-[#D32F2F] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide">
                {currentLang === 'ar' ? 'ملاحظة صحية هامة' : 'Important Health Warning'}
              </h4>
              <p className="text-xs md:text-sm mt-1 leading-relaxed opacity-90">
                {currentLang === 'ar' 
                  ? 'يرجى مراجعة قائمة المكونات مع طبيب الأطفال الخاص بك بناءً على ملاحظات الحساسية أو الأدوية التي قدمتها.' 
                  : 'Please review the ingredient list with your pediatrician given the allergy or medication notes you provided.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Profile Scores Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-border shadow-md mb-16"
        >
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h3 className="text-xl font-serif font-bold text-foreground uppercase tracking-wide">{r.profileTitle}</h3>
            {isLightRecommendation && (
              <span className="text-xs px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-medium">
                {currentLang === 'ar' ? 'مؤشرات خفيفة (أقل من حد الدعم الشديد)' : 'Mild Indicators (Baseline Support)'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <div className="flex justify-between items-end mb-2.5">
                <span className="font-semibold text-sm text-[#3B593F]">{r.focusNeed}</span>
                <span className="text-xs font-bold text-[#3B593F] bg-[#3B593F]/10 px-2.5 py-1 rounded-lg border border-[#3B593F]/15">
                  {assessment.focusScore}/12
                </span>
              </div>
              <Progress value={Math.min(100, Math.max(0, Math.round((assessment.focusScore / 12) * 100)))} className="h-3 mb-3 bg-[#3B593F]/10 [&>div]:bg-[#3B593F]" />
              <p className="text-xs text-foreground/60 leading-relaxed">
                {assessment.focusScore >= 6 ? r.focusHigh : r.focusLow}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2.5">
                <span className="font-semibold text-sm text-[#722F37]">{r.mineralNeed}</span>
                <span className="text-xs font-bold text-[#722F37] bg-[#722F37]/10 px-2.5 py-1 rounded-lg border border-[#722F37]/15">
                  {assessment.mineralScore}/8
                </span>
              </div>
              <Progress value={Math.min(100, Math.max(0, Math.round((assessment.mineralScore / 8) * 100)))} className="h-3 mb-3 bg-[#722F37]/10 [&>div]:bg-[#722F37]" />
              <p className="text-xs text-foreground/60 leading-relaxed">
                {assessment.mineralScore >= 4 ? r.mineralHigh : r.mineralLow}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendations Stacks styled as Gummy packaging */}
        <div className="space-y-24">
          <h3 className="text-2xl md:text-3xl font-serif text-center mb-8 uppercase tracking-widest text-foreground/80 font-normal">
            {r.recommendedTitle}
          </h3>

          {/* COMPLETE WELLNESS BUNDLE HERO BANNER (when recommendation is 'both') */}
          {assessment.recommendation === 'both' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#3B593F] to-[#722F37] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 mb-16 border border-white/20"
            >
              <div className="md:w-1/2 flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentLang === 'ar' ? 'حزمة العافية المتكاملة الموصى بها' : 'RECOMMENDED COMPLETE DUAL BUNDLE'}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-medium tracking-wide uppercase leading-tight mb-3">
                  {currentLang === 'ar' ? 'ثنائي التركيز والمعادن الشامل' : 'Complete Day & Night Bundle'}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed mb-6 font-sans">
                  {currentLang === 'ar'
                    ? `بناءً على التقييم، يحتاج ${assessment.childName} إلى دعم مزدوج للتركيز في النهار وللتعافي والراحة في المساء. توفر هذه الحزمة الرعاية المتكاملة على مدار ٢٤ ساعة.`
                    : `Based on the assessment, ${assessment.childName} benefits from dual support: daytime concentration and evening restful recovery. This pair provides complete round-the-clock wellness.`}
                </p>
                <Link href="/products#bundle">
                  <Button className="rounded-full bg-white text-foreground hover:bg-white/90 font-bold px-6 py-3 text-xs tracking-widest uppercase shadow-md">
                    {currentLang === 'ar' ? 'استكشف الحزمة الشاملة' : 'EXPLORE COMPLETE BUNDLE'}
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center items-center gap-4 relative">
                <img
                  src={focusGummiesImage}
                  alt="Pure Botànica Focus Gummies"
                  className="max-h-[220px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                />
                <img
                  src={mineralGummiesImage}
                  alt="Pure Botànica Mineral Gummies"
                  className="max-h-[220px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                />
              </div>
            </motion.div>
          )}

          {/* FOCUS GUMMIES PACKAGING BLOCK */}
          {isFocusRecommended && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col"
            >
              {/* PART 1: Hero Panel (Top Half) */}
              <div className="relative rounded-t-[2rem] overflow-hidden border-t border-l border-r border-border bg-[#FDFBF7] shadow-xl flex flex-col">
                <div style={{ backgroundColor: focusTheme.accentColor }} className="py-5 px-8 text-center text-white border-b border-black/10 select-none">
                  <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-[0.2em] uppercase">
                    {currentLang === 'ar' ? focusTheme.titleAr : focusTheme.title}
                  </h3>
                  <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.15em] opacity-80 uppercase mt-1">
                    {details.heroSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 items-center relative min-h-[500px]">
                  {/* Left Sidebar Cards */}
                  <div className="flex flex-col gap-4 order-2 md:order-1 select-none">
                    {[
                      { icon: Leaf, label: details.plantBased },
                      { icon: FlaskConical, label: details.carefullyCrafted },
                      { icon: Sparkles, label: details.inspiredNature }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border ${focusTheme.borderColor} ${focusTheme.bgTint} flex flex-col items-center text-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${focusTheme.textColor} mb-2.5`} />
                        <span className={`text-[10px] font-sans font-bold tracking-widest ${focusTheme.textColor} uppercase`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Center Bottle */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center relative min-h-[420px] order-1 md:order-2">
                    {focusTheme.decorations}
                    <div className="relative z-10 w-full h-[320px] md:h-[380px] flex items-center justify-center">
                      <motion.img 
                        src={focusGummiesOpen} 
                        alt={`${focusTheme.title} Open Jar`} 
                        className="h-full w-auto max-h-[360px] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                        whileHover={{ scale: 1.04 }}
                      />
                    </div>
                    <div className="absolute bottom-[-16px] bg-[#FCF9F2]/95 backdrop-blur-sm border border-border/80 rounded-2xl p-4 w-[85%] max-w-[280px] shadow-lg flex flex-col items-center border-t-[5px] z-20" style={{ borderTopColor: focusTheme.accentColor }}>
                      <span className="font-serif italic text-xs tracking-wider text-foreground/80">Pure Botanica</span>
                      <span className="font-serif font-bold text-sm tracking-wide text-foreground mt-0.5" style={{ color: focusTheme.accentColor }}>
                        {currentLang === 'ar' ? focusTheme.titleAr : focusTheme.title}
                      </span>
                      <span style={{ backgroundColor: focusTheme.accentColor }} className="text-[8px] text-white px-2.5 py-0.5 rounded-full font-semibold mt-2 tracking-wider uppercase scale-90">
                        {details.categoryPill}
                      </span>
                      <div className="flex justify-center gap-2.5 mt-3.5 w-full border-t border-border/60 pt-3">
                        {details.details.focus.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="w-12 h-12 rounded-full border border-border/80 bg-white flex flex-col items-center justify-center p-1 text-center scale-90 shadow-sm">
                            <span className="text-[6.5px] leading-tight font-sans font-bold text-foreground/75 tracking-tighter uppercase">{spec}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] text-foreground/50 mt-2.5 font-mono tracking-widest">{details.details.focus.netWt}</span>
                    </div>
                  </div>

                  {/* Right Sidebar (Ingredients) */}
                  <div className="order-3 h-full">
                    <div className={`p-6 rounded-3xl border ${focusTheme.borderColor} ${focusTheme.bgTint} h-full flex flex-col shadow-sm`}>
                      <h4 className={`text-xs font-serif font-bold tracking-widest ${focusTheme.textColor} mb-5 border-b pb-2.5 ${focusTheme.borderColor} uppercase`}>
                        {details.ingredientsTitle}
                      </h4>
                      <ul className="space-y-4 flex-grow">
                        {details.details.focus.ingredients.map((ing, iIdx) => (
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
                style={{ borderTopColor: focusTheme.accentColor }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="flex flex-col justify-between h-full min-h-[260px] relative">
                    <div>
                      <span className="font-serif italic text-base tracking-widest text-foreground/60 block">Pure Botanica</span>
                      <h3 className="text-3xl font-serif font-black tracking-wider text-foreground uppercase mt-1">
                        {currentLang === 'ar' ? focusTheme.titleAr : focusTheme.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-white px-3 py-1 rounded-full uppercase" style={{ backgroundColor: focusTheme.accentColor }}>
                          {details.categoryPill}
                        </span>
                        <span className={`text-[9px] font-sans font-extrabold tracking-widest uppercase ${focusTheme.textColor}`}>
                          {details.multiHerbal}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground/50 tracking-widest font-sans font-medium uppercase mt-4">
                        {details.subCategory}
                      </p>
                      
                      {/* Shop CTA Button */}
                      <div className="mt-6 flex justify-start select-none">
                        <Link href="/products#focus">
                          <Button style={{ backgroundColor: focusTheme.accentColor }} className="rounded-full px-7 py-5 text-xs font-bold tracking-widest text-white hover:opacity-90 hover:scale-102 transition-all">
                            {currentLang === 'ar' ? 'تسوق حلوى التركيز' : 'SHOP FOCUS GUMMIES'}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8 pt-6 border-t border-border/60">
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
                      <div className="self-center sm:self-auto">
                        <Barcode />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className={`p-6 rounded-2xl bg-white border ${focusTheme.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-foreground uppercase mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" style={{ color: focusTheme.accentColor }} />
                        {whyRecommendTitle}
                      </h4>
                      <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
                        {focusReason}
                      </p>
                    </div>
                    <div className={`p-6 rounded-2xl bg-white border ${focusTheme.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-destructive uppercase mb-3.5 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {details.noticeTitle}
                      </h4>
                      <ul className="space-y-2 font-sans">
                        {dynamicNoticesFocus.map((notice, nIdx) => (
                          <li key={nIdx} className="text-[11px] text-foreground/70 leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-1.5 shrink-0" />
                            <span>{notice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MINERAL GUMMIES PACKAGING BLOCK */}
          {isMineralRecommended && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col"
            >
              {/* PART 1: Hero Panel (Top Half) */}
              <div className="relative rounded-t-[2rem] overflow-hidden border-t border-l border-r border-border bg-[#FDFBF7] shadow-xl flex flex-col">
                <div style={{ backgroundColor: mineralTheme.accentColor }} className="py-5 px-8 text-center text-white border-b border-black/10 select-none">
                  <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-[0.2em] uppercase">
                    {currentLang === 'ar' ? mineralTheme.titleAr : mineralTheme.title}
                  </h3>
                  <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.15em] opacity-80 uppercase mt-1">
                    {details.heroSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 items-center relative min-h-[500px]">
                  {/* Left Sidebar Cards */}
                  <div className="flex flex-col gap-4 order-2 md:order-1 select-none">
                    {[
                      { icon: Leaf, label: details.plantBased },
                      { icon: FlaskConical, label: details.carefullyCrafted },
                      { icon: Sparkles, label: details.inspiredNature }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border ${mineralTheme.borderColor} ${mineralTheme.bgTint} flex flex-col items-center text-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${mineralTheme.textColor} mb-2.5`} />
                        <span className={`text-[10px] font-sans font-bold tracking-widest ${mineralTheme.textColor} uppercase`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Center Bottle */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center relative min-h-[420px] order-1 md:order-2">
                    {mineralTheme.decorations}
                    <div className="relative z-10 w-full h-[320px] md:h-[380px] flex items-center justify-center">
                      <motion.img 
                        src={mineralGummiesOpen} 
                        alt={`${mineralTheme.title} Open Jar`} 
                        className="h-full w-auto max-h-[360px] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                        whileHover={{ scale: 1.04 }}
                      />
                    </div>
                    <div className="absolute bottom-[-16px] bg-[#FCF9F2]/95 backdrop-blur-sm border border-border/80 rounded-2xl p-4 w-[85%] max-w-[280px] shadow-lg flex flex-col items-center border-t-[5px] z-20" style={{ borderTopColor: mineralTheme.accentColor }}>
                      <span className="font-serif italic text-xs tracking-wider text-foreground/80">Pure Botanica</span>
                      <span className="font-serif font-bold text-sm tracking-wide text-foreground mt-0.5" style={{ color: mineralTheme.accentColor }}>
                        {currentLang === 'ar' ? mineralTheme.titleAr : mineralTheme.title}
                      </span>
                      <span style={{ backgroundColor: mineralTheme.accentColor }} className="text-[8px] text-white px-2.5 py-0.5 rounded-full font-semibold mt-2 tracking-wider uppercase scale-90">
                        {details.categoryPill}
                      </span>
                      <div className="flex justify-center gap-2.5 mt-3.5 w-full border-t border-border/60 pt-3">
                        {details.details.mineral.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="w-12 h-12 rounded-full border border-border/80 bg-white flex flex-col items-center justify-center p-1 text-center scale-90 shadow-sm">
                            <span className="text-[6.5px] leading-tight font-sans font-bold text-foreground/75 tracking-tighter uppercase">{spec}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] text-foreground/50 mt-2.5 font-mono tracking-widest">{details.details.mineral.netWt}</span>
                    </div>
                  </div>

                  {/* Right Sidebar (Ingredients) */}
                  <div className="order-3 h-full">
                    <div className={`p-6 rounded-3xl border ${mineralTheme.borderColor} ${mineralTheme.bgTint} h-full flex flex-col shadow-sm`}>
                      <h4 className={`text-xs font-serif font-bold tracking-widest ${mineralTheme.textColor} mb-5 border-b pb-2.5 ${mineralTheme.borderColor} uppercase`}>
                        {details.ingredientsTitle}
                      </h4>
                      <ul className="space-y-4 flex-grow">
                        {details.details.mineral.ingredients.map((ing, iIdx) => (
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
                style={{ borderTopColor: mineralTheme.accentColor }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="flex flex-col justify-between h-full min-h-[260px] relative">
                    <div>
                      <span className="font-serif italic text-base tracking-widest text-foreground/60 block">Pure Botanica</span>
                      <h3 className="text-3xl font-serif font-black tracking-wider text-foreground uppercase mt-1">
                        {currentLang === 'ar' ? mineralTheme.titleAr : mineralTheme.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-white px-3 py-1 rounded-full uppercase" style={{ backgroundColor: mineralTheme.accentColor }}>
                          {details.categoryPill}
                        </span>
                        <span className={`text-[9px] font-sans font-extrabold tracking-widest uppercase ${mineralTheme.textColor}`}>
                          {details.multiHerbal}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground/50 tracking-widest font-sans font-medium uppercase mt-4">
                        {details.subCategory}
                      </p>
                      
                      {/* Shop CTA Button */}
                      <div className="mt-6 flex justify-start select-none">
                        <Link href="/products#mineral">
                          <Button style={{ backgroundColor: mineralTheme.accentColor }} className="rounded-full px-7 py-5 text-xs font-bold tracking-widest text-white hover:opacity-90 hover:scale-102 transition-all">
                            {currentLang === 'ar' ? 'تسوق حلوى المعادن' : 'SHOP MINERAL GUMMIES'}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8 pt-6 border-t border-border/60">
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
                      <div className="self-center sm:self-auto">
                        <Barcode />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className={`p-6 rounded-2xl bg-white border ${mineralTheme.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-foreground uppercase mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" style={{ color: mineralTheme.accentColor }} />
                        {whyRecommendTitle}
                      </h4>
                      <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-sans">
                        {mineralReason}
                      </p>
                    </div>
                    <div className={`p-6 rounded-2xl bg-white border ${mineralTheme.borderColor} shadow-sm`}>
                      <h4 className="text-xs font-serif font-bold tracking-widest text-destructive uppercase mb-3.5 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {details.noticeTitle}
                      </h4>
                      <ul className="space-y-2 font-sans">
                        {dynamicNoticesMineral.map((notice, nIdx) => (
                          <li key={nIdx} className="text-[11px] text-foreground/70 leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-1.5 shrink-0" />
                            <span>{notice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Disclaimer footer */}
        <div className="bg-muted/30 p-6 rounded-2xl text-center border border-border mt-16 select-none">
          <p className="text-xs text-foreground/50 max-w-3xl mx-auto leading-relaxed">
            <strong>{lang === 'ar' ? 'إخلاء المسؤولية الطبية:' : 'Medical Disclaimer:'}</strong>{' '}
            {r.disclaimer.replace(/^[^:]+:\s*/, '')}
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 flex justify-center">
          <Link href="/assessment">
            <Button variant="outline" className="rounded-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              {currentLang === 'ar' ? 'العودة للتقييم' : 'Back to Assessment'}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
