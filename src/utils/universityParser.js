// University Data Parser from OCR extracted text
export const parseUniversityData = (extractedText) => {
  try {
    if (!extractedText || extractedText.trim() === '') {
      return {
        success: false,
        error: 'No text extracted from image'
      };
    }

    const lines = extractedText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {
        success: false,
        error: 'No valid text lines found in image'
      };
    }
    
    // Initialize university object with defaults
    const university = {
      name: '',
      country: '',
      location: '',
      rating: 5,
      students: '',
      courses: [],
      description: '',
      image: '',
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Parse university name - look for complete university names
    const universityNamePatterns = [
      /university of law.*london.*bloomsbury/i,
      /university of law.*london.*moorgate/i,
      /university of law.*london/i,
      /university of.*london/i,
      /university of.*uk/i,
      /university of.*college/i,
      /university of.*institute/i
    ];
    
    let universityName = '';
    for (const pattern of universityNamePatterns) {
      const match = extractedText.match(pattern);
      if (match) {
        universityName = match[0].trim();
        break;
      }
    }
    
    if (universityName) {
      university.name = universityName;
    } else {
      // Fallback: look for any line containing "University" or "College"
      const nameLine = lines.find(line => {
        const lowerLine = line.toLowerCase().trim();
        return (lowerLine.includes('university') || lowerLine.includes('college')) && 
               line.length > 10 && 
               !lowerLine.includes('program') &&
               !lowerLine.includes('course');
      });
      
      if (nameLine) {
        let cleanName = nameLine.trim();
        // Remove trailing dashes and incomplete text
        cleanName = cleanName.replace(/\s*-+$/, '');
        cleanName = cleanName.replace(/\s*\([^)]*$/, '');
        // Remove special characters
        cleanName = cleanName.replace(/[☑✓✗×]+$/, '');
        cleanName = cleanName.replace(/[☑✓✗×]\s*/, '');
        university.name = cleanName;
      } else {
        university.name = 'University Name';
      }
    }
    
    // Parse location/country dynamically - look for various country patterns
    const locationPatterns = [
      // Canada patterns
      /([^,\n]+),\s*(CAN|Canada)/i,
      /([^,\n]+),\s*(ON|Ontario|BC|British Columbia|AB|Alberta|QC|Quebec|MB|Manitoba|SK|Saskatchewan|NB|New Brunswick|NS|Nova Scotia|PE|Prince Edward Island|NL|Newfoundland and Labrador)/i,
      // UK patterns
      /(Greater London|London),\s*(UK|United Kingdom)/i,
      /([^,\n]+),\s*(UK|United Kingdom)/i,
      // US patterns
      /([^,\n]+),\s*(US|USA|United States)/i,
      /([^,\n]+),\s*(CA|California|NY|New York|TX|Texas|FL|Florida|WA|Washington)/i,
      // Generic patterns
      /([^,\n]+),\s*([A-Z]{2,3})/i
    ];
    
    let location = 'Unknown';
    let country = 'Unknown';
    
    for (const pattern of locationPatterns) {
      const match = extractedText.match(pattern);
      if (match) {
        location = match[1].trim();
        const countryCode = match[2].trim().toUpperCase();
        
        // Map country codes to full names
        const countryMap = {
          'CAN': 'Canada',
          'CANADA': 'Canada',
          'ON': 'Canada',
          'ONTARIO': 'Canada',
          'BC': 'Canada',
          'BRITISH COLUMBIA': 'Canada',
          'AB': 'Canada',
          'ALBERTA': 'Canada',
          'QC': 'Canada',
          'QUEBEC': 'Canada',
          'MB': 'Canada',
          'MANITOBA': 'Canada',
          'SK': 'Canada',
          'SASKATCHEWAN': 'Canada',
          'NB': 'Canada',
          'NEW BRUNSWICK': 'Canada',
          'NS': 'Canada',
          'NOVA SCOTIA': 'Canada',
          'PE': 'Canada',
          'PRINCE EDWARD ISLAND': 'Canada',
          'NL': 'Canada',
          'NEWFOUNDLAND AND LABRADOR': 'Canada',
          'UK': 'United Kingdom',
          'UNITED KINGDOM': 'United Kingdom',
          'US': 'United States',
          'USA': 'United States',
          'UNITED STATES': 'United States',
          'CA': 'United States',
          'CALIFORNIA': 'United States',
          'NY': 'United States',
          'NEW YORK': 'United States',
          'TX': 'United States',
          'TEXAS': 'United States',
          'FL': 'United States',
          'FLORIDA': 'United States',
          'WA': 'United States',
          'WASHINGTON': 'United States'
        };
        
        country = countryMap[countryCode] || countryCode;
        break;
      }
    }
    
    university.location = location;
    university.country = country;
    
    // First, try to merge broken program names that are split across lines (improved logic)
    const mergedLines = [];
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
      
      // Only merge if current line clearly ends with incomplete text
      const isIncomplete = currentLine.endsWith(',') || 
                          currentLine.endsWith('-') || 
                          currentLine.endsWith('(') ||
                          currentLine.endsWith('...') ||
                          (currentLine.length > 30 && currentLine.match(/\s(Management|Law|Science|Arts|Business|Leadership|Digital|Project|Data|Healthcare|Commercial|International|Practice|Solicitor|Barrister)$/i));
      
      // Check if next line is a continuation (short and starts with lowercase or specific patterns)
      const isContinuation = nextLine && 
                            nextLine.length < 50 && 
                            (nextLine.match(/^[a-z]/) || 
                             nextLine.match(/^[A-Z][a-z]+/) ||
                             nextLine.includes('(') ||
                             nextLine.includes('...') ||
                             nextLine.match(/^(Leadership|Management|Law|Digital|Project|Data|Healthcare|Commercial|International|Practice|Solicitor|Barrister)/i));
      
      // Don't merge if current line is a complete program name
      const isCompleteProgram = currentLine.length > 40 && 
                               (currentLine.includes('Master of') || 
                                currentLine.includes('Bachelor of')) &&
                               !currentLine.endsWith('-');
      
      // Don't merge if current line already contains multiple program indicators
      const programIndicatorsMerge = ['master of', 'bachelor of', 'llm', 'mba', 'mits'];
      const currentLineLower = currentLine.toLowerCase();
      const indicatorCount = programIndicatorsMerge.filter(indicator => currentLineLower.includes(indicator)).length;
      
      if (isIncomplete && isContinuation && !isCompleteProgram && indicatorCount <= 1) {
        // Merge the lines
        mergedLines.push(currentLine + ' ' + nextLine);
        i++; // Skip the next line as it's been merged
      } else {
        mergedLines.push(currentLine);
      }
    }
    
    // Parse courses with better filtering and extract financial details
    const courseLines = mergedLines.filter(line => {
      const lowerLine = line.toLowerCase().trim();
      
      // Skip lines that contain multiple program indicators (likely merged incorrectly)
      const programIndicatorsFilter = ['master of', 'bachelor of', 'llm', 'mba', 'mits'];
      const indicatorCount = programIndicatorsFilter.filter(indicator => lowerLine.includes(indicator)).length;
      
      if (indicatorCount > 1) {
        return false; // Skip lines with multiple program types
      }
      
      // Skip lines that are too long (likely merged multiple programs)
      if (line.length > 100) {
        return false;
      }
      
      // Skip UI elements and common non-course text (more specific patterns)
      const skipPatterns = [
        'program level', 'field of study', 'intakes', 'program tag',
        'all filters', 'clear all', 'sort', 'compare', 'new student',
        'eligibility filters', 'items per page', 'pages',
        'create application', 'instant submission', 'scholarships available',
        'prime', 'incentivized', 'fast acceptance', 'high job demand',
        'success prediction', 'details', 'home', 'search', 'destination', 
        'institution', 'school', 'programs found', 'copyright', 'legal', 
        'privacy policy', 'terms', 'conditions', 'accessibility', 'about', 
        'blog', 'applyboard', 'greater london', 'uk', 'london',
        'what would you like to study', 'would you like to study',
        'like to study', 'study', 'found', 'items', 'per page',
        'of', 'pages', 'clear', 'all', 'filters', 'new', 'student',
        'eligibility', 'programs', 'copyright', 'legal', 'privacy',
        'policy', 'terms', 'conditions', 'accessibility', 'about',
        'blog', 'applyboard', 'greater', 'london', 'uk',
        'master\'s degree', 'bachelor\'s degree', 'degree', 'create application'
      ];
      
      // Skip if it matches any skip pattern exactly
      if (skipPatterns.some(pattern => lowerLine === pattern)) {
        return false;
      }
      
      // Skip very short lines or lines that are just numbers/dates
      if (line.length < 10 || /^[\d\s\-/]+$/.test(line)) {
        return false;
      }
      
      // Skip lines that are just degree types without program names
      const degreeTypesOnly = [
        'master\'s degree', 'bachelor\'s degree', '3-year bachelor\'s degree',
        'master degree', 'bachelor degree', 'phd', 'doctorate'
      ];
      
      if (degreeTypesOnly.some(degree => lowerLine === degree)) {
        return false;
      }
      
      // Skip single words that are likely UI elements
      const singleWordUI = ['of', 'free', 'months', 'gbp', 'application', 'fee', 'tuition', 'study', 'what', 'would', 'you', 'like', 'to'];
      if (singleWordUI.includes(lowerLine)) {
        return false;
      }
      
      // Skip lines that are questions or UI placeholders
      if (lowerLine.includes('what') || lowerLine.includes('would') || lowerLine.includes('you') || lowerLine.includes('like')) {
        return false;
      }
      
      // Skip lines that are just numbers or very short
      if (line.length < 15) {
        return false;
      }
      
      // Look for actual program names - be more inclusive (international)
      const programIndicators = [
        'bachelor of science', 'bachelor of arts', 'master of science',
        'master of arts', 'master of business', 'master of laws',
        'llm', 'mba', 'bsc', 'ba', 'msc', 'ma', 'honours',
        'foundation', 'integrated', 'governance', 'administration',
        'human resources', 'employment', 'medical law', 'mental health',
        'international law', 'business management', 'science', 'arts',
        'business', 'laws', 'health', 'management', 'with', 'degree',
        'bachelor', 'master', 'program', 'course', 'legal practice',
        'media law', 'privacy', 'defamation', 'healthcare regulation',
        'international criminal', 'human rights', 'mediation', 'alternative',
        'dispute resolution', 'mental health', 'general', 'sqe1',
        // Canadian programs
        'applied computing', 'mac', 'coursework', 'natural resources',
        'environmental engineering', 'theological studies', 'christian ministries',
        'information technology', 'security', 'mits', 'qualifying year',
        'economics', 'education', 'teaching', 'learning', 'regulatory affairs',
        // US programs
        'computer science', 'data science', 'artificial intelligence',
        'cybersecurity', 'public health', 'social work', 'psychology',
        // European programs
        'international relations', 'global studies', 'sustainability',
        'innovation', 'entrepreneurship', 'finance', 'accounting'
      ];
      
      // Must contain program indicators OR be substantial educational content
      const hasProgramIndicator = programIndicators.some(indicator => lowerLine.includes(indicator));
      const isSubstantial = line.length > 20;
      const notUIElement = !skipPatterns.some(pattern => lowerLine.includes(pattern));
      
      // Include if it has program indicators OR if it's substantial educational content
      return (hasProgramIndicator || (isSubstantial && notUIElement && !lowerLine.includes('program level') && !lowerLine.includes('field of study')));
    });
    
    // Extract tuition and application fee information from the text (dynamic currencies)
    const currencyPatterns = [
      // CAD patterns
      /\$[\d,]+\.?\d*\s*CAD/g,
      // USD patterns  
      /\$[\d,]+\.?\d*\s*USD/g,
      // GBP patterns
      /£[\d,]+\.?\d*\s*GBP/g,
      // EUR patterns
      /€[\d,]+\.?\d*\s*EUR/g,
      // Generic dollar patterns (assume USD if no currency specified)
      /\$[\d,]+\.?\d*(?:\s*(?:CAD|USD|GBP|EUR))?/g,
      // Generic pound patterns
      /£[\d,]+\.?\d*(?:\s*(?:CAD|USD|GBP|EUR))?/g,
      // Generic euro patterns
      /€[\d,]+\.?\d*(?:\s*(?:CAD|USD|GBP|EUR))?/g
    ];
    
    const applicationFeePattern = /(free|\$[\d,]+\.?\d*\s*(?:CAD|USD|GBP|EUR)|£[\d,]+\.?\d*\s*(?:CAD|USD|GBP|EUR)|€[\d,]+\.?\d*\s*(?:CAD|USD|GBP|EUR))/gi;
    const durationPattern = /(\d+)(?:\s*-\s*\d+)?\s*months?/gi;
    
    // Extract all currency amounts using dynamic patterns
    const allAmounts = [];
    currencyPatterns.forEach(pattern => {
      const matches = [...extractedText.matchAll(pattern)];
      allAmounts.push(...matches);
    });
    
    const allApplicationFees = [...extractedText.matchAll(applicationFeePattern)];
    const allDurations = [...extractedText.matchAll(durationPattern)];
    
    // Separate tuition fees from application fees based on amount and currency
    const tuitionFees = [];
    const applicationFees = [];
    
    allAmounts.forEach(match => {
      const amountText = match[0];
      const amount = parseInt(amountText.replace(/[^\d]/g, '')) || 0;
      
      // Determine if it's tuition or application fee based on amount and currency
      let isTuitionFee = false;
      
      if (amountText.includes('CAD')) {
        // Canadian amounts
        isTuitionFee = amount >= 10000; // CAD tuition fees are typically $10,000+
      } else if (amountText.includes('USD')) {
        // US amounts
        isTuitionFee = amount >= 10000; // USD tuition fees are typically $10,000+
      } else if (amountText.includes('GBP')) {
        // UK amounts
        isTuitionFee = amount >= 14000; // GBP tuition fees are typically £14,000+
      } else if (amountText.includes('EUR')) {
        // Euro amounts
        isTuitionFee = amount >= 10000; // EUR tuition fees are typically €10,000+
      } else {
        // Generic amounts - use higher threshold
        isTuitionFee = amount >= 10000;
      }
      
      if (isTuitionFee) {
        tuitionFees.push(amountText);
      } else if (amount >= 30) { // Application fees are typically $30+
        applicationFees.push(amountText);
      }
    });
    
    allApplicationFees.forEach(match => {
      const feeText = match[0];
      if (feeText.toLowerCase().includes('free')) {
        applicationFees.push('Free');
      } else {
        const amount = parseInt(feeText.replace(/[^\d]/g, '')) || 0;
        if (amount < 10000 && amount >= 30) { // Application fees are typically $30-$9,999
          applicationFees.push(feeText);
        }
      }
    });
    
    // Remove duplicates and clean up course names
    const uniqueCourses = [...new Set(courseLines)].map((course, index) => {
      let cleanCourse = course.trim();
      
      // Remove UI text that might have been merged
      cleanCourse = cleanCourse.replace(/\s+(Master's Degree|Bachelor's Degree|Create application|Details|High Job Demand).*$/i, '');
      
      // Remove location text that might have been merged
      cleanCourse = cleanCourse.replace(/\s+(Ontario|New Brunswick|Saskatchewan|CAN|Canada|Greater London|UK).*$/i, '');
      
      // Remove trailing incomplete words
      cleanCourse = cleanCourse.replace(/\s+(Bilingu|Location|Year|Commercial La).*$/i, '');
      
      // Clean up common OCR artifacts
      cleanCourse = cleanCourse.replace(/\.+$/, '');
      cleanCourse = cleanCourse.replace(/\s+$/, '');
      
      // Remove trailing dashes and incomplete parentheses
      cleanCourse = cleanCourse.replace(/\s*-+$/, '');
      cleanCourse = cleanCourse.replace(/\s*\([^)]*$/, '');
      
      // Remove trailing ellipses and continuation indicators
      cleanCourse = cleanCourse.replace(/\s*\.{3,}.*$/, '');
      
      // Remove special characters at the end
      cleanCourse = cleanCourse.replace(/[☑✓✗×]+$/, '');
      
      return cleanCourse;
    });
    
    // Create course objects from parsed lines with extracted financial details
    university.courses = uniqueCourses.map((course, index) => {
      // Try to find fees that appear near this course in the text
      const courseStartIndex = extractedText.indexOf(course);
      
      // Look for fees in a window around this course
      const searchWindow = 500; // characters
      const windowStart = Math.max(0, courseStartIndex - searchWindow);
      const windowEnd = Math.min(extractedText.length, courseStartIndex + searchWindow);
      const courseContext = extractedText.substring(windowStart, windowEnd);
      
      // Find fees in this context
      const contextTuitionFees = [...courseContext.matchAll(/\$[\d,]+\.?\d*\s*CAD/g)];
      const contextApplicationFees = [...courseContext.matchAll(/(free|\$[\d,]+\.?\d*\s*CAD)/gi)];
      
      // Use fees from context, or fallback to cycling through all fees
      let tuition = 'Contact for details';
      let applicationFee = 'Free';
      
      if (contextTuitionFees.length > 0) {
        // Filter out application fees from tuition fees by amount
        const tuitionAmounts = contextTuitionFees.filter(match => {
          const amount = parseInt(match[0].replace(/[^\d]/g, '')) || 0;
          return amount >= 10000; // CAD tuition threshold
        });
        if (tuitionAmounts.length > 0) {
          tuition = tuitionAmounts[0][0];
        }
      } else if (tuitionFees.length > 0) {
        const tuitionIndex = index % tuitionFees.length;
        tuition = tuitionFees[tuitionIndex];
      }
      
      if (contextApplicationFees.length > 0) {
        applicationFee = contextApplicationFees[0][0];
      } else if (applicationFees.length > 0) {
        const feeIndex = index % applicationFees.length;
        applicationFee = applicationFees[feeIndex];
      }
      
      // Get duration for this course
      let duration = 'Contact for details';
      if (allDurations.length > 0) {
        const durationIndex = index % allDurations.length;
        const months = allDurations[durationIndex][1];
        duration = `${months} months`;
      }
      
      // Determine success prediction based on program type
      let successPrediction = 'High';
      const courseLower = course.toLowerCase();
      if (courseLower.includes('mba') || courseLower.includes('master of business')) {
        successPrediction = 'Average';
      } else if (courseLower.includes('medical law') || courseLower.includes('mental health')) {
        successPrediction = 'Average';
      } else if (courseLower.includes('human resources')) {
        successPrediction = 'Average';
      }
      
      // Clean up course name - remove ellipses and incomplete words
      let cleanCourseName = course.trim();
      cleanCourseName = cleanCourseName.replace(/\.+$/, ''); // Remove trailing dots
      cleanCourseName = cleanCourseName.replace(/\.{3,}$/, ''); // Remove trailing ellipses
      
      return {
        programName: cleanCourseName,
        degreeType: getDegreeType(course),
        tuition: tuition,
        applicationFee: applicationFee,
        duration: duration,
        successPrediction: successPrediction,
        tags: ['Fast Acceptance']
      };
    });
    
    // Remove any courses with very short or incomplete names
    university.courses = university.courses.filter(course => {
      const name = course.programName.toLowerCase();
      return course.programName.length > 15 && 
             !name.includes('program level') && 
             !name.includes('field of study') &&
             !name.includes('program tag') &&
             !name.includes('what would you like') &&
             !name.includes('would you like') &&
             !name.includes('like to study') &&
             !name.includes('search') &&
             !name.includes('filter') &&
             !name.includes('sort') &&
             !name.includes('compare') &&
             !name.includes('clear all') &&
             !name.includes('all filters') &&
             // Allow courses that contain educational terms
             (name.includes('bachelor') || name.includes('master') || name.includes('llm') || 
              name.includes('mba') || name.includes('science') || name.includes('arts') || 
              name.includes('business') || name.includes('law') || name.includes('degree') ||
              name.includes('honours') || name.includes('foundation') || name.includes('integrated') ||
              name.includes('administration') || name.includes('management') || name.includes('health'));
    });
    
    // If no courses found, create a default one
    if (university.courses.length === 0) {
      university.courses = [{
        programName: 'Various Programs Available',
        degreeType: 'Multiple',
        tuition: 'Contact for details',
        applicationFee: 'Free',
        duration: 'Contact for details',
        successPrediction: 'High',
        tags: ['Fast Acceptance']
      }];
    }
    
    // Generate description based on extracted data
    university.description = `${university.name} offers ${university.courses.length} programs in various fields. Located in ${university.location}, ${university.country}. Contact us for detailed program information.`;
    
    // Set default student count
    university.students = 'Contact for details';
    
    return {
      success: true,
      data: university
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to determine degree type from course name
const getDegreeType = (courseName) => {
  const name = courseName.toLowerCase();
  
  // Master's degree indicators
  if (name.includes('master of science') || name.includes('master of arts') || 
      name.includes('master of business') || name.includes('master of laws') ||
      name.includes('llm') || name.includes('mba') || name.includes('msc') || 
      name.includes('ma') || name.includes('master\'s degree')) {
    return "Master's";
  } 
  // Bachelor's degree indicators
  else if (name.includes('bachelor of science') || name.includes('bachelor of arts') ||
           name.includes('bachelor of business') || name.includes('bsc') || 
           name.includes('ba') || name.includes('bba') || 
           name.includes('bachelor\'s degree') || name.includes('honours')) {
    return "Bachelor's";
  } 
  // Doctorate indicators
  else if (name.includes('phd') || name.includes('doctorate') || name.includes('doctoral')) {
    return "Doctorate";
  } 
  // Other degree types
  else if (name.includes('diploma')) {
    return "Diploma";
  } else if (name.includes('certificate')) {
    return "Certificate";
  } else if (name.includes('associate')) {
    return "Associate";
  } else if (name.includes('foundation')) {
    return "Foundation";
  }
  
  // Default fallback
  return "Other";
};

// Function to parse multiple universities from text (if image contains multiple)
export const parseMultipleUniversitiesData = (extractedText) => {
  try {
    if (!extractedText || extractedText.trim() === '') {
      return {
        success: false,
        error: 'No text extracted from image'
      };
    }

    // For now, parse as single university
    // In the future, this could be enhanced to detect multiple universities
    const singleResult = parseUniversityData(extractedText);
    
    if (singleResult.success) {
      return {
        success: true,
        data: [singleResult.data], // Return as array for consistency
        isArray: true
      };
    }
    
    return singleResult;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
