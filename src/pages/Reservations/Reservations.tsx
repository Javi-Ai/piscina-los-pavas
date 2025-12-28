import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, format as formatDate } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, CalendarIcon, Check, Clock, Users, Waves } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { createReservation } from '../../core/services/reservations';
import type { TimeSlot } from '../../types/reservations';

const reservationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  identification: z.string().min(5, 'Identificación inválida').max(20),
  phone_number: z.string().min(7, 'Número de teléfono inválido').max(15),
  email: z.string().email('Email inválido'),
  visit_date: z.date({ error: 'Selecciona una fecha' }),
  time_slot: z.enum(['mañana', 'tarde', 'todo el día'], { error: 'Selecciona un horario' }),
  visit_type: z.enum(['casual', 'evento'], { error: 'Selecciona el tipo de visita' }),
  people: z.number().min(1, 'Mínimo 1 persona').max(100, 'Máximo 100 personas'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const UNITARY_PRICE_CASUAL = 4000;
const UNITARY_PRICE_EVENT = 4000;

const TIME_SLOTS: Record<TimeSlot, string> = {
  mañana: '8:00 am - 1:00 pm',
  tarde: '2:00 pm - 7:00 pm',
  'todo el día': '8:00 am - 7:00 pm',
};

export default function Reservations() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      last_name: '',
      identification: '',
      phone_number: '',
      email: '',
      people: 1,
    },
  });

  const visitDate = form.watch('visit_date');
  const timeSlot = form.watch('time_slot');
  const visitType = form.watch('visit_type');
  const people = form.watch('people');

  const isEvent = visitType === 'evento';

  const { unitaryPrice, totalPrice } = useMemo(() => {
    const unitary = isEvent ? UNITARY_PRICE_EVENT : UNITARY_PRICE_CASUAL;

    // Si es evento: deshabilitamos “personas” y precios por persona.
    // Aquí dejo total = unitary (puedes cambiarlo a 0 si quieres “sin calcular”).
    const total = isEvent ? unitary : unitary * (people || 1);

    return {
      unitaryPrice: unitary,
      totalPrice: total,
    };
  }, [isEvent, people]);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'RES-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const onSubmit = async (data: ReservationFormData) => {
    try {
      setSubmitting(true);

      const payload = {
        name: data.name,
        last_name: data.last_name,
        identification: data.identification,
        phone_number: data.phone_number,
        email: data.email,

        // Date -> YYYY-MM-DD (lo que valida tu createReservation)
        visit_date: formatDate(data.visit_date, 'yyyy-MM-dd'),

        time_slot: data.time_slot,
        visit_type: data.visit_type,

        // Si es evento: manda null (más coherente con tu UI que muestra "—")
        people: isEvent ? null : data.people,
        unitary_price: isEvent ? null : unitaryPrice,
        total_price: isEvent ? null : totalPrice,

        status: 'pendiente' as const,
        code: generateCode(),
        rejection_reason: null,
      } as const;

      const saved = await createReservation(payload as any);

      toast.success(`¡Reserva creada! Código: ${saved.code ?? payload.code}`);

      form.reset();
      setStep(1);
      navigate('/');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error inesperado';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const prettyTimeSlot = (v: string) => {
    const s = v.replaceAll('_', ' ').toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  useEffect(() => {
    if (isEvent) form.setValue('people', 1, { shouldValidate: true });
  }, [isEvent, form]);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">Volver al inicio</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <span className="font-display text-lg sm:text-xl font-semibold text-foreground">
              AquaSerena
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 lg:py-6">
        {/* Page Title */}
        <div className="text-center mb-4 lg:mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-1">
            Reservar Entrada
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa el formulario para realizar tu reserva
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-md mx-auto mb-4 lg:mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                  step >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {step > 1 ? <Check className="h-3.5 w-3.5" /> : '1'}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  step >= 1 ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                Datos personales
              </span>
            </div>

            <div
              className={cn('h-px w-10 transition-colors', step >= 2 ? 'bg-primary' : 'bg-border')}
            />

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                  step >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                2
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  step >= 2 ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                Detalles de visita
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-4 lg:gap-6 max-w-5xl mx-auto">
          {/* Left Column - Form */}
          {/* MÓVIL: primero */}
          <div className="order-1 lg:order-1">
            <div className="bg-card rounded-2xl border border-border p-4 lg:p-5 shadow-card">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3 pb-3 border-b border-border">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="font-display text-lg font-semibold text-foreground">
                          Datos Personales
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Nombre</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tu nombre"
                                  {...field}
                                  className="bg-background h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Apellido</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tu apellido"
                                  {...field}
                                  className="bg-background h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="identification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Identificación</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Número de documento"
                                {...field}
                                className="bg-background h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Teléfono</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+57 300 000 0000"
                                  {...field}
                                  className="bg-background h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="tu@email.com"
                                  {...field}
                                  className="bg-background h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          variant="hero"
                          size="default"
                          onClick={async () => {
                            const isValid = await form.trigger([
                              'name',
                              'last_name',
                              'identification',
                              'phone_number',
                              'email',
                            ]);
                            if (isValid) setStep(2);
                          }}
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3 pb-3 border-b border-border">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="font-display text-lg font-semibold text-foreground">
                          Detalles de la Visita
                        </h2>
                      </div>

                      <FormField
                        control={form.control}
                        name="visit_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm">Fecha de Visita</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full pl-3 text-left font-normal bg-background h-9',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP', { locale: es })
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="time_slot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                Horario
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background h-9">
                                    <SelectValue placeholder="Selecciona horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mañana">Mañana (8:00 am - 1:00 pm)</SelectItem>
                                  <SelectItem value="tarde">Tarde (2:00 pm - 7:00 pm)</SelectItem>
                                  <SelectItem value="todo el día">
                                    Todo el día (8:00 am - 7:00 pm)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visit_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Tipo de Visita</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background h-9">
                                    <SelectValue placeholder="Selecciona tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="casual">Casual</SelectItem>
                                  <SelectItem value="evento">Evento</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="people"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4" />
                              Número de Personas
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                {...field}
                                disabled={isEvent}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className="bg-background h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          onClick={() => setStep(1)}
                          className="flex-1 h-9"
                        >
                          Atrás
                        </Button>
                        <Button
                          type="submit"
                          variant="hero"
                          size="default"
                          className="flex-1 h-9"
                          disabled={submitting}
                        >
                          {submitting ? 'Creando…' : 'Confirmar Reserva'}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>

          {/* Right Column - Summary */}
          {/* MÓVIL: después */}
          <div className="order-2 lg:order-2">
            <div className="lg:sticky lg:top-20">
              <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
                <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Waves className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Resumen de Reserva
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-xs">Fecha</span>
                    </div>
                    <span className="text-xs font-medium text-foreground text-right">
                      {visitDate ? format(visitDate, 'PPP', { locale: es }) : '—'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Horario</span>
                    </div>
                    <span className="text-xs font-medium text-foreground text-right normal-case">
                      <span className="text-xs font-medium text-foreground text-right normal-case">
                        {timeSlot
                          ? `${prettyTimeSlot(String(timeSlot))} (${TIME_SLOTS[timeSlot as TimeSlot]})`
                          : '—'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-muted-foreground">Tipo de visita</span>
                    <span className="text-xs font-medium text-foreground capitalize">
                      {visitType || '—'}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'flex items-start justify-between gap-4',
                      isEvent && 'opacity-50',
                    )}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Personas</span>
                    </div>

                    <span className="text-xs font-medium text-foreground">
                      {isEvent ? '—' : people || 1}
                    </span>
                  </div>

                  {!isEvent ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Precio por persona</span>
                          <span className="text-xs font-medium text-foreground">
                            {formatCurrency(unitaryPrice)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {people || 1} × {formatCurrency(unitaryPrice)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="py-2 opacity-50">
                        <span className="text-xs text-muted-foreground">
                          Precios por persona no aplican para evento
                        </span>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-border my-3" />

                  <div className={cn('flex items-center justify-between', isEvent && 'opacity-50')}>
                    <span className="text-base font-display font-semibold text-foreground">
                      Total
                    </span>

                    <span
                      className={cn(
                        'text-xl font-bold text-primary',
                        isEvent && 'text-muted-foreground',
                      )}
                    >
                      {isEvent ? '—' : formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-pool-shimmer border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Nota:</span> El precio para
                    eventos se obtiene contactándose con la persona encargada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
