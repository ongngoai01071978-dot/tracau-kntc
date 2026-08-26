export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  let clean = str.toLowerCase();
  clean = clean.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  clean = clean.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  clean = clean.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  clean = clean.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  clean = clean.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  clean = clean.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  clean = clean.replace(/đ/g, 'd');
  // Combining Diacritical Marks
  clean = clean.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  clean = clean.replace(/\u02C6|\u0306|\u031B/g, '');
  return clean.trim();
}

export function maskCCCD(cccd?: string, isMasked: boolean = false): string {
  if (!cccd || cccd.trim() === '' || cccd.trim() === '-') return '-';
  const clean = cccd.trim();
  if (!isMasked) return clean;
  if (clean.length <= 4) return '••••';
  if (clean.length <= 8) return clean.substring(0, 2) + '••••' + clean.substring(clean.length - 2);
  // Standard 12-digit Vietnamese CCCD: 051098001234 -> 0510••••••34
  return clean.substring(0, 4) + '••••••' + clean.substring(clean.length - 2);
}

export function maskPhone(phone?: string, isMasked: boolean = false): string {
  if (!phone || phone.trim() === '' || phone.trim() === '-') return '-';
  const clean = phone.trim();
  if (!isMasked) return clean;
  if (clean.length <= 4) return '••••';
  if (clean.length <= 7) return clean.substring(0, 2) + '•••' + clean.substring(clean.length - 2);
  // Standard 10-digit Vietnamese Phone: 0914123456 -> 0914••••56
  return clean.substring(0, 4) + '••••' + clean.substring(clean.length - 2);
}

export function maskName(name?: string, isMasked: boolean = false): string {
  if (!name || name.trim() === '' || name.trim() === '-') return '-';
  if (!isMasked) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  return parts[0] + ' ' + parts.slice(1).map((p) => p.charAt(0) + '•••').join(' ');
}

export function maskSensitiveInfo(val?: string, type: 'cccd' | 'phone' | 'name' = 'name', isMasked: boolean = true): string {
  if (!val) return '-';
  if (type === 'cccd') return maskCCCD(val, isMasked);
  if (type === 'phone') return maskPhone(val, isMasked);
  return maskName(val, isMasked);
}

export function parseDateVN(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return new Date(clean);
      } else {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDateVN(date?: Date | string | null): string {
  if (!date) return '-';
  if (typeof date === 'string') {
    const parsed = parseDateVN(date);
    if (!parsed) return date;
    date = parsed;
  }
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function extractToDanPho(address?: string): string {
  if (!address) return 'Chưa xác định';
  const match = address.match(/Tổ dân phố\s*([0-9A-Za-z\s]+?)(?:,|\.|$)/i);
  if (match && match[0]) {
    return match[0].replace(/,$/, '').trim();
  }
  const match2 = address.match(/TDP\s*([0-9A-Za-z\s]+?)(?:,|\.|$)/i);
  if (match2 && match2[0]) {
    return 'Tổ dân phố ' + match2[1].trim();
  }
  return 'Khu dân cư khác';
}

export function getStatusBadgeClass(status?: string, isHighContrast: boolean = false): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const s = (status || '').toLowerCase().trim();

  // High contrast mode for colorblind users: Deep Blue (#1d4ed8) for positive/completed vs Vivid Amber/Orange (#f59e0b) for overdue/urgent
  if (isHighContrast) {
    if (s.includes('đã giải quyết') || s.includes('hoàn thành') || s.includes('đúng hạn')) {
      return {
        bg: 'bg-blue-700 text-white dark:bg-blue-800 dark:text-blue-50 shadow-xs',
        text: 'text-blue-700 dark:text-blue-300 font-bold',
        border: 'border-blue-500 dark:border-blue-400',
        label: status || 'Đã giải quyết',
      };
    }
    if (s.includes('quá hạn')) {
      return {
        bg: 'bg-amber-500 text-slate-950 font-bold dark:bg-amber-600 dark:text-slate-950 animate-pulse shadow-xs',
        text: 'text-amber-600 dark:text-amber-400 font-bold',
        border: 'border-amber-400 dark:border-amber-300',
        label: status || 'Quá hạn',
      };
    }
    if (s.includes('sắp đến hạn') || s.includes('≤24')) {
      return {
        bg: 'bg-amber-400/90 text-slate-950 font-semibold dark:bg-amber-700 dark:text-amber-100',
        text: 'text-amber-700 dark:text-amber-300 font-bold',
        border: 'border-amber-300 dark:border-amber-500',
        label: status || 'Sắp đến hạn',
      };
    }
    if (s.includes('đang') || s.includes('trong hạn') || s.includes('thụ lý')) {
      return {
        bg: 'bg-sky-800 text-white dark:bg-sky-900 dark:text-sky-100',
        text: 'text-sky-700 dark:text-sky-300 font-bold',
        border: 'border-sky-500 dark:border-sky-400',
        label: status || 'Đang xử lý',
      };
    }
    return {
      bg: 'bg-slate-700 text-white dark:bg-slate-800 dark:text-slate-200',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-500 dark:border-slate-600',
      label: status || 'Chưa phân loại',
    };
  }

  // Standard palettes
  if (s.includes('đã giải quyết') || s.includes('hoàn thành') || s.includes('đúng hạn')) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      label: status || 'Đã giải quyết',
    };
  }
  if (s.includes('quá hạn')) {
    return {
      bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      label: status || 'Quá hạn',
    };
  }
  if (s.includes('sắp đến hạn') || s.includes('≤24')) {
    return {
      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
      label: status || 'Sắp đến hạn',
    };
  }
  if (s.includes('đang') || s.includes('trong hạn') || s.includes('thụ lý')) {
    return {
      bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      label: status || 'Đang xử lý',
    };
  }
  return {
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    label: status || 'Chưa phân loại',
  };
}
