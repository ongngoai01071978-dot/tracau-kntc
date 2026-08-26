import React, { useState } from 'react';
import {
  X,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  CreditCard,
  Building,
  Calendar,
  Layers,
  Printer,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { CitizenReception, ComplaintPetition, ProgressStep } from '../types';
import { maskCCCD, maskPhone } from '../utils/formatters';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: { type: 'tcd' | 'don' | 'td'; id: string } | null;
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  isPrivacyMode: boolean;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  tiepCongDan,
  quanLyDonThu,
  tienDo,
  isPrivacyMode,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'raw'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !selectedItem) return null;

  // Find linked records
  let matchedTcd: CitizenReception | undefined;
  let matchedDon: ComplaintPetition | undefined;
  let matchedSteps: ProgressStep[] = [];

  if (selectedItem.type === 'tcd') {
    matchedTcd = tiepCongDan.find((t) => t.maLuotTiep === selectedItem.id);
    if (matchedTcd?.maDonLienQuan) {
      matchedDon = quanLyDonThu.find((d) => d.maDon === matchedTcd?.maDonLienQuan);
      matchedSteps = tienDo.filter((td) => td.maDon === matchedTcd?.maDonLienQuan);
    }
  } else if (selectedItem.type === 'don') {
    matchedDon = quanLyDonThu.find((d) => d.maDon === selectedItem.id);
    if (matchedDon?.maLuotTiep) {
      matchedTcd = tiepCongDan.find((t) => t.maLuotTiep === matchedDon?.maLuotTiep);
    }
    matchedSteps = tienDo.filter((td) => td.maDon === selectedItem.id);
  } else if (selectedItem.type === 'td') {
    const step = tienDo.find((td) => td.maTienDo === selectedItem.id);
    if (step) {
      matchedSteps = tienDo.filter((td) => td.maDon === step.maDon);
      matchedDon = quanLyDonThu.find((d) => d.maDon === step.maDon);
      if (matchedDon?.maLuotTiep) {
        matchedTcd = tiepCongDan.find((t) => t.maLuotTiep === matchedDon?.maLuotTiep);
      }
    }
  }

  const citizenName = matchedDon?.hoTen || matchedTcd?.hoTen || 'Công dân';
  const cccd = matchedDon?.cccd || matchedTcd?.cccd || '';
  const phone = matchedDon?.soDienThoai || matchedTcd?.soDienThoai || '';
  const address = matchedDon?.diaChi || matchedTcd?.diaChi || '';
  const maDon = matchedDon?.maDon || matchedTcd?.maDonLienQuan || '-';
  const maLuotTiep = matchedTcd?.maLuotTiep || matchedDon?.maLuotTiep || '-';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 flex items-start justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600/90 text-white flex items-center justify-center font-bold shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  HỒ SƠ VỤ VIỆC LIÊN THÔNG
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 font-mono text-slate-200">
                  {maDon !== '-' ? maDon : maLuotTiep}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                <span>{citizenName}</span>
                {matchedDon?.loaiDon && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {matchedDon.loaiDon}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="In phiếu hồ sơ"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sub-navigation */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tổng Quan Vụ Việc
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'progress'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>Tiến Độ & Nhật Ký Xử Lý</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 text-[10px]">
                {matchedSteps.length}
              </span>
            </button>
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-2">
            <span>UBND Phường Trà Câu</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <>
              {/* Section 1: Thông tin người gửi / công dân */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>1. THÔNG TIN CÔNG DÂN</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Họ và tên:</span>
                    <strong className="text-sm text-slate-900 dark:text-white">{citizenName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">CCCD/Định danh:</span>
                    <div className="flex items-center gap-1">
                      <strong className="font-mono text-slate-800 dark:text-slate-200">
                        {maskCCCD(cccd, isPrivacyMode)}
                      </strong>
                      {!isPrivacyMode && cccd && (
                        <button onClick={() => handleCopy(cccd)} className="text-slate-400 hover:text-slate-600">
                          {copiedText === cccd ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Số điện thoại:</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">
                      {maskPhone(phone, isPrivacyMode)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Ngày sinh:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {matchedTcd?.ngaySinh || 'Không có'}
                    </span>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <span className="text-slate-500 block text-[11px]">Địa chỉ cư trú:</span>
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      {address || 'Chưa cung cấp'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Quản lý Đơn thư & Thụ lý */}
              {matchedDon && (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>2. HỒ SƠ ĐƠN THƯ THỤ LÝ</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Mã đơn / Số đến:</span>
                      <strong className="font-mono text-blue-700 dark:text-blue-400">{matchedDon.maDon}</strong>
                      <span className="text-slate-500 text-[11px] block">Số đến: {matchedDon.soDen || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Ngày nhận / Hình thức:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{matchedDon.ngayNhanDon}</strong>
                      <span className="text-slate-500 text-[11px] block">{matchedDon.hinhThucNhan}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Lĩnh vực / Loại đơn:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{matchedDon.linhVuc}</strong>
                      <span className="text-slate-500 text-[11px] block">{matchedDon.loaiDon}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Cán bộ tham mưu:</span>
                      <strong className="text-slate-900 dark:text-white">{matchedDon.canBoThamMuu || '-'}</strong>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <span className="text-slate-500 block text-[11px]">Nội dung tóm tắt đơn:</span>
                      <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-medium">
                        {matchedDon.noiDungTomTat}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Trạng thái hồ sơ:</span>
                      <span className="inline-block px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {matchedDon.trangThaiHoSo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Hạn giải quyết:</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">{matchedDon.hanGiaiQuyet || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Tình trạng thời hạn:</span>
                      <strong className={`font-semibold ${matchedDon.tinhTrangQuaHan.includes('Quá hạn') ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {matchedDon.tinhTrangQuaHan || 'Đúng hạn'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Số ngày xử lý:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{matchedDon.soNgayXuLy || '-'} ngày</strong>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <span className="text-slate-500 block text-[11px]">Kết quả giải quyết cuối cùng:</span>
                      <div className="text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
                        {matchedDon.ketQuaCuoiCung || 'Đang trong quá trình thụ lý giải quyết'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Lượt tiếp công dân liên quan */}
              {matchedTcd && (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>3. LỊCH SỬ TIẾP CÔNG DÂN</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Mã lượt tiếp / Ngày:</span>
                      <strong className="font-mono text-purple-700 dark:text-purple-400">{matchedTcd.maLuotTiep}</strong>
                      <span className="text-slate-500 text-[11px] block">{matchedTcd.ngayTiep} ({matchedTcd.hinhThucTiep})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Người chủ trì tiếp:</span>
                      <strong className="text-slate-900 dark:text-white">{matchedTcd.nguoiChuTri}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Cán bộ theo dõi:</span>
                      <strong className="text-slate-900 dark:text-white">{matchedTcd.canBoTheoDoi || '-'}</strong>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-slate-500 block text-[11px]">Nội dung trình bày tại buổi tiếp:</span>
                      <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        {matchedTcd.noiDung}
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-slate-500 block text-[11px]">Kết quả & Hướng xử lý:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {matchedTcd.ketQuaTiep} • {matchedTcd.huongXuLy}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>TIẾN ĐỘ CÁC BƯỚC XỬ LÝ VỤ VIỆC</span>
                </h3>
                <span className="text-xs text-slate-500">{matchedSteps.length} bước cập nhật</span>
              </div>

              {matchedSteps.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400">
                  Chưa có nhật ký bước xử lý chi tiết cho hồ sơ này trong Google Sheets.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                  {matchedSteps.map((step, idx) => (
                    <div key={step.maTienDo || idx} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 border-4 border-white dark:border-slate-900"></div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">
                            {step.buocXuLy}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {step.canhBaoTienDo || step.trangThaiBuocXuLy}
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 text-xs mb-3">
                          {step.noiDungCongViec}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <span>Người thực hiện: </span>
                            <strong className="text-slate-800 dark:text-slate-200">{step.nguoiThucHien}</strong>
                          </div>
                          <div>
                            <span>Văn bản LK: </span>
                            <strong className="font-mono text-slate-800 dark:text-slate-200">{step.vanBanLienQuan || 'Không có'}</strong>
                          </div>
                          <div>
                            <span>Thời hạn / Hoàn thành: </span>
                            <strong className="font-mono text-slate-800 dark:text-slate-200">
                              {step.ngayHoanThanh || step.thoiHanBuocXuLy || '-'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Nguồn dữ liệu: Google Sheets • Phường Trà Câu
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
