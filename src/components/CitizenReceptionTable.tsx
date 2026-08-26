import React, { useState, useMemo } from 'react';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  Eye,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import { CitizenReception } from '../types';
import { maskCCCD, maskPhone } from '../utils/formatters';
import * as XLSX from 'xlsx';

interface CitizenReceptionTableProps {
  data: CitizenReception[];
  isPrivacyMode: boolean;
  onSelectRecord: (record: { type: 'tcd' | 'don' | 'td'; id: string }) => void;
  searchQuery?: string;
  isHighContrast?: boolean;
  isDenseMode?: boolean;
}

export const CitizenReceptionTable: React.FC<CitizenReceptionTableProps> = ({
  data,
  isPrivacyMode,
  onSelectRecord,
  searchQuery = '',
  isHighContrast = false,
  isDenseMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<keyof CitizenReception>('STT');
  const [sortAsc, setSortAsc] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sorting
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = (a[sortField] || '').toString();
      const valB = (b[sortField] || '').toString();

      if (sortField === 'STT') {
        const numA = parseInt(valA, 10) || 0;
        const numB = parseInt(valB, 10) || 0;
        return sortAsc ? numA - numB : numB - numA;
      }

      return sortAsc ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
    });
  }, [data, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: keyof CitizenReception) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item, i) => ({
        'STT': item.STT || i + 1,
        'Mã lượt tiếp': item.maLuotTiep,
        'Ngày tiếp': item.ngayTiep,
        'Hình thức tiếp': item.hinhThucTiep,
        'Người chủ trì tiếp': item.nguoiChuTri,
        'Họ và tên công dân': item.hoTen,
        'Ngày sinh': item.ngaySinh,
        'CCCD/Định danh': item.cccd,
        'Địa chỉ': item.diaChi,
        'Số điện thoại': item.soDienThoai,
        'Nội dung trình bày': item.noiDung,
        'Lĩnh vực': item.linhVuc,
        'Phân loại vụ việc': item.phanLoaiVuViec,
        'Thuộc thẩm quyền': item.thuocThamQuyen,
        'Kết quả tiếp': item.ketQuaTiep,
        'Hướng xử lý': item.huongXuLy,
        'Mã đơn liên quan': item.maDonLienQuan,
        'Cán bộ theo dõi': item.canBoTheoDoi,
        'Ghi chú': item.ghiChu,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tiếp Công Dân');
    XLSX.writeFile(wb, 'Danh_sach_Tiep_cong_dan_Phuong_Tra_Cau.xlsx');
  };

  const cellPadding = isDenseMode ? 'px-2.5 py-1.5' : 'px-3 py-3';
  const headPadding = isDenseMode ? 'px-2.5 py-2' : 'px-3 py-3';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all">
      {/* Table Header Controls */}
      <div className={`${
        isDenseMode ? 'p-2.5 sm:p-3' : 'p-4'
      } border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50`}>
        <div className="flex items-center gap-2">
          <div className={`${
            isDenseMode ? 'w-7 h-7' : 'w-8 h-8'
          } rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-sm`}>
            <Users className={isDenseMode ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Sổ Theo Dõi Tiếp Công Dân Phường Trà Câu</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300">
                {data.length} lượt
              </span>
            </h2>
            <p className="text-xs text-slate-500">Thông tin chi tiết công dân, nội dung trình bày và hướng giải quyết</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Page size */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value={10}>10 dòng</option>
              <option value={15}>15 dòng</option>
              <option value={25}>25 dòng</option>
              <option value={50}>50 dòng</option>
              <option value={100}>100 dòng</option>
            </select>
          </div>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Table Data Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
            <tr>
              <th className={`${headPadding} w-12 text-center cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('STT')}>
                <div className="flex items-center justify-center gap-1">
                  <span>STT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-32 cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('maLuotTiep')}>
                <div className="flex items-center gap-1">
                  <span>Mã Lượt Tiếp</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-28 cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('ngayTiep')}>
                <div className="flex items-center gap-1">
                  <span>Ngày Tiếp</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-28`}>Hình Thức</th>
              <th className={`${headPadding} min-w-[160px] cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('hoTen')}>
                <div className="flex items-center gap-1">
                  <span>Họ Tên Công Dân</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} min-w-[140px]`}>CCCD / SĐT</th>
              <th className={`${headPadding} min-w-[180px]`}>Địa Chỉ</th>
              <th className={`${headPadding} min-w-[240px]`}>Nội Dung Trình Bày</th>
              <th className={`${headPadding} w-28`}>Lĩnh Vực</th>
              <th className={`${headPadding} w-28`}>Phân Loại</th>
              <th className={`${headPadding} w-32`}>Mã Đơn LK</th>
              <th className={`${headPadding} w-28`}>Cán Bộ</th>
              <th className={`${headPadding} w-20 text-center`}>Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-12 text-slate-400 text-sm">
                  Không tìm thấy lượt tiếp công dân nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={item.maLuotTiep || idx}
                  onClick={() => onSelectRecord({ type: 'tcd', id: item.maLuotTiep })}
                  className="cursor-pointer transition-all duration-150 group hover:bg-red-50/60 dark:hover:bg-slate-800/80 hover:shadow-xs"
                  title="Nhấp vào dòng để xem chi tiết toàn bộ hồ sơ tiếp công dân này"
                >
                  <td className={`${cellPadding} text-center font-medium text-slate-500`}>
                    {item.STT}
                  </td>
                  <td className={`${cellPadding} font-semibold text-slate-900 dark:text-white`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-red-700 dark:text-red-400 group-hover:underline">{item.maLuotTiep}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.maLuotTiep, item.maLuotTiep);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                        title="Sao chép mã"
                      >
                        {copiedId === item.maLuotTiep ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap text-slate-600 dark:text-slate-400`}>
                    {item.ngayTiep}
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap`}>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      isHighContrast
                        ? item.hinhThucTiep.includes('Định kỳ')
                          ? 'bg-blue-900 text-white font-bold border border-blue-600'
                          : item.hinhThucTiep.includes('Đột xuất')
                          ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400'
                          : 'bg-sky-700 text-white font-bold border border-sky-500'
                        : item.hinhThucTiep.includes('Định kỳ')
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                        : item.hinhThucTiep.includes('Đột xuất')
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    }`}>
                      {item.hinhThucTiep}
                    </span>
                  </td>
                  <td className={`${cellPadding} font-semibold text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors`}>
                    {item.hoTen}
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-400`}>
                    <div>CCCD: <span className="font-mono">{maskCCCD(item.cccd, isPrivacyMode)}</span></div>
                    <div>SĐT: <span className="font-mono">{maskPhone(item.soDienThoai, isPrivacyMode)}</span></div>
                  </td>
                  <td className={`${cellPadding} text-slate-600 dark:text-slate-400 max-w-[200px] truncate`} title={item.diaChi}>
                    {item.diaChi}
                  </td>
                  <td className={`${cellPadding} text-slate-700 dark:text-slate-300 max-w-[260px]`}>
                    <p className="line-clamp-2" title={item.noiDung}>
                      {item.noiDung}
                    </p>
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap`}>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {item.linhVuc}
                    </span>
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap`}>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isHighContrast
                        ? item.phanLoaiVuViec.includes('Khiếu nại')
                          ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400'
                          : item.phanLoaiVuViec.includes('Tố cáo')
                          ? 'bg-blue-900 text-white font-bold border border-blue-600'
                          : 'bg-sky-700 text-white font-bold border border-sky-500'
                        : item.phanLoaiVuViec.includes('Khiếu nại')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : item.phanLoaiVuViec.includes('Tố cáo')
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.phanLoaiVuViec}
                    </span>
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap`}>
                    {item.maDonLienQuan ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord({ type: 'don', id: item.maDonLienQuan });
                        }}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                        title="Xem chi tiết đơn thư liên quan"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>{item.maDonLienQuan}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className={`${cellPadding} whitespace-nowrap text-slate-600 dark:text-slate-400`}>
                    {item.canBoTheoDoi || '-'}
                  </td>
                  <td className={`${cellPadding} text-center whitespace-nowrap`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord({ type: 'tcd', id: item.maLuotTiep });
                      }}
                      className="p-1.5 rounded-md group-hover:bg-red-600 group-hover:text-white bg-red-50 dark:bg-slate-800 text-red-600 dark:text-red-400 transition-all shadow-xs"
                      title="Xem hồ sơ chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Hiển thị từ <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> đến{' '}
          <strong className="text-slate-800 dark:text-slate-200">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </strong>{' '}
          trong tổng số <strong className="text-slate-800 dark:text-slate-200">{sortedData.length}</strong> bản ghi
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40"
          >
            Đầu
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40"
          >
            Cuối
          </button>
        </div>
      </div>
    </div>
  );
};
