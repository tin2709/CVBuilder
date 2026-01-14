// src/lib/reactive-storage.ts

export class LocalStorageManager {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // 1. Hàm lắng nghe sự thay đổi (dành cho useSyncExternalStore)
  subscribe = (callback: () => void) => {
        if (typeof window === 'undefined') return () => {}; // Guard cho SSR
    // Lắng nghe thay đổi từ các tab khác (Sự kiện chuẩn của trình duyệt)
    window.addEventListener("storage", (e) => {
      if (e.key === this.key) callback();
    });

    // Lắng nghe thay đổi trong cùng 1 tab (Sự kiện tùy chỉnh)
    window.addEventListener(`local-storage-update-${this.key}`, callback);

    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(`local-storage-update-${this.key}`, callback);
    };
  };

  // 2. Hàm lấy dữ liệu hiện tại (Snapshot)
  getSnapshot = () => {
    if (typeof window === 'undefined') return null; 
    return localStorage.getItem(this.key);
  };

  // 3. Hàm ghi dữ liệu kèm theo phát tín hiệu (Trigger)
  set = (value: any) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(this.key, stringValue);
    
    // Phát sự kiện để báo cho các component trong cùng tab cập nhật ngay lập tức
    window.dispatchEvent(new Event(`local-storage-update-${this.key}`));
  };

  // 4. Hàm xóa dữ liệu
  remove = () => {
    localStorage.removeItem(this.key);
    window.dispatchEvent(new Event(`local-storage-update-${this.key}`));
  };
}

// Khởi tạo các manager cụ thể cho dự án của bạn
export const userStorage = new LocalStorageManager("user");
export const tokenStorage = new LocalStorageManager("accessToken");
export const themeStorage = new LocalStorageManager("theme");
