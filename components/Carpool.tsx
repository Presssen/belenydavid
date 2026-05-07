import React, { useState, useEffect } from 'react';
import { Ride } from '../types';
import { Car, User, MapPin, Clock, Plus, Search, Loader2, AlertCircle } from 'lucide-react';

// ============================================================================
// ⚙️ CONFIGURACIÓN GOOGLE SHEETS
// ============================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyPQaPaw3_YNpLCkhX66YNhuKmcJyXdqZQ9Ksk-ibsw7jctIYei5tXCYkKwXABgOqsH/exec"; 
// ============================================================================

interface CarpoolProps {
  guestName?: string;
}

export const Carpool: React.FC<CarpoolProps> = ({ guestName }) => {
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: guestName || '', // Auto-fill name if available
    contact: '',
    origin: '',
    date: '2026-09-19',
    time: '11:00',
    seats: 3,
    note: ''
  });

  // Load Data
  useEffect(() => {
    fetchRides();
  }, []);

  // Update form name if guestName prop changes (e.g. if arriving late)
  useEffect(() => {
    if (guestName && !formData.name) {
      setFormData(prev => ({ ...prev, name: guestName }));
    }
  }, [guestName]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      if (GOOGLE_SCRIPT_URL) {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        
        // SANITIZACIÓN DE DATOS (IMPORTANTE PARA EVITAR CRASH)
        // Convertimos todo a String o Number según corresponda para evitar errores
        // si Google Sheets devuelve un número en lugar de texto.
        const safeData = Array.isArray(data) ? data.map((r: any) => ({
          ...r,
          id: String(r.id),
          driverName: String(r.driverName || 'Anónimo'),
          contact: String(r.contact || ''), // Convertir teléfono a string por si acaso
          origin: String(r.origin || ''),
          destination: String(r.destination || ''),
          date: String(r.date || ''),
          time: String(r.time || ''),
          seatsAvailable: Number(r.seatsAvailable) || 0,
          type: (r.type === 'offer' || r.type === 'request') ? r.type : 'offer',
          note: r.note ? String(r.note) : '',
          timestamp: Number(r.timestamp) || Date.now()
        })).reverse() : [];

        setRides(safeData);
      } else {
        // Fallback demo
        const stored = localStorage.getItem('wedding_rides');
        if (stored) setRides(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error fetching rides", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newRide: Ride = {
      id: Date.now().toString(),
      driverName: formData.name,
      contact: String(formData.contact), // Asegurar string
      origin: formData.origin,
      destination: "Sanlúcar de Barrameda",
      date: formData.date,
      time: formData.time,
      seatsAvailable: Number(formData.seats),
      type: activeTab === 'offer' ? 'offer' : 'request',
      note: formData.note,
      timestamp: Date.now()
    };

    try {
      if (GOOGLE_SCRIPT_URL) {
        // Send to Google Sheet
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRide)
        });
        
        await new Promise(r => setTimeout(r, 1500));
        await fetchRides();
      } else {
        const updatedRides = [newRide, ...rides];
        setRides(updatedRides);
        localStorage.setItem('wedding_rides', JSON.stringify(updatedRides));
        await new Promise(r => setTimeout(r, 800));
      }
      
      // Clear form but keep name
      setFormData({ ...formData, contact: '', origin: '', note: '' });
      alert(activeTab === 'offer' ? "¡Viaje publicado con éxito!" : "¡Solicitud publicada con éxito!");
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRides = rides.filter(ride => 
    activeTab === 'find' ? ride.type === 'offer' : ride.type === 'request'
  );

  return (
    <div className="pt-28 pb-20 px-4 bg-wedding-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wedding-100 text-wedding-600 mb-6">
            <Car size={32} />
          </div>
          <h1 className="font-serif text-4xl text-wedding-900 mb-4">Coche Compartido</h1>
          <p className="text-wedding-700 max-w-lg mx-auto">
            ¿Tienes sitio libre en el coche? ¿Buscas transporte? 
            Organizaos aquí para llegar a la boda.
          </p>

          {!GOOGLE_SCRIPT_URL && (
            <div className="mt-6 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg text-sm inline-flex items-center gap-2 max-w-md mx-auto text-left">
              <AlertCircle size={20} className="flex-shrink-0" />
              <div>
                <strong>Modo Demo Activado:</strong> Los datos no se guardan en la nube.
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-wedding-200 mb-8 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${activeTab === 'find' 
                ? 'bg-wedding-900 text-white shadow-md' 
                : 'text-wedding-600 hover:bg-wedding-50'}`}
          >
            <Search size={18} />
            Buscar Coche
          </button>
          <button
            onClick={() => setActiveTab('offer')}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${activeTab === 'offer' 
                ? 'bg-wedding-900 text-white shadow-md' 
                : 'text-wedding-600 hover:bg-wedding-50'}`}
          >
            <Plus size={18} />
            {activeTab === 'offer' ? 'Publicar Viaje' : 'Ofrecer Coche'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left Column: List */}
          <div className="md:order-1 order-2 space-y-4">
            <h3 className="font-serif text-2xl text-wedding-900 mb-4 px-2">
              {activeTab === 'find' ? 'Coches Disponibles' : 'Gente buscando sitio'}
            </h3>

            {loading ? (
              <div className="flex justify-center py-12 text-wedding-400">
                <Loader2 className="animate-spin" />
              </div>
            ) : filteredRides.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-wedding-300">
                <p className="text-wedding-500">
                  {activeTab === 'find' 
                    ? "Aún no hay nadie ofreciendo coche. ¡Sé el primero!" 
                    : "No hay solicitudes pendientes por ahora."}
                </p>
              </div>
            ) : (
              filteredRides.map((ride) => {
                // Preparar datos seguros para renderizar
                const safeName = String(ride.driverName || '?');
                const safeInitial = safeName.charAt(0).toUpperCase();
                const safeContact = String(ride.contact || '');
                // Solo números para el enlace de WhatsApp
                const whatsappNumber = safeContact.replace(/\D/g,'');

                return (
                  <div key={ride.id} className="bg-white p-5 rounded-2xl shadow-sm border border-wedding-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-wedding-100 flex items-center justify-center text-wedding-700 font-bold text-lg">
                          {safeInitial}
                        </div>
                        <div>
                          <h4 className="font-semibold text-wedding-900">{safeName}</h4>
                          <p className="text-xs text-wedding-500">
                             {/* Safe date rendering */}
                             {new Date(ride.timestamp).toLocaleDateString() !== 'Invalid Date' 
                               ? new Date(ride.timestamp).toLocaleDateString() 
                               : 'Reciente'}
                          </p>
                        </div>
                      </div>
                      <span className="bg-wedding-50 text-wedding-800 text-xs font-bold px-3 py-1 rounded-full border border-wedding-200">
                        {ride.seatsAvailable} {activeTab === 'find' ? 'plazas' : 'personas'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-wedding-700 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-accent" />
                        <span className="font-medium">Origen:</span> {ride.origin}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-accent" />
                        <span>{ride.date} a las {ride.time}h</span>
                      </div>
                      {ride.note && (
                        <div className="bg-wedding-50 p-3 rounded-lg text-sm italic mt-2">
                          "{ride.note}"
                        </div>
                      )}
                    </div>

                    <a 
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center bg-wedding-900 text-white py-2 rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                      Contactar
                    </a>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Form */}
          <div className="md:order-2 order-1">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-wedding-100 sticky top-28">
              <h3 className="font-serif text-2xl text-wedding-900 mb-6">
                {activeTab === 'offer' ? 'Publicar mi coche' : 'Solicitar transporte'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-wedding-400" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">WhatsApp / Teléfono</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-wedding-400 font-bold text-xs">+34</span>
                    <input 
                      required
                      type="tel" 
                      value={formData.contact}
                      onChange={e => setFormData({...formData, contact: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="600 000 000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">
                       {activeTab === 'offer' ? 'Plazas Libres' : 'Plazas Necesarias'}
                    </label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      max="8"
                      value={formData.seats || ''}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setFormData({...formData, seats: isNaN(val) ? 0 : val});
                      }}
                      className="w-full px-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">Hora Salida</label>
                    <input 
                      required
                      type="time" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">
                    Origen (¿De dónde sales?)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-wedding-400" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.origin}
                      onChange={e => setFormData({...formData, origin: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                      placeholder="Ej: Sevilla, Centro"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wedding-700 uppercase tracking-wider mb-1">Nota (Opcional)</label>
                  <textarea 
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-2.5 bg-wedding-50 border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent outline-none h-20 resize-none"
                    placeholder="Ej: Paso por Jerez, tengo maletero grande..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                  {activeTab === 'offer' ? 'Publicar Asientos' : 'Solicitar Asiento'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};