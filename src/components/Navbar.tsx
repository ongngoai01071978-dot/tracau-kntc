import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Lock,
  Unlock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  Landmark,
  Moon,
  Sun,
  Palette,
  ChevronDown,
  Sparkles,
  MonitorDot,
  Eye,
  Settings,
  Tv,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ActiveTab, SyncState, ThemeMode, THEME_OPTIONS } from '../types';
import { SPREADSHEET_URL } from '../services/sheetsService';
import { StaggeredFlipTitle } from './StaggeredFlipTitle';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  syncState: SyncState;
  onRefresh: () => void;
  autoSyncInterval: number;
  setAutoSyncInterval: (interval: number) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isDenseMode: boolean;
  setIsDenseMode: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenReportModal: () => void;
  onOpenTvPresentation: () => void;
  totalRecords: {
    tiepCongDan: number;
    quanLyDonThu: number;
    tienDo: number;
  };
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  syncState,
  onRefresh,
  autoSyncInterval,
  setAutoSyncInterval,
  isPrivacyMode,
  setIsPrivacyMode,
  isDenseMode,
  setIsDenseMode,
  onOpenReportModal,
  onOpenTvPresentation,
  totalRecords,
  themeMode,
  setThemeMode,
  isHighContrast,
  setIsHighContrast,
  onOpenSettings,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const currentTheme = THEME_OPTIONS.find((t) => t.id === themeMode) || THEME_OPTIONS[0];

  const getThemeIcon = (id: ThemeMode) => {
    switch (id) {
      case 'ceremonial':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'command_center':
        return <Moon className="w-4 h-4 text-cyan-400" />;
      case 'standard_office':
        return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b shadow-md transition-colors ${
      themeMode === 'ceremonial'
        ? 'bg-gradient-to-r from-red-950 via-slate-950 to-red-950 border-red-900/60 text-white'
        : themeMode === 'command_center'
        ? 'bg-slate-950 border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Banner with Vietnamese National Style Accents */}
      <div className={`px-4 py-1.5 text-xs flex items-center justify-between font-bold ${
        themeMode === 'ceremonial'
          ? 'bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-amber-200 border-b border-amber-500/30'
          : themeMode === 'command_center'
          ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 text-cyan-200 border-b border-cyan-500/40'
          : 'bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
            themeMode === 'command_center' ? 'bg-cyan-400' : 'bg-amber-400'
          }`}></span>
          <span className="font-bold tracking-wide text-white uppercase">ỦY BAN NHÂN DÂN PHƯỜNG TRÀ CÂU, TỈNH QUẢNG NGÃI</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden lg:inline text-white/95 font-semibold">DỮ LIỆU ĐỒNG BỘ TRỰC TUYẾN TỪ GOOGLE SHEETS</span>
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 px-2.5 py-0.5 rounded text-white font-bold transition-colors border border-white/20"
            title="Mở Google Sheets nguồn trong tab mới"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
            <span>Google Sheets</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isDenseMode ? 'py-0.5' : ''}`}>
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-2.5 ${
          isDenseMode ? 'py-1.5 min-h-[3.5rem]' : 'py-3 min-h-[4.5rem]'
        }`}>
          {/* Centered / Evenly Aligned System Title */}
          <div className="flex-1 flex items-center justify-center text-center gap-2.5 w-full">
            <div className={`rounded-xl p-1 shadow-md flex items-center justify-center shrink-0 ${
              isDenseMode ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10 sm:w-11 sm:h-11'
            } ${
              themeMode === 'ceremonial'
                ? 'bg-gradient-to-br from-red-600 to-amber-500 text-white ring-2 ring-amber-400/50 shadow-amber-900/40'
                : themeMode === 'command_center'
                ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white ring-1 ring-cyan-400/50 shadow-cyan-950/50'
                : 'bg-gradient-to-br from-red-700 to-red-800 text-white shadow-red-900/20'
            }`}>
              <Building2 className={`${isDenseMode ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6'} text-white`} />
            </div>
            <StaggeredFlipTitle
              text="HỆ THỐNG QUẢN LÝ TIẾP CÔNG DÂN VÀ GIẢI QUYẾT ĐƠN THƯ KHIẾU NẠI TỐ CÁO"
              themeMode={themeMode}
            />
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-1.5 sm:gap-2 shrink-0">
            {/* Display Mode Dropdown Selector */}
            <div className="relative" ref={themeMenuRef}>
              <button
                id="btn-display-mode-selector"
                onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm active:scale-95 ${
                  themeMode === 'ceremonial'
                    ? 'bg-gradient-to-r from-red-900 to-amber-950 border-amber-500/50 text-amber-200 hover:border-amber-400'
                    : themeMode === 'command_center'
                    ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
                title="Chọn chế độ hiển thị màn hình (Hội nghị / Điều hành / Văn phòng)"
              >
                {getThemeIcon(themeMode)}
                <span className="hidden md:inline font-medium">{currentTheme.shortName}</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-150 ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      <Palette className="w-3.5 h-3.5 text-red-600" />
                      <span>Chế Độ Hiển Thị Màn Hình</span>
                    </div>
                    <span className="text-[10px] text-slate-400">3 chế độ</span>
                  </div>

                  <div className="p-2 space-y-1">
                    {THEME_OPTIONS.map((opt, index) => {
                      const isSelected = themeMode === opt.id;
                      return (
                        <button
                          key={opt.id}
                          id={`theme-option-${opt.id}`}
                          onClick={() => {
                            setThemeMode(opt.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-3 border ${
                            isSelected
                              ? opt.id === 'ceremonial'
                                ? 'bg-red-950/20 border-red-700/60 dark:bg-red-950/40 text-red-700 dark:text-amber-300 shadow-xs'
                                : opt.id === 'command_center'
                                ? 'bg-cyan-950/20 border-cyan-500/60 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 shadow-xs'
                                : 'bg-amber-50 border-amber-400/80 text-amber-900 shadow-xs'
                              : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md mt-0.5 ${
                            opt.id === 'ceremonial'
                              ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-amber-300'
                              : opt.id === 'command_center'
                              ? 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300'
                              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                          }`}>
                            {opt.id === 'ceremonial' && <Landmark className="w-4 h-4" />}
                            {opt.id === 'command_center' && <MonitorDot className="w-4 h-4" />}
                            {opt.id === 'standard_office' && <Sun className="w-4 h-4" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                <span>{index + 1}. {opt.name}</span>
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {opt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sync Status Badge */}
            <div className={`hidden lg:flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs ${
              themeMode === 'standard_office'
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}>
              {syncState.isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span className="text-blue-400 font-medium">Đang đồng bộ...</span>
                </>
              ) : syncState.status === 'error' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400" title={syncState.errorMessage}>Dự phòng ngoại tuyến</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Đồng bộ: <strong className="text-emerald-500">{formatTime(syncState.lastSyncedAt)}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Auto-sync Interval Selector */}
            <div className={`hidden md:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg text-xs ${
              themeMode === 'standard_office'
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="auto-sync-select" className="text-slate-400 text-[11px]">Tự động:</label>
              <select
                id="auto-sync-select"
                value={autoSyncInterval}
                onChange={(e) => setAutoSyncInterval(Number(e.target.value))}
                className={`border rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  themeMode === 'standard_office'
                    ? 'bg-white border-slate-300 text-slate-800'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value={0}>Tắt tự động</option>
                <option value={30}>30 giây</option>
                <option value={60}>1 phút</option>
                <option value={300}>5 phút</option>
              </select>
            </div>

            {/* Manual Sync Button */}
            <button
              id="btn-sync-now"
              onClick={onRefresh}
              disabled={syncState.isSyncing}
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                themeMode === 'standard_office'
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
              title="Đồng bộ dữ liệu mới nhất từ Google Sheets ngay lập tức"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Đồng bộ ngay</span>
            </button>

            {/* High Contrast Mode Toggle Button (Hidden from main bar as requested, managed via Settings) */}
            <button
              id="btn-navbar-high-contrast"
              onClick={() => setIsHighContrast((prev) => !prev)}
              className="hidden"
              title={isHighContrast ? 'Đang bật chế độ tương phản cao (Mù màu)' : 'Bật chế độ tương phản cao (Mù màu - Xanh dương/Vàng cam)'}
            >
              <Eye className={`w-3.5 h-3.5 ${isHighContrast ? 'text-amber-300' : 'text-slate-400'}`} />
              <span className="hidden xl:inline">Tương phản cao:</span>
              <span>{isHighContrast ? 'Bật' : 'Tắt'}</span>
            </button>

            {/* Privacy Mode Toggle (Hidden from main bar as requested, managed via Settings) */}
            <button
              id="btn-toggle-privacy"
              onClick={() => setIsPrivacyMode((prev) => !prev)}
              className="hidden"
              title={isPrivacyMode ? 'Đang ẩn thông tin nhạy cảm (CCCD, SĐT)' : 'Nhấp để ẩn thông tin CCCD & SĐT công dân'}
            >
              {isPrivacyMode ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Bảo mật: Bật</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Bảo mật: Tắt</span>
                </>
              )}
            </button>

            {/* Dense Mode (Thu Gọn / Siêu Nén) Toggle */}
            <button
              id="btn-toggle-dense-mode"
              onClick={() => setIsDenseMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                isDenseMode
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-800 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/40'
                  : themeMode === 'standard_office'
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={
                isDenseMode
                  ? 'Chế độ Thu Gọn (Dense Mode) đang BẬT: Đã giảm khoảng cách (padding/margin) để hiển thị nhiều thông tin và biểu đồ nhất trên màn hình TV nhỏ.'
                  : 'Bật chế độ Thu Gọn (Dense Mode) để giảm khoảng cách giữa các thành phần, giúp hiển thị nhiều biểu đồ và thông tin hơn trên các màn hình TV nhỏ.'
              }
            >
              {isDenseMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">Thu Gọn: Bật</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Thu Gọn: Tắt</span>
                </>
              )}
            </button>

            {/* System & Accessibility Settings Modal Trigger */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className={`p-1.5 rounded-lg border transition-all ${
                themeMode === 'standard_office'
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Cài đặt hệ thống, Dense Mode & Trợ năng mù màu"
            >
              <Settings className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>

            {/* TV Presentation Mode Button */}
            <button
              id="btn-open-tv-presentation"
              onClick={onOpenTvPresentation}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 border ${
                themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/40 shadow-amber-950/40'
                  : themeMode === 'command_center'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400 ring-2 ring-cyan-400/40'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-amber-600 shadow-sm'
              }`}
              title="Bật chế độ Trình chiếu TV / Hội trường / Màn hình lớn"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Trình Chiếu TV</span>
            </button>

            {/* Export Official Report Modal Trigger */}
            <button
              id="btn-open-report-modal"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow-red-900/20 active:scale-95 border border-red-800"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t text-xs font-semibold ${
          themeMode === 'standard_office' ? 'border-slate-200 bg-slate-50/50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8' : 'border-slate-800'
        }`}>
          <button
            id="nav-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 shadow-md border border-amber-400/60 ring-1 ring-amber-400/30'
                  : themeMode === 'command_center'
                  ? 'bg-cyan-900 text-white shadow-md border border-cyan-400/70 ring-1 ring-cyan-400/30'
                  : 'bg-red-700 text-white shadow-md border border-red-800'
                : themeMode === 'standard_office'
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 border border-transparent'
                : themeMode === 'ceremonial'
                ? 'text-amber-200/90 hover:text-white hover:bg-red-950/80 border border-transparent'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>📊 Bảng Điều Khiển Tổng Hợp</span>
          </button>

          <button
            id="nav-tab-tiep-cong-dan"
            onClick={() => setActiveTab('tiep-cong-dan')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'tiep-cong-dan'
                ? themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 shadow-md border border-amber-400/60 ring-1 ring-amber-400/30'
                  : themeMode === 'command_center'
                  ? 'bg-cyan-900 text-white shadow-md border border-cyan-400/70 ring-1 ring-cyan-400/30'
                  : 'bg-red-700 text-white shadow-md border border-red-800'
                : themeMode === 'standard_office'
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 border border-transparent'
                : themeMode === 'ceremonial'
                ? 'text-amber-200/90 hover:text-white hover:bg-red-950/80 border border-transparent'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>👥 Tiếp Công Dân</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-black ${
              activeTab === 'tiep-cong-dan'
                ? 'bg-white text-red-800 shadow-xs'
                : themeMode === 'standard_office'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-black/60 text-amber-300 border border-amber-500/40'
            }`}>
              {totalRecords.tiepCongDan}
            </span>
          </button>

          <button
            id="nav-tab-quan-ly-don-thu"
            onClick={() => setActiveTab('quan-ly-don-thu')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'quan-ly-don-thu'
                ? themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 shadow-md border border-amber-400/60 ring-1 ring-amber-400/30'
                  : themeMode === 'command_center'
                  ? 'bg-cyan-900 text-white shadow-md border border-cyan-400/70 ring-1 ring-cyan-400/30'
                  : 'bg-red-700 text-white shadow-md border border-red-800'
                : themeMode === 'standard_office'
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 border border-transparent'
                : themeMode === 'ceremonial'
                ? 'text-amber-200/90 hover:text-white hover:bg-red-950/80 border border-transparent'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>📋 Quản Lý Đơn Thư</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-black ${
              activeTab === 'quan-ly-don-thu'
                ? 'bg-white text-red-800 shadow-xs'
                : themeMode === 'standard_office'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-black/60 text-amber-300 border border-amber-500/40'
            }`}>
              {totalRecords.quanLyDonThu}
            </span>
          </button>

          <button
            id="nav-tab-tien-do"
            onClick={() => setActiveTab('tien-do')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'tien-do'
                ? themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 shadow-md border border-amber-400/60 ring-1 ring-amber-400/30'
                  : themeMode === 'command_center'
                  ? 'bg-cyan-900 text-white shadow-md border border-cyan-400/70 ring-1 ring-cyan-400/30'
                  : 'bg-red-700 text-white shadow-md border border-red-800'
                : themeMode === 'standard_office'
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 border border-transparent'
                : themeMode === 'ceremonial'
                ? 'text-amber-200/90 hover:text-white hover:bg-red-950/80 border border-transparent'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>⏱️ Theo Dõi Tiến Độ & Hạn Chót</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-black ${
              activeTab === 'tien-do'
                ? 'bg-white text-red-800 shadow-xs'
                : themeMode === 'standard_office'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-black/60 text-amber-300 border border-amber-500/40'
            }`}>
              {totalRecords.tienDo}
            </span>
          </button>

          <button
            id="nav-tab-bao-cao"
            onClick={() => setActiveTab('bao-cao')}
            className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'bao-cao'
                ? themeMode === 'ceremonial'
                  ? 'bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 shadow-md border border-amber-400/60 ring-1 ring-amber-400/30'
                  : themeMode === 'command_center'
                  ? 'bg-cyan-900 text-white shadow-md border border-cyan-400/70 ring-1 ring-cyan-400/30'
                  : 'bg-red-700 text-white shadow-md border border-red-800'
                : themeMode === 'standard_office'
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 border border-transparent'
                : themeMode === 'ceremonial'
                ? 'text-amber-200/90 hover:text-white hover:bg-red-950/80 border border-transparent'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>📑 Văn Bản Báo Cáo Chuẩn</span>
          </button>

          {/* Quick TV Presentation Tab */}
          <button
            id="nav-tab-tv-presentation"
            onClick={onOpenTvPresentation}
            className={`ml-auto px-3.5 py-1.5 rounded-lg font-black whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-sm active:scale-95 ${
              themeMode === 'ceremonial'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 border-amber-300 hover:brightness-110 shadow-amber-950/40'
                : themeMode === 'command_center'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 hover:brightness-110'
                : 'bg-amber-600 text-white border-amber-500 hover:bg-amber-500'
            }`}
            title="Mở chế độ trình chiếu lên màn hình TV / Hội nghị"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>📺 Trình Chiếu TV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
