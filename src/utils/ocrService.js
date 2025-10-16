// OCR Service using Google Vision API
export const extractTextFromImage = async (imageFile) => {
  try {
    // Convert file to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Use Google Vision API (client-side approach with API key)
    const apiKey = process.env.REACT_APP_GOOGLE_VISION_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Google Vision API key not found. Please add REACT_APP_GOOGLE_VISION_API_KEY to your .env file.'
      };
    }

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.responses && result.responses[0] && result.responses[0].textAnnotations) {
      const detections = result.responses[0].textAnnotations;
      const extractedText = detections[0] ? detections[0].description : '';
      
      return {
        success: true,
        text: extractedText,
        raw: detections
      };
    } else {
      return {
        success: false,
        error: 'No text found in the image'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
