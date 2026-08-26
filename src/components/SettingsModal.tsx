import React from 'react';
import {
  X,
  Eye,
  Sliders,
  Moon,
  Sun,
  Shield,
  RefreshCw,
  Sparkles,
  Check,
  Palette,
  Layers,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  MonitorDot,
  LayoutGrid,
  Minimize2,
  Maximize2,
  Tv,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ThemeMode, THEME_OPTIONS, SyncState, ToastPosition } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  isDenseMode: boolean;
  setIsDenseMode: React.Dispatch<React.SetStateAction<boolean>>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  showOverdueAlert: boolean;
  setShowOverdueAlert: React.Dispatch<React.SetStateAction<boolean>>;
  toastPosition: ToastPosition;
  setToastPosition: (pos: ToastPosition) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: React.Dispatch<React.SetStateAction<boolean>>;
  autoSyncInterval: number;
  setAutoSyncInterval: (interval: number) => void;
  onManualSync: () => void;
  syncState: SyncState;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isHighContrast,
  setIsHighContrast,
  isDenseMode,
  setIsDenseMode,
  themeMode,
  setThemeMode,
  showOverdueAlert,
  setShowOverdueAlert,
  toastPosition,
  setToastPosition,
  isPrivacyMode,
  setIsPrivacyMode,
  autoSyncInterval,
  setAutoSyncInterval,
  onManualSync,
  syncState,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] transition-all ${
          themeMode === 'ceremonial'
            ? 'bg-[#1e0a0d] border-amber-900/60 text-slate-100'
            : themeMode === 'command_center'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 flex items-center justify-between border-b ${
            themeMode === 'ceremonial'
              ? 'bg-gradient-to-r from-red-950 via-[#2a0e13] to-[#1a080a] border-amber-900/40 text-white'
              : themeMode === 'command_center'
              ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-slate-800 text-white'
              : 'bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 border-slate-200 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">CÀI ĐẶT HỆ THỐNG & TRỢ NĂNG</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Phường Trà Câu
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tùy chỉnh chế độ tương phản cao cho người mù màu, giao diện hiển thị và đồng bộ dữ liệu
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* SECTION 1: HIGH CONTRAST MODE (COLORBLIND SAFE) - HIGHLIGHTED */}
          <div
            id="section-high-contrast"
            className={`rounded-xl p-5 border transition-all ${
              isHighContrast
                ? 'bg-gradient-to-br from-blue-950/60 to-amber-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/30'
                : themeMode === 'standard_office'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isHighContrast
                      ? 'bg-blue-600 text-white ring-2 ring-amber-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span>Chế độ tương phản cao (High Contrast Mode)</span>
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHighContrast
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isHighContrast ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Được thiết kế chuyên biệt cho <strong>người dùng bị mù màu (Colorblind Safe)</strong> hoặc người có thị lực hạn chế.
                    Hệ thống sẽ chuyển toàn bộ biểu đồ, trạng thái xử lý và cảnh báo từ dải màu Đỏ/Xanh lá sang dải{' '}
                    <strong className="text-blue-500 dark:text-blue-300">Xanh dương đậm</strong> &{' '}
                    <strong className="text-amber-500 dark:text-amber-300">Vàng cam</strong> có độ nhận diện cao nhất.
                  </p>
                </div>
              </div>

              {/* Action Toggle Switch */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                <button
                  id="btn-toggle-high-contrast"
                  onClick={() => setIsHighContrast((prev) => !prev)}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isHighContrast ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  role="switch"
                  aria-checked={isHighContrast}
                  title="Bật/Tắt chế độ tương phản cao cho người mù màu"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      isHighContrast ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {isHighContrast ? (
                      <Check className="w-3.5 h-3.5 text-blue-700 font-bold" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Color Palette Preview Comparison */}
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {/* Standard Palette */}
              <div
                className={`p-2.5 rounded-lg border ${
                  !isHighContrast
                    ? 'border-emerald-500/40 bg-emerald-50/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Bảng màu tiêu chuẩn:
                  </span>
                  {!isHighContrast && (
                    <span className="text-[10px] text-emerald-500 font-medium">Hiện hành</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">
                    Đã xong (Xanh lá)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-medium">
                    Quá hạn (Đỏ)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-medium">
                    Đơn nhận
                  </span>
                </div>
              </div>

              {/* High Contrast Colorblind Safe Palette */}
              <div
                className={`p-2.5 rounded-lg border ${
                  isHighContrast
                    ? 'border-blue-500/80 bg-blue-950/40 ring-1 ring-blue-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                    <span>Bảng màu Trợ năng Mù màu:</span>
                  </span>
                  {isHighContrast && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                      Đang kích hoạt
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-700 text-white text-[10px] font-bold shadow-xs">
                    Đúng hạn (Xanh dương đậm)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold shadow-xs">
                    Quá hạn (Vàng cam)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-800 text-white text-[10px] font-medium">
                    Đang xử lý
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DENSE MODE (COMPACT SPACING FOR SMALL TVS / SCREENS) */}
          <div
            id="section-dense-mode"
            className={`rounded-xl p-5 border transition-all ${
              isDenseMode
                ? 'bg-gradient-to-br from-indigo-950/60 to-blue-950/40 border-blue-400 shadow-md ring-2 ring-blue-500/30'
                : themeMode === 'standard_office'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isDenseMode
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-2 ring-blue-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Minimize2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span>Chế độ Thu Gọn (Dense Mode - Mật Độ Cao)</span>
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDenseMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isDenseMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Tối ưu hóa không gian hiển thị bằng cách <strong>giảm khoảng cách (padding / margin / gap)</strong> giữa các thẻ chỉ số KPI, bảng biểu đồ phân tích và danh sách hồ sơ. Giúp <strong>hiển thị trọn vẹn nhiều biểu đồ và dòng thông tin hơn trên cùng 1 màn hình</strong> mà không cần cuộn trang, đặc biệt hiệu quả trên <strong>các màn hình TV nhỏ, màn hình độ phân giải 720p/1080p</strong> hoặc màn hình hội họp trực tuyến.
                  </p>
                </div>
              </div>

              {/* Action Toggle Switch */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                <button
                  id="btn-modal-toggle-dense-mode"
                  onClick={() => setIsDenseMode((prev) => !prev)}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDenseMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  role="switch"
                  aria-checked={isDenseMode}
                  title="Bật/Tắt chế độ thu gọn hiển thị nhiều thông tin hơn trên màn hình TV"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      isDenseMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {isDenseMode ? (
                      <Check className="w-3.5 h-3.5 text-blue-700 font-bold" />
                    ) : (
                      <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Density Layout Comparison Preview */}
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div
                onClick={() => setIsDenseMode(false)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  !isDenseMode
                    ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Chế độ Tiêu chuẩn (Thoáng đãng)</span>
                  </span>
                  {!isDenseMode && <span className="text-[10px] text-blue-500 font-bold">Đang chọn</span>}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Khoảng cách lề rộng rãi, dễ nhìn khi dùng trên máy tính để bàn hoặc màn hình lớn 4K.
                </p>
              </div>

              <div
                onClick={() => setIsDenseMode(true)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isDenseMode
                    ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1.5">
                    <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Chế độ Thu Gọn (Dense Mode)</span>
                  </span>
                  {isDenseMode && (
                    <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded">
                      Đang chọn
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nén lề, thu gọn padding bảng & thẻ KPI, tối ưu cho màn hình TV nhỏ và hiển thị bao quát.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: THEME MODE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>Chế Độ Màn Hình & Trình Chiếu</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = themeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setThemeMode(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-400/30 bg-amber-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {opt.id === 'ceremonial' && <Sparkles className="w-4 h-4 text-amber-500" />}
                        {opt.id === 'command_center' && <MonitorDot className="w-4 h-4 text-cyan-400" />}
                        {opt.id === 'standard_office' && <Sun className="w-4 h-4 text-amber-600" />}
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {opt.shortName}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {opt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: TOAST NOTIFICATION SETTINGS & POSITION */}
          <div
            id="section-toast-position"
            className="space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  showOverdueAlert
                    ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span>Cửa Sổ Cảnh Báo Hồ Sơ Quá Hạn (Toast Notification)</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      showOverdueAlert
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {showOverdueAlert ? 'Đang Bật' : 'Đang Ẩn / Tắt'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bật hoặc tắt cửa sổ thông báo tự động xuất hiện khi có đơn thư / bước xử lý quá hạn
                  </p>
                </div>
              </div>

              <button
                id="btn-toggle-show-overdue-alert"
                type="button"
                onClick={() => setShowOverdueAlert((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showOverdueAlert ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title={showOverdueAlert ? 'Nhấp để ẩn cảnh báo quá hạn' : 'Nhấp để bật cảnh báo quá hạn'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showOverdueAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {showOverdueAlert && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 animate-in fade-in duration-150">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Vị trí xuất hiện trên màn hình:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Top Right */}
                  <button
                    id="btn-toast-pos-top-right"
                    type="button"
                    onClick={() => setToastPosition('top-right')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      toastPosition === 'top-right'
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/40 ring-2 ring-rose-500/40 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        toastPosition === 'top-right'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Góc trên bên phải</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">(Top-Right)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Hiển thị cố định ở phía trên, góc phải (<code className="text-rose-600 dark:text-rose-400 font-mono">top-5 right-5</code>)
                        </p>
                      </div>
                    </div>
                    {toastPosition === 'top-right' && (
                      <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 shrink-0 mt-1"></div>
                    )}
                  </button>

                  {/* Option 2: Bottom Right */}
                  <button
                    id="btn-toast-pos-bottom-right"
                    type="button"
                    onClick={() => setToastPosition('bottom-right')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      toastPosition === 'bottom-right'
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/40 ring-2 ring-rose-500/40 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        toastPosition === 'bottom-right'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Góc dưới bên phải</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">(Bottom-Right)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Hiển thị cố định ở phía dưới, góc phải (<code className="text-rose-600 dark:text-rose-400 font-mono">bottom-5 right-5</code>)
                        </p>
                      </div>
                    </div>
                    {toastPosition === 'bottom-right' && (
                      <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 shrink-0 mt-1"></div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: PRIVACY & DATA SYNC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Privacy Mode */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Ẩn Danh Thông Tin Nhạy Cảm</span>
                </h4>
                <button
                  onClick={() => setIsPrivacyMode((prev) => !prev)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                    isPrivacyMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isPrivacyMode ? 'BẬT' : 'TẮT'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tự động che số CCCD và Số điện thoại của công dân (dạng 0987••••123) khi trình chiếu tại nơi đông người.
              </p>
            </div>

            {/* Auto Sync Interval */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <span>Chu Kỳ Tự Động Đồng Bộ</span>
                </h4>
                <select
                  value={autoSyncInterval}
                  onChange={(e) => setAutoSyncInterval(Number(e.target.value))}
                  className="border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5 text-xs bg-white dark:bg-slate-900 font-medium"
                >
                  <option value={0}>Tắt</option>
                  <option value={30}>30 giây</option>
                  <option value={60}>1 phút</option>
                  <option value={300}>5 phút</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tự động truy xuất cập nhật mới nhất từ Google Sheets UBND Phường theo thời gian thực.
              </p>
            </div>
          </div>

          {/* SECTION 4: SOURCE STATUS */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Nguồn dữ liệu Google Sheets
                </div>
                <div className="text-[11px] text-slate-500">
                  Tổng hồ sơ tiếp dân & đơn thư:{' '}
                  <strong>{syncState.recordCount.tiepCongDan + syncState.recordCount.quanLyDonThu}</strong> bản ghi
                </div>
              </div>
            </div>

            <button
              onClick={onManualSync}
              disabled={syncState.isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
              <span>Đồng bộ ngay</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            themeMode === 'standard_office'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div className="text-[11px] text-slate-500">
            Cấu hình trợ năng và giao diện được lưu tự động trên trình duyệt.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold shadow-sm transition-all"
          >
            Đóng Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
