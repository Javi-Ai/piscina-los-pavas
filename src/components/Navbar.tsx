// import { ReservationModal } from '@/components/ReservationModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, Waves, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Mis reservas', href: '#' },
    { label: 'Calendario', href: '#' },
    { label: 'Galería', href: '#' },
    { label: 'Contacto', href: '#' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-12',
          isScrolled ? 'bg-card/95 backdrop-blur-md shadow-card py-3' : 'bg-transparent py-5',
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isScrolled ? 'bg-blue/10' : 'bg-card/20 backdrop-blur-sm',
                )}
              >
                <Waves
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isScrolled ? 'text-blue' : 'text-blue-foreground',
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-xl font-display font-bold transition-colors',
                  isScrolled ? 'text-foreground' : 'text-blue-foreground',
                )}
              >
                Los Pavas
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative px-6 py-3 rounded-full overflow-hidden group transition-all duration-300',
                    isScrolled
                      ? 'text-muted-foreground hover:text-white'
                      : 'text-blue-foreground/90 hover:text-white',
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full scale-0 group-hover:scale-100',
                      'bg-gradient-to-br from-blue/20 via-blue/10 to-transparent',
                      'backdrop-blur-sm transition-transform duration-500 ease-out',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full opacity-0 group-hover:opacity-100',
                      'bg-gradient-to-br from-blue/10 via-transparent to-transparent',
                      'transition-opacity duration-300',
                    )}
                  />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X
                  className={cn('h-6 w-6', isScrolled ? 'text-foreground' : 'text-blue-foreground')}
                />
              ) : (
                <Menu
                  className={cn('h-6 w-6', isScrolled ? 'text-foreground' : 'text-blue-foreground')}
                />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fade-in">
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-card/95 backdrop-blur-md">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative px-4 py-3 rounded-lg group transition-all duration-300 hover:bg-blue/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10 text-foreground group-hover:text-[hsl(var(--hero-grad-hover))] transition-colors">
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 h-8 w-1 rounded-r-full',
                        'bg-gradient-to-b from-blue via-blue/50 to-transparent',
                        'transform -translate-y-1/2 scale-y-0 group-hover:scale-y-100',
                        'transition-transform duration-300 ease-out',
                      )}
                    />
                  </a>
                ))}
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-2"
                >
                  Reservar Ahora
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* <ReservationModal open={isModalOpen} onOpenChange={setIsModalOpen} /> */}
    </>
  );
}
