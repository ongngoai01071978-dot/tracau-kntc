import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { CitizenReception, ComplaintPetition, ProgressStep, ThemeMode } from '../types';
import { extractToDanPho } from '../utils/formatters';

interface AnalyticsChartsProps {
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  onFilterField?: (field: string) => void;
  onFilterType?: (type: string) => void;
  themeMode?: ThemeMode;
  isHighContrast?: boolean;
  isDenseMode?: boolean;
}

const COLORS_TYPE = ['#2563eb', '#9333ea', '#059669', '#d97706'];
const COLORS_TYPE_HIGH_CONTRAST = ['#1d4ed8', '#f59e0b', '#0284c7', '#ea580c', '#3b82f6'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  tiepCongDan,
  quanLyDonThu,
  tienDo,
  onFilterField,
  onFilterType,
  themeMode = 'ceremonial',
  isHighContrast = false,
  isDenseMode = false,
}) => {
  // 1. Phân loại đơn thư (Khiếu nại, Tố cáo, Kiến nghị...)
  const typeMap: Record<string, number> = {};
  quanLyDonThu.forEach((d) => {
    const key = d.loaiDon.trim() || 'Chưa phân loại';
    typeMap[key] = (typeMap[key] || 0) + 1;
  });
  const dataByType = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // 2. Lĩnh vực (Đất đai, Chính sách, Hành chính...)
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
  const dataByField = Object.entries(fieldMap).map(([linhVuc, counts]) => ({
    linhVuc,
    'Đơn thư': counts.don,
    'Lượt tiếp CD': counts.tcd,
    total: counts.don + counts.tcd,
  })).sort((a, b) => b.total - a.total);

  // 3. Xu hướng theo tháng (Tháng 1 -> Tháng 12)
  const monthMap: Record<string, { monthName: string; don: number; tcd: number; daGiaiQuyet: number }> = {};
  for (let m = 1; m <= 12; m++) {
    const key = `Tháng ${m}`;
    monthMap[key] = { monthName: key, don: 0, tcd: 0, daGiaiQuyet: 0 };
  }

  quanLyDonThu.forEach((d) => {
    if (d.ngayNhanDon && d.ngayNhanDon.includes('/')) {
      const parts = d.ngayNhanDon.split('/');
      const m = parseInt(parts[1], 10);
      if (m >= 1 && m <= 12) {
        const key = `Tháng ${m}`;
        monthMap[key].don += 1;
        if (d.trangThaiHoSo.includes('Đã giải quyết')) {
          monthMap[key].daGiaiQuyet += 1;
        }
      }
    }
  });

  tiepCongDan.forEach((t) => {
    if (t.ngayTiep && t.ngayTiep.includes('/')) {
      const parts = t.ngayTiep.split('/');
      const m = parseInt(parts[1], 10);
      if (m >= 1 && m <= 12) {
        const key = `Tháng ${m}`;
        monthMap[key].tcd += 1;
      }
    }
  });

  const dataByMonth = Object.values(monthMap).filter((item) => item.don > 0 || item.tcd > 0);

  // 4. Phân bố theo Tổ dân phố
  const tdpMap: Record<string, number> = {};
  quanLyDonThu.forEach((d) => {
    const tdp = extractToDanPho(d.diaChi);
    tdpMap[tdp] = (tdpMap[tdp] || 0) + 1;
  });
  const dataByTdp = Object.entries(tdpMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const getCardClasses = () => {
    if (themeMode === 'ceremonial') {
      return 'bg-[#220d11] border border-amber-900/40 text-slate-100 shadow-md';
    }
    if (themeMode === 'command_center') {
      return 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg';
    }
    return 'bg-white border border-slate-200 text-slate-900 shadow-sm';
  };

  const getHeadingColor = () => {
    if (themeMode === 'ceremonial') return 'text-amber-200';
    if (themeMode === 'command_center') return 'text-white';
    return 'text-slate-900';
  };

  const getTooltipStyle = () => {
    if (themeMode === 'standard_office') {
      return { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };
    }
    if (themeMode === 'ceremonial') {
      return { backgroundColor: '#1c080b', borderColor: '#b45309', color: '#fef3c7', borderRadius: '8px', fontSize: '12px' };
    }
    return { backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' };
  };

  const gridStroke = themeMode === 'standard_office' ? '#e2e8f0' : themeMode === 'ceremonial' ? '#451a20' : '#1e293b';
  const axisColor = themeMode === 'standard_office' ? '#64748b' : themeMode === 'ceremonial' ? '#fde68a' : '#94a3b8';

  // Select colors based on High Contrast / Colorblind mode
  const activePieColors = isHighContrast ? COLORS_TYPE_HIGH_CONTRAST : COLORS_TYPE;
  const barDonColor = isHighContrast ? '#1d4ed8' : '#dc2626'; // Deep Blue vs Red
  const barTcdColor = isHighContrast ? '#f59e0b' : '#2563eb'; // Vivid Amber vs Blue
  const areaDonStroke = isHighContrast ? '#1e40af' : '#3b82f6';
  const areaResolvedStroke = isHighContrast ? '#d97706' : '#10b981'; // Amber instead of Green
  const tdpBarFill = isHighContrast
    ? '#1d4ed8'
    : themeMode === 'ceremonial'
    ? '#d97706'
    : themeMode === 'command_center'
    ? '#06b6d4'
    : '#6366f1';

  const chartHeightClass = isDenseMode ? 'h-48 sm:h-52' : 'h-64';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 ${isDenseMode ? 'gap-3 sm:gap-4' : 'gap-6'}`}>
      {/* Chart 1: Cơ cấu loại đơn & Hình thức tiếp */}
      <div className={`rounded-xl ${isDenseMode ? 'p-3 sm:p-4' : 'p-5'} ${getCardClasses()}`}>
        <div className={`flex items-center justify-between ${isDenseMode ? 'mb-2' : 'mb-4'}`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${getHeadingColor()}`}>
              <span>Cơ Cấu Phân Loại Đơn Thư</span>
              {isHighContrast && (
                <span className="text-[10px] bg-blue-700 text-white px-1.5 py-0.2 rounded font-bold">
                  Trợ năng
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Tỷ lệ Khiếu nại, Tố cáo, Kiến nghị phản ánh</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
            isHighContrast
              ? 'bg-blue-900/60 text-blue-200 border-blue-500'
              : themeMode === 'standard_office'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-red-950/60 text-amber-300 border-amber-900/30'
          }`}>
            {quanLyDonThu.length} đơn
          </span>
        </div>
        <div className={`${chartHeightClass} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByType}
                cx="50%"
                cy="50%"
                innerRadius={isDenseMode ? 42 : 55}
                outerRadius={isDenseMode ? 68 : 85}
                paddingAngle={4}
                dataKey="value"
                onClick={(entry) => onFilterType && onFilterType(entry.name)}
                cursor="pointer"
              >
                {dataByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={activePieColors[index % activePieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`${val} đơn (${((val / (quanLyDonThu.length || 1)) * 100).toFixed(1)}%)`, 'Số lượng']}
                contentStyle={getTooltipStyle()}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span className={`text-xs ${themeMode === 'standard_office' ? 'text-slate-700' : 'text-slate-300'}`}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Phân bố theo Lĩnh vực */}
      <div className={`rounded-xl ${isDenseMode ? 'p-3 sm:p-4' : 'p-5'} lg:col-span-2 ${getCardClasses()}`}>
        <div className={`flex items-center justify-between ${isDenseMode ? 'mb-2' : 'mb-4'}`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${getHeadingColor()}`}>
              <span>Phân Bố Số Liệu Theo Lĩnh Vực Quản Lý</span>
              {isHighContrast && (
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                  Độ tương phản cao
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">So sánh số lượt tiếp công dân và hồ sơ đơn thư</p>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Nhấp cột để lọc theo lĩnh vực</span>
        </div>
        <div className={`${chartHeightClass} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByField}
              margin={{ top: 10, right: 10, left: -10, bottom: isDenseMode ? 15 : 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="linhVuc"
                tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Legend verticalAlign="top" align="right" />
              <Bar
                dataKey="Đơn thư"
                fill={barDonColor}
                radius={[4, 4, 0, 0]}
                onClick={(entry) => onFilterField && onFilterField(entry.linhVuc)}
                cursor="pointer"
              />
              <Bar
                dataKey="Lượt tiếp CD"
                fill={barTcdColor}
                radius={[4, 4, 0, 0]}
                onClick={(entry) => onFilterField && onFilterField(entry.linhVuc)}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Xu hướng tiếp nhận & giải quyết theo tháng */}
      <div className={`rounded-xl ${isDenseMode ? 'p-3 sm:p-4' : 'p-5'} lg:col-span-2 ${getCardClasses()}`}>
        <div className={`flex items-center justify-between ${isDenseMode ? 'mb-2' : 'mb-4'}`}>
          <div>
            <h3 className={`text-sm font-bold ${getHeadingColor()}`}>
              Diễn Biến Tiếp Công Dân & Giải Quyết Đơn Thư Theo Thời Gian
            </h3>
            <p className="text-xs text-slate-400">Xu hướng hồ sơ phát sinh và tiến độ xử lý hàng tháng</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className={`flex items-center gap-1 ${isHighContrast ? 'text-blue-400' : 'text-blue-500'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-blue-600' : 'bg-blue-500'}`}></span> Đơn nhận
            </span>
            <span className={`flex items-center gap-1 ${isHighContrast ? 'text-amber-400' : 'text-emerald-500'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-amber-500' : 'bg-emerald-500'}`}></span> Đã giải quyết
            </span>
          </div>
        </div>
        <div className={`${chartHeightClass} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isHighContrast ? '#1d4ed8' : '#3b82f6'} stopOpacity={isHighContrast ? 0.6 : 0.4} />
                  <stop offset="95%" stopColor={isHighContrast ? '#1d4ed8' : '#3b82f6'} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isHighContrast ? '#f59e0b' : '#10b981'} stopOpacity={isHighContrast ? 0.6 : 0.4} />
                  <stop offset="95%" stopColor={isHighContrast ? '#f59e0b' : '#10b981'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="monthName" tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }} />
              <YAxis tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Area
                type="monotone"
                dataKey="don"
                stroke={areaDonStroke}
                fillOpacity={1}
                fill="url(#colorDon)"
                name="Đơn tiếp nhận"
                strokeWidth={isHighContrast ? 3 : 2}
              />
              <Area
                type="monotone"
                dataKey="daGiaiQuyet"
                stroke={areaResolvedStroke}
                fillOpacity={1}
                fill="url(#colorResolved)"
                name="Đã giải quyết"
                strokeWidth={isHighContrast ? 3 : 2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Phân bố theo Tổ dân phố / Địa bàn phường Trà Câu */}
      <div className={`rounded-xl ${isDenseMode ? 'p-3 sm:p-4' : 'p-5'} ${getCardClasses()}`}>
        <div className={`flex items-center justify-between ${isDenseMode ? 'mb-2' : 'mb-4'}`}>
          <div>
            <h3 className={`text-sm font-bold ${getHeadingColor()}`}>
              Phân Bố Theo Tổ Dân Phố
            </h3>
            <p className="text-xs text-slate-400">Mật độ hồ sơ trên địa bàn Phường Trà Câu</p>
          </div>
        </div>
        <div className={`${chartHeightClass} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByTdp}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
              <XAxis type="number" tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: isDenseMode ? 10 : 11, fill: axisColor }} width={75} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Bar dataKey="value" fill={tdpBarFill} radius={[0, 4, 4, 0]} name="Số hồ sơ" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
