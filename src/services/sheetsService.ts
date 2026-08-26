import Papa from 'papaparse';
import {
  CitizenReception,
  ComplaintPetition,
  ProgressStep,
  SyncState,
} from '../types';
import {
  FALLBACK_TIEP_CONG_DAN,
  FALLBACK_QUAN_LY_DON_THU,
  FALLBACK_TIEN_DO_GIAI_QUYET,
} from '../data/fallbackData';

export const SPREADSHEET_ID = '1P_DajsvgIjI-x_vfluUeKjpSmQji_fn2uvqVb4qt8V0';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=2097799911#gid=2097799911`;

export const GID_MAP = {
  summary: '2097799911',
  tiepCongDan: '1431774129',
  quanLyDonThu: '1172886670',
  tienDo: '103681898',
};

function getGvizUrl(gid: string): string {
  // Use timestamp parameter to bypass browser caching and ensure real-time fresh fetch
  const cacheBuster = Date.now();
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${cacheBuster}`;
}

// Convert raw header keys to normalized CamelCase objects
export function normalizeTiepCongDan(rows: Record<string, string>[]): CitizenReception[] {
  return rows.map((r, index) => {
    return {
      STT: r['STT'] || String(index + 1),
      maLuotTiep: r['Mã lượt tiếp'] || '',
      ngayTiep: r['Ngày tiếp'] || '',
      hinhThucTiep: r['Hình thức tiếp'] || '',
      nguoiChuTri: r['Người chủ trì tiếp'] || '',
      hoTen: r['Họ và tên công dân'] || '',
      ngaySinh: r['Ngày sinh'] || '',
      cccd: r['CCCD/Định danh'] || '',
      diaChi: r['Địa chỉ'] || '',
      soDienThoai: r['Số điện thoại'] || '',
      noiDung: r['Nội dung trình bày'] || '',
      linhVuc: r['Lĩnh vực'] || '',
      phanLoaiVuViec: r['Phân loại vụ việc'] || '',
      thuocThamQuyen: r['Thuộc thẩm quyền'] || 'Có',
      ketQuaTiep: r['Kết quả tiếp'] || '',
      huongXuLy: r['Hướng xử lý'] || '',
      maDonLienQuan: r['Mã đơn liên quan'] || '',
      canBoTheoDoi: r['Cán bộ theo dõi'] || '',
      ghiChu: r['Ghi chú'] || '',
    };
  }).filter(r => Boolean(r.maLuotTiep || r.hoTen));
}

export function normalizeQuanLyDonThu(rows: Record<string, string>[]): ComplaintPetition[] {
  return rows.map((r, index) => {
    return {
      STT: r['STT'] || String(index + 1),
      maDon: r['Mã đơn'] || '',
      soDen: r['Số đến'] || '',
      ngayNhanDon: r['Ngày nhận đơn'] || '',
      hinhThucNhan: r['Hình thức nhận'] || '',
      maLuotTiep: r['Mã lượt tiếp công dân'] || '',
      hoTen: r['Họ tên người gửi đơn'] || '',
      diaChi: r['Địa chỉ'] || '',
      soDienThoai: r['Số điện thoại'] || '',
      cccd: r['Số CCCD/Định danh'] || '',
      loaiDon: r['Loại đơn'] || '',
      noiDungTomTat: r['Nội dung tóm tắt'] || '',
      linhVuc: r['Lĩnh vực'] || '',
      donLanDau: r['Đơn lần đầu/lần tiếp theo'] || 'Lần đầu',
      thuocThamQuyen: r['Thuộc thẩm quyền'] || 'Có',
      coQuanThamQuyen: r['Cơ quan có thẩm quyền'] || '',
      ketQuaPhanLoai: r['Kết quả phân loại'] || '',
      ngayXuLyBanDau: r['Ngày xử lý ban đầu'] || '',
      soVanBanXuLy: r['Số văn bản xử lý'] || '',
      ngayBanHanhVanBan: r['Ngày ban hành văn bản'] || '',
      canBoThamMuu: r['Cán bộ tham mưu'] || '',
      trangThaiHoSo: r['Trạng thái hồ sơ'] || '',
      hanGiaiQuyet: r['Hạn giải quyết'] || '',
      ngayKetThuc: r['Ngày kết thúc'] || '',
      ketQuaCuoiCung: r['Kết quả cuối cùng'] || '',
      tinhTrangQuaHan: r['Tình trạng quá hạn'] || '',
      lyDoQuaHan: r['Lý do quá hạn'] || '',
      ghiChu: r['Ghi chú'] || '',
      soNgayXuLy: r['Số ngày xử lý'] || '',
      soNgayQuaHan: r['Số ngày quá hạn'] || '',
    };
  }).filter(r => Boolean(r.maDon || r.hoTen));
}

export function normalizeTienDo(rows: Record<string, string>[]): ProgressStep[] {
  return rows.map((r, index) => {
    return {
      STT: r['STT'] || String(index + 1),
      maTienDo: r['Mã tiến độ'] || '',
      maDon: r['Mã đơn'] || '',
      ngayCapNhat: r['Ngày cập nhật'] || '',
      buocXuLy: r['Bước xử lý'] || '',
      noiDungCongViec: r['Nội dung công việc'] || '',
      coQuanThucHien: r['Cơ quan/Bộ phận thực hiện'] || '',
      nguoiThucHien: r['Người thực hiện'] || '',
      vanBanLienQuan: r['Văn bản liên quan'] || '',
      ngayVanBan: r['Ngày văn bản'] || '',
      thoiHanBuocXuLy: r['Thời hạn bước xử lý'] || '',
      ketQuaThucHien: r['Kết quả thực hiện'] || '',
      trangThaiBuocXuLy: r['Trạng thái bước xử lý'] || '',
      ngayHoanThanh: r['Ngày hoàn thành'] || '',
      soNgayConLai: r['Số ngày còn lại/quá hạn'] || '',
      tepDinhKem: r['Tệp đính kèm'] || '',
      ghiChu: r['Ghi chú'] || '',
      loaiDon: r['Loại đơn (tự động)'] || '',
      nguoiGuiDon: r['Người gửi đơn (tự động)'] || '',
      hanGiaiQuyet: r['Hạn giải quyết (tự động)'] || '',
      trangThaiHoSo: r['Trạng thái hồ sơ (tự động)'] || '',
      canhBaoTienDo: r['Cảnh báo tiến độ'] || '',
    };
  }).filter(r => Boolean(r.maTienDo || r.maDon));
}

async function fetchCsvSheet(gid: string): Promise<Record<string, string>[]> {
  const url = getGvizUrl(gid);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/csv, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu Google Sheets (${response.status}: ${response.statusText})`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error(`Lỗi định dạng dữ liệu Google Sheets: ${parsed.errors[0].message}`);
  }

  return parsed.data;
}

