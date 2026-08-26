import * as XLSX from 'xlsx';
import { CitizenReception, ComplaintPetition, ProgressStep } from '../types';
import { formatDateVN, maskCCCD, maskPhone } from './formatters';

export function exportMultiSheetExcel(
  tiepCongDan: CitizenReception[],
  quanLyDonThu: ComplaintPetition[],
  tienDo: ProgressStep[],
  fileName = 'Bao_cao_Tiep_cong_dan_va_Don_thu_Phuong_Tra_Cau.xlsx',
  isPrivacyMode = false
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tổng hợp thống kê
  const totalTcd = tiepCongDan.length;
  const totalDon = quanLyDonThu.length;
  const donDaGiaiQuyet = quanLyDonThu.filter(d => d.trangThaiHoSo.includes('Đã giải quyết')).length;
  const donDangGiaiQuyet = quanLyDonThu.filter(d => d.trangThaiHoSo.includes('Đang')).length;
  const donDungHan = quanLyDonThu.filter(d => d.tinhTrangQuaHan.includes('Đúng hạn') || d.tinhTrangQuaHan.includes('Trong hạn')).length;
  const donQuaHan = quanLyDonThu.filter(d => d.tinhTrangQuaHan.includes('Quá hạn')).length;
  const tyLeGiaiQuyet = totalDon > 0 ? ((donDaGiaiQuyet / totalDon) * 100).toFixed(2) + '%' : '0%';
  const tyLeDungHan = donDaGiaiQuyet > 0 ? ((donDungHan / totalDon) * 100).toFixed(2) + '%' : '100%';

  const summaryData = [
    ['ỦY BAN NHÂN DÂN PHƯỜNG TRÀ CÂU', '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    ['BỘ PHẬN TIẾP CÔNG DÂN & ĐƠN THƯ', '', '', 'Độc lập - Tự do - Hạnh phúc'],
    ['', '', '', ''],
    ['BÁO CÁO TỔNG HỢP THEO DÕI TIẾP CÔNG DÂN VÀ GIẢI QUYẾT ĐƠN THƯ KNTC', '', '', ''],
    ['Ngày xuất báo cáo:', formatDateVN(new Date()), '', isPrivacyMode ? '(Chế độ bảo mật: Đã che CCCD & SĐT)' : ''],
    ['', '', '', ''],
    ['I. CHỈ SỐ TIẾP CÔNG DÂN', 'SỐ LƯỢNG', 'GHI CHÚ', ''],
    ['Tổng số lượt tiếp công dân', totalTcd, 'Lượt', ''],
    ['- Tiếp công dân định kỳ', tiepCongDan.filter(t => t.hinhThucTiep.includes('Định kỳ')).length, 'Lượt', ''],
    ['- Tiếp công dân thường xuyên', tiepCongDan.filter(t => t.hinhThucTiep.includes('Thường xuyên')).length, 'Lượt', ''],
    ['- Tiếp công dân đột xuất', tiepCongDan.filter(t => t.hinhThucTiep.includes('Đột xuất')).length, 'Lượt', ''],
    ['', '', '', ''],
    ['II. CHỈ SỐ QUẢN LÝ ĐƠN THƯ', 'SỐ LƯỢNG', 'GHI CHÚ', ''],
    ['Tổng số đơn tiếp nhận', totalDon, 'Đơn', ''],
    ['- Đơn khiếu nại', quanLyDonThu.filter(d => d.loaiDon.includes('Khiếu nại')).length, 'Đơn', ''],
    ['- Đơn tố cáo', quanLyDonThu.filter(d => d.loaiDon.includes('Tố cáo')).length, 'Đơn', ''],
    ['- Đơn kiến nghị, phản ánh', quanLyDonThu.filter(d => d.loaiDon.includes('Kiến nghị') || d.loaiDon.includes('phản ánh')).length, 'Đơn', ''],
    ['- Đã giải quyết', donDaGiaiQuyet, 'Đơn', ''],
    ['- Đang giải quyết', donDangGiaiQuyet, 'Đơn', ''],
    ['- Đơn đúng hạn / trong hạn', donDungHan, 'Đơn', ''],
    ['- Đơn quá hạn', donQuaHan, 'Đơn', ''],
    ['Tỷ lệ giải quyết chung', tyLeGiaiQuyet, '', ''],
    ['Tỷ lệ giải quyết đúng hạn', tyLeDungHan, '', ''],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Hợp Thống Kê');

  // Sheet 2: Tiếp công dân
  const tcdExportData = tiepCongDan.map((item, i) => ({
    'STT': item.STT || i + 1,
    'Mã lượt tiếp': item.maLuotTiep,
    'Ngày tiếp': item.ngayTiep,
    'Hình thức tiếp': item.hinhThucTiep,
    'Người chủ trì tiếp': item.nguoiChuTri,
    'Họ và tên công dân': item.hoTen,
    'Ngày sinh': item.ngaySinh,
    'CCCD/Định danh': maskCCCD(item.cccd, isPrivacyMode),
    'Địa chỉ': item.diaChi,
    'Số điện thoại': maskPhone(item.soDienThoai, isPrivacyMode),
    'Nội dung trình bày': item.noiDung,
    'Lĩnh vực': item.linhVuc,
    'Phân loại vụ việc': item.phanLoaiVuViec,
    'Thuộc thẩm quyền': item.thuocThamQuyen,
    'Kết quả tiếp': item.ketQuaTiep,
    'Hướng xử lý': item.huongXuLy,
    'Mã đơn liên quan': item.maDonLienQuan,
    'Cán bộ theo dõi': item.canBoTheoDoi,
    'Ghi chú': item.ghiChu,
  }));
  const wsTcd = XLSX.utils.json_to_sheet(tcdExportData);
  XLSX.utils.book_append_sheet(wb, wsTcd, 'Tiếp Công Dân');

  // Sheet 3: Quản lý đơn thư
  const donExportData = quanLyDonThu.map((item, i) => ({
    'STT': item.STT || i + 1,
    'Mã đơn': item.maDon,
    'Số đến': item.soDen,
    'Ngày nhận đơn': item.ngayNhanDon,
    'Hình thức nhận': item.hinhThucNhan,
    'Mã lượt tiếp': item.maLuotTiep,
    'Họ tên người gửi đơn': item.hoTen,
    'Địa chỉ': item.diaChi,
    'Số điện thoại': maskPhone(item.soDienThoai, isPrivacyMode),
    'CCCD': maskCCCD(item.cccd, isPrivacyMode),
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
  }));
  const wsDon = XLSX.utils.json_to_sheet(donExportData);
  XLSX.utils.book_append_sheet(wb, wsDon, 'Quản Lý Đơn Thư');

  // Sheet 4: Tiến độ giải quyết
  const tdExportData = tienDo.map((item, i) => ({
    'STT': item.STT || i + 1,
    'Mã tiến độ': item.maTienDo,
    'Mã đơn': item.maDon,
    'Ngày cập nhật': item.ngayCapNhat,
    'Bước xử lý': item.buocXuLy,
    'Nội dung công việc': item.noiDungCongViec,
    'Cơ quan/Bộ phận thực hiện': item.coQuanThucHien,
    'Người thực hiện': item.nguoiThucHien,
    'Văn bản liên quan': item.vanBanLienQuan,
    'Ngày văn bản': item.ngayVanBan,
    'Thời hạn bước': item.thoiHanBuocXuLy,
    'Kết quả thực hiện': item.ketQuaThucHien,
    'Trạng thái bước': item.trangThaiBuocXuLy,
    'Ngày hoàn thành': item.ngayHoanThanh,
    'Số ngày còn lại/quá hạn': item.soNgayConLai,
    'Cảnh báo tiến độ': item.canhBaoTienDo,
  }));
  const wsTd = XLSX.utils.json_to_sheet(tdExportData);
  XLSX.utils.book_append_sheet(wb, wsTd, 'Tiến Độ Giải Quyết');

  // Trigger download
  XLSX.writeFile(wb, fileName);
}
