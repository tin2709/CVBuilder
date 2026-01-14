import { useSyncExternalStore, useEffect, useState } from 'react';
import { LocalStorageManager } from '@/lib/reactive-storage';

export function useReactiveStorage(manager: LocalStorageManager) {
  // 1. Snapshot phía client
  const data = useSyncExternalStore(
    manager.subscribe,
    manager.getSnapshot,
    () => null // 2. Snapshot phía server (Bắt buộc phải là null để khớp ban đầu)
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Chỉ trả về dữ liệu thật khi đã ở Client
  if (!isClient) return null;

  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return data;
  }
}