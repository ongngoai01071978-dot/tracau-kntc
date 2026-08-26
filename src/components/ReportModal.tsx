import React from 'react';
import { X } from 'lucide-react';
import { CitizenReception, ComplaintPetition, ProgressStep } from '../types';
import { OfficialReportView } from './OfficialReportView';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  tiepCongDan,
  quanLyDonThu,
  tienDo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>BÁO CÁO HÀNH CHÍNH CHUẨN - UBND PHƯỜNG TRÀ CÂU</span>
            </h3>
            <p className="text-xs text-slate-400">Xuất file văn bản phục vụ báo cáo cấp ủy, HĐND và UBND cấp trên</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <OfficialReportView
            tiepCongDan={tiepCongDan}
            quanLyDonThu={quanLyDonThu}
            tienDo={tienDo}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
