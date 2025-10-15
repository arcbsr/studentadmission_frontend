import { database } from '../firebase/config';
import { ref, set, get, push } from 'firebase/database';

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
    // First, test if we can read from the database
    const testRef = ref(database, 'test-connection');
    try {
      await get(testRef);
    } catch (readError) {
      return {
        success: false,
        message: 'Database access failed'
      };
    }

    // Check if universities already exist
    const universitiesRef = ref(database, 'universities');
    let existingCount = 0;
    
    try {
      const snapshot = await get(universitiesRef);
      if (snapshot.exists()) {
        const universities = snapshot.val();
        existingCount = Object.keys(universities).length;
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to check existing universities'
      };
    }

    if (existingCount > 0) {
      return {
        success: true,
        message: `Universities already exist in database (${existingCount} found)`
      };
    }

    // Create default universities
    let successCount = 0;
    
    for (const university of defaultUniversities) {
      try {
        const newUniversityRef = push(ref(database, 'universities'));
        await set(newUniversityRef, {
          ...university,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        successCount++;
      } catch (error) {
        // Continue with next university if one fails
      }
    }

    if (successCount > 0) {
      return {
        success: true,
        message: `Successfully initialized ${successCount} universities`
      };
    } else {
      return {
        success: false,
        message: 'Failed to initialize any universities'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error initializing universities'
    };
  }
}; 