import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Eye,
  Link as LinkIcon,
  Copy,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { ComplaintPetition } from '../types';
import { maskCCCD, maskPhone, getStatusBadgeClass } from '../utils/formatters';
import * as XLSX from 'xlsx';

interface ComplaintPetitionsTableProps {
  data: ComplaintPetition[];
  isPrivacyMode: boolean;
  onSelectRecord: (record: { type: 'tcd' | 'don' | 'td'; id: string }) => void;
  searchQuery?: string;
  isHighContrast?: boolean;
  isDenseMode?: boolean;
}

export const ComplaintPetitionsTable: React.FC<ComplaintPetitionsTableProps> = ({
  data,
  isPrivacyMode,
  onSelectRecord,
  searchQuery = '',
  isHighContrast = false,
  isDenseMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<keyof ComplaintPetition>('STT');
  const [sortAsc, setSortAsc] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sorting
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = (a[sortField] || '').toString();
      const valB = (b[sortField] || '').toString();

      if (sortField === 'STT' || sortField === 'soNgayXuLy' || sortField === 'soNgayQuaHan') {
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

  const handleSort = (field: keyof ComplaintPetition) => {
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
        'Mã đơn': item.maDon,
        'Số đến': item.soDen,
        'Ngày nhận đơn': item.ngayNhanDon,
        'Hình thức nhận': item.hinhThucNhan,
        'Mã lượt tiếp': item.maLuotTiep,
        'Họ tên người gửi': item.hoTen,
        'Địa chỉ': item.diaChi,
        'Số điện thoại': item.soDienThoai,
        'CCCD': item.cccd,
        'Loại đơn': item.loaiDon,
        'Nội dung tóm tắt': item.noiDungTomTat,
        'Lĩnh vực': item.linhVuc,
        'Đơn lần đầu': item.donLanDau,
        'Thuộc thẩm quyền': item.thuocThamQuyen,
        'Cán bộ tham mưu': item.canBoThamMuu,
        'Trạng thái hồ sơ': item.trangThaiHoSo,
        'Hạn giải quyết': item.hanGiaiQuyet,
        'Ngày kết thúc': item.ngayKetThuc,
        'Kết quả cuối cùng': item.ketQuaCuoiCung,
        'Tình trạng quá hạn': item.tinhTrangQuaHan,
        'Số ngày xử lý': item.soNgayXuLy,
        'Số ngày quá hạn': item.soNgayQuaHan,
        'Ghi chú': item.ghiChu,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quản Lý Đơn Thư');
    XLSX.writeFile(wb, 'Danh_sach_Don_thu_Phuong_Tra_Cau.xlsx');
  };

  const cellPadding = isDenseMode ? 'px-2.5 py-1.5' : 'px-3 py-3';
  const headPadding = isDenseMode ? 'px-2.5 py-2' : 'px-3 py-3';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all">
      {/* Header Bar */}
      <div className={`${
        isDenseMode ? 'p-2.5 sm:p-3' : 'p-4'
      } border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50`}>
        <div className="flex items-center gap-2">
          <div className={`${
            isDenseMode ? 'w-7 h-7' : 'w-8 h-8'
          } rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm`}>
            <FileSpreadsheet className={isDenseMode ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Sổ Quản Lý Đơn Thư Khiếu Nại, Tố Cáo Phường Trà Câu</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                {data.length} hồ sơ
              </span>
            </h2>
            <p className="text-xs text-slate-500">Giám sát xử lý đơn theo Luật Khiếu nại, Luật Tố cáo và quy định tiếp công dân</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Table Data */}
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
              <th className={`${headPadding} w-28 cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('maDon')}>
                <div className="flex items-center gap-1">
                  <span>Mã Đơn</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-24`}>Số Đến</th>
              <th className={`${headPadding} w-28 cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('ngayNhanDon')}>
                <div className="flex items-center gap-1">
                  <span>Ngày Nhận</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} min-w-[150px] cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('hoTen')}>
                <div className="flex items-center gap-1">
                  <span>Người Gửi Đơn</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-28`}>Loại Đơn</th>
              <th className={`${headPadding} min-w-[220px]`}>Nội Dung Tóm Tắt</th>
              <th className={`${headPadding} w-24`}>Lĩnh Vực</th>
              <th className={`${headPadding} w-28`}>Cán Bộ XL</th>
              <th className={`${headPadding} w-28 text-center cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('trangThaiHoSo')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Trạng Thái</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-28 cursor-pointer hover:bg-slate-200/60`} onClick={() => handleSort('hanGiaiQuyet')}>
                <div className="flex items-center gap-1">
                  <span>Hạn Xử Lý</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className={`${headPadding} w-28 text-center`}>Tiến Độ Hạn</th>
              <th className={`${headPadding} w-20 text-center`}>Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-12 text-slate-400 text-sm">
                  Không tìm thấy đơn thư nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const isOverdue = item.tinhTrangQuaHan.includes('Quá hạn') || (parseInt(item.soNgayQuaHan, 10) > 0);
                const isResolved = item.trangThaiHoSo.includes('Đã giải quyết');

                return (
                  <tr
                    key={item.maDon || idx}
                    onClick={() => onSelectRecord({ type: 'don', id: item.maDon })}
                    className={`cursor-pointer transition-all duration-150 group hover:bg-blue-50/80 dark:hover:bg-slate-800/80 hover:shadow-xs ${
                      isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                    }`}
                    title="Nhấp vào dòng để xem chi tiết toàn bộ hồ sơ đơn thư này"
                  >
                    <td className={`${cellPadding} text-center font-medium text-slate-500`}>
                      {item.STT}
                    </td>
                    <td className={`${cellPadding} font-semibold`}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-blue-700 dark:text-blue-400 group-hover:underline">{item.maDon}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.maDon, item.maDon);
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          title="Sao chép mã đơn"
                        >
                          {copiedId === item.maDon ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className={`${cellPadding} font-mono text-slate-600 dark:text-slate-400`}>
                      {item.soDen || '-'}
                    </td>
                    <td className={`${cellPadding} whitespace-nowrap text-slate-600 dark:text-slate-400`}>
                      {item.ngayNhanDon}
                    </td>
                    <td className={cellPadding}>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{item.hoTen}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={item.diaChi}>
                        {item.diaChi}
                      </div>
                    </td>
                    <td className={`${cellPadding} whitespace-nowrap`}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isHighContrast
                          ? item.loaiDon.includes('Khiếu nại')
                            ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400'
                            : item.loaiDon.includes('Tố cáo')
                            ? 'bg-blue-900 text-white font-bold border border-blue-600'
                            : 'bg-sky-700 text-white font-bold border border-sky-500'
                          : item.loaiDon.includes('Khiếu nại')
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : item.loaiDon.includes('Tố cáo')
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {item.loaiDon}
                      </span>
                    </td>
                    <td className={`${cellPadding} text-slate-700 dark:text-slate-300 max-w-[220px]`}>
                      <p className="line-clamp-2" title={item.noiDungTomTat}>
                        {item.noiDungTomTat}
                      </p>
                    </td>
                    <td className={`${cellPadding} whitespace-nowrap`}>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {item.linhVuc}
                      </span>
                    </td>
                    <td className={`${cellPadding} whitespace-nowrap text-slate-700 dark:text-slate-300`}>
                      {item.canBoThamMuu || '-'}
                    </td>
                    <td className={`${cellPadding} text-center whitespace-nowrap`}>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        isHighContrast
                          ? isResolved
                            ? 'bg-blue-900 text-blue-100 border-blue-500 font-bold'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                          : isResolved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                      }`}>
                        {item.trangThaiHoSo}
                      </span>
                    </td>
                    <td className={`${cellPadding} whitespace-nowrap`}>
                      <div className="font-mono text-slate-800 dark:text-slate-200">{item.hanGiaiQuyet || '-'}</div>
                      {item.ngayKetThuc && (
                        <div className="text-[10px] text-slate-500">Xong: {item.ngayKetThuc}</div>
                      )}
                    </td>
                    <td className={`${cellPadding} text-center whitespace-nowrap`}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 ${
                        isHighContrast
                          ? isOverdue
                            ? 'bg-amber-500 text-slate-950 font-bold border border-amber-300'
                            : 'bg-blue-800 text-white font-bold border border-blue-400'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {isOverdue ? (
                          <>
                            <AlertCircle className={`w-3 h-3 ${isHighContrast ? 'text-slate-950' : 'text-rose-600'}`} />
                            <span>Quá hạn ({item.soNgayQuaHan || '1'}d)</span>
                          </>
                        ) : (
                          <>
                            <Clock className={`w-3 h-3 ${isHighContrast ? 'text-blue-200' : 'text-emerald-600'}`} />
                            <span>{item.tinhTrangQuaHan || 'Đúng hạn'}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`${cellPadding} text-center whitespace-nowrap`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord({ type: 'don', id: item.maDon });
                        }}
                        className="p-1.5 rounded-md group-hover:bg-blue-600 group-hover:text-white bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 transition-all shadow-xs"
                        title="Xem chi tiết hồ sơ đơn"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
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
          trong tổng số <strong className="text-slate-800 dark:text-slate-200">{sortedData.length}</strong> hồ sơ
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
