import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  CheckCircle,
  Sparkles,
  ListFilter,
  Eye,
  EyeOff,
  MapPin,
  Target,
  HelpCircle,
  Trophy,
  Medal,
  Award,
} from 'lucide-react';
import { getMapImageFromDB, saveMapImageToDB } from '../utils/mapStorage';
import { PROVINCES_DATA } from '../data/provinces';
import { Province, GameMode, GameProgress } from '../types';
import { ProvincePopup } from './ProvincePopup';
import { loadGameProgress, saveGameProgress, resetGameProgress } from '../utils/gameStorage';
import { FindProvinceHUD } from './game/FindProvinceHUD';
import { GuessProvinceModal } from './game/GuessProvinceModal';
import { QuizModal } from './game/QuizModal';
import { BadgesModal } from './game/BadgesModal';

interface MapPageProps {
  onBackToHome: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onBackToHome }) => {
  const [mapSrc, setMapSrc] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Hotspot States
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const [showHotspotGuide, setShowHotspotGuide] = useState<boolean>(false);
  const [isProvinceListOpen, setIsProvinceListOpen] = useState<boolean>(false);
  const [recentlyTouchedId, setRecentlyTouchedId] = useState<number | null>(null);

  // Game System States & Persistence
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress);
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('eksplorasi');
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [showGrandCelebration, setShowGrandCelebration] = useState<boolean>(false);

  // Mode 1: Cari Provinsi State
  const [targetFindProvince, setTargetFindProvince] = useState<Province>(PROVINCES_DATA[13]); // Default Jawa Tengah
  const [findFeedback, setFindFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongFindAttemptCount, setWrongFindAttemptCount] = useState<number>(0);
  const [isPanduAssistantOpen, setIsPanduAssistantOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync progress to localStorage whenever it changes
  useEffect(() => {
    saveGameProgress(progress);

    // Check if user has unlocked all 38 provinces and hasn't claimed grand bonus
    if (progress.foundProvinceIds.length === 38 && !progress.hasClaimedGrandBonus) {
      setProgress((prev) => ({
        ...prev,
        xp: prev.xp + 1000,
        score: prev.score + 1000,
        hasClaimedGrandBonus: true,
      }));
      setShowGrandCelebration(true);
    }
  }, [progress]);

  // Load image from storage or default paths on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialMap() {
      const saved = await getMapImageFromDB();
      if (saved && isMounted) {
        setMapSrc(saved);
        return;
      }

      const candidatePaths = [
        '/peta-indonesia.webp',
        '/Peta IndonesiaBantu follow dan reshare jika bermanfaat. Silahkan yang mau komen aja yaa.. #guru.webp',
      ];

      for (const p of candidatePaths) {
        try {
          const res = await fetch(p, { method: 'HEAD' });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.startsWith('image/')) {
            if (isMounted) {
              setMapSrc(p);
              return;
            }
          }
        } catch {
          // Continue
        }
      }
    }

    loadInitialMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag / Pan logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan support for IFP touchscreen
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add province to explored set & reward XP
  const markProvinceExplored = (provinceId: number) => {
    setProgress((prev) => {
      if (prev.foundProvinceIds.includes(provinceId)) return prev;
      return {
        ...prev,
        foundProvinceIds: [...prev.foundProvinceIds, provinceId],
        unlockedBadges: [...prev.unlockedBadges, provinceId],
      };
    });
  };

  // Start Mode 1: Cari Provinsi
  const startFindProvinceMode = (specificProvince?: Province) => {
    setActiveGameMode('cari-provinsi');
    setSelectedProvince(null);
    setWrongFindAttemptCount(0);
    if (specificProvince) {
      setTargetFindProvince(specificProvince);
    } else {
      // Pick an unexplored province first, or random
      const unexplored = PROVINCES_DATA.filter((p) => !progress.foundProvinceIds.includes(p.id));
      const pool = unexplored.length > 0 ? unexplored : PROVINCES_DATA;
      const randomTarget = pool[Math.floor(Math.random() * pool.length)];
      setTargetFindProvince(randomTarget);
    }
    setFindFeedback('idle');
  };

  const nextFindMission = () => {
    const unexplored = PROVINCES_DATA.filter(
      (p) => !progress.foundProvinceIds.includes(p.id) && p.id !== targetFindProvince.id
    );
    const pool = unexplored.length > 0 ? unexplored : PROVINCES_DATA;
    const randomTarget = pool[Math.floor(Math.random() * pool.length)];
    setTargetFindProvince(randomTarget);
    setFindFeedback('idle');
    setWrongFindAttemptCount(0);
  };

  // Hotspot Touch Handler
  const handleHotspotClick = (province: Province, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setRecentlyTouchedId(province.id);

    // If Mode 1 "Cari Provinsi" is currently active
    if (activeGameMode === 'cari-provinsi') {
      if (province.id === targetFindProvince.id) {
        setFindFeedback('correct');
        setWrongFindAttemptCount(0);
        markProvinceExplored(province.id);
        setProgress((prev) => ({
          ...prev,
          xp: prev.xp + 100,
          score: prev.score + 100,
          correctCount: prev.correctCount + 1,
        }));
      } else {
        setFindFeedback('wrong');
        setWrongFindAttemptCount((prev) => prev + 1);
        setProgress((prev) => ({
          ...prev,
          incorrectCount: prev.incorrectCount + 1,
        }));
      }
      return;
    }

    // Default Exploration Mode: mark explored and open popup
    markProvinceExplored(province.id);
    setSelectedProvince(province);

    setTimeout(() => {
      setRecentlyTouchedId(null);
    }, 1500);
  };

  // Handle answers from Guess Province Mode
  const handleGuessCorrect = (provinceId: number) => {
    markProvinceExplored(provinceId);
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + 100,
      score: prev.score + 100,
      correctCount: prev.correctCount + 1,
    }));
  };

  // Handle answers from Quiz Mode
  const handleQuizCorrect = () => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + 100,
      score: prev.score + 100,
      correctCount: prev.correctCount + 1,
    }));
  };

  const handleQuizWrong = () => {
    setProgress((prev) => ({
      ...prev,
      incorrectCount: prev.incorrectCount + 1,
    }));
  };

  const handleResetProgressConfirm = () => {
    const reset = resetGameProgress();
    setProgress(reset);
    setShowGrandCelebration(false);
  };

  // File Picker / Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setMapSrc(dataUrl);
        setIsImageLoaded(true);
        await saveMapImageToDB(dataUrl);

        try {
          await fetch('/api/upload-map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl }),
          });
        } catch (err) {
          console.error('Server sync optional warning:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Navigation & Live Stats Bar (IFP 75" Touch Optimized) */}
      <header className="relative z-30 flex-none bg-slate-900/95 backdrop-blur-md border-b border-sky-900/50 px-3 sm:px-6 py-2 shadow-xl flex flex-wrap items-center justify-between gap-2">
        {/* Left: "⌂ Beranda" Button (Touch target min 60px) + Live Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="touch-target group flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 border-2 border-amber-300 transition-all cursor-pointer font-display tracking-wide"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <Home className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
            <span>⌂ Beranda</span>
          </button>

          {/* ========================================================== */}
          {/* LIVE PROGRESS HUD: PROVINSI DIJELAJAHI, XP, SKOR           */}
          {/* ========================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 🗺️ PROVINSI DIJELAJAHI */}
            <button
              onClick={() => setIsBadgesModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-400/50 hover:bg-sky-900/80 transition flex items-center gap-1.5 cursor-pointer"
              title="Lihat Koleksi 38 Lencana"
            >
              <span className="text-sm">🗺️</span>
              <div className="text-left">
                <span className="text-[9px] font-bold text-sky-300 uppercase block leading-none">
                  Dijelajahi
                </span>
                <span className="text-xs sm:text-sm font-black text-white font-display">
                  {progress.foundProvinceIds.length} / 38
                </span>
              </div>
            </button>

            {/* ⭐ XP */}
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-400/50 flex items-center gap-1.5">
              <span className="text-sm">⭐</span>
              <div className="text-left">
                <span className="text-[9px] font-bold text-amber-300 uppercase block leading-none">
                  XP
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-display">
                  {progress.xp}
                </span>
              </div>
            </div>

            {/* 🏆 SKOR */}
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-center gap-1.5">
              <span className="text-sm">🏆</span>
              <div className="text-left">
                <span className="text-[9px] font-bold text-emerald-300 uppercase block leading-none">
                  Skor
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-300 font-display">
                  {progress.score}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Game Modes Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode 1: Cari Provinsi */}
          <button
            onClick={() => {
              if (activeGameMode === 'cari-provinsi') {
                setActiveGameMode('eksplorasi');
              } else {
                startFindProvinceMode();
              }
            }}
            className={`touch-target px-3 sm:px-4 h-11 sm:h-12 flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer active:scale-95 shadow-md ${
              activeGameMode === 'cari-provinsi'
                ? 'bg-rose-600 text-white border-rose-400 font-black shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700'
            }`}
            title="Mode 1: Cari Provinsi di Peta"
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">🎯 Cari Provinsi</span>
          </button>

          {/* Mode 2: Tebak Provinsi */}
          <button
            onClick={() => setIsGuessModalOpen(true)}
            className="touch-target px-3 sm:px-4 h-11 sm:h-12 flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shadow-md"
            title="Mode 2: Tebak Provinsi dari Petunjuk"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">❓ Tebak</span>
          </button>

          {/* Mode 3: Kuis */}
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="touch-target px-3 sm:px-4 h-11 sm:h-12 flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shadow-md"
            title="Mode 3: Kuis Nusantara (Mudah, Sedang, Sulit)"
          >
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">📝 Kuis</span>
          </button>

          {/* Koleksi Lencana (38 Lencana) */}
          <button
            onClick={() => setIsBadgesModalOpen(true)}
            className="touch-target px-3 sm:px-3.5 h-11 sm:h-12 flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border border-amber-300 text-xs sm:text-sm font-black transition cursor-pointer active:scale-95 shadow-md font-display"
            title="Buka Koleksi 38 Lencana"
          >
            <Medal className="w-4 h-4 text-slate-950" />
            <span className="hidden md:inline">Lencana</span>
          </button>

          {/* Toggle Bantuan Hotspot */}
          <button
            onClick={() => setShowHotspotGuide(!showHotspotGuide)}
            className={`touch-target w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl transition cursor-pointer shadow-md border ${
              showHotspotGuide
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={showHotspotGuide ? 'Sembunyikan Titik Panduan' : 'Tampilkan Titik Panduan Hotspot'}
          >
            {showHotspotGuide ? <Eye className="w-4 h-4 text-slate-950" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Zoom In & Out */}
          <button
            onClick={handleZoomIn}
            className="touch-target w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="touch-target w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white border border-slate-700 transition cursor-pointer"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="touch-target w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl bg-sky-700 hover:bg-sky-600 text-white border border-sky-500 transition cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (IFP 75")'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Upload fallback button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="touch-target w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 transition cursor-pointer"
            title="Pilih Berkas Peta Asli"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </header>

      {/* Main Viewport: Original Map Image + 38 Hotspots */}
      <main
        ref={containerRef}
        className={`relative flex-1 w-full h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5rem)] bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 flex items-center justify-center overflow-hidden ${
          zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {mapSrc ? (
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out p-2 sm:p-4"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Image Wrapper Container: Exact bounding box of rendered image */}
            <div className="relative inline-block max-w-full max-h-full">
              {/* ORIGINAL MAP IMAGE: 100% intact, object-contain, no stretch, no crop */}
              <img
                src={mapSrc}
                alt="PETA INDONESIA 38 PROVINSI - Negara Kepulauan Terbesar di Dunia"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full w-auto h-auto object-contain select-none shadow-2xl pointer-events-none rounded-lg block"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setIsImageLoaded(false);
                }}
              />

              {/* ========================================================== */}
              {/* 38 HOTSPOTS: TRANSPARENT INTERACTION LAYER DIRECTLY ON TOP */}
              {/* ========================================================== */}
              <div className="absolute inset-0 pointer-events-auto">
                {PROVINCES_DATA.map((province) => {
                  const isSelected = selectedProvince?.id === province.id;
                  const isHovered = hoveredProvince?.id === province.id;
                  const isRecentlyTouched = recentlyTouchedId === province.id;
                  const isExplored = progress.foundProvinceIds.includes(province.id);
                  const isTargetInFindMode =
                    activeGameMode === 'cari-provinsi' && targetFindProvince.id === province.id;

                  return (
                    <div
                      key={province.id}
                      style={{
                        left: `${province.x}%`,
                        top: `${province.y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Generous touch target for 75" IFP */}
                      <button
                        onClick={(e) => handleHotspotClick(province, e)}
                        onMouseEnter={() => setHoveredProvince(province)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        className={`touch-target group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 outline-none ${
                          isSelected
                            ? 'scale-125'
                            : isRecentlyTouched
                            ? 'scale-130 animate-bounce'
                            : 'hover:scale-115 active:scale-95'
                        }`}
                        title={`Provinsi #${province.id}: ${province.name} (${province.capital})`}
                        aria-label={`Sentuh Provinsi ${province.name}`}
                      >
                        {/* Transparent in normal state; gentle highlight on hover / selected */}
                        <div
                          className={`absolute inset-0 rounded-full transition-all duration-250 ${
                            isSelected
                              ? 'bg-amber-400/40 border-3 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.9)] backdrop-blur-[0.5px]'
                              : isRecentlyTouched
                              ? 'bg-amber-300/50 border-3 border-amber-200 shadow-[0_0_30px_rgba(252,211,77,1)]'
                              : isHovered
                              ? 'bg-sky-400/35 border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
                              : showHotspotGuide
                              ? isExplored
                                ? 'bg-emerald-500/25 border-2 border-emerald-400/80 shadow-xs'
                                : 'bg-amber-400/20 border-2 border-amber-400/60 shadow-xs'
                              : 'bg-transparent border-transparent'
                          }`}
                        />

                        {/* Ping Ripple on Active Touch */}
                        {(isRecentlyTouched || isSelected) && (
                          <span className="absolute inset-0 rounded-full bg-amber-400/60 animate-ping pointer-events-none" />
                        )}

                        {/* Marker badge when Guide Mode is active */}
                        {showHotspotGuide && (
                          <span
                            className={`relative z-10 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                              isExplored
                                ? 'bg-emerald-400 text-slate-950 font-black'
                                : 'bg-amber-300 text-slate-950'
                            }`}
                          >
                            {isExplored ? '✓' : province.id}
                          </span>
                        )}

                        {/* Tooltip on Hover / Selected */}
                        {(isHovered || isSelected || isRecentlyTouched) &&
                          activeGameMode !== 'cari-provinsi' && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 pointer-events-none whitespace-nowrap animate-fade-in">
                              <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border-2 border-amber-400 shadow-2xl text-center">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm">🇮🇩</span>
                                  <span className="text-xs sm:text-sm font-black text-white font-display">
                                    {province.name}
                                  </span>
                                  {isExplored && (
                                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-amber-300 font-semibold block">
                                  Ibu Kota: {province.capital}
                                </span>
                              </div>
                              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-400 mx-auto" />
                            </div>
                          )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* File Selector Fallback */
          <div className="max-w-md w-full mx-4 bg-slate-900/90 border-2 border-sky-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-inner mb-4">
              🗺️
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Gambar Peta Indonesia 38 Provinsi
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Silakan pilih berkas gambar peta asli untuk ditampilkan di layar.
            </p>
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="touch-target w-full h-15 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-lg shadow-lg active:scale-95 transition cursor-pointer font-display border-2 border-white"
              >
                <Upload className="w-5 h-5 stroke-[2.5]" />
                <span>Pilih Berkas Peta Asli</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 1: CARI PROVINSI ACTIVE HUD */}
        {activeGameMode === 'cari-provinsi' && (
          <FindProvinceHUD
            targetProvince={targetFindProvince}
            feedback={findFeedback}
            wrongAttemptCount={wrongFindAttemptCount}
            onNextMission={nextFindMission}
            onExit={() => setActiveGameMode('eksplorasi')}
          />
        )}

        {/* FLOATING PANDU NUSANTARA COMPANION BUTTON */}
        <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
          <button
            onClick={() => setIsPanduAssistantOpen(true)}
            className="group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer font-display"
            title="Teman Belajar: Pandu Nusantara"
            aria-label="Buka Teman Belajar Pandu Nusantara"
          >
            <span className="w-8 h-8 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center text-lg">
              🧭
            </span>
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider text-amber-950 font-bold leading-none">
                Teman Belajar
              </span>
              <span className="block text-xs sm:text-sm font-black leading-tight">
                PANDU NUSANTARA
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* POPUP INFORMASI PROVINSI (MODAL / KARTU INFORMASI) */}
      {selectedProvince && activeGameMode === 'eksplorasi' && (
        <ProvincePopup
          province={selectedProvince}
          onClose={() => setSelectedProvince(null)}
        />
      )}

      {/* MODE 2: TEBAK PROVINSI MODAL */}
      <GuessProvinceModal
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onAnswerCorrect={handleGuessCorrect}
      />

      {/* MODE 3: KUIS NUSANTARA MODAL */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onCorrectAnswer={handleQuizCorrect}
        onWrongAnswer={handleQuizWrong}
      />

      {/* KOLEKSI 38 LENCANA & RESET MODAL */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        progress={progress}
        onResetProgress={handleResetProgressConfirm}
        onSelectProvince={(prov) => {
          setSelectedProvince(prov);
          setActiveGameMode('eksplorasi');
        }}
      />

      {/* GRAND CELEBRATION MODAL WHEN 38 / 38 PROVINCES EXPLORED */}
      {showGrandCelebration && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-gradient-to-b from-amber-500 via-yellow-400 to-orange-500 border-4 border-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_25px_60px_rgba(245,158,11,0.7)] text-slate-950 animate-bounce space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl">
              🏆
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-wide">
              SELAMAT!
            </h2>
            <p className="text-base sm:text-lg font-black leading-relaxed">
              &quot;Kamu telah menjelajahi seluruh 38 provinsi Indonesia!&quot;
            </p>
            <div className="bg-slate-950 text-amber-300 font-black text-lg py-2.5 px-6 rounded-2xl border-2 border-white inline-block shadow-lg">
              Bonus Prestasi: +1000 XP ⭐
            </div>
            <button
              onClick={() => setShowGrandCelebration(false)}
              className="w-full h-15 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-lg cursor-pointer transition active:scale-95 border-2 border-amber-300 touch-target"
            >
              Lihat Koleksi Lencana 🏅
            </button>
          </div>
        </div>
      )}

      {/* PANDU NUSANTARA DIALOGUE ASSISTANT MODAL */}
      {isPanduAssistantOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsPanduAssistantOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-white text-center space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-lg">
              🧭
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block font-display">
                TEMAN BELAJAR SISWA
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                PANDU NUSANTARA
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-800/80 p-4 rounded-2xl border border-slate-700 font-medium">
              &quot;Halo kawan penjelajah! Aku Pandu Nusantara. Jangan khawatir jika salah menjawab saat bermain game, aku akan membantumu dengan <strong>petunjuk bertahap</strong> agar kamu bisa menemukan jawabannya sendiri!&quot;
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold font-display">
              <button
                onClick={() => {
                  setIsPanduAssistantOpen(false);
                  startFindProvinceMode();
                }}
                className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95"
              >
                🎯 Cari Provinsi
              </button>

              <button
                onClick={() => {
                  setIsPanduAssistantOpen(false);
                  setIsGuessModalOpen(true);
                }}
                className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer active:scale-95"
              >
                ❓ Tebak Provinsi
              </button>

              <button
                onClick={() => {
                  setIsPanduAssistantOpen(false);
                  setIsQuizModalOpen(true);
                }}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95"
              >
                📝 Kuis Nusantara
              </button>

              <button
                onClick={() => {
                  setIsPanduAssistantOpen(false);
                  setIsBadgesModalOpen(true);
                }}
                className="p-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white cursor-pointer active:scale-95"
              >
                🏅 38 Lencana
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPanduAssistantOpen(false)}
                className="w-full h-13 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer border border-slate-700"
              >
                Tutup Pandu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
