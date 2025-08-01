import { database } from '../firebase/config';
import { ref, set } from 'firebase/database';

const sampleUniversities = [
  {
    name: "University of Oxford",
    country: "United Kingdom",
    location: "Oxford, England",
    rating: 5,
    students: "24,000+",
    courses: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law"],
    description: "One of the world's oldest and most prestigious universities.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "Harvard University",
    country: "United States",
    location: "Cambridge, Massachusetts",
    rating: 5,
    students: "31,000+",
    courses: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law"],
    description: "America's oldest institution of higher learning.",
    image: "https://images.unsplash.com/photo-1541339907198-1175e01b6a3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "Stanford University",
    country: "United States",
    location: "Stanford, California",
    rating: 5,
    students: "17,000+",
    courses: ["Computer Science", "Engineering", "Business", "Medicine"],
    description: "Located in the heart of Silicon Valley.",
    image: "https://images.unsplash.com/photo-1541339907198-1175e01b6a3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  }
];

export const manualInitialize = async () => {
  try {
    console.log('=== Manual University Initialization ===');
    
    let successCount = 0;
    
    for (let i = 0; i < sampleUniversities.length; i++) {
      const university = sampleUniversities[i];
      const universityRef = ref(database, `universities/manual-${i + 1}`);
      
      try {
        await set(universityRef, university);
        console.log(`✅ Added: ${university.name}`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed to add ${university.name}:`, error.message);
      }
    }
    
    if (successCount > 0) {
      return {
        success: true,
        message: `Successfully added ${successCount} universities manually`,
        count: successCount
      };
    } else {
      return {
        success: false,
        message: 'Failed to add any universities. Check Firebase database rules.',
        count: 0
      };
    }
    
  } catch (error) {
    console.error('Manual initialization error:', error);
    return {
      success: false,
      message: 'Manual initialization failed: ' + error.message,
      error
    };
  }
}; 