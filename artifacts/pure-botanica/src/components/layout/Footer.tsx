import { Link } from 'wouter';
import { Leaf } from 'lucide-react';
import { useLang } from '@/lib/lang-context';

export function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="bg-foreground text-background py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block font-serif text-2xl font-medium text-background mb-4">
              Pure Botanica
            </Link>
            <p className="text-background/70 max-w-sm leading-relaxed mb-6">
              {f.tagline}
            </p>
            <div className="flex items-center gap-4 text-primary">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-medium">{f.plantBased}</span>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">{f.explore}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-background/70 hover:text-white transition-colors">{f.botanicals}</Link>
              </li>
              <li>
                <Link href="/assessment" className="text-background/70 hover:text-white transition-colors">{f.wellnessAssessment}</Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/70 hover:text-white transition-colors">{f.contactUs}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">{f.legal}</h4>
            <ul className="space-y-3">
              <li><span className="text-background/50 text-sm cursor-not-allowed">{f.privacy}</span></li>
              <li><span className="text-background/50 text-sm cursor-not-allowed">{f.terms}</span></li>
              <li className="pt-4">
                <Link href="/admin/login" className="text-background/30 hover:text-primary transition-colors text-xs uppercase tracking-wider">
                  {f.admin}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-background/50 text-sm">
          <p>{f.copyright(new Date().getFullYear())}</p>
          <p className="text-center md:text-right max-w-xl text-xs">
            {f.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
