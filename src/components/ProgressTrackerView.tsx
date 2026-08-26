import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Calendar,
  User,
  FileText,
  Building,
  ArrowRight,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
} from 'lucide-react';
import { ProgressStep } from '../types';
import * as XLSX from 'xlsx';

interface ProgressTrackerViewProps {
  data: ProgressStep[];
  onSelectRecord: (record: { type: 'tcd' | 'don' | 'td'; id: string }) => void;
  searchQuery?: string;
  isHighContrast?: boolean;
  isDenseMode?: boolean;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  data,
  onSelectRecord,
  searchQuery = '',
  isHighContrast = false,
  isDenseMode = false,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Critical alerts calculation
  const quaHanItems = data.filter((d) => d.canhBaoTienDo.includes('QUÁ HẠN'));
  const sapDenHanItems = data.filter(
    (d) => d.canhBaoTienDo.includes('SẮP ĐẾN HẠN') || d.canhBaoTienDo.includes('≤24')
  );
  const trongHanItems = data.filter((d) => d.canhBaoTienDo.includes('TRONG HẠN'));
  const hoanThanhItems = data.filter((d) => d.canhBaoTienDo.includes('Hoàn thành'));

  // Filtering by alert level
  const filteredData = useMemo(() => {
    if (filterLevel === 'quahan') return quaHanItems;
    if (filterLevel === 'sapdenhan') return sapDenHanItems;
    if (filterLevel === 'tronghan') return trongHanItems;
    if (filterLevel === 'hoanthanh') return hoanThanhItems;
    return data;
  }, [data, filterLevel, quaHanItems, sapDenHanItems, trongHanItems, hoanThanhItems]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item, i) => ({
        'STT': item.STT || i + 1,
        'Mã tiến độ': item.maTienDo,
        'Mã đơn': item.maDon,
        'Ngày cập nhật': item.ngayCapNhat,
        'Bước xử lý': item.buocXuLy,
        'Nội dung công việc': item.noiDungCongViec,
        'Bộ phận thực hiện': item.coQuanThucHien,
        'Người thực hiện': item.nguoiThucHien,
        'Văn bản liên quan': item.vanBanLienQuan,
        'Ngày văn bản': item.ngayVanBan,
        'Thời hạn bước': item.thoiHanBuocXuLy,
        'Kết quả thực hiện': item.ketQuaThucHien,
        'Trạng thái bước': item.trangThaiBuocXuLy,
        'Ngày hoàn thành': item.ngayHoanThanh,
        'Số ngày còn lại/quá hạn': item.soNgayConLai,
        'Cảnh báo tiến độ': item.canhBaoTienDo,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tiến Độ Giải Quyết');
    XLSX.writeFile(wb, 'Tien_do_giai_quyet_Phuong_Tra_Cau.xlsx');
  };

  const cellPadding = isDenseMode ? 'px-2.5 py-1.5' : 'px-3 py-3';
  const headPadding = isDenseMode ? 'px-2.5 py-2' : 'px-3 py-3';

  return (
    <div className={isDenseMode ? 'space-y-3' : 'space-y-6'}>
      {/* Alert Banner for Urgent & Overdue Actions */}
      {(quaHanItems.length > 0 || sapDenHanItems.length > 0) && (
        <div className={`rounded-xl shadow-md border transition-all ${
          isDenseMode ? 'p-3' : 'p-5'
        } ${
          isHighContrast
            ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 text-white border-amber-500/80 ring-2 ring-amber-400/40'
            : 'bg-gradient-to-r from-rose-900/90 via-rose-800 to-amber-900 text-white border-rose-700/50'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-6 h-6 shrink-0 animate-pulse mt-0.5 ${isHighContrast ? 'text-amber-400' : 'text-amber-300'}`} />
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <span>CẢNH BÁO TIẾN ĐỘ & HẠN CHÓT XỬ LÝ ĐƠN THƯ</span>
                {isHighContrast && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">
                    Chế độ tương phản cao
                  </span>
                )}
              </h3>
              <p className="text-xs text-rose-100/90 mt-1">
                Hệ thống phát hiện{' '}
                <strong className="text-amber-200 underline">{quaHanItems.length} công việc quá hạn</strong> và{' '}
                <strong className="text-amber-200 underline">{sapDenHanItems.length} công việc sắp đến hạn (≤24 giờ)</strong>{' '}
                cần lãnh đạo và cán bộ phụ trách kiểm tra, đôn đốc xử lý khẩn trương.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quaHanItems.map((item) => (
                  <button
                    key={item.maTienDo}
                    onClick={() => onSelectRecord({ type: 'don', id: item.maDon })}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
                      isHighContrast
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold hover:bg-amber-400'
                        : 'bg-black/40 hover:bg-black/60 text-amber-300 border-amber-400/30'
                    }`}
                  >
                    <span>{item.maDon}</span>
                    <span className={`text-[10px] px-1 rounded font-bold ${
                      isHighContrast ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white'
                    }`}>QUÁ HẠN</span>
                  </button>
                ))}
                {sapDenHanItems.map((item) => (
                  <button
                    key={item.maTienDo}
                    onClick={() => onSelectRecord({ type: 'don', id: item.maDon })}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
                      isHighContrast
                        ? 'bg-amber-400/90 text-slate-950 border-amber-300 font-semibold hover:bg-amber-300'
                        : 'bg-black/40 hover:bg-black/60 text-amber-300 border-amber-400/30'
                    }`}
                  >
                    <span>{item.maDon}</span>
                    <span className={`text-[10px] px-1 rounded font-bold ${
                      isHighContrast ? 'bg-slate-900 text-white' : 'bg-amber-600 text-white'
                    }`}>≤24H</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Quick Pills */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 ${isDenseMode ? 'gap-2' : 'gap-3'}`}>
        <button
          onClick={() => {
            setFilterLevel('all');
            setCurrentPage(1);
          }}
          className={`${isDenseMode ? 'p-2' : 'p-3'} rounded-xl border text-left transition-all ${
            filterLevel === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm dark:bg-slate-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-400 font-medium">Toàn bộ tiến độ</div>
          <div className={`${isDenseMode ? 'text-lg' : 'text-xl'} font-bold mt-1 text-slate-900 dark:text-white`}>{data.length} bước</div>
        </button>

        <button
          onClick={() => {
            setFilterLevel('quahan');
            setCurrentPage(1);
          }}
          className={`${isDenseMode ? 'p-2' : 'p-3'} rounded-xl border text-left transition-all ${
            filterLevel === 'quahan'
              ? isHighContrast
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md ring-2 ring-amber-300'
                : 'bg-rose-700 text-white border-rose-700 shadow-sm'
              : isHighContrast
              ? 'bg-white dark:bg-slate-900 border-amber-400/60 hover:border-amber-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center gap-1 ${
            isHighContrast ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-rose-500'
          }`}>
            <AlertTriangle className="w-3 h-3" />
            <span>Quá hạn</span>
          </div>
          <div className={`${isDenseMode ? 'text-lg' : 'text-xl'} font-bold mt-1 ${
            isHighContrast ? 'text-amber-700 dark:text-amber-300' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {quaHanItems.length} bước
          </div>
        </button>

        <button
          onClick={() => {
            setFilterLevel('sapdenhan');
            setCurrentPage(1);
          }}
          className={`${isDenseMode ? 'p-2' : 'p-3'} rounded-xl border text-left transition-all ${
            filterLevel === 'sapdenhan'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="text-xs text-amber-500 font-medium flex items-center gap-1">
            <Hourglass className="w-3 h-3" />
            <span>Sắp đến hạn (≤24h)</span>
          </div>
          <div className={`${isDenseMode ? 'text-lg' : 'text-xl'} font-bold mt-1 text-amber-600 dark:text-amber-400`}>{sapDenHanItems.length} bước</div>
        </button>

        <button
          onClick={() => {
            setFilterLevel('hoanthanh');
            setCurrentPage(1);
          }}
          className={`${isDenseMode ? 'p-2' : 'p-3'} rounded-xl border text-left transition-all ${
            filterLevel === 'hoanthanh'
              ? isHighContrast
                ? 'bg-blue-700 text-white font-bold border-blue-500 shadow-md ring-2 ring-blue-400'
                : 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : isHighContrast
              ? 'bg-white dark:bg-slate-900 border-blue-400/60 hover:border-blue-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center gap-1 ${
            isHighContrast ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-emerald-500'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã hoàn thành</span>
          </div>
          <div className={`${isDenseMode ? 'text-lg' : 'text-xl'} font-bold mt-1 ${
            isHighContrast ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {hoanThanhItems.length} bước
          </div>
        </button>
      </div>

      {/* Data Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all">
        <div className={`${
          isDenseMode ? 'p-2.5 sm:p-3' : 'p-4'
        } border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50`}>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Bảng Tiến Độ Thực Hiện Từng Bước Xử Lý</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredData.length} bước
              </span>
            </h3>
            <p className="text-xs text-slate-500">Chi tiết cơ quan thực hiện, văn bản ban hành, thời hạn và kết quả</p>
          </div>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className={`${headPadding} w-12 text-center`}>STT</th>
                <th className={`${headPadding} w-28`}>Mã Tiến Độ</th>
                <th className={`${headPadding} w-28`}>Mã Đơn LK</th>
                <th className={`${headPadding} min-w-[200px]`}>Bước Xử Lý & Công Việc</th>
                <th className={`${headPadding} min-w-[180px]`}>Người / Đơn Vị Thực Hiện</th>
                <th className={`${headPadding} w-32`}>Văn Bản LK</th>
                <th className={`${headPadding} w-28`}>Thời Hạn</th>
                <th className={`${headPadding} w-28 text-center`}>Cảnh Báo</th>
                <th className={`${headPadding} w-28 text-center`}>Trạng Thái</th>
                <th className={`${headPadding} w-16 text-center`}>Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400 text-sm">
                    Không có bản ghi tiến độ nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const isOverdue = item.canhBaoTienDo.includes('QUÁ HẠN');
                  const isNear = item.canhBaoTienDo.includes('SẮP ĐẾN HẠN') || item.canhBaoTienDo.includes('≤24');
                  const isCompleted = item.canhBaoTienDo.includes('Hoàn thành');

                  return (
                    <tr
                      key={item.maTienDo || idx}
                      onClick={() => onSelectRecord({ type: item.maDon ? 'don' : 'td', id: item.maDon || item.maTienDo })}
                      className={`cursor-pointer transition-all duration-150 group hover:bg-purple-50/70 dark:hover:bg-slate-800/80 hover:shadow-xs ${
                        isOverdue
                          ? 'bg-rose-50/30 dark:bg-rose-950/10'
                          : isNear
                          ? 'bg-amber-50/30 dark:bg-amber-950/10'
                          : ''
                      }`}
                      title="Nhấp vào dòng để xem chi tiết toàn bộ hồ sơ tiến độ này"
                    >
                      <td className={`${cellPadding} text-center font-medium text-slate-500`}>
                        {item.STT}
                      </td>
                      <td className={`${cellPadding} font-mono font-semibold text-purple-700 dark:text-purple-400 group-hover:underline`}>
                        {item.maTienDo}
                      </td>
                      <td className={cellPadding}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord({ type: 'don', id: item.maDon });
                          }}
                          className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400"
                        >
                          {item.maDon}
                        </button>
                      </td>
                      <td className={cellPadding}>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{item.buocXuLy}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{item.noiDungCongViec}</div>
                      </td>
                      <td className={`${cellPadding} text-slate-600 dark:text-slate-400`}>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{item.nguoiThucHien || '-'}</div>
                        <div className="text-[11px] text-slate-500">{item.coQuanThucHien}</div>
                      </td>
                      <td className={cellPadding}>
                        <div className="font-mono text-slate-700 dark:text-slate-300">{item.vanBanLienQuan || '-'}</div>
                        {item.ngayVanBan && (
                          <div className="text-[10px] text-slate-500">Ngày: {item.ngayVanBan}</div>
                        )}
                      </td>
                      <td className={`${cellPadding} whitespace-nowrap`}>
                        <div className="font-mono text-slate-800 dark:text-slate-200">{item.thoiHanBuocXuLy || '-'}</div>
                        {item.ngayHoanThanh && (
                          <div className="text-[10px] text-emerald-600">Xong: {item.ngayHoanThanh}</div>
                        )}
                      </td>
                      <td className={`${cellPadding} text-center whitespace-nowrap`}>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isHighContrast
                            ? isOverdue
                              ? 'bg-amber-500 text-slate-950 font-bold border border-amber-300 animate-pulse'
                              : isNear
                              ? 'bg-amber-400 text-slate-950 font-semibold border border-amber-300'
                              : isCompleted
                              ? 'bg-blue-700 text-white font-bold border border-blue-400'
                              : 'bg-sky-800 text-white border border-sky-400'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                            : isNear
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                          {item.canhBaoTienDo || 'Trong hạn'}
                        </span>
                      </td>
                      <td className={`${cellPadding} text-center whitespace-nowrap`}>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {item.trangThaiBuocXuLy || 'Hoàn thành'}
                        </span>
                      </td>
                      <td className={`${cellPadding} text-center whitespace-nowrap`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord({ type: 'don', id: item.maDon });
                          }}
                          className="p-1.5 rounded-md group-hover:bg-purple-600 group-hover:text-white bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 transition-all shadow-xs"
                          title="Xem toàn bộ hồ sơ vụ việc"
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
              {Math.min(currentPage * pageSize, filteredData.length)}
            </strong>{' '}
            trong <strong className="text-slate-800 dark:text-slate-200">{filteredData.length}</strong> bước
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
    </div>
  );
};
