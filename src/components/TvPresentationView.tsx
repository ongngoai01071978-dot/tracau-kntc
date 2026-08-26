import React, { useState, useEffect, useRef } from 'react';
import {
  CitizenReception,
  ComplaintPetition,
  ProgressStep,
  ThemeMode,
  THEME_OPTIONS,
} from '../types';
import { extractToDanPho, maskSensitiveInfo } from '../utils/formatters';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Tv,
  Maximize,
  Minimize,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Calendar,
  Building2,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Lock,
  Unlock,
  Radio,
  Sparkles,
  Layers,
  FileText,
  Timer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TvPresentationViewProps {
  isOpen: boolean;
  onClose: () => void;
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: React.Dispatch<React.SetStateAction<boolean>>;
  lastSyncedAt: Date | null;
}

const SLIDES = [
  { id: 0, title: 'Tổng Quan Điều Hành & Chỉ Số Toàn Diện', icon: '📊' },
  { id: 1, title: 'Công Tác Tiếp Công Dân & Lĩnh Vực', icon: '👥' },
  { id: 2, title: 'Giám Sát Xử Lý Đơn Thư Khiếu Nại Tố Cáo', icon: '📋' },
  { id: 3, title: 'Cảnh Báo Hạn Xử Lý & Đơn Thư Trọng Điểm', icon: '⏱️' },
  { id: 4, title: 'Bản Đồ Số Liệu Theo 8 Tổ Dân Phố', icon: '🗺️' },
];

