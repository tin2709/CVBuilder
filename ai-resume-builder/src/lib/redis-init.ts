// src/lib/redis-init.ts
import { redis } from './db';

export async function initRedisIndices() {
  try {
    await redis.ft.create(
      'idx:candidates', 
      {
        '$.headline': {
          type: 'TEXT', // Dùng chuỗi trực tiếp thay vì Enum
          AS: 'headline'
        },
          '$.skills[*]': { type: 'TEXT', AS: 'skills' }, // Đổi từ TAG sang TEXT

        '$.experience': {
          type: 'TEXT', // Dùng chuỗi trực tiếp
          AS: 'experience'
        }
      },
      {
        ON: 'JSON',
        PREFIX: 'candidate:'
      }
    );
    console.log('✅ [Redis] Index "idx:candidates" created.');
  } catch (error: any) {
    if (error.message.includes('Index already exists')) {
      console.log('ℹ️ [Redis] Index already exists. Skipping...');
    } else {
      console.error('❌ [Redis] Error:', error);
    }
  }
}