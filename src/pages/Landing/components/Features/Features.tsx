import { Clock, Droplets, Shield, Sparkles, Sun, Users } from 'lucide-react';

const features = [
  {
    icon: Droplets,
    title: 'Agua Cristalina',
    description:
      'Sistema de filtración de última generación que garantiza agua perfectamente pura y limpia.',
  },
  {
    icon: Sun,
    title: 'Ambiente Natural',
    description: 'Espacios al aire libre con jardines tropicales y áreas de descanso bajo el sol.',
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    description: 'Salvavidas certificados y protocolos de seguridad para tu tranquilidad.',
  },
  {
    icon: Clock,
    title: 'Horarios Flexibles',
    description: 'Abiertos mañana, tarde y noche para adaptarnos a tu disponibilidad.',
  },
  {
    icon: Users,
    title: 'Eventos Privados',
    description: 'Organiza fiestas, cumpleaños y celebraciones con tarifas especiales para grupos.',
  },
  {
    icon: Sparkles,
    title: 'Servicios Premium',
    description:
      'Zona de bar, cambiadores, duchas y casilleros disponibles para todos los visitantes.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pool-shimmer rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-light rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-blue uppercase tracking-wider">
            Nuestras Ventajas
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            Una Experiencia
            <span className="text-blue"> Incomparable</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubre por qué somos el destino favorito para quienes buscan relajación, diversión y
            momentos especiales.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border/50 shadow-[0_10px_40px_-10px_oklch(15%_0.032_240_/_0.1)] hover:shadow-[0_0_40px_oklch(62%_0.13_235_/_0.2)] transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue/10 flex items-center justify-center mb-6 group-hover:bg-blue/20 transition-colors">
                <feature.icon className="h-7 w-7 text-blue" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
