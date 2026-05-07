import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight, Trash2, Plus } from 'lucide-react';
import { ViewState } from '../types';

interface RSVPFormProps {
  guestName: string;
  onNavigate: (view: ViewState) => void;
}

type Companion = { firstName: string; lastName: string };

type FormData = {
  attending: string;
  firstName: string;
  lastName: string;
  hasCompanion: string;
  companions: Companion[];
  busNeeded: string;
  addressStreet: string;
  addressFloor: string;
  addressPostalCode: string;
  addressCity: string;
  hasDietary: string;
  dietaryWho: string;
  dietaryRestrictions: string;
  songs: string[];
  message: string;
};

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhcszOLYHIGkxfD0I7jNE7beoHkxDoWeNeXvwg3vZ2kQza9Dj9oBuOl_1u1lbgWk-4zg/exec';

// Build dynamic step list from current form state
function buildSteps(formData: FormData): string[] {
  const steps: string[] = ['attending', 'firstName', 'lastName'];

  if (formData.attending === 'yes') {
    steps.push('hasCompanion');
    if (formData.hasCompanion === 'yes') steps.push('companions');
    steps.push('busNeeded', 'address', 'hasDietary');
    if (formData.hasDietary === 'yes') {
      if (formData.hasCompanion === 'yes') steps.push('dietaryWho');
      steps.push('dietaryDetail');
    }
  }

  steps.push('songSuggestion', 'message');
  return steps;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ guestName, onNavigate }) => {
  // Pre-fill first name from guestName if available
  const nameParts = (guestName || '').trim().split(' ');
  const defaultFirst = nameParts[0] || '';
  const defaultLast = nameParts.slice(1).join(' ') || '';

  const [formData, setFormData] = useState<FormData>({
    attending: '',
    firstName: defaultFirst,
    lastName: defaultLast,
    hasCompanion: '',
    companions: [{ firstName: '', lastName: '' }],
    busNeeded: '',
    addressStreet: '',
    addressFloor: '',
    addressPostalCode: '',
    addressCity: '',
    hasDietary: '',
    dietaryWho: '',
    dietaryRestrictions: '',
    songs: [''],
    message: ''
  });

  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const steps = buildSteps(formData);
  const currentStepKey = steps[step];
  const totalSteps = steps.length;
  const progress = ((step) / totalSteps) * 100;

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 300);
  }, [step]);

  // Auto-suggest companion based on detected guest identity
  useEffect(() => {
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const firstNorm = norm(formData.firstName.trim());
    const lastWords = norm(formData.lastName).split(/\s+/);

    let suggestion: { firstName: string; lastName: string } | null = null;

    if ((firstNorm === 'miguel angel' || firstNorm === 'miguelangel' || firstNorm === 'miguel') && lastWords.some(w => w === 'rodenas')) {
      suggestion = { firstName: 'Ana', lastName: 'Saumell' };
    } else if (firstNorm === 'jaime' && lastWords.some(w => w === 'varela')) {
      suggestion = { firstName: 'Miriam', lastName: 'Artola' };
    } else if (lastWords.some(w => w === 'caubet')) {
      suggestion = { firstName: 'Carmen', lastName: 'Fons' };
    } else if (lastWords.some(w => w === 'concha')) {
      suggestion = { firstName: 'Isa', lastName: '' };
    }

    if (suggestion) {
      setFormData(prev => ({
        ...prev,
        hasCompanion: 'yes',
        companions: [{ firstName: suggestion!.firstName, lastName: suggestion!.lastName }]
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.firstName, formData.lastName]);

  const animateTo = (nextStep: number, dir: 'forward' | 'back') => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 220);
  };

  const goNext = () => {
    if (step < totalSteps - 1) animateTo(step + 1, 'forward');
  };

  const goBack = () => {
    if (step > 0) animateTo(step - 1, 'back');
    else onNavigate('home');
  };

  const canGoNext = (): boolean => {
    switch (currentStepKey) {
      case 'attending': return formData.attending !== '';
      case 'firstName': return formData.firstName.trim() !== '';
      case 'lastName': return formData.lastName.trim() !== '';
      case 'hasCompanion': return formData.hasCompanion !== '';
      case 'companions': return formData.companions.every(c => c.firstName.trim() !== '' && c.lastName.trim() !== '');
      case 'busNeeded': return formData.busNeeded !== '';
      case 'address': return formData.addressStreet.trim() !== '' && formData.addressPostalCode.trim() !== '' && formData.addressCity.trim() !== '';
      case 'hasDietary': return formData.hasDietary !== '';
      case 'dietaryWho': return formData.dietaryWho !== '';
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const companionsList = formData.hasCompanion === 'yes'
        ? formData.companions.map(c => `${c.firstName} ${c.lastName}`).join(', ')
        : '';

      const params = new URLSearchParams({
        attending: formData.attending,
        fullName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hasCompanion: formData.hasCompanion,
        companions: companionsList,
        busNeeded: { yes: 'Sí', no: 'No', maybe: 'Por ver' }[formData.busNeeded] ?? formData.busNeeded,
        addressStreet: formData.addressStreet,
        addressFloor: formData.addressFloor,
        addressPostalCode: formData.addressPostalCode,
        addressCity: formData.addressCity,
        hasDietary: { yes: 'Sí', no: 'No' }[formData.hasDietary] ?? formData.hasDietary,
        dietaryWho: { main: 'Yo', companion: 'Mi acompañante', both: 'Ambos' }[formData.dietaryWho] ?? formData.dietaryWho,
        dietaryRestrictions: formData.dietaryRestrictions,
        songSuggestion: formData.songs.filter(s => s.trim()).join(' / '),
        message: formData.message,
      });

      console.log('📋 Datos que se envían a Google Sheets:', Object.fromEntries(params));
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      setStatus('success');
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setStatus('error');
    }
  };

const removeCompanion = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== idx)
    }));
  };

  const updateCompanion = (idx: number, field: 'firstName' | 'lastName', value: string) => {
    setFormData(prev => {
      const companions = [...prev.companions];
      companions[idx] = { ...companions[idx], [field]: value };
      return { ...prev, companions };
    });
  };

  const isLastStep = step === totalSteps - 1;
  const isAutoAdvanceStep = currentStepKey === 'attending' || currentStepKey === 'busNeeded' || currentStepKey === 'hasDietary' || currentStepKey === 'dietaryWho';

  // ─── SUCCESS SCREEN ──────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-50 to-white flex items-center justify-center px-4">
        <div className="bg-white max-w-lg w-full rounded-3xl p-10 text-center shadow-2xl border border-wedding-100 animate-fade-in-up">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="font-serif text-4xl text-wedding-900 mb-4">¡Gracias!</h2>
          <p className="text-wedding-600 mb-8 leading-relaxed text-lg">
            {formData.attending === 'yes'
              ? '¡Qué ganas de verte! Hemos anotado tu confirmación. Te esperamos el 19 de septiembre 💛'
              : 'Hemos recibido tu respuesta. ¡Te echaremos de menos ese día!'}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-wedding-900 text-white rounded-xl font-medium shadow-lg hover:bg-wedding-800 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP RENDER ─────────────────────────────────────────────────
  const animClass = animating
    ? direction === 'forward' ? 'opacity-0 translate-y-5' : 'opacity-0 -translate-y-5'
    : 'opacity-100 translate-y-0';
  const baseTransition = `transition-all duration-200 ease-out ${animClass}`;

  const OptionButton = ({
    value, label, sub, field, colorActive = 'border-wedding-800 bg-wedding-50',
    onSelect
  }: {
    value: string; label: string; sub?: string; field: keyof FormData;
    colorActive?: string; onSelect?: () => void;
  }) => {
    const current = formData[field] as string;
    return (
      <button
        type="button"
        onClick={() => {
          setFormData(prev => ({ ...prev, [field]: value }));
          if (onSelect) setTimeout(onSelect, 280);
        }}
        className={`w-full p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.98]
          ${current === value ? colorActive : 'border-wedding-100 hover:border-wedding-300 bg-white'}`}
      >
        <div className="font-semibold text-wedding-900 text-lg">{label}</div>
        {sub && <div className="text-wedding-500 text-sm mt-0.5">{sub}</div>}
      </button>
    );
  };

  const renderStep = () => {
    switch (currentStepKey) {
      case 'attending':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-3 leading-snug">
              ¿Nos acompañarás en nuestro gran día? 💛
            </h2>
            <p className="text-wedding-500 mb-8 text-base">
              El <strong className="text-wedding-800">19 de septiembre de 2026</strong> nos casamos y queremos saber si podrás estar con nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <OptionButton value="yes" label="¡Sí, allí estaré!" sub="No me lo perdería por nada" field="attending" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
              <OptionButton value="no" label="Lo siento, no podré" sub="Me encantaría, pero..." field="attending" colorActive="border-red-300 bg-red-50" onSelect={goNext} />
            </div>
            {step > 0 && <BackButton onClick={goBack} />}
          </div>
        );

      case 'firstName':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Cuál es tu nombre? 📝
            </h2>
            <p className={`mb-8 text-sm font-medium transition-all duration-300 ${
              formData.firstName.includes(' ')
                ? 'text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2'
                : 'text-wedding-500'
            }`}>
              {formData.firstName.includes(' ') && <span className="text-lg">✋</span>}
              Solo el nombre de pila
              {formData.firstName.includes(' ') && <span className="text-amber-500">. ¡Los apellidos van en el siguiente paso!</span>}
            </p>
            <input
              ref={inputRef}
              type="text"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && canGoNext() && goNext()}
              placeholder="Ej. María"
              className={`w-full px-5 py-4 text-xl rounded-2xl border-2 focus:outline-none transition-all bg-white ${
                formData.firstName.includes(' ')
                  ? 'border-amber-300 focus:border-amber-500'
                  : 'border-wedding-200 focus:border-wedding-800'
              }`}
            />
          </div>
        );

      case 'lastName': {
        const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const firstNorm = norm(formData.firstName.trim());
        const lastWords = norm(formData.lastName).split(/\s+/);

        // --- Combination checks ---
        const isJaimeVarela = firstNorm === 'jaime' && lastWords.some(w => w === 'varela');
        const isDaniFernandez =
          (firstNorm === 'dani' || firstNorm === 'daniel') &&
          lastWords.some(w => w === 'fernandez' || w === 'fernandes');
        const isMiguelAngelRodenas =
          (firstNorm === 'miguel angel' || firstNorm === 'miguelangel' || firstNorm === 'miguel') &&
          lastWords.some(w => w === 'rodenas');

        // Resolve which surname to highlight
        const KNOWN_SURNAMES = ['caubet', 'concha', 'escauriaza', 'poole', 'corominas', 'rubio'];
        let triggeredSurname: string | null = null;

        if (isJaimeVarela) {
          triggeredSurname = 'Varela';
        } else if (isDaniFernandez) {
          triggeredSurname = 'Fernández';
        } else if (isMiguelAngelRodenas) {
          triggeredSurname = formData.lastName.trim();
        } else {
          const match = KNOWN_SURNAMES.find(s => lastWords.some(w => w === s));
          if (match) triggeredSurname = formData.lastName.trim();
        }

        const easterEgg = triggeredSurname ? (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3 animate-fade-in-up">
            <span className="text-2xl">🤔</span>
            <p className="text-red-700 text-sm leading-relaxed">
              Lo sentimos <strong>{triggeredSurname}</strong>, pero el aforo de esta boda está completo. Además, no nos suena nadie con ese apellido. Quizá no está sinvitado 😉
            </p>
          </div>
        ) : null;

        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Y tus apellidos?
            </h2>
            <p className="text-wedding-500 mb-6">Tal como aparecerá en el registro.</p>
            <input
              ref={inputRef}
              type="text"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && canGoNext() && goNext()}
              placeholder="Ej. García López"
              className="w-full px-5 py-4 text-xl rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
            />
            {easterEgg}
          </div>
        );
      }

      case 'hasCompanion':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-8 leading-snug">
              ¿Vendrás con acompañante(s)? 👫
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <OptionButton
                value="yes" label="Sí, vendré acompañado/a" field="hasCompanion"
                colorActive="border-wedding-800 bg-wedding-50"
                onSelect={() => {
                  setFormData(prev => ({
                    ...prev,
                    // Only reset if there's no pre-filled companion suggestion
                    companions: prev.companions[0].firstName ? prev.companions : [{ firstName: '', lastName: '' }]
                  }));
                  goNext();
                }}
              />
              <OptionButton
                value="no" label="No, vendré solo/a" field="hasCompanion"
                colorActive="border-wedding-800 bg-wedding-50"
                onSelect={goNext}
              />
            </div>
            <BackButton onClick={goBack} />
          </div>
        );

      case 'companions':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              Nombre de tus acompañantes
            </h2>
            <p className="text-wedding-500 mb-6">Indícanos el nombre y apellidos de cada persona.</p>

            <div className="space-y-4">
              {formData.companions.map((companion, idx) => (
                <div key={idx} className="bg-wedding-50/60 border border-wedding-100 rounded-2xl p-4 space-y-3 relative">
                  {formData.companions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompanion(idx)}
                      className="absolute top-3 right-3 p-1.5 text-wedding-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar acompañante"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <p className="text-xs font-semibold text-wedding-500 uppercase tracking-wider">
                    {idx === 0 ? 'Acompañante 1' : `Acompañante ${idx + 1}`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={companion.firstName}
                      onChange={e => updateCompanion(idx, 'firstName', e.target.value)}
                      placeholder="Nombre"
                      className="w-full px-4 py-3 text-base rounded-xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                    />
                    <input
                      type="text"
                      value={companion.lastName}
                      onChange={e => updateCompanion(idx, 'lastName', e.target.value)}
                      placeholder="Apellidos"
                      className="w-full px-4 py-3 text-base rounded-xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add companion button */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, companions: [...prev.companions, { firstName: '', lastName: '' }] }))}
              className="mt-4 flex items-center gap-2 text-sm text-wedding-500 hover:text-wedding-800 transition-colors group"
            >
              <span className="w-6 h-6 rounded-full border border-wedding-300 group-hover:border-wedding-700 flex items-center justify-center transition-colors">
                <Plus size={12} />
              </span>
              Añadir otro acompañante
            </button>
          </div>
        );

      case 'busNeeded':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-8 leading-snug">
              ¿Necesitaréis el servicio de autobús? 🚌
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { value: 'no', label: 'No, iremos por nuestra cuenta' },
                { value: 'yes', label: 'Sí, lo necesitamos' },
                { value: 'maybe', label: 'Aún no lo sabemos' },
              ].map(opt => (
                <OptionButton key={opt.value} value={opt.value} label={opt.label} field="busNeeded" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
              ))}
            </div>
            <BackButton onClick={goBack} />
          </div>
        );

      case 'address':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Cuál es tu dirección? 📮
            </h2>
            <p className="text-wedding-500 mb-6">Necesitamos tu dirección postal para poder enviarte algo especial.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-wedding-600 mb-1.5">Dirección *</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.addressStreet}
                  onChange={e => setFormData(prev => ({ ...prev, addressStreet: e.target.value }))}
                  placeholder="Ej. Calle Mayor, 12"
                  className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wedding-600 mb-1.5">Piso / Puerta</label>
                <input
                  type="text"
                  value={formData.addressFloor}
                  onChange={e => setFormData(prev => ({ ...prev, addressFloor: e.target.value }))}
                  placeholder="Ej. 3ºA (opcional)"
                  className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-wedding-600 mb-1.5">Código Postal *</label>
                  <input
                    type="text"
                    value={formData.addressPostalCode}
                    onChange={e => setFormData(prev => ({ ...prev, addressPostalCode: e.target.value }))}
                    placeholder="Ej. 28001"
                    className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-wedding-600 mb-1.5">Ciudad *</label>
                  <input
                    type="text"
                    value={formData.addressCity}
                    onChange={e => setFormData(prev => ({ ...prev, addressCity: e.target.value }))}
                    placeholder="Ej. Madrid"
                    className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'hasDietary':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-8 leading-snug">
              ¿Alguno de vosotros tiene alergias o restricciones alimentarias? 🥗
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <OptionButton value="yes" label="Sí, tenemos" field="hasDietary" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
              <OptionButton value="no" label="No, ninguna" field="hasDietary" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
            </div>
            <BackButton onClick={goBack} />
          </div>
        );

      case 'dietaryWho': {
        const companionName = formData.companions[0]?.firstName || 'Mi acompañante';
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-8 leading-snug">
              ¿A quién le aplica? 👤
            </h2>
            <div className="flex flex-col gap-3">
              <OptionButton value="main" label="A mí" field="dietaryWho" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
              <OptionButton value="companion" label={`A ${companionName}`} field="dietaryWho" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
              <OptionButton value="both" label="A ambos" field="dietaryWho" colorActive="border-wedding-800 bg-wedding-50" onSelect={goNext} />
            </div>
            <BackButton onClick={goBack} />
          </div>
        );
      }

      case 'dietaryDetail':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Qué alergia o intolerancia? 🌿
            </h2>
            <p className="text-wedding-500 mb-6">Indícanos cuál o cuáles.</p>
            <input
              ref={inputRef}
              type="text"
              value={formData.dietaryRestrictions}
              onChange={e => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && goNext()}
              placeholder="Ej. Gluten, lácteos, marisco, frutos secos..."
              className="w-full px-5 py-4 text-xl rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
            />
          </div>
        );

      case 'songSuggestion':
        return (
          <div className={baseTransition}>
            <StepLabel step={step} total={totalSteps} />
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Alguna canción sugerida? 🎵
            </h2>
            <p className="text-wedding-500 mb-6">Si hay canciones que no pueden faltar en la pista de baile, ¡dínoslo! (opcional)</p>
            <div className="space-y-3">
              {formData.songs.map((song, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    ref={idx === 0 ? inputRef : undefined}
                    type="text"
                    value={song}
                    onChange={e => {
                      const songs = [...formData.songs];
                      songs[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, songs }));
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (song.trim() && idx === formData.songs.length - 1) {
                          setFormData(prev => ({ ...prev, songs: [...prev.songs, ''] }));
                        } else if (!song.trim()) {
                          goNext();
                        }
                      }
                    }}
                    placeholder={idx === 0 ? 'Artista – Canción (opcional)' : 'Otra canción...'}
                    className="flex-1 px-5 py-4 text-xl rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all bg-white"
                  />
                  {formData.songs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, songs: prev.songs.filter((_, i) => i !== idx) }))}
                      className="p-3 text-wedding-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, songs: [...prev.songs, ''] }))}
              className="mt-4 flex items-center gap-2 text-sm text-wedding-500 hover:text-wedding-800 transition-colors group"
            >
              <span className="w-6 h-6 rounded-full border border-wedding-300 group-hover:border-wedding-700 flex items-center justify-center transition-colors">
                <Plus size={12} />
              </span>
              Añadir otra canción
            </button>
          </div>
        );

      case 'message':
        return (
          <div className={baseTransition}>
            <p className="text-sm font-semibold text-wedding-400 uppercase tracking-widest mb-3">¡Última pregunta! 🎉</p>
            <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-2 leading-snug">
              ¿Quieres dejarnos algún mensaje? 💌
            </h2>
            <p className="text-wedding-500 mb-8">Totalmente opcional. ¡Nos encantará leerlo!</p>
            <textarea
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              placeholder="¡Escribe tus mejores deseos para los novios! (opcional)"
              className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-wedding-200 focus:outline-none focus:border-wedding-800 transition-all resize-none bg-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-50 to-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-wedding-100 z-50">
        <div
          className="h-full bg-wedding-800 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top nav */}
      <div className="flex items-center justify-end px-6 py-5 pt-6">
        <span className="text-sm text-wedding-400 font-medium">{step + 1} / {totalSteps}</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {renderStep()}

          {/* Navigation buttons — hidden for auto-advance steps */}
          {!isAutoAdvanceStep && currentStepKey !== 'hasCompanion' && (
            <div className="mt-10 flex flex-col gap-3">
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>Hubo un error al enviar. Inténtalo de nuevo.</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {/* Back button */}
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-4 rounded-2xl font-semibold text-base border-2 border-wedding-200 text-wedding-600 hover:border-wedding-800 hover:text-wedding-900 transition-all active:scale-[0.98]"
                >
                  <ChevronLeft size={18} />
                  {step === 0 ? 'Volver' : 'Anterior'}
                </button>

                {/* Next / Submit button */}
                {isLastStep ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === 'submitting'}
                    className={`flex items-center gap-2 px-8 py-4 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg
                      ${status === 'submitting' ? 'bg-wedding-400 cursor-not-allowed' : 'bg-wedding-900 hover:bg-wedding-800 active:scale-[0.98]'}`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <><Send size={20} /> Enviar respuesta</>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canGoNext()}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all
                      ${canGoNext() ? 'bg-wedding-900 text-white hover:bg-wedding-800 active:scale-[0.98] shadow-lg' : 'bg-wedding-100 text-wedding-400 cursor-not-allowed'}`}
                  >
                    Continuar <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Helper component ────────────────────────────────────────────
const StepLabel = ({ step, total }: { step: number; total: number }) => (
  <p className="text-sm font-semibold text-wedding-400 uppercase tracking-widest mb-3">
    Pregunta {step + 1} de {total}
  </p>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-base border-2 border-wedding-200 text-wedding-600 hover:border-wedding-800 hover:text-wedding-900 transition-all active:scale-[0.98] self-start"
  >
    <ChevronLeft size={18} />
    Anterior
  </button>
);
