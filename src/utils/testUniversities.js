import { database } from '../firebase/config';
import { ref, get } from 'firebase/database';

export const testUniversities = async () => {
  try {
    console.log('=== Testing Universities Loading ===');
    
    const universitiesRef = ref(database, 'universities');
    const snapshot = await get(universitiesRef);
    
    if (snapshot.exists()) {
      const universities = snapshot.val();
      const count = Object.keys(universities).length;
      console.log(`✅ Found ${count} universities in database`);
      
      // Log first few universities
      Object.entries(universities).slice(0, 3).forEach(([id, uni]) => {
        console.log(`- ${uni.name} (${uni.country}) - Rating: ${uni.rating}★`);
      });
      
      return {
        success: true,
        message: `Found ${count} universities`,
        count,
        universities: universities
      };
    } else {
      console.log('❌ No universities found in database');
      return {
        success: false,
        message: 'No universities found in database',
        count: 0
      };
    }
    
  } catch (error) {
    console.error('❌ Error testing universities:', error);
    return {
      success: false,
      message: 'Error testing universities: ' + error.message,
      error
    };
  }
}; 