export const TvPresentationView: React.FC<TvPresentationViewProps> = ({
  isOpen,
  onClose,
  tiepCongDan,
  quanLyDonThu,
  tienDo,
  themeMode,
  setThemeMode,
  isPrivacyMode,
  setIsPrivacyMode,
  lastSyncedAt,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [intervalSec, setIntervalSec] = useState<number>(20); // 20s per slide by default
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isControlVisible, setIsControlVisible] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Digital Clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Auto hide controls on TV after 4.5s idle
  const handleMouseMove = () => {
    setIsControlVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlVisible(false);
      }
    }, 4500);
  };

  // Keyboard Shortcuts for TV remote
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        setProgressPercent(0);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
        setProgressPercent(0);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Slideshow Timer & Progress Bar
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      setProgressPercent(0);
      return;
    }

    const stepMs = 100;
    const totalSteps = (intervalSec * 1000) / stepMs;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setProgressPercent(Math.min(100, (stepCount / totalSteps) * 100));

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setProgressPercent(0);
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, intervalSec, currentSlide]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  // Pre-calculate Metrics
  const totalTcd = tiepCongDan.length;
  const tcdDinhKy = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Định kỳ')).length;
  const tcdThuongXuyen = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Thường xuyên')).length;
  const tcdDotXuat = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Đột xuất')).length;

  const totalDon = quanLyDonThu.length;
  const donKhieuNai = quanLyDonThu.filter((d) => d.loaiDon.includes('Khiếu nại')).length;
  const donToCao = quanLyDonThu.filter((d) => d.loaiDon.includes('Tố cáo')).length;
  const donKienNghi = quanLyDonThu.filter((d) => d.loaiDon.includes('Kiến nghị') || d.loaiDon.includes('phản ánh')).length;

  const donDaGiaiQuyet = quanLyDonThu.filter((d) => d.trangThaiHoSo.includes('Đã giải quyết')).length;
  const donDangGiaiQuyet = quanLyDonThu.filter((d) => d.trangThaiHoSo.includes('Đang')).length;
  const tyLeGiaiQuyet = totalDon > 0 ? ((donDaGiaiQuyet / totalDon) * 100).toFixed(1) : '0';

  const donDungHan = quanLyDonThu.filter(
    (d) => d.tinhTrangQuaHan.includes('Đúng hạn') || d.tinhTrangQuaHan.includes('Trong hạn')
  ).length;
  const donQuaHan = quanLyDonThu.filter((d) => d.tinhTrangQuaHan.includes('Quá hạn')).length;

  const tdSapDenHan = tienDo.filter((td) => td.canhBaoTienDo.includes('SẮP ĐẾN HẠN') || td.canhBaoTienDo.includes('≤24')).length;
  const tdQuaHan = tienDo.filter((td) => td.canhBaoTienDo.includes('QUÁ HẠN')).length;
  const tyLeDungHan = totalDon > 0 ? (((totalDon - donQuaHan) / totalDon) * 100).toFixed(1) : '100';

  // Lĩnh vực Chart Data
  const fieldMap: Record<string, { don: number; tcd: number }> = {};
  quanLyDonThu.forEach((d) => {
    const key = d.linhVuc.trim() || 'Khác';
    if (!fieldMap[key]) fieldMap[key] = { don: 0, tcd: 0 };
    fieldMap[key].don += 1;
  });
  tiepCongDan.forEach((t) => {
    const key = t.linhVuc.trim() || 'Khác';
    if (!fieldMap[key]) fieldMap[key] = { don: 0, tcd: 0 };
    fieldMap[key].tcd += 1;
  });
  const fieldData = Object.entries(fieldMap)
    .map(([name, val]) => ({ name, 'Đơn Thư': val.don, 'Tiếp Dân': val.tcd, total: val.don + val.tcd }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // Status Chart Data
  const statusPieData = [
    { name: 'Đã giải quyết', value: donDaGiaiQuyet, color: '#10b981' },
    { name: 'Đang giải quyết', value: donDangGiaiQuyet, color: '#f59e0b' },
  ];

  // Types Pie Data
  const typePieData = [
    { name: 'Khiếu nại', value: donKhieuNai, color: '#3b82f6' },
    { name: 'Tố cáo', value: donToCao, color: '#ef4444' },
    { name: 'Kiến nghị, phản ánh', value: donKienNghi, color: '#10b981' },
  ];

  // TDP Breakdown Data
  const tdpMap: Record<string, { tcd: number; don: number; resolved: number }> = {};
  for (let i = 1; i <= 8; i++) {
    tdpMap[`Tổ dân phố ${i}`] = { tcd: 0, don: 0, resolved: 0 };
  }
  tdpMap['Khác / Chưa rõ'] = { tcd: 0, don: 0, resolved: 0 };

  tiepCongDan.forEach((t) => {
    const tdp = extractToDanPho(t.diaChi);
    if (!tdpMap[tdp]) tdpMap[tdp] = { tcd: 0, don: 0, resolved: 0 };
    tdpMap[tdp].tcd += 1;
  });

  quanLyDonThu.forEach((d) => {
    const tdp = extractToDanPho(d.diaChi);
    if (!tdpMap[tdp]) tdpMap[tdp] = { tcd: 0, don: 0, resolved: 0 };
    tdpMap[tdp].don += 1;
    if (d.trangThaiHoSo.includes('Đã giải quyết')) {
      tdpMap[tdp].resolved += 1;
    }
  });

  const tdpData = Object.entries(tdpMap)
    .filter(([name]) => name.startsWith('Tổ dân phố'))
    .map(([name, val]) => ({
      name: name.replace('Tổ dân phố ', 'TDP '),
      fullName: name,
      'Tiếp Dân': val.tcd,
      'Đơn Thư': val.don,
      'Đã giải quyết': val.resolved,
      total: val.tcd + val.don,
      rate: val.don > 0 ? Math.round((val.resolved / val.don) * 100) : 100,
    }));

  // Date Formatting for Clock
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const formattedDay = dayNames[currentTime.getDay()];
  const formattedDate = `${String(currentTime.getDate()).padStart(2, '0')}/${String(currentTime.getMonth() + 1).padStart(2, '0')}/${currentTime.getFullYear()}`;
  const formattedHours = String(currentTime.getHours()).padStart(2, '0');
  const formattedMins = String(currentTime.getMinutes()).padStart(2, '0');
  const formattedSecs = String(currentTime.getSeconds()).padStart(2, '0');

  // Background style based on theme
  const getTvThemeStyles = () => {
    if (themeMode === 'ceremonial') {
      return {
        bg: 'bg-radial from-[#320f14] via-[#1a0709] to-[#0d0304]',
        headerBg: 'bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-amber-500/30',
        cardBg: 'bg-[#260e12]/90 border border-amber-900/50 shadow-2xl backdrop-blur-md',
        cardHover: 'hover:border-amber-400/60',
        textPrimary: 'text-amber-100',
        textSecondary: 'text-amber-200/70',
        accentGold: 'text-amber-400',
        badge: 'bg-red-900/80 text-amber-300 border border-amber-500/40',
        glow: 'shadow-[0_0_30px_rgba(234,88,12,0.15)]',
      };
    }
    if (themeMode === 'command_center') {
      return {
        bg: 'bg-radial from-[#041d2d] via-[#020b14] to-[#01050a]',
        headerBg: 'bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border-b border-cyan-500/40',
        cardBg: 'bg-slate-900/90 border border-cyan-900/60 shadow-2xl backdrop-blur-md',
        cardHover: 'hover:border-cyan-400/60',
        textPrimary: 'text-cyan-50',
        textSecondary: 'text-cyan-200/70',
        accentGold: 'text-cyan-400',
        badge: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-900',
      headerBg: 'bg-gradient-to-r from-red-800 via-red-700 to-amber-700 border-b border-red-900 text-white',
      cardBg: 'bg-white/95 border border-slate-300 shadow-xl backdrop-blur-md text-slate-900',
      cardHover: 'hover:border-red-400',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      accentGold: 'text-red-700',
      badge: 'bg-red-100 text-red-800 border border-red-300',
      glow: 'shadow-xl',
    };
  };

  const st = getTvThemeStyles();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[100] flex flex-col overflow-hidden select-none font-sans ${st.bg}`}
      style={{ minHeight: '100vh', width: '100vw' }}
    >
      {/* 1. TOP OFFICIAL TV HEADER */}
      <header className={`px-6 py-3 flex items-center justify-between shadow-lg relative shrink-0 ${st.headerBg}`}>
        {/* Left: National Emblem & Ward Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl p-1.5 shadow-lg flex items-center justify-center bg-gradient-to-br from-red-600 to-amber-500 ring-2 ring-amber-300/60 shrink-0">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase drop-shadow">
                ỦY BAN NHÂN DÂN PHƯỜNG TRÀ CÂU, TỈNH QUẢNG NGÃI
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-400/40 animate-pulse">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>TRỰC TUYẾN</span>
              </span>
            </div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-tight text-white drop-shadow-md">
              HỆ THỐNG QUẢN LÝ TIẾP CÔNG DÂN VÀ GIẢI QUYẾT ĐƠN THƯ KHIẾU NẠI TỐ CÁO
            </h1>
          </div>
        </div>

        {/* Center: Slide indicator on Header */}
        <div className="hidden 2xl:flex items-center gap-2 bg-black/30 border border-white/10 px-4 py-1.5 rounded-xl">
          <span className="text-xl">{SLIDES[currentSlide].icon}</span>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-amber-300">
              Trang Trình Chiếu {currentSlide + 1} / {SLIDES.length}
            </div>
            <div className="text-xs font-black text-white">{SLIDES[currentSlide].title}</div>
          </div>
        </div>

        {/* Right: Live Digital Clock & Quick TV Exit */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-black/40 border border-white/15 px-3.5 py-1.5 rounded-xl text-right">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <div className="text-[11px] font-semibold text-amber-200/90">
                {formattedDay}, {formattedDate}
              </div>
              <div className="text-lg font-black tracking-wider text-white font-mono leading-none">
                {formattedHours}:{formattedMins}:<span className="text-amber-400">{formattedSecs}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all shadow-md active:scale-95 border border-red-400/50 flex items-center gap-1.5 text-xs"
            title="Thoát chế độ trình chiếu TV (Phím Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Thoát TV</span>
          </button>
        </div>

        {/* Countdown Progress Line at bottom of Header */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN TV SLIDE CANVAS (FLEXIBLE 16:9 / FULL RESOLUTION) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ========================================================
              SLIDE 1: TỔNG QUAN ĐIỀU HÀNH & CHỈ SỐ KPI TOÀN DIỆN
             ======================================================== */}
          {currentSlide === 0 && (
            <motion.div
              key="tv-slide-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full space-y-6"
            >
              {/* Header Title of Slide */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-amber-400">
                    BÁO CÁO TỔNG QUAN ĐIỀU HÀNH
                  </span>
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeMode === 'standard_office' ? 'text-slate-950' : 'text-white'}`}>
                    📊 Chỉ Số Toàn Diện Công Tác Tiếp Dân & Giải Quyết Khiếu Nại Tố Cáo
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Đồng bộ Google Sheets: {lastSyncedAt ? `${lastSyncedAt.toLocaleTimeString('vi-VN')}` : 'Mới nhất'}
                  </span>
                </div>
              </div>

              {/* 6 High-Impact Big Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                {/* 1. Tiếp Công Dân */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-blue-400">Tiếp Công Dân</span>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                    {totalTcd}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-blue-300/80 flex items-center justify-between">
                    <span>Định kỳ: <strong>{tcdDinhKy}</strong></span>
                    <span>Thường xuyên: <strong>{tcdThuongXuyen}</strong></span>
                  </div>
                </div>

                {/* 2. Tổng Đơn Tiếp Nhận */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-purple-400">Đơn Tiếp Nhận</span>
                    <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                    {totalDon}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-purple-300/80 flex items-center justify-between">
                    <span>KN: <strong>{donKhieuNai}</strong></span>
                    <span>TC: <strong>{donToCao}</strong></span>
                    <span>KN/PA: <strong>{donKienNghi}</strong></span>
                  </div>
                </div>

                {/* 3. Đã Giải Quyết */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-emerald-400">Đã Giải Quyết</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-400">
                    {donDaGiaiQuyet}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Tỷ lệ: {tyLeGiaiQuyet}%</span>
                  </div>
                </div>

                {/* 4. Đang Xử Lý */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-amber-400">Đang Xử Lý</span>
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-amber-400">
                    {donDangGiaiQuyet}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-amber-200/80">
                    Trong hạn luật định
                  </div>
                </div>

                {/* 5. Sắp Đến Hạn (≤24h) */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all ring-1 ring-yellow-500/40`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-yellow-400">Sắp Đến Hạn</span>
                    <Flame className="w-5 h-5 text-yellow-400 animate-bounce" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-yellow-400">
                    {tdSapDenHan}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-yellow-300">
                    Cần đôn đốc khẩn
                  </div>
                </div>

                {/* 6. Quá Hạn */}
                <div className={`p-4 rounded-2xl ${st.cardBg} ${st.cardHover} transition-all ring-1 ring-red-500/40`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-red-400">Quá Hạn</span>
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-red-400">
                    {donQuaHan + tdQuaHan}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-red-300">
                    {donQuaHan + tdQuaHan === 0 ? 'Tuyệt đối đúng hạn' : 'Hồ sơ chậm trễ'}
                  </div>
                </div>
              </div>

              {/* 2 Big Charts: Progress Gauge & Field Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Chart: Status & Resolution Donut */}
                <div className={`lg:col-span-5 p-5 rounded-2xl ${st.cardBg} flex flex-col justify-between`}>
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Tiến Độ & Tỷ Lệ Giải Quyết Đơn Thư</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Thống kê theo trạng thái giải quyết của UBND phường</p>
                  </div>

                  <div className="h-60 relative flex items-center justify-center my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={1} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-emerald-400">{tyLeGiaiQuyet}%</span>
                      <span className="text-[11px] uppercase font-bold text-slate-300">ĐÃ HOÀN THÀNH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-center">
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-xs text-emerald-300 font-bold">Đã Giải Quyết</div>
                      <div className="text-xl font-black text-emerald-400">{donDaGiaiQuyet} hồ sơ</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                      <div className="text-xs text-amber-300 font-bold">Đang Giải Quyết</div>
                      <div className="text-xl font-black text-amber-400">{donDangGiaiQuyet} hồ sơ</div>
                    </div>
                  </div>
                </div>

                {/* Right Chart: Top Fields Bar Chart */}
                <div className={`lg:col-span-7 p-5 rounded-2xl ${st.cardBg} flex flex-col justify-between`}>
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                      <Layers className="w-5 h-5 text-amber-400" />
                      <span>Cơ Cấu Lĩnh Vực Khiếu Nại, Tố Cáo & Tiếp Dân</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">So sánh khối lượng vụ việc phát sinh theo từng lĩnh vực</p>
                  </div>

                  <div className="h-64 my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fieldData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        <Bar dataKey="Đơn Thư" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Tiếp Dân" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs text-amber-200">
                    <span>Lĩnh vực chiếm tỷ trọng cao nhất: <strong>{fieldData[0]?.name || 'Đất đai'}</strong> ({fieldData[0]?.total || 0} vụ)</span>
                    <span className="font-bold text-emerald-400">Tỷ lệ đúng hạn: {tyLeDungHan}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 2: CÔNG TÁC TIẾP CÔNG DÂN & LĨNH VỰC
             ======================================================== */}
          {currentSlide === 1 && (
            <motion.div
              key="tv-slide-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-blue-400">
                    CÔNG TÁC TIẾP DÂN TRỰC TIẾP
                  </span>
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeMode === 'standard_office' ? 'text-slate-950' : 'text-white'}`}>
                    👥 Tình Hình Tiếp Công Dân Của Lãnh Đạo & Cán Bộ UBND Phường
                  </h2>
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Tổng số: {totalTcd} lượt tiếp
                </div>
              </div>

              {/* 3 Metric Cards for Reception Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl ${st.cardBg} border-l-4 border-l-amber-500`}>
                  <span className="text-xs font-bold uppercase text-amber-400">Tiếp Dân Định Kỳ</span>
                  <div className="text-4xl font-black text-amber-300 mt-1">{tcdDinhKy} <span className="text-base font-normal text-slate-400">lượt</span></div>
                  <p className="text-xs text-slate-400 mt-1">Chủ tịch & Phó Chủ tịch UBND phường chủ trì</p>
                </div>
                <div className={`p-5 rounded-2xl ${st.cardBg} border-l-4 border-l-blue-500`}>
                  <span className="text-xs font-bold uppercase text-blue-400">Tiếp Dân Thường Xuyên</span>
                  <div className="text-4xl font-black text-blue-300 mt-1">{tcdThuongXuyen} <span className="text-base font-normal text-slate-400">lượt</span></div>
                  <p className="text-xs text-slate-400 mt-1">Công chức phụ trách tiếp công dân thường trực</p>
                </div>
                <div className={`p-5 rounded-2xl ${st.cardBg} border-l-4 border-l-purple-500`}>
                  <span className="text-xs font-bold uppercase text-purple-400">Tiếp Dân Đột Xuất</span>
                  <div className="text-4xl font-black text-purple-300 mt-1">{tcdDotXuat} <span className="text-base font-normal text-slate-400">lượt</span></div>
                  <p className="text-xs text-slate-400 mt-1">Xử lý các vụ việc phát sinh cấp bách tại cơ sở</p>
                </div>
              </div>

              {/* Live Reception Records Table */}
              <div className={`p-5 rounded-2xl ${st.cardBg}`}>
                <h3 className={`text-base font-bold mb-3 flex items-center justify-between ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span>Danh Sách Lượt Tiếp Công Dân Mới Nhất Trên Địa Bàn</span>
                  </span>
                  <span className="text-xs text-slate-400">Hiển thị {Math.min(6, tiepCongDan.length)} lượt tiếp gần nhất</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                        <th className="py-2.5 px-3">Mã Lượt Tiếp</th>
                        <th className="py-2.5 px-3">Ngày Tiếp</th>
                        <th className="py-2.5 px-3">Họ Tên Công Dân</th>
                        <th className="py-2.5 px-3">Địa Chỉ / TDP</th>
                        <th className="py-2.5 px-3">Lĩnh Vực</th>
                        <th className="py-2.5 px-3">Người Chủ Trì</th>
                        <th className="py-2.5 px-3">Kết Quả Tiếp & Hướng Xử Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tiepCongDan.slice(0, 6).map((item, idx) => (
                        <tr key={`tcd-tv-${idx}`} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{item.maLuotTiep}</td>
                          <td className="py-2.5 px-3 text-slate-300">{item.ngayTiep}</td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            {isPrivacyMode ? maskSensitiveInfo(item.hoTen, 'name') : item.hoTen}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40 text-[10px]">
                              {extractToDanPho(item.diaChi)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-amber-200">{item.linhVuc}</td>
                          <td className="py-2.5 px-3 text-slate-300 font-semibold">{item.nguoiChuTri}</td>
                          <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate" title={item.huongXuLy}>
                            {item.huongXuLy || item.ketQuaTiep || 'Đã hướng dẫn và tiếp nhận'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 3: GIÁM SÁT XỬ LÝ ĐƠN THƯ KHIẾU NẠI TỐ CÁO
             ======================================================== */}
          {currentSlide === 2 && (
            <motion.div
              key="tv-slide-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-purple-400">
                    QUẢN LÝ & THỤ LÝ ĐƠN THƯ
                  </span>
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeMode === 'standard_office' ? 'text-slate-950' : 'text-white'}`}>
                    📋 Tiến Độ Giải Quyết Đơn Thư Khiếu Nại, Tố Cáo, Kiến Nghị
                  </h2>
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Tổng số: {totalDon} hồ sơ
                </div>
              </div>

              {/* 3 Categories Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl ${st.cardBg} flex items-center justify-between border-t-4 border-t-blue-500`}>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold">Đơn Khiếu Nại</span>
                    <div className="text-3xl font-black text-blue-400">{donKhieuNai}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Thuộc thẩm quyền: <strong>{quanLyDonThu.filter(d => d.loaiDon.includes('Khiếu nại') && d.thuocThamQuyen.includes('Có')).length}</strong></div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl ${st.cardBg} flex items-center justify-between border-t-4 border-t-red-500`}>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold">Đơn Tố Cáo</span>
                    <div className="text-3xl font-black text-red-400">{donToCao}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Thuộc thẩm quyền: <strong>{quanLyDonThu.filter(d => d.loaiDon.includes('Tố cáo') && d.thuocThamQuyen.includes('Có')).length}</strong></div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl ${st.cardBg} flex items-center justify-between border-t-4 border-t-emerald-500`}>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold">Đơn Kiến Nghị, Phản Ánh</span>
                    <div className="text-3xl font-black text-emerald-400">{donKienNghi}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Đã giải quyết: <strong>{quanLyDonThu.filter(d => (d.loaiDon.includes('Kiến nghị') || d.loaiDon.includes('phản ánh')) && d.trangThaiHoSo.includes('Đã')).length}</strong></div>
                  </div>
                </div>
              </div>

              {/* Complaints Table Display */}
              <div className={`p-5 rounded-2xl ${st.cardBg}`}>
                <h3 className={`text-base font-bold mb-3 flex items-center justify-between ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                    <span>Hồ Sơ Đơn Thư Đang Thụ Lý & Giải Quyết</span>
                  </span>
                  <span className="text-xs text-slate-400">Cập nhật thời gian thực</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                        <th className="py-2.5 px-3">Mã Đơn</th>
                        <th className="py-2.5 px-3">Ngày Nhận</th>
                        <th className="py-2.5 px-3">Người Gửi</th>
                        <th className="py-2.5 px-3">Loại Đơn</th>
                        <th className="py-2.5 px-3">Nội Dung Tóm Tắt</th>
                        <th className="py-2.5 px-3">Cán Bộ Tham Mưu</th>
                        <th className="py-2.5 px-3">Hạn Giải Quyết</th>
                        <th className="py-2.5 px-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {quanLyDonThu.slice(0, 6).map((item, idx) => (
                        <tr key={`don-tv-${idx}`} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{item.maDon}</td>
                          <td className="py-2.5 px-3 text-slate-300">{item.ngayNhanDon}</td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            {isPrivacyMode ? maskSensitiveInfo(item.hoTen, 'name') : item.hoTen}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.loaiDon.includes('Khiếu nại')
                                ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                                : item.loaiDon.includes('Tố cáo')
                                ? 'bg-red-900/60 text-red-300 border border-red-700'
                                : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                            }`}>
                              {item.loaiDon}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate" title={item.noiDungTomTat}>
                            {item.noiDungTomTat}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 font-semibold">{item.canBoThamMuu}</td>
                          <td className="py-2.5 px-3 text-amber-300 font-mono">{item.hanGiaiQuyet}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.trangThaiHoSo.includes('Đã giải quyết')
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {item.trangThaiHoSo}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 4: CẢNH BÁO TIẾN ĐỘ & HẠN CHÓT
             ======================================================== */}
          {currentSlide === 3 && (
            <motion.div
              key="tv-slide-3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-red-400">
                    TRUNG TÂM GIÁM SÁT THỜI HẠN & CẢNH BÁO
                  </span>
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeMode === 'standard_office' ? 'text-slate-950' : 'text-white'}`}>
                    ⏱️ Theo Dõi Tiến Độ Giải Quyết, Cảnh Báo Hồ Sơ Chậm & Sắp Đến Hạn
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                    Quá hạn: {tdQuaHan + donQuaHan}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    Sắp đến hạn: {tdSapDenHan}
                  </span>
                </div>
              </div>

              {/* Real-time Alert List for Deadlines */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgent Deadline Box */}
                <div className={`p-5 rounded-2xl ${st.cardBg} border-t-4 border-t-red-600`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
                      <Flame className="w-5 h-5 animate-pulse" />
                      <span>Hồ Sơ Cần Đôn Đốc & Xử Lý Khẩn Cấp</span>
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
                      Thời gian thực
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tienDo
                      .filter((td) => td.canhBaoTienDo.includes('QUÁ HẠN') || td.canhBaoTienDo.includes('SẮP ĐẾN HẠN') || td.canhBaoTienDo.includes('≤24'))
                      .slice(0, 4)
                      .map((item, idx) => (
                        <div
                          key={`alert-tv-${idx}`}
                          className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-300 text-xs">{item.maDon}</span>
                              <span className="text-[11px] px-2 py-0.2 rounded-full font-bold bg-red-900/60 text-red-200 border border-red-700">
                                {item.canhBaoTienDo}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-white mt-1">{item.noiDungCongViec || 'Thực hiện quy trình thụ lý'}</p>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                              <span>Phụ trách: <strong>{item.nguoiThucHien}</strong></span>
                              <span>Hạn: <strong>{item.hanGiaiQuyet || item.thoiHanBuocXuLy}</strong></span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2 py-1 rounded border border-red-800">
                              {item.soNgayConLai || 'Khẩn'}
                            </span>
                          </div>
                        </div>
                      ))}

                    {tienDo.filter((td) => td.canhBaoTienDo.includes('QUÁ HẠN') || td.canhBaoTienDo.includes('SẮP ĐẾN HẠN')).length === 0 && (
                      <div className="p-8 text-center text-emerald-400 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-80" />
                        <p className="font-bold text-sm">Hiện không có hồ sơ nào quá hạn hoặc chậm trễ!</p>
                        <p className="text-xs text-slate-400 mt-1">Toàn bộ hồ sơ đang được giải quyết đúng quy trình</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Directive & Step Tracking */}
                <div className={`p-5 rounded-2xl ${st.cardBg} border-t-4 border-t-amber-500 flex flex-col justify-between`}>
                  <div>
                    <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${themeMode === 'standard_office' ? 'text-slate-900' : 'text-white'}`}>
                      <Timer className="w-5 h-5 text-amber-400" />
                      <span>Quy Trình 5 Bước Giải Quyết Theo Luật Định</span>
                    </h3>

                    <div className="space-y-2.5 my-3">
                      {[
                        { step: 'Bước 1', name: 'Tiếp nhận & Phân loại đơn ban đầu', days: '≤ 01 ngày' },
                        { step: 'Bước 2', name: 'Thụ lý & Xác minh nội dung khiếu nại, tố cáo', days: '≤ 05 ngày' },
                        { step: 'Bước 3', name: 'Tổ chức đối thoại & Làm việc với các bên', days: '≤ 03 ngày' },
                        { step: 'Bước 4', name: 'Dự thảo kết luận / Quyết định giải quyết', days: '≤ 03 ngày' },
                        { step: 'Bước 5', name: 'Ban hành văn bản & Trả kết quả cho công dân', days: '≤ 02 ngày' },
                      ].map((s, sIdx) => (
                        <div key={`step-flow-${sIdx}`} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                          <span className="font-bold text-amber-300">{s.step}: {s.name}</span>
                          <span className="font-mono text-emerald-400 font-semibold">{s.days}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
                    💡 <strong>Chỉ đạo điều hành:</strong> Cán bộ chuyên môn chủ động phối hợp Tổ trưởng Tổ dân phố xác minh thực địa để giải quyết dứt điểm các đơn thư ngay tại cơ sở.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 5: BẢN ĐỒ SỐ LIỆU THEO 8 TỔ DÂN PHỐ
             ======================================================== */}
          {currentSlide === 4 && (
            <motion.div
              key="tv-slide-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-emerald-400">
                    PHÂN BỐ ĐỊA BÀN CƠ SỞ
                  </span>
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeMode === 'standard_office' ? 'text-slate-950' : 'text-white'}`}>
                    🗺️ Tình Hình Đơn Thư & Tiếp Công Dân Tại 8 Tổ Dân Phố Phường Trà Câu
                  </h2>
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Địa bàn: 8 Tổ dân phố trực thuộc
                </div>
              </div>

              {/* Bar chart for 8 TDPs */}
              <div className={`p-5 rounded-2xl ${st.cardBg}`}>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tdpData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="fullName" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }} />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                      <Bar dataKey="Tiếp Dân" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Đơn Thư" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Đã giải quyết" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 8 TDP Mini Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {tdpData.map((tdp, idx) => (
                  <div key={`tdp-card-${idx}`} className={`p-3 rounded-xl ${st.cardBg} text-center`}>
                    <div className="text-xs font-bold text-amber-300">{tdp.name}</div>
                    <div className="text-2xl font-black text-white my-1">{tdp.total} <span className="text-[10px] text-slate-400 font-normal">vụ</span></div>
                    <div className="text-[10px] font-semibold text-emerald-400">
                      Xong: {tdp.rate}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FLOATING TV CONTROL BAR (AUTO HIDES AFTER 4.5S IDLE) */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isControlVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl text-white">
          {/* Prev Slide */}
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
              setProgressPercent(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-95 border border-slate-700"
            title="Trang trước (Phím Mũi tên Trái)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 border ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white'
            }`}
            title="Tạm dừng / Tiếp tục tự động chuyển slide (Phím Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-xs">Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-xs">Phát Tiếp</span>
              </>
            )}
          </button>

          {/* Next Slide */}
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
              setProgressPercent(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-95 border border-slate-700"
            title="Trang tiếp theo (Phím Mũi tên Phải)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Slide Quick Selectors */}
          <div className="hidden sm:flex items-center gap-1.5">
            {SLIDES.map((slide, sIdx) => (
              <button
                key={`btn-slide-dot-${sIdx}`}
                onClick={() => {
                  setCurrentSlide(sIdx);
                  setProgressPercent(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  currentSlide === sIdx
                    ? 'bg-red-700 text-white border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-transparent hover:bg-slate-700'
                }`}
                title={slide.title}
              >
                {slide.icon} <span className="hidden xl:inline">{slide.id + 1}</span>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1" />

          {/* Interval Selector */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-300">
            <span className="text-[10px] text-slate-400">Tốc độ:</span>
            <select
              value={intervalSec}
              onChange={(e) => {
                setIntervalSec(Number(e.target.value));
                setProgressPercent(0);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value={10}>10s</option>
              <option value={15}>15s</option>
              <option value={20}>20s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
          </div>

          {/* Privacy Toggle on TV */}
          <button
            onClick={() => setIsPrivacyMode((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all text-xs ${
              isPrivacyMode
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isPrivacyMode ? 'Đang ẩn thông tin nhạy cảm' : 'Ẩn thông tin nhạy cảm công dân'}
          >
            {isPrivacyMode ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Theme Switcher Directly on TV */}
          <button
            onClick={() => {
              if (themeMode === 'ceremonial') setThemeMode('command_center');
              else if (themeMode === 'command_center') setThemeMode('standard_office');
              else setThemeMode('ceremonial');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all text-xs"
            title="Đổi chủ đề màn hình TV (Trang trọng / Ban đêm / Sáng)"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all text-xs"
            title="Bật/Tắt Toàn Màn Hình TV (Phím F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-cyan-400" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close TV Mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold transition-all border border-red-500 text-xs"
            title="Thoát trình chiếu TV"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
