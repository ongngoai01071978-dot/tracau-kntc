import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CitizenReception,
  ComplaintPetition,
  ProgressStep,
  SyncState,
  FilterState,
  ActiveTab,
  ThemeMode,
  ToastPosition,
} from './types';
import {
  fetchAllSheetData,
  SPREADSHEET_URL,
} from './services/sheetsService';
import { parseDateVN, extractToDanPho, removeVietnameseTones } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { SmartFilterBar } from './components/SmartFilterBar';
import { CitizenReceptionTable } from './components/CitizenReceptionTable';
import { ComplaintPetitionsTable } from './components/ComplaintPetitionsTable';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { RecordDetailModal } from './components/RecordDetailModal';
import { ReportModal } from './components/ReportModal';
import { OfficialReportView } from './components/OfficialReportView';
import { SettingsModal } from './components/SettingsModal';
import { TvPresentationView } from './components/TvPresentationView';
import {
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react';

export default function App() {
  // Theme Mode: 1. Ceremonial / Hội nghị, 2. Command Center / Ban đêm, 3. Standard Office / Văn phòng
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tra_cau_display_theme');
    if (saved === 'ceremonial' || saved === 'command_center' || saved === 'standard_office') {
      return saved;
    }
    return 'ceremonial';
  });

  // High Contrast Accessibility Mode (Colorblind-Safe)
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('tra_cau_high_contrast') === 'true';
  });

  // Dense Mode for Big Screens & Compact Dashboards
  const [isDenseMode, setIsDenseMode] = useState<boolean>(() => {
    return localStorage.getItem('tra_cau_dense_mode') === 'true';
  });

  // Toast Notification Position: top-right or bottom-right
  const [toastPosition, setToastPosition] = useState<ToastPosition>(() => {
    const saved = localStorage.getItem('tra_cau_toast_position');
    if (saved === 'top-right' || saved === 'bottom-right') {
      return saved;
    }
    return 'bottom-right';
  });

  // Toggle Overdue Alert Toast Notification (Default: false / hidden)
  const [showOverdueAlert, setShowOverdueAlert] = useState<boolean>(() => {
    return localStorage.getItem('tra_cau_show_overdue_alert') === 'true';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tra_cau_high_contrast', String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem('tra_cau_dense_mode', String(isDenseMode));
  }, [isDenseMode]);

  useEffect(() => {
    localStorage.setItem('tra_cau_toast_position', toastPosition);
  }, [toastPosition]);

  useEffect(() => {
    localStorage.setItem('tra_cau_show_overdue_alert', String(showOverdueAlert));
  }, [showOverdueAlert]);

  useEffect(() => {
    localStorage.setItem('tra_cau_display_theme', themeMode);
    document.documentElement.classList.remove('theme-ceremonial', 'theme-command-center', 'theme-standard-office', 'dark');
    if (themeMode === 'ceremonial') {
      document.documentElement.classList.add('theme-ceremonial', 'dark');
    } else if (themeMode === 'command_center') {
      document.documentElement.classList.add('theme-command-center', 'dark');
    } else {
      document.documentElement.classList.add('theme-standard-office');
    }
  }, [themeMode]);

  // Raw Data States
  const [tiepCongDan, setTiepCongDan] = useState<CitizenReception[]>([]);
  const [quanLyDonThu, setQuanLyDonThu] = useState<ComplaintPetition[]>([]);
  const [tienDo, setTienDo] = useState<ProgressStep[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Sync State
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncedAt: null,
    status: 'idle',
    sourceUrl: SPREADSHEET_URL,
    recordCount: {
      tiepCongDan: 0,
      quanLyDonThu: 0,
      tienDo: 0,
    },
  });
  const [autoSyncInterval, setAutoSyncInterval] = useState<number>(60); // 60s default auto-sync

  // App Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<{ type: 'tcd' | 'don' | 'td'; id: string } | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTvPresentationOpen, setIsTvPresentationOpen] = useState<boolean>(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateRange: 'all',
    linhVuc: 'all',
    loaiDon: 'all',
    trangThai: 'all',
    tinhTrangHan: 'all',
    hinhThuc: 'all',
    canBo: 'all',
    toDanPho: 'all',
  });

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    donQuaHanCount: number;
    tdQuaHanCount: number;
    totalOverdue: number;
  } | null>(null);

  // Data Fetching Routine
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setSyncState((prev) => ({ ...prev, isSyncing: true }));
    }
    try {
      const res = await fetchAllSheetData();
      setTiepCongDan(res.tiepCongDan);
      setQuanLyDonThu(res.quanLyDonThu);
      setTienDo(res.tienDo);

      const donQuaHanCount = res.quanLyDonThu.filter(
        (d) => d.tinhTrangQuaHan.includes('Quá hạn') || (parseInt(d.soNgayQuaHan, 10) > 0)
      ).length;
      const tdQuaHanCount = res.tienDo.filter((td) => td.canhBaoTienDo.includes('QUÁ HẠN')).length;
      const totalOverdue = donQuaHanCount + tdQuaHanCount;

      setSyncState({
        isSyncing: false,
        lastSyncedAt: new Date(),
        status: res.isFallback ? 'error' : 'success',
        errorMessage: res.isFallback ? 'Đang dùng dữ liệu chuẩn ngoại tuyến' : undefined,
        sourceUrl: SPREADSHEET_URL,
        recordCount: {
          tiepCongDan: res.tiepCongDan.length,
          quanLyDonThu: res.quanLyDonThu.length,
          tienDo: res.tienDo.length,
        },
      });

      // Trigger Toast Notification on data load
      if (totalOverdue > 0) {
        setToast({
          show: true,
          type: 'warning',
          title: `Cảnh báo: Có ${totalOverdue} hồ sơ & bước xử lý QUÁ HẠN`,
          message: `Phát hiện ${donQuaHanCount} đơn thư và ${tdQuaHanCount} bước xử lý đang bị quá hạn quy định cần chỉ đạo giải quyết khẩn cấp.`,
          donQuaHanCount,
          tdQuaHanCount,
          totalOverdue,
        });
      } else {
        setToast({
          show: true,
          type: 'success',
          title: 'Đồng bộ dữ liệu thành công',
          message: 'Tất cả hồ sơ và các bước giải quyết đơn thư đều đang trong hạn quy định.',
          donQuaHanCount: 0,
          tdQuaHanCount: 0,
          totalOverdue: 0,
        });
      }
    } catch (err: any) {
      console.error('Error fetching sheet data:', err);
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        status: 'error',
        errorMessage: err?.message || 'Lỗi kết nối máy chủ Google Sheets',
      }));
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time Auto Sync Interval
  useEffect(() => {
    if (autoSyncInterval <= 0) return;
    const intervalId = setInterval(() => {
      loadData(true);
    }, autoSyncInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoSyncInterval, loadData]);

  // Extract filter options dynamically from current records
  const fieldOptions = useMemo(() => {
    const set = new Set<string>();
    quanLyDonThu.forEach((d) => d.linhVuc && set.add(d.linhVuc.trim()));
    tiepCongDan.forEach((t) => t.linhVuc && set.add(t.linhVuc.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [quanLyDonThu, tiepCongDan]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    quanLyDonThu.forEach((d) => d.loaiDon && set.add(d.loaiDon.trim()));
    tiepCongDan.forEach((t) => t.phanLoaiVuViec && set.add(t.phanLoaiVuViec.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [quanLyDonThu, tiepCongDan]);

  const officerOptions = useMemo(() => {
    const set = new Set<string>();
    quanLyDonThu.forEach((d) => d.canBoThamMuu && set.add(d.canBoThamMuu.trim()));
    tiepCongDan.forEach((t) => t.canBoTheoDoi && set.add(t.canBoTheoDoi.trim()));
    tienDo.forEach((td) => td.nguoiThucHien && set.add(td.nguoiThucHien.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [quanLyDonThu, tiepCongDan, tienDo]);

  const neighborhoodOptions = useMemo(() => {
    const set = new Set<string>();
    quanLyDonThu.forEach((d) => set.add(extractToDanPho(d.diaChi)));
    tiepCongDan.forEach((t) => set.add(extractToDanPho(t.diaChi)));
    return Array.from(set).filter(Boolean).sort();
  }, [quanLyDonThu, tiepCongDan]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.linhVuc !== 'all') count++;
    if (filters.loaiDon !== 'all') count++;
    if (filters.trangThai !== 'all') count++;
    if (filters.tinhTrangHan !== 'all') count++;
    if (filters.canBo !== 'all') count++;
    if (filters.toDanPho !== 'all') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      dateRange: 'all',
      linhVuc: 'all',
      loaiDon: 'all',
      trangThai: 'all',
      tinhTrangHan: 'all',
      hinhThuc: 'all',
      canBo: 'all',
      toDanPho: 'all',
    });
  };

  // Advanced Multi-Keyword Search Matcher (Accented & Non-Accented Vietnamese)
  const matchesSearch = useCallback((text: string, query: string): boolean => {
    if (!query || !query.trim()) return true;
    const rawText = (text || '').toLowerCase();
    const normalizedText = removeVietnameseTones(text || '');
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return words.every((word) => {
      const normalizedWord = removeVietnameseTones(word);
      return rawText.includes(word) || normalizedText.includes(normalizedWord);
    });
  }, []);

  // Date Checker Helper
  const checkDateInRange = useCallback((dateStr?: string) => {
    if (!dateStr || filters.dateRange === 'all') return true;
    const date = parseDateVN(dateStr);
    if (!date) return true;

    const now = new Date();
    if (filters.dateRange === 'today') {
      return date.toDateString() === now.toDateString();
    }
    if (filters.dateRange === 'this_month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (filters.dateRange === 'this_quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const itemQuarter = Math.floor(date.getMonth() / 3);
      return currentQuarter === itemQuarter && date.getFullYear() === now.getFullYear();
    }
    if (filters.dateRange === 'this_year') {
      return date.getFullYear() === 2026 || date.getFullYear() === now.getFullYear();
    }
    if (filters.dateRange === 'custom') {
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        if (date < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (date > end) return false;
      }
      return true;
    }
    return true;
  }, [filters.dateRange, filters.startDate, filters.endDate]);

  // Filtered Datasets with Exact & Real-time Matching
  const filteredTiepCongDan = useMemo(() => {
    return tiepCongDan.filter((item) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const fullText = [
          item.maLuotTiep,
          item.hoTen,
          item.cccd,
          item.soDienThoai,
          item.diaChi,
          item.noiDung,
          item.nguoiChuTri,
          item.canBoTheoDoi,
          item.maDonLienQuan,
          item.linhVuc,
          item.phanLoaiVuViec,
          item.ketQuaTiep,
          item.huongXuLy,
        ].join(' ');
        if (!matchesSearch(fullText, filters.searchQuery)) return false;
      }

      // 2. Date
      if (!checkDateInRange(item.ngayTiep)) return false;

      // 3. Field
      if (filters.linhVuc !== 'all') {
        const target = filters.linhVuc.toLowerCase().trim();
        if (!item.linhVuc?.toLowerCase().includes(target)) return false;
      }

      // 4. Type
      if (filters.loaiDon !== 'all') {
        const target = filters.loaiDon.toLowerCase().trim();
        if (!item.phanLoaiVuViec?.toLowerCase().includes(target)) return false;
      }

      // 5. Neighborhood
      if (filters.toDanPho !== 'all') {
        const tdp = extractToDanPho(item.diaChi);
        if (tdp !== filters.toDanPho && !item.diaChi?.toLowerCase().includes(filters.toDanPho.toLowerCase())) return false;
      }

      // 6. Officer
      if (filters.canBo !== 'all') {
        const cb = filters.canBo.toLowerCase().trim();
        const fullOfficers = `${item.canBoTheoDoi || ''} ${item.nguoiChuTri || ''}`.toLowerCase();
        if (!fullOfficers.includes(cb)) return false;
      }

      return true;
    });
  }, [tiepCongDan, filters, matchesSearch, checkDateInRange]);

  const filteredQuanLyDonThu = useMemo(() => {
    return quanLyDonThu.filter((item) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const fullText = [
          item.maDon,
          item.soDen,
          item.hoTen,
          item.cccd,
          item.soDienThoai,
          item.diaChi,
          item.noiDungTomTat,
          item.canBoThamMuu,
          item.linhVuc,
          item.loaiDon,
          item.ketQuaCuoiCung,
          item.trangThaiHoSo,
          item.tinhTrangQuaHan,
          item.coQuanThamQuyen,
          item.soVanBanXuLy,
        ].join(' ');
        if (!matchesSearch(fullText, filters.searchQuery)) return false;
      }

      // 2. Date
      if (!checkDateInRange(item.ngayNhanDon)) return false;

      // 3. Field
      if (filters.linhVuc !== 'all') {
        const target = filters.linhVuc.toLowerCase().trim();
        if (!item.linhVuc?.toLowerCase().includes(target)) return false;
      }

      // 4. Type
      if (filters.loaiDon !== 'all') {
        const target = filters.loaiDon.toLowerCase().trim();
        if (!item.loaiDon?.toLowerCase().includes(target)) return false;
      }

      // 5. Status
      if (filters.trangThai !== 'all') {
        const st = item.trangThaiHoSo.toLowerCase();
        if (filters.trangThai === 'Đã giải quyết' && !st.includes('đã giải quyết') && !st.includes('hoàn thành')) return false;
        if (filters.trangThai === 'Đang giải quyết' && !st.includes('đang') && !st.includes('thụ lý')) return false;
      }

      // 6. Deadline status (Normalized for both Vietnamese and code values)
      if (filters.tinhTrangHan !== 'all') {
        const h = filters.tinhTrangHan.toLowerCase();
        const itemH = item.tinhTrangQuaHan.toLowerCase();
        const overdueDays = parseInt(item.soNgayQuaHan || '0', 10);
        if (h === 'quá hạn' || h === 'quahan') {
          if (!itemH.includes('quá hạn') && overdueDays <= 0) return false;
        } else if (h === 'đúng hạn' || h === 'dunghan') {
          if (!itemH.includes('đúng hạn') && !itemH.includes('trong hạn')) return false;
        } else if (h === 'trong hạn' || h === 'tronghan') {
          if (!itemH.includes('trong hạn') && !itemH.includes('đang')) return false;
        } else if (h === 'sắp đến hạn' || h === 'sapdenhan') {
          if (!itemH.includes('sắp đến hạn') && !itemH.includes('≤24')) return false;
        }
      }

      // 7. Neighborhood
      if (filters.toDanPho !== 'all') {
        const tdp = extractToDanPho(item.diaChi);
        if (tdp !== filters.toDanPho && !item.diaChi?.toLowerCase().includes(filters.toDanPho.toLowerCase())) return false;
      }

      // 8. Officer
      if (filters.canBo !== 'all') {
        const cb = filters.canBo.toLowerCase().trim();
        if (!item.canBoThamMuu?.toLowerCase().includes(cb)) return false;
      }

      return true;
    });
  }, [quanLyDonThu, filters, matchesSearch, checkDateInRange]);

  const filteredTienDo = useMemo(() => {
    return tienDo.filter((item) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const fullText = [
          item.maTienDo,
          item.maDon,
          item.buocXuLy,
          item.noiDungCongViec,
          item.nguoiThucHien,
          item.coQuanThucHien,
          item.vanBanLienQuan,
          item.nguoiGuiDon,
          item.loaiDon,
          item.canhBaoTienDo,
        ].join(' ');
        if (!matchesSearch(fullText, filters.searchQuery)) return false;
      }

      // 2. Deadline status
      if (filters.tinhTrangHan !== 'all') {
        const h = filters.tinhTrangHan.toLowerCase();
        const cb = item.canhBaoTienDo.toUpperCase();
        if (h === 'quá hạn' || h === 'quahan') {
          if (!cb.includes('QUÁ HẠN')) return false;
        } else if (h === 'sắp đến hạn' || h === 'sapdenhan') {
          if (!cb.includes('SẮP ĐẾN HẠN') && !cb.includes('≤24')) return false;
        } else if (h === 'trong hạn' || h === 'tronghan') {
          if (!cb.includes('TRONG HẠN') && !cb.includes('HOÀN THÀNH')) return false;
        } else if (h === 'đúng hạn' || h === 'dunghan') {
          if (!cb.includes('HOÀN THÀNH') && !cb.includes('TRONG HẠN')) return false;
        }
      }

      // 3. Officer
      if (filters.canBo !== 'all') {
        const cb = filters.canBo.toLowerCase().trim();
        if (!item.nguoiThucHien?.toLowerCase().includes(cb)) return false;
      }

      // 4. Type
      if (filters.loaiDon !== 'all') {
        const target = filters.loaiDon.toLowerCase().trim();
        if (!item.loaiDon?.toLowerCase().includes(target)) return false;
      }

      return true;
    });
  }, [tienDo, filters, matchesSearch]);

  // Handler for quick summary card clicks
  const handleSummaryCardFilter = (type: string, value: string) => {
    if (type === 'tab') {
      setActiveTab(value as ActiveTab);
    } else if (type === 'trangThai') {
      setFilters((prev) => ({ ...prev, trangThai: value }));
    } else if (type === 'tinhTrangHan') {
      setFilters((prev) => ({ ...prev, tinhTrangHan: value }));
    } else if (type === 'linhVuc') {
      setFilters((prev) => ({ ...prev, linhVuc: value }));
    } else if (type === 'loaiDon') {
      setFilters((prev) => ({ ...prev, loaiDon: value }));
    }
  };

  const handleFilterByField = (field: string) => {
    setFilters((prev) => ({ ...prev, linhVuc: field }));
  };

  const handleFilterByType = (type: string) => {
    setFilters((prev) => ({ ...prev, loaiDon: type }));
  };

  const getMainBgClass = () => {
    if (themeMode === 'ceremonial') return 'bg-[#150508] text-slate-100';
    if (themeMode === 'command_center') return 'bg-slate-950 text-slate-100';
    return 'bg-slate-100 text-slate-900';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${getMainBgClass()}`}>
      {/* Header Bar with Live Sync, Themes & Controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        syncState={syncState}
        onRefresh={() => loadData(false)}
        autoSyncInterval={autoSyncInterval}
        setAutoSyncInterval={setAutoSyncInterval}
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        isDenseMode={isDenseMode}
        setIsDenseMode={setIsDenseMode}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenTvPresentation={() => setIsTvPresentationOpen(true)}
        totalRecords={{
          tiepCongDan: filteredTiepCongDan.length,
          quanLyDonThu: filteredQuanLyDonThu.length,
          tienDo: filteredTienDo.length,
        }}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className={`max-w-7xl mx-auto ${
        isDenseMode ? 'px-3 sm:px-4 lg:px-6 py-3 space-y-3' : 'px-4 sm:px-6 lg:px-8 py-6 space-y-6'
      } flex-1 w-full transition-all`}>
        {/* Loading Spinner for Initial Render */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="w-10 h-10 text-red-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-400">
              Đang nạp và đồng bộ dữ liệu Tiếp công dân & Đơn thư từ Google Sheets...
            </p>
          </div>
        ) : (
          <>
            {/* Global Smart Filter Bar (Shown on all tabs except Official Report) */}
            {activeTab !== 'bao-cao' && (
              <SmartFilterBar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                fieldOptions={fieldOptions}
                typeOptions={typeOptions}
                officerOptions={officerOptions}
                neighborhoodOptions={neighborhoodOptions}
                activeFilterCount={activeFilterCount}
                isDenseMode={isDenseMode}
                resultsCount={{
                  donThu: filteredQuanLyDonThu.length,
                  tiepCongDan: filteredTiepCongDan.length,
                  tienDo: filteredTienDo.length,
                  total: filteredQuanLyDonThu.length + filteredTiepCongDan.length + filteredTienDo.length,
                }}
              />
            )}

            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className={isDenseMode ? 'space-y-3' : 'space-y-6'}>
                {/* Executive KPI Metric Cards */}
                <SummaryCards
                  tiepCongDan={filteredTiepCongDan}
                  quanLyDonThu={filteredQuanLyDonThu}
                  tienDo={filteredTienDo}
                  onSelectFilter={handleSummaryCardFilter}
                  themeMode={themeMode}
                  isHighContrast={isHighContrast}
                  isDenseMode={isDenseMode}
                />

                {/* Analytical Charts */}
                <AnalyticsCharts
                  tiepCongDan={filteredTiepCongDan}
                  quanLyDonThu={filteredQuanLyDonThu}
                  tienDo={filteredTienDo}
                  onFilterField={handleFilterByField}
                  onFilterType={handleFilterByType}
                  themeMode={themeMode}
                  isHighContrast={isHighContrast}
                  isDenseMode={isDenseMode}
                />

                {/* Quick Snapshot Table: Recent Complaints */}
                <div className={isDenseMode ? 'space-y-2' : 'space-y-4'}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Hồ Sơ Đơn Thư & Tiếp Công Dân Mới Nhất</span>
                      </h3>
                      <p className="text-xs text-slate-500">Xem nhanh danh sách giải quyết trên địa bàn</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('quan-ly-don-thu')}
                      className="text-xs font-semibold text-red-700 hover:text-red-800 dark:text-red-400 hover:underline"
                    >
                      Xem toàn bộ {filteredQuanLyDonThu.length} hồ sơ &rarr;
                    </button>
                  </div>

                  <ComplaintPetitionsTable
                    data={filteredQuanLyDonThu}
                    isPrivacyMode={isPrivacyMode}
                    onSelectRecord={(rec) => setSelectedRecord(rec)}
                    searchQuery={filters.searchQuery}
                    isHighContrast={isHighContrast}
                    isDenseMode={isDenseMode}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: TIẾP CÔNG DÂN */}
            {activeTab === 'tiep-cong-dan' && (
              <div className={isDenseMode ? 'space-y-2' : 'space-y-4'}>
                <CitizenReceptionTable
                  data={filteredTiepCongDan}
                  isPrivacyMode={isPrivacyMode}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  searchQuery={filters.searchQuery}
                  isHighContrast={isHighContrast}
                  isDenseMode={isDenseMode}
                />
              </div>
            )}

            {/* TAB 3: QUẢN LÝ ĐƠN THƯ */}
            {activeTab === 'quan-ly-don-thu' && (
              <div className={isDenseMode ? 'space-y-2' : 'space-y-4'}>
                <ComplaintPetitionsTable
                  data={filteredQuanLyDonThu}
                  isPrivacyMode={isPrivacyMode}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  searchQuery={filters.searchQuery}
                  isHighContrast={isHighContrast}
                  isDenseMode={isDenseMode}
                />
              </div>
            )}

            {/* TAB 4: THEO DÕI TIẾN ĐỘ & HẠN CHÓT */}
            {activeTab === 'tien-do' && (
              <div className={isDenseMode ? 'space-y-2' : 'space-y-4'}>
                <ProgressTrackerView
                  data={filteredTienDo}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  searchQuery={filters.searchQuery}
                  isHighContrast={isHighContrast}
                  isDenseMode={isDenseMode}
                />
              </div>
            )}

            {/* TAB 5: VĂN BẢN BÁO CÁO CHUẨN */}
            {activeTab === 'bao-cao' && (
              <div className={isDenseMode ? 'space-y-2' : 'space-y-4'}>
                <OfficialReportView
                  tiepCongDan={filteredTiepCongDan}
                  quanLyDonThu={filteredQuanLyDonThu}
                  tienDo={filteredTienDo}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-xs mt-auto transition-colors duration-300 ${
        themeMode === 'ceremonial'
          ? 'bg-[#180609] border-amber-950/60 text-slate-400'
          : themeMode === 'command_center'
          ? 'bg-slate-950 border-slate-850 text-slate-400 border-t-slate-800'
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className={`font-semibold ${themeMode === 'standard_office' ? 'text-slate-800' : 'text-amber-200'}`}>
              ỦY BAN NHÂN DÂN PHƯỜNG TRÀ CÂU
            </span>
            <span>• Hệ thống Giám sát & Quản trị Thông minh</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Dữ liệu nguồn: Google Sheets</span>
            <span>•</span>
            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-medium"
            >
              Mở Trang Tính Trực Tiếp
            </a>
          </div>
        </div>
      </footer>

      {/* Settings & Colorblind Accessibility Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        isDenseMode={isDenseMode}
        setIsDenseMode={setIsDenseMode}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        showOverdueAlert={showOverdueAlert}
        setShowOverdueAlert={setShowOverdueAlert}
        toastPosition={toastPosition}
        setToastPosition={setToastPosition}
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        autoSyncInterval={autoSyncInterval}
        setAutoSyncInterval={setAutoSyncInterval}
        onManualSync={() => loadData(false)}
        syncState={syncState}
      />

      {/* Comprehensive Linked Dossier Modal */}
      <RecordDetailModal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        selectedItem={selectedRecord}
        tiepCongDan={tiepCongDan}
        quanLyDonThu={quanLyDonThu}
        tienDo={tienDo}
        isPrivacyMode={isPrivacyMode}
      />

      {/* Official Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        tiepCongDan={filteredTiepCongDan}
        quanLyDonThu={filteredQuanLyDonThu}
        tienDo={filteredTienDo}
      />

      {/* TV Presentation & Big Screen Slideshow Mode */}
      <TvPresentationView
        isOpen={isTvPresentationOpen}
        onClose={() => setIsTvPresentationOpen(false)}
        tiepCongDan={filteredTiepCongDan}
        quanLyDonThu={filteredQuanLyDonThu}
        tienDo={filteredTienDo}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        lastSyncedAt={syncState.lastSyncedAt}
      />

      {/* Floating Toast Notification for Overdue Dossiers on Data Load (Controlled by showOverdueAlert) */}
      {showOverdueAlert && toast && toast.show && (
        <div
          id="toast-overdue-notification"
          className={`fixed z-50 max-w-md w-[calc(100%-2.5rem)] sm:w-[420px] rounded-2xl shadow-2xl border p-4 transition-all duration-300 ${
            toastPosition === 'top-right'
              ? 'top-5 right-5 animate-in slide-in-from-top-6 fade-in'
              : 'bottom-5 right-5 animate-in slide-in-from-bottom-6 fade-in'
          } ${
            toast.type === 'warning'
              ? 'bg-slate-900/95 text-white border-rose-500/80 ring-2 ring-rose-500/30'
              : 'bg-slate-900/95 text-white border-emerald-500/80 ring-2 ring-emerald-500/30'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${
              toast.type === 'warning'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 animate-pulse text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                  <span>{toast.title}</span>
                </h4>
                <button
                  id="btn-close-toast"
                  onClick={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Đóng thông báo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>

              {toast.totalOverdue > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    id="btn-toast-view-overdue"
                    onClick={() => {
                      setActiveTab('quan-ly-don-thu');
                      setFilters((prev) => ({
                        ...prev,
                        tinhTrangHan: 'quahan',
                      }));
                      setToast((prev) => (prev ? { ...prev, show: false } : null));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    <span>Xem {toast.totalOverdue} hồ sơ quá hạn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('tien-do');
                      setToast((prev) => (prev ? { ...prev, show: false } : null));
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <span>Tiến độ chi tiết</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
