import poolHero from '@/assets/pool-hero.jpg';
//import { ReservationModal } from '@/components/ReservationModal';
import { Button } from '@/components/ui/button';
import { Waves } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={poolHero}
          alt="Piscina de lujo con agua cristalina"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-background" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '-3s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md border border-blue-foreground/20 animate-fade-in">
            <Waves className="h-4 w-4 text-blue-foreground" />
            <span className="text-sm font-medium text-blue-foreground">
              Experiencia Acuática Premium
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-blue-foreground leading-tight animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Piscina
            <span className="block bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.40)]">
              Los Pavas
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-blue-foreground/90 max-w-2xl mx-auto font-light animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Sumérgete en una experiencia única. Nuestras instalaciones de primer nivel te ofrecen el
            escape perfecto para relajarte, divertirte y crear recuerdos inolvidables.
          </p>

          {/* CTA Button */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/reservar">
                <Waves className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Reservar Ahora
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
      </div>
    </section>
  );
}
