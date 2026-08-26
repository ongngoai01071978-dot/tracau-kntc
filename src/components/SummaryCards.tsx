import React from 'react';
import {
  Users,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { CitizenReception, ComplaintPetition, ProgressStep, ThemeMode } from '../types';

interface SummaryCardsProps {
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  onSelectFilter?: (type: string, value: string) => void;
  themeMode?: ThemeMode;
  isHighContrast?: boolean;
  isDenseMode?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  tiepCongDan,
  quanLyDonThu,
  tienDo,
  onSelectFilter,
  themeMode = 'ceremonial',
  isHighContrast = false,
  isDenseMode = false,
}) => {
  // Calculations
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

  // Check urgent warnings from Tien Do
  const tdSapDenHan = tienDo.filter((td) => td.canhBaoTienDo.includes('SẮP ĐẾN HẠN') || td.canhBaoTienDo.includes('≤24')).length;
  const tdQuaHan = tienDo.filter((td) => td.canhBaoTienDo.includes('QUÁ HẠN')).length;
  const tyLeDungHan = totalDon > 0 ? (((totalDon - donQuaHan) / totalDon) * 100).toFixed(1) : '100';

  const getCardBg = () => {
    if (themeMode === 'ceremonial') {
      return 'bg-gradient-to-b from-[#250e12] to-[#1a080a] border border-amber-900/40 text-slate-100 shadow-md hover:border-amber-500/50';
    }
    if (themeMode === 'command_center') {
      return 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg hover:border-cyan-500/50';
    }
    return 'bg-white border border-slate-200 text-slate-900 shadow-sm hover:border-red-300';
  };

  const getSubBoxBg = () => {
    if (themeMode === 'ceremonial') {
      return 'bg-[#351319]/80 text-amber-100/90 border border-amber-900/30';
    }
    if (themeMode === 'command_center') {
      return 'bg-slate-950/80 text-slate-200 border border-slate-800';
    }
    return 'bg-slate-50 text-slate-700 border border-slate-100';
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${isDenseMode ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
      {/* Card 1: Tiếp công dân */}
      <div
        id="card-summary-tcd"
        onClick={() => onSelectFilter && onSelectFilter('tab', 'tiep-cong-dan')}
        className={`rounded-xl transition-all cursor-pointer group hover:scale-[1.01] ${
          isDenseMode ? 'p-3' : 'p-4'
        } ${getCardBg()}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            themeMode === 'ceremonial' ? 'text-amber-300' : themeMode === 'command_center' ? 'text-cyan-300' : 'text-slate-500'
          }`}>
            Tiếp Công Dân
          </span>
          <div className={`rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
            isDenseMode ? 'w-7 h-7' : 'w-9 h-9'
          } ${
            themeMode === 'ceremonial'
              ? 'bg-red-900/60 text-amber-300 border border-amber-500/30'
              : themeMode === 'command_center'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            <Users className={isDenseMode ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        </div>
        <div className={`${isDenseMode ? 'mt-1' : 'mt-2'} flex items-baseline gap-2`}>
          <span className={`font-extrabold ${isDenseMode ? 'text-xl sm:text-2xl' : 'text-2xl'} ${
            themeMode === 'ceremonial' ? 'text-amber-100' : themeMode === 'command_center' ? 'text-white' : 'text-slate-900'
          }`}>
            {totalTcd}
          </span>
          <span className="text-xs text-slate-400 font-medium">lượt tiếp</span>
        </div>
        <div className={`${isDenseMode ? 'mt-2 pt-2' : 'mt-3 pt-3'} border-t border-slate-200/20 grid grid-cols-3 gap-1 text-[11px] text-center`}>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className="opacity-75">Định kỳ</div>
            <div className="font-bold">{tcdDinhKy}</div>
          </div>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className="opacity-75">Thường xuyên</div>
            <div className="font-bold">{tcdThuongXuyen}</div>
          </div>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className="opacity-75">Đột xuất</div>
            <div className="font-bold">{tcdDotXuat}</div>
          </div>
        </div>
      </div>

      {/* Card 2: Tổng số đơn tiếp nhận */}
      <div
        id="card-summary-don"
        onClick={() => onSelectFilter && onSelectFilter('tab', 'quan-ly-don-thu')}
        className={`rounded-xl transition-all cursor-pointer group hover:scale-[1.01] ${
          isDenseMode ? 'p-3' : 'p-4'
        } ${getCardBg()}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            themeMode === 'ceremonial' ? 'text-amber-300' : themeMode === 'command_center' ? 'text-blue-300' : 'text-slate-500'
          }`}>
            Tổng Số Đơn Nhận
          </span>
          <div className={`rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
            isDenseMode ? 'w-7 h-7' : 'w-9 h-9'
          } ${
            themeMode === 'ceremonial'
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
              : themeMode === 'command_center'
              ? 'bg-blue-950 text-blue-300 border border-blue-800'
              : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            <FileSpreadsheet className={isDenseMode ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        </div>
        <div className={`${isDenseMode ? 'mt-1' : 'mt-2'} flex items-baseline gap-2`}>
          <span className={`font-extrabold ${isDenseMode ? 'text-xl sm:text-2xl' : 'text-2xl'} ${
            themeMode === 'ceremonial' ? 'text-amber-100' : themeMode === 'command_center' ? 'text-white' : 'text-slate-900'
          }`}>
            {totalDon}
          </span>
          <span className="text-xs text-slate-400 font-medium">hồ sơ đơn</span>
        </div>
        <div className={`${isDenseMode ? 'mt-2 pt-2' : 'mt-3 pt-3'} border-t border-slate-200/20 grid grid-cols-3 gap-1 text-[11px] text-center`}>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className={`${isHighContrast ? 'text-amber-500 font-bold' : 'text-rose-500 font-medium'}`}>Khiếu nại</div>
            <div className="font-bold">{donKhieuNai}</div>
          </div>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className={`${isHighContrast ? 'text-blue-400 font-bold' : 'text-purple-400 font-medium'}`}>Tố cáo</div>
            <div className="font-bold">{donToCao}</div>
          </div>
          <div className={`rounded p-1 ${getSubBoxBg()}`}>
            <div className={`${isHighContrast ? 'text-sky-400 font-bold' : 'text-emerald-400 font-medium'}`}>Kiến nghị</div>
            <div className="font-bold">{donKienNghi}</div>
          </div>
        </div>
      </div>

      {/* Card 3: Tỷ lệ giải quyết */}
      <div
        id="card-summary-resolve-rate"
        className={`rounded-xl transition-all shadow-sm ${
          isDenseMode ? 'p-3' : 'p-4'
        } ${getCardBg()}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isHighContrast
              ? 'text-blue-300'
              : themeMode === 'ceremonial'
              ? 'text-amber-300'
              : themeMode === 'command_center'
              ? 'text-emerald-300'
              : 'text-slate-500'
          }`}>
            Kết Quả Giải Quyết
          </span>
          <div className={`rounded-lg flex items-center justify-center ${
            isDenseMode ? 'w-7 h-7' : 'w-9 h-9'
          } ${
            isHighContrast
              ? 'bg-blue-950/80 text-blue-300 border border-blue-500/60'
              : themeMode === 'ceremonial'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              : themeMode === 'command_center'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            <CheckCircle className={isDenseMode ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        </div>
        <div className={`${isDenseMode ? 'mt-1' : 'mt-2'} flex items-baseline justify-between`}>
          <div className="flex items-baseline gap-1.5">
            <span className={`font-extrabold ${isDenseMode ? 'text-xl sm:text-2xl' : 'text-2xl'} ${
              isHighContrast
                ? 'text-blue-300'
                : themeMode === 'ceremonial'
                ? 'text-emerald-300'
                : themeMode === 'command_center'
                ? 'text-emerald-400'
                : 'text-emerald-600'
            }`}>
              {tyLeGiaiQuyet}%
            </span>
            <span className="text-xs text-slate-400 font-medium">hoàn thành</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isHighContrast
              ? 'bg-blue-950 text-blue-200 border border-blue-600'
              : themeMode === 'standard_office'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
          }`}>
            {donDaGiaiQuyet}/{totalDon}
          </span>
        </div>
        <div className={isDenseMode ? 'mt-2' : 'mt-3'}>
          <div className={`w-full rounded-full h-2 overflow-hidden ${
            themeMode === 'standard_office' ? 'bg-slate-100' : 'bg-slate-800'
          }`}>
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                isHighContrast ? 'bg-blue-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${tyLeGiaiQuyet}%` }}
            ></div>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Đã giải quyết: <strong className={isHighContrast ? 'text-blue-400 font-bold' : 'text-emerald-400'}>{donDaGiaiQuyet}</strong></span>
            <span>Đang giải quyết: <strong className="text-blue-400">{donDangGiaiQuyet}</strong></span>
          </div>
        </div>
      </div>

      {/* Card 4: Tình trạng tiến độ & Cảnh báo hạn */}
      <div
        id="card-summary-overdue"
        onClick={() => onSelectFilter && onSelectFilter('tab', 'tien-do')}
        className={`rounded-xl transition-all cursor-pointer group hover:scale-[1.01] ${
          isDenseMode ? 'p-3' : 'p-4'
        } ${
          donQuaHan > 0 || tdQuaHan > 0
            ? isHighContrast
              ? 'bg-gradient-to-b from-amber-950/90 to-slate-950 border-2 border-amber-500 text-slate-100 shadow-lg'
              : themeMode === 'ceremonial'
              ? 'bg-gradient-to-b from-rose-950/80 to-[#1a080a] border border-rose-600/60 text-slate-100 shadow-md'
              : themeMode === 'command_center'
              ? 'bg-rose-950/40 border border-rose-600/70 text-slate-100 shadow-lg'
              : 'bg-rose-50/60 border border-rose-300 text-slate-900 shadow-sm'
            : getCardBg()
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isHighContrast
              ? 'text-amber-400'
              : themeMode === 'ceremonial'
              ? 'text-amber-300'
              : themeMode === 'command_center'
              ? 'text-amber-300'
              : 'text-slate-500'
          }`}>
            Tiến Độ & Hạn Chót
          </span>
          <div className={`rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
            isDenseMode ? 'w-7 h-7' : 'w-9 h-9'
          } ${
            donQuaHan > 0 || tdQuaHan > 0
              ? isHighContrast
                ? 'bg-amber-500 text-slate-950 border border-amber-300 animate-pulse font-bold'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/60 animate-pulse'
              : isHighContrast
              ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
              : themeMode === 'ceremonial'
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800'
          }`}>
            {donQuaHan > 0 || tdQuaHan > 0 ? (
              <Flame className={`${isDenseMode ? 'w-4 h-4' : 'w-5 h-5'} ${isHighContrast ? 'text-slate-950' : 'text-rose-400'} animate-bounce`} />
            ) : (
              <ShieldCheck className={`${isDenseMode ? 'w-4 h-4' : 'w-5 h-5'} ${isHighContrast ? 'text-blue-400' : 'text-emerald-400'}`} />
            )}
          </div>
        </div>
        <div className={`${isDenseMode ? 'mt-1' : 'mt-2'} flex items-baseline gap-2`}>
          <span className={`font-extrabold ${isDenseMode ? 'text-xl sm:text-2xl' : 'text-2xl'} ${
            donQuaHan > 0
              ? isHighContrast
                ? 'text-amber-400'
                : 'text-rose-400'
              : themeMode === 'ceremonial'
              ? 'text-amber-200'
              : themeMode === 'command_center'
              ? 'text-cyan-300'
              : 'text-slate-900'
          }`}>
            {donQuaHan}
          </span>
          <span className="text-xs text-slate-400 font-medium">đơn quá hạn</span>
          <span className="ml-auto text-xs font-medium text-slate-400">
            Đúng hạn: <strong className={isHighContrast ? 'text-blue-400 font-bold' : 'text-emerald-400'}>{tyLeDungHan}%</strong>
          </span>
        </div>
        <div className={`${isDenseMode ? 'mt-2 pt-2' : 'mt-3 pt-3'} border-t border-slate-200/20 grid grid-cols-2 gap-2 text-[11px]`}>
          <div className={`rounded p-1 text-center font-medium ${
            tdSapDenHan > 0
              ? 'bg-amber-950/60 border border-amber-600/50 text-amber-300'
              : getSubBoxBg()
          }`}>
            Sắp đến hạn (≤24h): <span className="font-bold text-amber-400">{tdSapDenHan}</span>
          </div>
          <div className={`rounded p-1 text-center font-medium ${getSubBoxBg()}`}>
            Đang trong hạn: <span className="font-bold text-blue-400">{totalDon - donDaGiaiQuyet - donQuaHan}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

