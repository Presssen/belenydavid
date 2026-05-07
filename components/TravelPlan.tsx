import React, { useState, useEffect } from 'react';
import { Plane, Train, Car, MapPin, Calendar, ExternalLink, Search, ChevronDown, CheckCircle2, Users, Edit3, X, Bus, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { ViewState } from '../types';
import { Accommodation } from './Accommodation';

interface TravelPlanProps {
  onNavigate: (view: ViewState) => void;
  guestName?: string;
}

// Precios estimados (Simulación basada en medias históricas Septiembre)
const PRICE_ESTIMATES: Record<string, { flight: string; train: string; bus: string; car_time: string }> = {
  BIO: { flight: '60€ - 110€', train: '80€ - 120€ (Lento)', bus: '~35€ (Largo)', car_time: '9h 30m' },
  SDR: { flight: '100€ - 180€', train: 'N/A (+9h)', bus: '~45€ (Muy largo)', car_time: '9h' },
  MAD: { flight: '50€ - 90€', train: '30€ - 75€ (AVE/Avlo)', bus: '~20€ (Socibus)', car_time: '5h 45m' },
  BCN: { flight: '45€ - 95€', train: '60€ - 120€', bus: '~90€', car_time: '10h' },
  PNA: { flight: '120€ - 180€', train: 'N/A', bus: 'N/A', car_time: '9h 15m' },
  ALC: { flight: '80€ - 140€', train: 'N/A', bus: '~50€', car_time: '6h 30m' },
  PMI: { flight: '40€ - 120€', train: 'Imposible', bus: 'Imposible', car_time: 'N/A' },
  FUE: { flight: '70€ - 150€', train: 'Imposible', bus: 'Imposible', car_time: 'N/A' },
  OTH: { flight: 'Consultar', train: 'Consultar', bus: 'Consultar', car_time: 'Consultar' }
};

export const TravelPlan: React.FC<TravelPlanProps> = ({ onNavigate, guestName }) => {
  // State
  const [origin, setOrigin] = useState('BIO');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-09-20');
  const [travelers, setTravelers] = useState(2);
  
  // UI State
  const [hasSearched, setHasSearched] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const [estimates, setEstimates] = useState(PRICE_ESTIMATES['BIO']);

  const airports = [
    { code: 'BIO', name: 'Bilbao (BIO)', city: 'Bilbao', region: 'Norte' },
    { code: 'SDR', name: 'Santander (SDR)', city: 'Santander', region: 'Norte' },
    { code: 'MAD', name: 'Madrid (MAD)', city: 'Madrid', region: 'Centro' },
    { code: 'BCN', name: 'Barcelona (BCN)', city: 'Barcelona', region: 'Este' },
    { code: 'PMI', name: 'Mallorca (PMI)', city: 'Palma', region: 'Islas' },
    { code: 'PNA', name: 'Pamplona (PNA)', city: 'Pamplona', region: 'Norte' },
    { code: 'ALC', name: 'Alicante (ALC)', city: 'Alicante', region: 'Este' },
    { code: 'FUE', name: 'Fuerteventura (FUE)', city: 'Fuerteventura', region: 'Islas' },
    { code: 'OTH', name: 'Otro Origen', city: 'Otro', region: 'General' }
  ];

  useEffect(() => {
    setEstimates(PRICE_ESTIMATES[origin] || PRICE_ESTIMATES['OTH']);
  }, [origin, startDate, endDate, travelers]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setIsFormOpen(false);
      
      const resultsElement = document.getElementById('results-container');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  };

  // RECOMMENDATION LOGIC
  const isIsland = origin === 'PMI' || origin === 'FUE';
  // Si es isla, nunca recomendamos coche para llegar, aunque sean muchos.
  const isCarRecommended = travelers >= 3 && !isIsland;
  const isTrainRecommended = origin === 'MAD'; // Madrid train is superior
  // Si es isla, siempre recomendamos avión.
  const isFlightRecommended = (!isCarRecommended && !isTrainRecommended) || isIsland;

  const getFlightUrl = (type: string) => {
    const originCode = origin === 'OTH' ? '' : origin;
    const formatDateScyscanner = (d: string) => d.replace(/-/g, '').slice(2);
    
    switch (type) {
        case 'google':
            return `https://www.google.com/travel/flights?q=Flights%20to%20Sevilla%20from%20${originCode}%20on%20${startDate}%20through%20${endDate}`;
        case 'skyscanner':
            return `https://www.skyscanner.es/transport/flights/${originCode.toLowerCase()}/svq/${formatDateScyscanner(startDate)}/${formatDateScyscanner(endDate)}/`;
        case 'kiwi':
            return `https://www.kiwi.com/es/search/results/${originCode.toLowerCase()}/seville-spain/${startDate}/${endDate}`;
        case 'vueling': return `https://www.vueling.com/es`;
        case 'volotea': return `https://www.volotea.com/es`;
        case 'ryanair': return `https://www.ryanair.com/es/es`;
        default: return '#';
    }
  };

  const getCarRentalUrl = () => `https://www.rentalcars.com/search-results?pu=SVQ&pu_date=${startDate}&do_date=${endDate}`;

  // Estilos comunes para inputs y selects
  const inputContainerStyle = "relative hover:shadow-md transition-shadow duration-300";
  const inputStyle = "appearance-none block w-full pl-12 pr-10 py-4 text-base font-medium text-wedding-900 bg-white border border-wedding-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none shadow-sm transition-all cursor-pointer hover:border-wedding-300 placeholder-wedding-300";
  const labelStyle = "block text-xs font-bold text-wedding-500 uppercase tracking-wider mb-2 ml-1";
  const iconStyle = "absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-wedding-400 peer-focus:text-accent transition-colors";

  return (
    <div className="pt-24 pb-0 bg-wedding-50 min-h-screen">
      
      {/* ------------------- HEADER & FORM (Constrained Width) ------------------- */}
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        {(isFormOpen || !hasSearched) && (
          <div className="text-center mb-8 animate-fade-in-up transition-all duration-500">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100 shadow-sm">
              <Plane size={28} />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-wedding-900 mb-2">
              {guestName ? `Planifica tu viaje, ${guestName}` : 'Planifica tu Viaje'}
            </h1>
            <p className="text-wedding-700 text-sm md:text-lg max-w-lg mx-auto">
              Compara precios y encuentra la mejor forma de llegar a la boda.
            </p>
          </div>
        )}

        {/* ------------------- SEARCH FORM ------------------- */}
        
        {/* MINIMIZED BAR */}
        {hasSearched && !isFormOpen && (
          <div 
            onClick={() => setIsFormOpen(true)}
            className="bg-white rounded-2xl shadow-lg border border-wedding-200 p-4 mb-8 flex items-center justify-between cursor-pointer animate-fade-in-down hover:bg-gray-50 transition-colors sticky top-24 z-40"
          >
             <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm">
                <div className="flex items-center gap-2 font-bold text-wedding-900">
                  <MapPin size={16} className="text-accent" />
                  {airports.find(a => a.code === origin)?.name}
                </div>
                <div className="hidden md:block w-px h-4 bg-wedding-200"></div>
                <div className="flex items-center gap-2 text-wedding-700">
                   <Calendar size={16} />
                   {startDate.split('-').reverse().slice(0,2).join('/')} - {endDate.split('-').reverse().slice(0,2).join('/')}
                </div>
                <div className="hidden md:block w-px h-4 bg-wedding-200"></div>
                <div className="flex items-center gap-2 text-wedding-700">
                   <Users size={16} />
                   {travelers} Viajeros
                </div>
             </div>
             <div className="text-accent p-2 bg-wedding-50 rounded-full">
                <Edit3 size={18} />
             </div>
          </div>
        )}

        {/* EXPANDED FORM */}
        {(isFormOpen || !hasSearched) && (
          <div className={`bg-white rounded-3xl shadow-xl shadow-wedding-900/5 p-5 md:p-8 mb-8 border border-wedding-100 animate-fade-in-up sticky top-24 z-40 transition-all`}>
            
            {hasSearched && (
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 text-wedding-400 hover:text-wedding-800 bg-wedding-50 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}

            <div className="flex flex-col gap-6">
              
              {/* Row 1: Origin & Travelers */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                  <label className={labelStyle}>
                    Origen
                  </label>
                  <div className={inputContainerStyle}>
                      <div className={iconStyle}>
                        <MapPin size={20} />
                      </div>
                      <select 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className={`${inputStyle} peer`}
                      >
                        {airports.map(apt => (
                          <option key={apt.code} value={apt.code}>{apt.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-wedding-400">
                        <ChevronDown size={16} />
                      </div>
                  </div>
                </div>

                <div className="relative w-full md:w-1/3 group">
                   <label className={labelStyle}>
                    Viajeros
                  </label>
                   <div className={inputContainerStyle}>
                      <div className={iconStyle}>
                        <Users size={20} />
                      </div>
                      <select 
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        className={`${inputStyle} peer`}
                      >
                         {[1,2,3,4,5,6,7,8].map(num => (
                           <option key={num} value={num}>{num} {num === 1 ? 'Persona' : 'Personas'}</option>
                         ))}
                      </select>
                       <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-wedding-400">
                        <ChevronDown size={16} />
                      </div>
                   </div>
                </div>
              </div>

              {/* Row 2: Dates (Stacked on mobile for better usability) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative flex-1 group">
                      <label className={labelStyle}>
                        Fecha de Ida
                      </label>
                      <div className={inputContainerStyle}>
                         <div className={iconStyle}>
                             <Calendar size={20} />
                         </div>
                         <input 
                             type="date" 
                             value={startDate}
                             onChange={(e) => setStartDate(e.target.value)}
                             className={`${inputStyle} peer`}
                             style={{ colorScheme: 'light' }}
                         />
                      </div>
                  </div>
                  <div className="relative flex-1 group">
                       <label className={labelStyle}>
                        Fecha de Vuelta
                      </label>
                      <div className={inputContainerStyle}>
                          <div className={iconStyle}>
                              <Calendar size={20} />
                          </div>
                          <input 
                              type="date" 
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className={`${inputStyle} peer`}
                              style={{ colorScheme: 'light' }}
                          />
                      </div>
                  </div>
              </div>
              
              {/* Search Button */}
              <button 
                  onClick={handleSearch}
                  className="w-full bg-wedding-900 text-white py-4 rounded-xl font-bold hover:bg-wedding-800 transition-all shadow-lg shadow-wedding-900/20 flex items-center justify-center gap-2 mt-2 active:scale-95 text-lg"
              >
                  {isSearching ? (
                     <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  ) : (
                     <Search size={22} />
                  )}
                  <span>
                    {guestName ? `Buscar opciones para ${guestName}` : 'Buscar Opciones'}
                  </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------- RESULTS (Hybrid Width) ------------------- */}
      {hasSearched && (
        <>
          {/* TRANSPORT RESULTS (Constrained) */}
          <div id="results-container" className="max-w-5xl mx-auto px-4 space-y-10 animate-fade-in-up mb-12" style={{ animationDelay: '0.1s' }}>
            
            {/* DISCLAIMER / AVISO */}
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start shadow-sm">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-900 leading-relaxed">
                    <strong>Nota importante:</strong> Recomendamos investigar bien la mejor alternativa. Los precios mostrados a continuación son solo orientativos basados en medias históricas y puede haber variaciones.
                </p>
             </div>

            <div className="flex items-center justify-center gap-2 text-xs text-wedding-500 uppercase tracking-widest mb-6">
                <span>Mejores opciones para {travelers} viajeros</span>
            </div>

            {/* CARD 1: FLIGHTS */}
            <div className={`bg-white rounded-3xl p-6 md:p-8 border ${isFlightRecommended ? 'border-accent shadow-lg ring-1 ring-accent/30' : 'border-wedding-100 shadow-sm'} relative overflow-hidden transition-all duration-500`}>
                
                {isFlightRecommended && (
                  <div className="absolute top-0 left-0 bg-accent text-white px-4 py-1.5 text-xs font-bold rounded-br-xl z-20 shadow-md flex items-center gap-1">
                    <CheckCircle2 size={12} /> RECOMENDADO {isIsland ? '(Isla)' : '(< 3 Pers.)'}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6 relative z-10 pt-4 md:pt-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${isFlightRecommended ? 'bg-accent text-white' : 'bg-blue-50 text-blue-600'}`}>
                      <Plane size={24} />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-wedding-900">Vuelos (SVQ/XRY)</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-wedding-600 text-sm">Precio medio:</span>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                {estimates.flight}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* General Search Cards */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 flex flex-col">
                        <h3 className="font-bold text-blue-900 mb-2 text-sm uppercase">Comparadores</h3>
                        <div className="space-y-3 mt-auto">
                            <a href={getFlightUrl('google')} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-3 bg-white rounded-xl border border-blue-200 text-blue-800 hover:shadow-md transition-all font-medium group text-sm">
                                <span className="flex items-center gap-2">
                                    <Search size={16} />
                                    Google Flights
                                </span>
                                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                            </a>
                            <a href={getFlightUrl('skyscanner')} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-3 bg-[#0094ce] rounded-xl text-white hover:bg-[#0083b8] hover:shadow-md transition-all font-medium group text-sm">
                                <span className="flex items-center gap-2 font-bold tracking-tight">Skyscanner</span>
                                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                            </a>
                             <a href={getFlightUrl('kiwi')} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-3 bg-[#00a991] rounded-xl text-white hover:bg-[#008f7a] hover:shadow-md transition-all font-medium group text-sm">
                                <span className="flex items-center gap-2 font-bold tracking-tight">Kiwi.com</span>
                                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                            </a>
                        </div>
                    </div>

                    {/* Airlines */}
                    <div className="bg-white p-5 rounded-2xl border border-wedding-100 flex flex-col hover:border-yellow-400 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-wedding-900">Vueling</span>
                            <span className="text-xs text-gray-400">Low Cost</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">Suele tener las mejores ofertas directas a Sevilla.</p>
                        <a href={getFlightUrl('vueling')} target="_blank" rel="noreferrer" className="mt-auto block text-center w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-colors">
                            Ver web
                        </a>
                    </div>
                     <div className="bg-white p-5 rounded-2xl border border-wedding-100 flex flex-col hover:border-red-400 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-wedding-900">Volotea</span>
                             <span className="text-xs text-gray-400">Directo</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Recomendado desde el Norte (Bilbao/Asturias).</p>
                        <a href={getFlightUrl('volotea')} target="_blank" rel="noreferrer" className="mt-auto block text-center w-full py-2 bg-white border border-[#E3004F] text-[#E3004F] hover:bg-[#E3004F] hover:text-white font-bold text-sm rounded-lg transition-colors">
                            Ver web
                        </a>
                    </div>
                </div>
            </div>

             {/* CARD 2: TRAIN */}
            <div className={`bg-white rounded-3xl p-6 md:p-8 border ${isTrainRecommended ? 'border-purple-400 shadow-xl ring-1 ring-purple-400/30' : 'border-wedding-100 shadow-sm'} relative`}>
                
                {isTrainRecommended && (
                  <div className="absolute top-0 left-0 bg-purple-600 text-white px-4 py-1.5 text-xs font-bold rounded-br-xl z-20 shadow-md">
                    MEJOR OPCIÓN MADRID
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6 pt-4 md:pt-0">
                     <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                        <Train size={24} />
                     </div>
                     <div>
                        <h2 className="font-serif text-2xl text-wedding-900">Tren Alta Velocidad</h2>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-wedding-600 text-sm">Precio medio:</span>
                            <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-100">
                                {estimates.train}
                            </span>
                        </div>
                     </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-purple-900 font-medium">Destino: Santa Justa (Sevilla)</span>
                        <span className="font-bold text-purple-900">2h 30m</span>
                    </div>
                     <p className="text-xs text-purple-800 leading-relaxed">
                        Desde Madrid hay muchísima frecuencia. Desde Santa Justa tendréis que coger el autobús de Damas o un coche de alquiler hasta Sanlúcar.
                     </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     <a href="https://www.renfe.com/es/es" target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 bg-[#77267d] text-white rounded-lg font-medium hover:bg-[#5a1c5e] text-sm">
                        Renfe
                    </a>
                     <a href="https://iryo.eu/es/home" target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 bg-[#EB161E] text-white rounded-lg font-medium hover:bg-[#c41219] text-sm">
                        Iryo
                    </a>
                     <a href="https://www.ouigo.com/es/" target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 bg-[#00A5D6] text-white rounded-lg font-medium hover:bg-[#008bc4] text-sm">
                        Ouigo
                    </a>
                    <a href="https://avlorenfe.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 bg-[#642d6c] text-white rounded-lg font-medium hover:bg-[#4a1f50] text-sm">
                        Avlo
                    </a>
                </div>
            </div>

            {/* CARD 3: BUS */}
             <div className="bg-white rounded-3xl p-6 md:p-8 border border-wedding-100 shadow-sm relative">
                <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shrink-0">
                        <Bus size={24} />
                     </div>
                     <div>
                        <h2 className="font-serif text-2xl text-wedding-900">Autobús</h2>
                        <p className="text-sm text-wedding-600">Conexión Sevilla - Sanlúcar</p>
                     </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <p className="text-wedding-700 text-sm mb-4 leading-relaxed">
                            Si llegáis a Sevilla en Tren o Avión y no queréis alquilar coche, la mejor opción es el autobús de <strong>Damas</strong>. Salen desde la estación <strong>Prado de San Sebastián</strong>.
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded font-bold border border-green-100">~10€ Trayecto</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold border border-gray-200">1h 15m Duración</span>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col justify-center min-w-[200px]">
                        <a href="https://www.damas-sa.es/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 bg-[#005a41] text-white rounded-xl font-medium hover:bg-[#004230] transition-colors shadow-sm">
                            Horarios y Billetes Damas
                        </a>
                         <p className="text-[10px] text-center mt-2 text-wedding-400">Se compran online o en taquilla</p>
                    </div>
                </div>
            </div>

             {/* CARD 4: RENTAL CARS */}
             <div className={`bg-wedding-900 text-white rounded-3xl p-6 md:p-8 border ${isCarRecommended ? 'border-accent shadow-xl ring-2 ring-accent' : 'border-wedding-800 shadow-xl'} relative overflow-hidden transition-all duration-500`}>
                
                {isCarRecommended && (
                  <div className="absolute top-0 right-0 bg-accent text-wedding-900 px-6 py-2 text-xs font-bold rounded-bl-2xl z-20 shadow-md flex items-center gap-2">
                    <Users size={14} /> RECOMENDADO (Grupo {travelers}+)
                  </div>
                )}

                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Car size={200} />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10 pt-6 md:pt-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${isCarRecommended ? 'bg-accent text-wedding-900' : 'bg-wedding-700 text-white'}`}>
                       <Car size={24} />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-white">Alquiler de Coche</h2>
                        <p className="text-wedding-200 text-sm">
                           {travelers >= 3 && !isIsland ? 'La opción más económica al compartir gastos.' : 'Libertad total de movimiento.'}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="font-bold text-accent mb-3 text-xs uppercase tracking-widest">Estimación Total ({travelers} pers)</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Coche Mediano (3 días)</span>
                                <span className="font-bold">~90€</span>
                            </div>
                            {/* Ocultar gasolina si es isla, ya que no se viaja en coche desde origen */}
                            {!isIsland && (
                              <div className="flex justify-between items-center text-sm">
                                  <span>Gasolina (Est.)</span>
                                  <span className="font-bold">~40€</span>
                              </div>
                            )}
                            <div className="border-t border-white/20 pt-2 flex justify-between items-center">
                                <span className="font-bold">Total aprox.</span>
                                <span className="font-bold text-xl text-accent">~{Math.round((isIsland ? 90 : 130) / travelers)}€ <span className="text-xs font-normal text-white">/pers</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                         <a 
                            href={getCarRentalUrl()} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-full text-center bg-white text-wedding-900 font-bold py-3.5 rounded-xl hover:bg-wedding-50 transition-colors shadow-lg mb-4 text-sm md:text-base"
                         >
                            Ver Precios Reales en RentalCars
                         </a>
                         <p className="text-center text-xs text-wedding-300 opacity-80">
                            Recomendamos seguro "Premium" online.
                         </p>
                    </div>
                </div>
            </div>

          </div>

          {/* ACCOMMODATION (Full Width) */}
          <div className="animate-fade-in-up">
              <Accommodation />
          </div>

          {/* BIG CARPOOL CTA (Constrained) */}
          <div className="max-w-5xl mx-auto px-4 pt-12 pb-20 animate-fade-in-up">
                 <button 
                    onClick={() => onNavigate('carpool')}
                    className="group w-full bg-accent hover:bg-yellow-500 text-wedding-900 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                         <Car size={150} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <div className="bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm">
                             <Users size={32} className="text-wedding-900" />
                        </div>
                        <h3 className="font-serif text-2xl md:text-4xl font-bold mb-2">¿Buscas u Ofreces Sitio?</h3>
                        <p className="text-wedding-800 text-base md:text-lg max-w-xl mx-auto mb-6 font-medium">
                            Accede a nuestra zona de <strong>Coche Compartido</strong> para organizarte con otros invitados y ahorrar gastos.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-wedding-900 text-white px-8 py-3 rounded-full font-bold shadow-lg group-hover:bg-wedding-800 transition-colors">
                            Entrar en Coche Compartido <ArrowRight size={18} />
                        </div>
                    </div>
                </button>
          </div>
        </>
      )}

    </div>
  );
};