import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ShieldCheck } from 'lucide-react';
import { beverageImages } from '../assets/beverageImages';

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  badge: string;
  badgeColor: 'cyan' | 'amber' | 'emerald' | 'rose';
  title: string;
  description: string;
  category: string;
}

interface AdegaImageCarouselProps {
  className?: string;
  autoPlayInterval?: number; // in milliseconds (default 4500)
}

export const AdegaImageCarousel: React.FC<AdegaImageCarouselProps> = ({
  className = '',
  autoPlayInterval = 4500,
}) => {
  const slides: CarouselSlide[] = [
    {
      id: 'slide-cold-room',
      imageUrl: beverageImages.beerColdFreezer,
      badge: '❄️ CÂMARA FRIA -4°C',
      badgeColor: 'cyan',
      title: 'Câmara Fria Industrial a -4°C',
      description: 'A cerveja não dorme em prateleira morna. Sistema de refrigeração industrial contínua para estalar de gelada.',
      category: 'cervejas',
    },
    {
      id: 'slide-front-people',
      imageUrl: beverageImages.beerCheersNight,
      badge: '🍻 RESENHA NA PORTA',
      badgeColor: 'amber',
      title: 'Galera Reunida em Frente à Adega',
      description: 'A energia autêntica da nossa loja física: resenha de respeito, amigos brindando e a noite que nunca para.',
      category: 'destilados',
    },
    {
      id: 'slide-adega-facade',
      imageUrl: beverageImages.adegaFrontNight,
      badge: '🌙 ADEGA FÍSICA NOTURNA',
      badgeColor: 'amber',
      title: 'Fachada Noturna & Balcão Oficial',
      description: 'Estrutura estabelecida no coração do bairro, pronta para atender no balcão ou despachar pedidos via delivery.',
      category: 'destilados',
    },
    {
      id: 'slide-delivery-motoboy',
      imageUrl: beverageImages.deliveryMotoboyNight,
      badge: '⚡ ENTREGA EM ATÉ 30 MIN',
      badgeColor: 'emerald',
      title: 'Logística Noturna Rápida & Discreta',
      description: 'Motoboys dedicados com bags térmicas higienizadas para garantir que suas bebidas cheguem no ponto.',
      category: 'cervejas',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<number | null>(null);
  const progressStartTimeRef = useRef<number>(Date.now());

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    progressStartTimeRef.current = Date.now();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
    progressStartTimeRef.current = Date.now();
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    progressStartTimeRef.current = Date.now();
  }, [slides.length]);

  // Handle auto-playing with progress ticker
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    const intervalStep = 50; // update progress every 50ms
    progressStartTimeRef.current = Date.now();

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - progressStartTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / autoPlayInterval) * 100);
      setProgress(currentProgress);

      if (elapsed >= autoPlayInterval) {
        nextSlide();
      }
    }, intervalStep);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, isHovered, autoPlayInterval, nextSlide, currentIndex]);

  // Touch Swipe Handlers for mobile responsiveness
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  const currentSlide = slides[currentIndex];

  const getBadgeStyles = (color: CarouselSlide['badgeColor']) => {
    switch (color) {
      case 'cyan':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
      case 'amber':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative w-full rounded-2xl overflow-hidden bg-[#07090D] border border-amber-500/30 shadow-2xl group focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${className}`}
      aria-roledescription="carousel"
      aria-label="Carrossel oficial de fotos da Adega Bigode"
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full h-72 sm:h-84 md:h-96 lg:h-[420px] overflow-hidden">
        {/* Slides Stack with Smooth Fade and Subtle Cinematic Zoom */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Ambient Vignette & Dark Contrast Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />

              {/* Slide Content Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border backdrop-blur-md shadow-sm ${getBadgeStyles(
                      slide.badgeColor
                    )}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{slide.badge}</span>
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-zinc-300 backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>Estrutura Física Real</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-extrabold font-['Poppins'] text-white drop-shadow-md leading-tight">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl line-clamp-2 drop-shadow leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Top Floating Controls Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
          {/* Slide Counter */}
          <div className="px-2.5 py-1 rounded-full bg-black/65 border border-white/15 backdrop-blur-md text-white text-[11px] font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
            <span className="text-amber-400">0{currentIndex + 1}</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-400">0{slides.length}</span>
          </div>

          {/* Auto-Play Toggle & Status */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 border border-white/20 backdrop-blur-md text-white/90 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label={isPlaying ? 'Pausar carrossel automático' : 'Iniciar carrossel automático'}
              title={isPlaying ? 'Pausar carrossel' : 'Iniciar carrossel'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Left / Right Arrow Buttons (Smooth appearance on hover or mobile tap) */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/15 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/15 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Continuous Auto-Play Progress Bar (Top Edge) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-40">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip & Navigation Dots */}
      <div className="p-3 bg-[#0B0D12] border-t border-white/10 flex items-center justify-between gap-3">
        {/* Thumbnails Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {slides.map((slide, index) => {
            const isSelected = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-300 border ${
                  isSelected
                    ? 'w-14 sm:w-16 h-10 border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-105'
                    : 'w-10 sm:w-12 h-10 border-white/15 opacity-50 hover:opacity-85'
                }`}
                aria-label={`Ir para ${slide.title}`}
                title={slide.title}
              >
                <img
                  src={slide.imageUrl}
                  alt=""
                  role="presentation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-400/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Indicator Dots */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1">
          {slides.map((slide, index) => {
            const isSelected = index === currentIndex;
            return (
              <button
                key={`dot-${slide.id}`}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400/50'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
