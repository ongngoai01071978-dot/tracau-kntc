import React from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  Layers,
  FileText,
  Clock,
  UserCheck,
  MapPin,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { FilterState } from '../types';

interface SmartFilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  fieldOptions: string[];
  typeOptions: string[];
  officerOptions: string[];
  neighborhoodOptions: string[];
  activeFilterCount: number;
  isDenseMode?: boolean;
  resultsCount?: {
    donThu: number;
    tiepCongDan: number;
    tienDo: number;
    total: number;
  };
}

export const SmartFilterBar: React.FC<SmartFilterBarProps> = ({
  filters,
  setFilters,
  onReset,
  fieldOptions,
  typeOptions,
  officerOptions,
  neighborhoodOptions,
  activeFilterCount,
  isDenseMode = false,
  resultsCount,
}) => {
  return (
    <div
      id="smart-filter-container"
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-all ${
        isDenseMode ? 'p-2.5 sm:p-3 mb-3' : 'p-4 mb-5'
      }`}
    >
      {/* Search Input Bar & Quick Date & Reset */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-global-search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Tìm kiếm chính xác theo Họ tên, CCCD, SĐT, Mã đơn (DT-..), Mã tiếp (TCD-..), Địa chỉ, Cán bộ..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          />
          {filters.searchQuery && (
            <button
              id="btn-clear-search-query"
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Xóa từ khóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Presets Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="select-date-preset"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: e.target.value as FilterState['dateRange'],
                }))
              }
              className="pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer shadow-2xs"
            >
              <option value="all">📅 Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="this_month">Tháng hiện tại</option>
              <option value="this_quarter">Quý hiện tại</option>
              <option value="this_year">Năm 2026</option>
              <option value="custom">Tùy chỉnh khoảng ngày...</option>
            </select>
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {activeFilterCount > 0 && (
            <button
              id="btn-reset-filters"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all whitespace-nowrap active:scale-95 shadow-2xs"
              title="Xóa tất cả các bộ lọc đang chọn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa lọc ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Pickers (Shown only when 'custom' is selected) */}
      {filters.dateRange === 'custom' && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-lg">
          <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            Khoảng ngày tùy chọn:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500 dark:text-slate-400 font-medium">Từ:</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-2xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500 dark:text-slate-400 font-medium">Đến:</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* Dropdown Filters Grid */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Filter 1: Lĩnh vực */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-red-600" />
            Lĩnh Vực
          </label>
          <select
            id="filter-linh-vuc"
            value={filters.linhVuc}
            onChange={(e) => setFilters((prev) => ({ ...prev, linhVuc: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.linhVuc !== 'all' ? 'border-red-500 font-semibold text-red-700 dark:text-red-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả lĩnh vực</option>
            {fieldOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 2: Loại đơn */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-blue-600" />
            Loại Đơn / Phân Loại
          </label>
          <select
            id="filter-loai-don"
            value={filters.loaiDon}
            onChange={(e) => setFilters((prev) => ({ ...prev, loaiDon: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.loaiDon !== 'all' ? 'border-blue-500 font-semibold text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả loại đơn</option>
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Trạng thái */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Trạng Thái Xử Lý
          </label>
          <select
            id="filter-trang-thai"
            value={filters.trangThai}
            onChange={(e) => setFilters((prev) => ({ ...prev, trangThai: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.trangThai !== 'all' ? 'border-emerald-500 font-semibold text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đã giải quyết">Đã giải quyết</option>
            <option value="Đang giải quyết">Đang giải quyết</option>
          </select>
        </div>

        {/* Filter 4: Tình trạng hạn */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Tiến Độ / Hạn Chót
          </label>
          <select
            id="filter-tinh-trang-han"
            value={filters.tinhTrangHan}
            onChange={(e) => setFilters((prev) => ({ ...prev, tinhTrangHan: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.tinhTrangHan !== 'all' ? 'border-amber-500 font-semibold text-amber-700 dark:text-amber-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả tiến độ</option>
            <option value="Đúng hạn">Đúng hạn</option>
            <option value="Trong hạn">Đang trong hạn</option>
            <option value="Sắp đến hạn">Sắp đến hạn (≤24h)</option>
            <option value="Quá hạn">Quá hạn</option>
          </select>
        </div>

        {/* Filter 5: Tổ dân phố */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-600" />
            Tổ Dân Phố
          </label>
          <select
            id="filter-to-dan-pho"
            value={filters.toDanPho}
            onChange={(e) => setFilters((prev) => ({ ...prev, toDanPho: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.toDanPho !== 'all' ? 'border-indigo-500 font-semibold text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả tổ dân phố</option>
            {neighborhoodOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 6: Cán bộ phụ trách */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-teal-600" />
            Cán Bộ Phụ Trách
          </label>
          <select
            id="filter-can-bo"
            value={filters.canBo}
            onChange={(e) => setFilters((prev) => ({ ...prev, canBo: e.target.value }))}
            className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600 ${
              filters.canBo !== 'all' ? 'border-teal-500 font-semibold text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="all">Tất cả cán bộ</option>
            {officerOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Accurate Results & Active Filters Status Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Kết quả lọc chính xác tức thì:</span>
            {resultsCount ? (
              <span className="text-slate-900 dark:text-white font-bold">
                <span className="text-blue-700 dark:text-blue-400 font-mono">{resultsCount.donThu}</span> đơn thư •{' '}
                <span className="text-red-700 dark:text-red-400 font-mono">{resultsCount.tiepCongDan}</span> tiếp dân •{' '}
                <span className="text-purple-700 dark:text-purple-400 font-mono">{resultsCount.tienDo}</span> tiến độ
              </span>
            ) : (
              <span className="text-slate-500">Đang cập nhật...</span>
            )}
          </span>
        </div>

        {/* Quick Active Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-medium">
                Tìm: "{filters.searchQuery}"
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="hover:text-blue-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.linhVuc !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[11px] font-medium">
                Lĩnh vực: {filters.linhVuc}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, linhVuc: 'all' }))}
                  className="hover:text-red-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.loaiDon !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium">
                Loại: {filters.loaiDon}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, loaiDon: 'all' }))}
                  className="hover:text-indigo-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.trangThai !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
                Trạng thái: {filters.trangThai}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, trangThai: 'all' }))}
                  className="hover:text-emerald-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tinhTrangHan !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-medium">
                Hạn: {filters.tinhTrangHan}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, tinhTrangHan: 'all' }))}
                  className="hover:text-amber-950 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.toDanPho !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-medium">
                {filters.toDanPho}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, toDanPho: 'all' }))}
                  className="hover:text-purple-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.canBo !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-medium">
                Cán bộ: {filters.canBo}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, canBo: 'all' }))}
                  className="hover:text-teal-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
