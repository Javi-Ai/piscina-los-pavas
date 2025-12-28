import { Clock, Mail, MapPin, Phone, Waves } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foregroundd text-blue-foreground py-16 px-18">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue/20">
                <Waves className="h-6 w-6 text-blue" />
              </div>
              <span className="text-2xl font-display font-bold">Los Pavas</span>
            </div>
            <p className="text-blue-foreground/70 text-sm leading-relaxed">
              Tu destino de relajación y diversión acuática. Creando momentos inolvidables desde
              2015.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-blue-foreground/70">
                <MapPin className="h-4 w-4 text-blue" />
                <span>Calle 123 #45-67, Ciudad</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-foreground/70">
                <Phone className="h-4 w-4 text-blue" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-foreground/70">
                <Mail className="h-4 w-4 text-blue" />
                <span>info@aquaparadise.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Horarios</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-blue-foreground/70">
                <Clock className="h-4 w-4 text-blue mt-0.5" />
                <div>
                  <p className="font-medium text-blue-foreground">Lunes - Viernes</p>
                  <p>8:00 AM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-blue-foreground/70">
                <Clock className="h-4 w-4 text-blue mt-0.5" />
                <div>
                  <p className="font-medium text-blue-foreground">Sábados y Domingos</p>
                  <p>7:00 AM - 10:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {['Inicio', 'Servicios', 'Tarifas', 'Reservar', 'Contacto'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-blue-foreground/70 hover:text-blue transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-foreground/50">
            <p>© 2024 Aqua Paradise. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="hover:text-blue transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
