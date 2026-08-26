export type ThemeMode = 'ceremonial' | 'command_center' | 'standard_office';

export type ToastPosition = 'top-right' | 'bottom-right';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  shortName: string;
  description: string;
  tag: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ceremonial',
    name: 'Chế độ trang trọng / Hội nghị',
    shortName: 'Trang trọng / Hội nghị',
    description: 'Tông đỏ đô - vàng đồng trang trọng, phục vụ hội nghị, kỳ họp HĐND và trình chiếu lãnh đạo',
    tag: 'Hội nghị',
  },
  {
    id: 'command_center',
    name: 'Chế độ ban đêm / Trung tâm điều hành',
    shortName: 'Ban đêm / TT Điều hành',
    description: 'Giao diện tối chuyên sâu tương phản cao cho màn hình lớn IOC, giám sát ca trực ban đêm',
    tag: 'IOC / Ban đêm',
  },
  {
    id: 'standard_office',
    name: 'Chế độ sáng chuẩn văn phòng',
    shortName: 'Sáng chuẩn văn phòng',
    description: 'Giao diện sáng thanh lịch, độ tương phản chuẩn cho công chức xử lý hồ sơ ban ngày',
    tag: 'Văn phòng',
  },
];

export interface CitizenReception {
  STT: string;
  maLuotTiep: string; // "Mã lượt tiếp"
  ngayTiep: string; // "Ngày tiếp" (DD/MM/YYYY)
  hinhThucTiep: string; // "Hình thức tiếp" (Định kỳ, Thường xuyên, Đột xuất)
  nguoiChuTri: string; // "Người chủ trì tiếp"
  hoTen: string; // "Họ và tên công dân"
  ngaySinh: string; // "Ngày sinh"
  cccd: string; // "CCCD/Định danh"
  diaChi: string; // "Địa chỉ"
  soDienThoai: string; // "Số điện thoại"
  noiDung: string; // "Nội dung trình bày"
  linhVuc: string; // "Lĩnh vực" (Đất đai, Chính sách, Hành chính, Môi trường, Tranh chấp dân sự)
  phanLoaiVuViec: string; // "Phân loại vụ việc" (Khiếu nại, Tố cáo, Kiến nghị, phản ánh)
  thuocThamQuyen: string; // "Thuộc thẩm quyền" (Có, Không)
  ketQuaTiep: string; // "Kết quả tiếp"
  huongXuLy: string; // "Hướng xử lý"
  maDonLienQuan: string; // "Mã đơn liên quan"
  canBoTheoDoi: string; // "Cán bộ theo dõi"
  ghiChu: string; // "Ghi chú"
  [key: string]: string;
}

export interface ComplaintPetition {
  STT: string;
  maDon: string; // "Mã đơn"
  soDen: string; // "Số đến"
  ngayNhanDon: string; // "Ngày nhận đơn"
  hinhThucNhan: string; // "Hình thức nhận" (Trực tiếp, Qua bưu điện, Trực tuyến)
  maLuotTiep: string; // "Mã lượt tiếp công dân"
  hoTen: string; // "Họ tên người gửi đơn"
  diaChi: string; // "Địa chỉ"
  soDienThoai: string; // "Số điện thoại"
  cccd: string; // "Số CCCD/Định danh"
  loaiDon: string; // "Loại đơn" (Khiếu nại, Tố cáo, Kiến nghị, phản ánh)
  noiDungTomTat: string; // "Nội dung tóm tắt"
  linhVuc: string; // "Lĩnh vực"
  donLanDau: string; // "Đơn lần đầu/lần tiếp theo"
  thuocThamQuyen: string; // "Thuộc thẩm quyền"
  coQuanThamQuyen: string; // "Cơ quan có thẩm quyền"
  ketQuaPhanLoai: string; // "Kết quả phân loại"
  ngayXuLyBanDau: string; // "Ngày xử lý ban đầu"
  soVanBanXuLy: string; // "Số văn bản xử lý"
  ngayBanHanhVanBan: string; // "Ngày ban hành văn bản"
  canBoThamMuu: string; // "Cán bộ tham mưu"
  trangThaiHoSo: string; // "Trạng thái hồ sơ" (Đã giải quyết, Đang giải quyết)
  hanGiaiQuyet: string; // "Hạn giải quyết"
  ngayKetThuc: string; // "Ngày kết thúc"
  ketQuaCuoiCung: string; // "Kết quả cuối cùng"
  tinhTrangQuaHan: string; // "Tình trạng quá hạn" (Đúng hạn, Trong hạn, Quá hạn, Sắp đến hạn)
  lyDoQuaHan: string; // "Lý do quá hạn"
  ghiChu: string; // "Ghi chú"
  soNgayXuLy: string; // "Số ngày xử lý"
  soNgayQuaHan: string; // "Số ngày quá hạn"
  [key: string]: string;
}

export interface ProgressStep {
  STT: string;
  maTienDo: string; // "Mã tiến độ"
  maDon: string; // "Mã đơn"
  ngayCapNhat: string; // "Ngày cập nhật"
  buocXuLy: string; // "Bước xử lý"
  noiDungCongViec: string; // "Nội dung công việc"
  coQuanThucHien: string; // "Cơ quan/Bộ phận thực hiện"
  nguoiThucHien: string; // "Người thực hiện"
  vanBanLienQuan: string; // "Văn bản liên quan"
  ngayVanBan: string; // "Ngày văn bản"
  thoiHanBuocXuLy: string; // "Thời hạn bước xử lý"
  ketQuaThucHien: string; // "Kết quả thực hiện"
  trangThaiBuocXuLy: string; // "Trạng thái bước xử lý"
  ngayHoanThanh: string; // "Ngày hoàn thành"
  soNgayConLai: string; // "Số ngày còn lại/quá hạn"
  tepDinhKem: string; // "Tệp đính kèm"
  ghiChu: string; // "Ghi chú"
  loaiDon: string; // "Loại đơn (tự động)"
  nguoiGuiDon: string; // "Người gửi đơn (tự động)"
  hanGiaiQuyet: string; // "Hạn giải quyết (tự động)"
  trangThaiHoSo: string; // "Trạng thái hồ sơ (tự động)"
  canhBaoTienDo: string; // "Cảnh báo tiến độ" (Hoàn thành, ĐANG TRONG HẠN, SẮP ĐẾN HẠN (≤24 GIỜ), QUÁ HẠN)
  [key: string]: string;
}

export interface SyncState {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  status: 'idle' | 'success' | 'error' | 'syncing';
  errorMessage?: string;
  sourceUrl: string;
  recordCount: {
    tiepCongDan: number;
    quanLyDonThu: number;
    tienDo: number;
  };
}

export interface FilterState {
  searchQuery: string;
  dateRange: 'all' | 'today' | 'this_month' | 'this_quarter' | 'this_year' | 'custom';
  startDate?: string;
  endDate?: string;
  linhVuc: string; // "all" or specific
  loaiDon: string; // "all" or specific
  trangThai: string; // "all" | "Đã giải quyết" | "Đang giải quyết"
  tinhTrangHan: string; // "all" | "Đúng hạn" | "Trong hạn" | "Sắp đến hạn" | "Quá hạn"
  hinhThuc: string; // "all" or specific
  canBo: string; // "all" or specific
  toDanPho: string; // "all" or specific
}

export type ActiveTab = 'overview' | 'tiep-cong-dan' | 'quan-ly-don-thu' | 'tien-do' | 'bao-cao';
