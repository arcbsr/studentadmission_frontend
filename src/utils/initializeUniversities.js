import { database } from '../firebase/config';
import { ref, set, get } from 'firebase/database';

const defaultUniversities = [
  {
    name: "University of Oxford",
    country: "United Kingdom",
    location: "Oxford, England",
    rating: 5,
    students: "24,000+",
    courses: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law"],
    description: "One of the world's oldest and most prestigious universities, known for academic excellence and research.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "Harvard University",
    country: "United States",
    location: "Cambridge, Massachusetts",
    rating: 5,
    students: "31,000+",
    courses: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law", "Arts & Sciences"],
    description: "America's oldest institution of higher learning, consistently ranked among the world's top universities.",
    image: "https://images.unsplash.com/photo-1541339907198-1175e01b6a3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Cambridge",
    country: "United Kingdom",
    location: "Cambridge, England",
    rating: 5,
    students: "23,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Natural Sciences", "Humanities"],
    description: "A collegiate research university with a rich history dating back to 1209.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "Stanford University",
    country: "United States",
    location: "Stanford, California",
    rating: 5,
    students: "17,000+",
    courses: ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Arts & Sciences"],
    description: "Located in the heart of Silicon Valley, known for innovation and entrepreneurship.",
    image: "https://images.unsplash.com/photo-1541339907198-1175e01b6a3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "MIT (Massachusetts Institute of Technology)",
    country: "United States",
    location: "Cambridge, Massachusetts",
    rating: 5,
    students: "11,000+",
    courses: ["Computer Science", "Engineering", "Physics", "Mathematics", "Architecture"],
    description: "World-renowned for science and technology research and education.",
    image: "https://images.unsplash.com/photo-1541339907198-1175e01b6a3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Toronto",
    country: "Canada",
    location: "Toronto, Ontario",
    rating: 4,
    students: "95,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Arts & Science", "Business"],
    description: "Canada's largest university, known for research and innovation.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    location: "Melbourne, Victoria",
    rating: 4,
    students: "52,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Arts", "Commerce"],
    description: "Australia's leading university, consistently ranked among the world's best.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "National University of Singapore (NUS)",
    country: "Singapore",
    location: "Singapore",
    rating: 4,
    students: "40,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Business", "Arts & Social Sciences"],
    description: "Asia's top university, known for research and innovation in Asia-Pacific region.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of British Columbia (UBC)",
    country: "Canada",
    location: "Vancouver, British Columbia",
    rating: 4,
    students: "66,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Arts", "Science"],
    description: "One of Canada's top research universities with beautiful campus settings.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Sydney",
    country: "Australia",
    location: "Sydney, New South Wales",
    rating: 4,
    students: "73,000+",
    courses: ["Computer Science", "Engineering", "Medicine", "Arts", "Business"],
    description: "Australia's first university, known for research excellence and beautiful campus.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  }
];

export const initializeUniversities = async () => {
  try {
    console.log('=== Initializing Default Universities ===');
    
    // First, test if we can read from the database
    console.log('Testing database access...');
    const testRef = ref(database, 'test-connection');
    try {
      await get(testRef);
      console.log('✅ Database read access confirmed');
    } catch (readError) {
      console.log('⚠️ Database read access failed:', readError.message);
    }
    
    // Check if universities already exist
    const universitiesRef = ref(database, 'universities');
    let snapshot;
    try {
      snapshot = await get(universitiesRef);
      console.log('✅ Successfully read universities node');
    } catch (error) {
      console.log('❌ Failed to read universities node:', error.message);
      return {
        success: false,
        message: `Database access denied: ${error.message}. Please check Firebase database rules.`,
        error
      };
    }
    
    if (snapshot.exists()) {
      const count = Object.keys(snapshot.val()).length;
      console.log(`✅ Universities already exist in database (${count} found)`);
      return {
        success: true,
        message: `Universities already initialized (${count} found)`,
        count: count
      };
    }
    
    console.log('Creating default universities...');
    
    // Try to add universities one by one with error handling
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < defaultUniversities.length; i++) {
      const university = defaultUniversities[i];
      const universityRef = ref(database, `universities/${i + 1}`);
      
      try {
        await set(universityRef, university);
        console.log(`✅ Added: ${university.name}`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed to add ${university.name}:`, error.message);
        errorCount++;
      }
    }
    
    if (successCount > 0) {
      console.log(`✅ Successfully initialized ${successCount} universities`);
      return {
        success: true,
        message: `Successfully initialized ${successCount} universities${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        count: successCount,
        errors: errorCount
      };
    } else {
      console.log('❌ Failed to initialize any universities');
      return {
        success: false,
        message: `Failed to initialize universities. All ${defaultUniversities.length} attempts failed. Check Firebase database rules.`,
        count: 0,
        errors: errorCount
      };
    }
    
  } catch (error) {
    console.error('❌ Error initializing universities:', error);
    return {
      success: false,
      message: `Failed to initialize universities: ${error.message}. Please check Firebase configuration and database rules.`,
      error
    };
  }
}; 