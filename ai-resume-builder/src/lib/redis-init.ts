// src/lib/redis-init.ts
import { redis } from './db';

export async function initRedisIndices() {
  try {
    // Trong ioredis, chúng ta dùng .call('TÊN_LỆNH', ...các_tham_số)
    await redis.call(
      'FT.CREATE',
      'idx:candidates',
      'ON', 'JSON',
      'PREFIX', '1', 'candidate:',
      'SCHEMA',
      '$.headline', 'AS', 'headline', 'TEXT',
      '$.skills[*]', 'AS', 'skills', 'TEXT',
      '$.experience', 'AS', 'experience', 'TEXT'
    );
    
    console.log('✅ [Redis] Index "idx:candidates" created using ioredis.');
  } catch (error: any) {
    // Lỗi từ Redis server trả về khi dùng .call() thường nằm trong error.message
    if (error.message && error.message.includes('Index already exists')) {
      console.log('ℹ️ [Redis] Index "idx:candidates" already exists. Skipping...');
    } else {
      console.error('❌ [Redis] Error creating index:', error.message || error);
    }
  }
}