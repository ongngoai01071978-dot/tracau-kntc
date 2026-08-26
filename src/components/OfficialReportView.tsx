import React, { useState } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CitizenReception, ComplaintPetition, ProgressStep } from '../types';
import { formatDateVN } from '../utils/formatters';
import { exportMultiSheetExcel } from '../utils/exportUtils';

interface OfficialReportViewProps {
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  onClose?: () => void;
}

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  tiepCongDan,
  quanLyDonThu,
  tienDo,
  onClose,
}) => {
  const [reportPeriod, setReportPeriod] = useState<string>('Năm 2026');
  const [signerTitle, setSignerTitle] = useState<string>('CHỦ TỊCH');
  const [signerName, setSignerName] = useState<string>('Nguyễn Văn Trưởng');
  const [reportNumber, setReportNumber] = useState<string>('45/BC-UBND');

  // Metrics calculation
  const totalTcd = tiepCongDan.length;
  const tcdDinhKy = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Định kỳ')).length;
  const tcdThuongXuyen = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Thường xuyên')).length;
  const tcdDotXuat = tiepCongDan.filter((t) => t.hinhThucTiep.includes('Đột xuất')).length;

  const totalDon = quanLyDonThu.length;
  const donKhieuNai = quanLyDonThu.filter((d) => d.loaiDon.includes('Khiếu nại')).length;
  const donToCao = quanLyDonThu.filter((d) => d.loaiDon.includes('Tố cáo')).length;
  const donKienNghi = quanLyDonThu.filter(
    (d) => d.loaiDon.includes('Kiến nghị') || d.loaiDon.includes('phản ánh')
  ).length;

  const donDaGiaiQuyet = quanLyDonThu.filter((d) => d.trangThaiHoSo.includes('Đã giải quyết')).length;
  const donDangGiaiQuyet = quanLyDonThu.filter((d) => d.trangThaiHoSo.includes('Đang')).length;
  const tyLeGiaiQuyet = totalDon > 0 ? ((donDaGiaiQuyet / totalDon) * 100).toFixed(2) : '0.00';

  const donDungHan = quanLyDonThu.filter(
    (d) => d.tinhTrangQuaHan.includes('Đúng hạn') || d.tinhTrangQuaHan.includes('Trong hạn')
  ).length;
  const donQuaHan = quanLyDonThu.filter((d) => d.tinhTrangQuaHan.includes('Quá hạn')).length;
  const tyLeDungHan = donDaGiaiQuyet > 0 ? (((donDaGiaiQuyet - donQuaHan) / donDaGiaiQuyet) * 100).toFixed(2) : '100.00';

  // Field breakdown
  const fields = ['Đất đai', 'Chính sách', 'Hành chính', 'Môi trường', 'Tranh chấp dân sự'];
  const fieldBreakdown = fields.map((f) => {
    const tcdCount = tiepCongDan.filter((t) => t.linhVuc.includes(f)).length;
    const donCount = quanLyDonThu.filter((d) => d.linhVuc.includes(f)).length;
    const resolvedCount = quanLyDonThu.filter(
      (d) => d.linhVuc.includes(f) && d.trangThaiHoSo.includes('Đã giải quyết')
    ).length;
    return {
      field: f,
      tcdCount,
      donCount,
      resolvedCount,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportMultiSheetExcel(tiepCongDan, quanLyDonThu, tienDo, `Bao_cao_Tiep_cong_dan_${reportPeriod.replace(/\s+/g, '_')}.xlsx`);
  };

  const today = new Date();
  const dateStr = `Trà Câu, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Control Bar (hidden when printing) */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Kỳ báo cáo:</label>
            <input
              type="text"
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Số văn bản:</label>
            <input
              type="text"
              value={reportNumber}
              onChange={(e) => setReportNumber(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Người ký:</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Chức vụ:</label>
            <select
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="CHỦ TỊCH">CHỦ TỊCH</option>
              <option value="PHÓ CHỦ TỊCH">PHÓ CHỦ TỊCH</option>
              <option value="CÁN BỘ PHỤ TRÁCH">CÁN BỘ PHỤ TRÁCH</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel Đầy Đủ</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Official Vietnamese Government Standard Layout */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-md font-serif text-[13.5px] leading-relaxed print:p-0 print:border-none print:shadow-none print:m-0">
        {/* National Header */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-300">
          <div className="text-center font-sans">
            <div className="font-semibold text-xs tracking-wider">ỦY BAN NHÂN DÂN</div>
            <div className="font-bold text-sm tracking-wide">PHƯỜNG TRÀ CÂU</div>
            <div className="text-xs text-slate-600 mt-1">Số: {reportNumber}</div>
          </div>

          <div className="text-center font-sans">
            <div className="font-bold text-xs tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold text-xs tracking-wider underline underline-offset-4 decoration-1">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="text-xs italic text-slate-600 mt-2 font-serif">{dateStr}</div>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center my-8 font-sans">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-900">
            BÁO CÁO
          </h1>
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-800 mt-1">
            KẾT QUẢ CÔNG TÁC TIẾP CÔNG DÂN, XỬ LÝ ĐƠN THƯ VÀ GIẢI QUYẾT KHIẾU NẠI, TỐ CÁO
          </h2>
          <p className="text-xs font-medium text-slate-600 italic mt-1 font-serif">
            (Số liệu tổng hợp trên hệ thống cơ sở dữ liệu Google Sheets - Kỳ {reportPeriod})
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-justify">
          <p>
            Kính gửi: <strong>Ủy ban nhân dân thị xã / Thường trực Đảng ủy phường Trà Câu</strong>.
          </p>
          <p>
            Ủy ban nhân dân phường Trà Câu trân trọng báo cáo kết quả thực hiện công tác tiếp công dân, tiếp nhận,
            phân loại, xử lý đơn thư khiếu nại, tố cáo, kiến nghị, phản ánh trên địa bàn phường như sau:
          </p>

          {/* Section I */}
          <div>
            <h3 className="font-bold font-sans text-sm uppercase text-slate-900 mb-2">
              I. TÌNH HÌNH VÀ KẾT QUẢ TIẾP CÔNG DÂN
            </h3>
            <p className="mb-3">
              Trong kỳ báo cáo, UBND phường đã thực hiện nghiêm túc Quy chế tiếp công dân theo quy định của Luật Tiếp công dân;
              bố trí lịch tiếp định kỳ của Lãnh đạo UBND phường và phân công cán bộ chuyên môn thường trực tiếp công dân
              thường xuyên, đột xuất.
            </p>
            <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-3">
              <thead>
                <tr className="bg-slate-100 font-bold text-center">
                  <th className="border border-slate-400 p-2">STT</th>
                  <th className="border border-slate-400 p-2">Chỉ tiêu tiếp công dân</th>
                  <th className="border border-slate-400 p-2">Số lượt</th>
                  <th className="border border-slate-400 p-2">Tỷ lệ (%)</th>
                  <th className="border border-slate-400 p-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold">1</td>
                  <td className="border border-slate-400 p-2 font-bold">Tổng số lượt tiếp công dân</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">{totalTcd}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">100.0%</td>
                  <td className="border border-slate-400 p-2 text-center">Tất cả các vụ việc</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">a</td>
                  <td className="border border-slate-400 p-2">Tiếp công dân định kỳ (Lãnh đạo UBND phường)</td>
                  <td className="border border-slate-400 p-2 text-center">{tcdDinhKy}</td>
                  <td className="border border-slate-400 p-2 text-center">{totalTcd > 0 ? ((tcdDinhKy/totalTcd)*100).toFixed(1) : 0}%</td>
                  <td className="border border-slate-400 p-2 text-center">Thực hiện theo lịch</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">b</td>
                  <td className="border border-slate-400 p-2">Tiếp công dân thường xuyên</td>
                  <td className="border border-slate-400 p-2 text-center">{tcdThuongXuyen}</td>
                  <td className="border border-slate-400 p-2 text-center">{totalTcd > 0 ? ((tcdThuongXuyen/totalTcd)*100).toFixed(1) : 0}%</td>
                  <td className="border border-slate-400 p-2 text-center">Bộ phận một cửa & tiếp dân</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">c</td>
                  <td className="border border-slate-400 p-2">Tiếp công dân đột xuất</td>
                  <td className="border border-slate-400 p-2 text-center">{tcdDotXuat}</td>
                  <td className="border border-slate-400 p-2 text-center">{totalTcd > 0 ? ((tcdDotXuat/totalTcd)*100).toFixed(1) : 0}%</td>
                  <td className="border border-slate-400 p-2 text-center">Vụ việc phát sinh</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section II */}
          <div>
            <h3 className="font-bold font-sans text-sm uppercase text-slate-900 mb-2">
              II. KẾT QUẢ TIẾP NHẬN, XỬ LÝ VÀ GIẢI QUYẾT ĐƠN THƯ
            </h3>
            <p className="mb-2">
              1. <strong>Tổng số đơn tiếp nhận:</strong> Toàn phường tiếp nhận tổng cộng <strong>{totalDon}</strong> đơn thư
              (trong đó: Khiếu nại: <strong>{donKhieuNai}</strong> đơn; Tố cáo: <strong>{donToCao}</strong> đơn; Kiến nghị, phản ánh: <strong>{donKienNghi}</strong> đơn).
              100% đơn thư thuộc thẩm quyền giải quyết của UBND phường Trà Câu.
            </p>
            <p className="mb-3">
              2. <strong>Kết quả giải quyết:</strong>
              <br />- Đã giải quyết xong: <strong>{donDaGiaiQuyet}</strong> / {totalDon} đơn, đạt tỷ lệ <strong>{tyLeGiaiQuyet}%</strong>.
              <br />- Đang tiếp tục xác minh, giải quyết: <strong>{donDangGiaiQuyet}</strong> đơn.
              <br />- Tỷ lệ giải quyết đúng hạn: <strong>{tyLeDungHan}%</strong> (có {donQuaHan} đơn quá hạn đang được tập trung chỉ đạo dứt điểm).
            </p>

            <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-3">
              <thead>
                <tr className="bg-slate-100 font-bold text-center">
                  <th className="border border-slate-400 p-2">STT</th>
                  <th className="border border-slate-400 p-2">Lĩnh vực</th>
                  <th className="border border-slate-400 p-2">Lượt tiếp CD</th>
                  <th className="border border-slate-400 p-2">Số đơn tiếp nhận</th>
                  <th className="border border-slate-400 p-2">Đã giải quyết</th>
                  <th className="border border-slate-400 p-2">Tỷ lệ GQ</th>
                </tr>
              </thead>
              <tbody>
                {fieldBreakdown.map((row, idx) => (
                  <tr key={row.field}>
                    <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 font-medium">{row.field}</td>
                    <td className="border border-slate-400 p-2 text-center">{row.tcdCount}</td>
                    <td className="border border-slate-400 p-2 text-center font-bold">{row.donCount}</td>
                    <td className="border border-slate-400 p-2 text-center text-emerald-800 font-bold">{row.resolvedCount}</td>
                    <td className="border border-slate-400 p-2 text-center font-bold">
                      {row.donCount > 0 ? ((row.resolvedCount / row.donCount) * 100).toFixed(1) + '%' : '100%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section III */}
          <div>
            <h3 className="font-bold font-sans text-sm uppercase text-slate-900 mb-2">
              III. ĐÁNH GIÁ CHUNG VÀ NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI
            </h3>
            <p className="mb-2">
              - <strong>Ưu điểm:</strong> Công tác tiếp công dân và giải quyết đơn thư được thực hiện đồng bộ, công khai,
              minh bạch; ứng dụng chuyển đổi số theo dõi thời gian thực giúp lãnh đạo phường nắm chắc tiến độ từng vụ việc,
              hạn chế tối đa tình trạng chậm trễ kéo dài.
            </p>
            <p>
              - <strong>Phương hướng:</strong> Tiếp tục tập trung giải quyết dứt điểm các hồ sơ đơn thư trong lĩnh vực đất đai
              và chính sách; tăng cường phối hợp giữa cán bộ chuyên môn và các tổ dân phố để hòa giải ngay tại cơ sở.
            </p>
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-6 font-sans text-xs">
          <div className="text-left">
            <div className="font-bold uppercase mb-1">Nơi nhận:</div>
            <div className="text-[11px] text-slate-700 leading-normal">
              - Thường trực Đảng ủy phường (b/c);<br />
              - Thường trực HĐND phường;<br />
              - Chủ tịch, các PCT UBND phường;<br />
              - Bộ phận Tiếp dân, Địa chính, Tư pháp;<br />
              - Lưu: VT, HS-TCD.
            </div>
          </div>

          <div className="text-center">
            <div className="font-bold uppercase text-slate-900">{signerTitle}</div>
            <div className="text-slate-500 italic text-[11px] mb-16">
              (Ký, ghi rõ họ tên và đóng dấu)
            </div>
            <div className="font-bold text-sm text-slate-900">{signerName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
