import { database } from '../firebase/config';
import { ref, set, get, push } from 'firebase/database';

const defaultUniversities = [
  {
    name: "University of Law - London Bloomsbury",
    country: "United Kingdom",
    location: "London, Greater London",
    rating: 5,
    students: "24,000+",
    courses: [
      {
        programName: "Master of Laws - International and Comparative Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws - Immigration Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws - Family Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - International Arbitration",
        degreeType: "Master's",
        tuition: "£17,000 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Arts - Law (Conversion)",
        degreeType: "Master's",
        tuition: "£17,850 GBP",
        applicationFee: "£30 GBP",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Bachelor of Arts (Honours) - Criminology (M900)",
        degreeType: "Bachelor's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "36 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - Employment Law",
        degreeType: "Master's",
        tuition: "£17,000 GBP",
        applicationFee: "Free",
        duration: "11 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Integrated Foundation - Bachelor of Science",
        degreeType: "Bachelor's",
        tuition: "£17,550 GBP",
        applicationFee: "Free",
        duration: "48 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - International Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws - Healthcare Regulation",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Integrated Foundation - BSc (Honours) in Business",
        degreeType: "Bachelor's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "48 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Integrated Foundation - Bachelor of Science (Computer Science)",
        degreeType: "Bachelor's",
        tuition: "£17,550 GBP",
        applicationFee: "Free",
        duration: "48 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - International Human Rights Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - Mediation and Alternative Dispute Resolution",
        degreeType: "Master's",
        tuition: "£14,600 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Bachelor of Science (Honours) - Accounting with Finance",
        degreeType: "Bachelor's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "36 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Integrated Foundation - Bachelor of Arts (Honours)",
        degreeType: "Bachelor's",
        tuition: "£17,550 GBP",
        applicationFee: "Free",
        duration: "48 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      }
    ],
    description: "The University of Law - London Bloomsbury campus is located in central London and is one of the university's largest and most established centers. It offers a wide selection of undergraduate and postgraduate degrees focusing on Law, Business, and Criminology. The campus emphasizes employability, flexible learning options, and instant application submission with scholarships and fast acceptance pathways for students worldwide.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Law - London Moorgate",
    country: "United Kingdom",
    location: "London, Greater London",
    rating: 5,
    students: "24,000+",
    courses: [
      {
        programName: "Master of Science - Leadership and Human Resource Management",
        degreeType: "Master's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Marketing",
        degreeType: "Master's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Strategic Business Management",
        degreeType: "Master's",
        tuition: "£17,200 GBP",
        applicationFee: "Free",
        duration: "24 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Psychology (Conversion)",
        degreeType: "Master's",
        tuition: "£16,000 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Cyber Security Management",
        degreeType: "Master's",
        tuition: "£18,500 GBP",
        applicationFee: "Free",
        duration: "24 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Artificial Intelligence for Business",
        degreeType: "Master's",
        tuition: "£18,700 GBP",
        applicationFee: "Free",
        duration: "24 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - Corporate Governance",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - Company Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - International Energy Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - Insurance Law",
        degreeType: "Master's",
        tuition: "£17,000 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Arts - Law (SQE1)",
        degreeType: "Master's",
        tuition: "£18,450 GBP",
        applicationFee: "£30 GBP",
        duration: "15 months",
        successPrediction: "Low",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Laws (LLM) - International Commercial Law",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Legal Practice Course (LPC) + Master of Science - Law",
        degreeType: "Master's",
        tuition: "£19,500 GBP",
        applicationFee: "£30 GBP",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Legal Practice Course (LPC) + Master of Laws (LLM)",
        degreeType: "Master's",
        tuition: "£19,500 GBP",
        applicationFee: "£30 GBP",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Corporate Financial Management",
        degreeType: "Master's",
        tuition: "£16,700 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Legal Technology",
        degreeType: "Master's",
        tuition: "£17,500 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Average",
        tags: ["Scholarships", "Prime", "Incentivized", "Fast Acceptance"]
      },
      {
        programName: "Master of Science - Project Management (Academic and Professional)",
        degreeType: "Master's",
        tuition: "£17,200 GBP",
        applicationFee: "Free",
        duration: "18 months",
        successPrediction: "High",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      }
    ],
    description: "The University of Law - London Moorgate campus is a prestigious center near the City of London's financial district, offering modern business and law degrees with strong employability focus. Programs cover Business, Legal Practice, and cutting-edge areas like Cyber Security, AI, and Legal Technology.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isActive: true,
    createdAt: Date.now()
  },
  {
    name: "University of Law - London (General)",
    country: "United Kingdom",
    location: "London, Greater London",
    rating: 5,
    students: "24,000+",
    courses: [
      {
        programName: "Master of Science - Computer Science (Conversion)",
        degreeType: "Master's",
        tuition: "£16,000 GBP",
        applicationFee: "Free",
        duration: "12 months",
        successPrediction: "Very High",
        tags: ["Scholarships", "Prime", "Fast Acceptance"]
      }
    ],
    description: "The University of Law's general London programs include modern interdisciplinary pathways such as Computer Science (Conversion), bridging business, law, and technology with flexible entry routes and career-oriented study models.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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