export async function fetchAllSheetData(): Promise<{
  tiepCongDan: CitizenReception[];
  quanLyDonThu: ComplaintPetition[];
  tienDo: ProgressStep[];
  isFallback: boolean;
}> {
  try {
    const [tcdRaw, donRaw, tdRaw] = await Promise.all([
      fetchCsvSheet(GID_MAP.tiepCongDan),
      fetchCsvSheet(GID_MAP.quanLyDonThu),
      fetchCsvSheet(GID_MAP.tienDo),
    ]);

    const tiepCongDan = normalizeTiepCongDan(tcdRaw);
    const quanLyDonThu = normalizeQuanLyDonThu(donRaw);
    const tienDo = normalizeTienDo(tdRaw);

    if (tiepCongDan.length === 0 && quanLyDonThu.length === 0) {
      throw new Error('Dữ liệu từ Google Sheets trả về rỗng');
    }

    return {
      tiepCongDan,
      quanLyDonThu,
      tienDo,
      isFallback: false,
    };
  } catch (error) {
    console.warn('Sử dụng bộ dữ liệu dự phòng chuẩn từ Google Sheets do lỗi mạng:', error);
    return {
      tiepCongDan: normalizeTiepCongDan(FALLBACK_TIEP_CONG_DAN as unknown as Record<string, string>[]),
      quanLyDonThu: normalizeQuanLyDonThu(FALLBACK_QUAN_LY_DON_THU as unknown as Record<string, string>[]),
      tienDo: normalizeTienDo(FALLBACK_TIEN_DO_GIAI_QUYET as unknown as Record<string, string>[]),
      isFallback: true,
    };
  }
}
