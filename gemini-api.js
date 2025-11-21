/**
 * Gemini API Integration for OCR Document Processing
 * Uses Google's Gemini Pro Vision for document analysis and data extraction
 */

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Process a document image using Gemini API
 * @param {string} imageData - Base64 encoded image data
 * @param {string} apiKey - Google Gemini API key
 * @param {string} documentType - Type of document (transcript, invoice, medical, etc.)
 * @returns {Promise<Object>} Extracted data with bounding boxes
 */
async function processDocumentWithGemini(imageData, apiKey, documentType = 'transcript') {
    try {
        // Remove data URL prefix if present
        const base64Image = imageData.includes(',')
            ? imageData.split(',')[1]
            : imageData;

        // Construct the prompt based on document type
        const prompt = getPromptForDocumentType(documentType);

        // Prepare the API request
        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: prompt
                    },
                    {
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.1,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
            }
        };

        // Make the API call
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();

        // Extract the response text
        const responseText = result.candidates[0]?.content?.parts[0]?.text;

        if (!responseText) {
            throw new Error('No response from Gemini API');
        }

        // Parse the JSON response
        const extractedData = parseGeminiResponse(responseText);

        return {
            success: true,
            data: extractedData,
            rawResponse: responseText
        };

    } catch (error) {
        console.error('Error processing document:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Get appropriate prompt based on document type
 * @param {string} documentType - Type of document
 * @returns {string} Formatted prompt for Gemini
 */
function getPromptForDocumentType(documentType) {
    const prompts = {
        transcript: `Analyze this academic transcript image and extract all course information.

For each course, extract the following fields:
- Year (academic year)
- Term (Fall, Spring, Summer, etc.)
- Subject (course subject code, e.g., MATH, ENGL)
- Catalog (course number, e.g., 1301)
- Title (full course title)
- Units (credit hours)
- Grade (letter grade)

Additionally, for EACH extracted field, provide bounding box coordinates as percentages:
- x: left position (0-100%)
- y: top position (0-100%)
- width: box width (0-100%)
- height: box height (0-100%)

Return the data as a JSON array with this exact structure:
{
  "courses": [
    {
      "year": "2013",
      "term": "FALL",
      "subject": "COLL",
      "catalog": "0171",
      "title": "STRATEGIES FOR SUCCESS",
      "units": "1",
      "grade": "A",
      "boundingBox": {
        "x": 10.5,
        "y": 25.3,
        "width": 80.0,
        "height": 2.5
      }
    }
  ],
  "studentInfo": {
    "name": "Student Name",
    "studentId": "123456",
    "institution": "College Name"
  }
}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`,

        invoice: `Analyze this invoice image and extract all line items and header information.

Extract:
- Invoice number, date, due date
- Vendor/supplier information
- Customer information
- Each line item with: description, quantity, unit price, total
- Subtotal, tax, and total amount

Include bounding boxes for each field (x, y, width, height as percentages).

Return as JSON only.`,

        medical: `Analyze this medical record and extract:
- Patient information (name, ID, DOB)
- Date of service
- Provider information
- Diagnoses
- Procedures/tests
- Medications
- Lab results

Include bounding boxes for each field (x, y, width, height as percentages).

Return as JSON only.`
    };

    return prompts[documentType] || prompts.transcript;
}

/**
 * Parse Gemini response text to extract JSON
 * @param {string} responseText - Raw response from Gemini
 * @returns {Object} Parsed data object
 */
function parseGeminiResponse(responseText) {
    try {
        // Remove markdown code blocks if present
        let jsonText = responseText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Find JSON object/array in the response
        const jsonMatch = jsonText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
            jsonText = jsonMatch[0];
        }

        const parsed = JSON.parse(jsonText);
        return parsed;

    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        console.error('Response text:', responseText);

        // Return sample data as fallback
        return {
            courses: [
                { year: '2013', term: 'FALL', subject: 'COLL', catalog: '0171', title: 'STRATEGIES FOR SUCCESS', units: '1', grade: 'A', boundingBox: { x: 10, y: 20, width: 80, height: 3 } },
                { year: '2013', term: 'FALL', subject: 'ENGL', catalog: '1301', title: 'COMPOSITION I', units: '3', grade: 'B', boundingBox: { x: 10, y: 24, width: 80, height: 3 } }
            ],
            studentInfo: {
                name: 'Sample Student',
                studentId: '123456',
                institution: 'Sample College'
            },
            parseError: true,
            originalResponse: responseText
        };
    }
}

/**
 * Generate synthetic bounding boxes for demo purposes
 * @param {Array} courses - Array of course objects
 * @returns {Array} Courses with bounding boxes added
 */
function generateSyntheticBoundingBoxes(courses) {
    return courses.map((course, index) => ({
        ...course,
        boundingBox: {
            x: 15 + (index % 2) * 45,
            y: 20 + Math.floor(index / 2) * 6,
            width: 35,
            height: 4
        }
    }));
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} Whether key appears valid
 */
function validateApiKey(apiKey) {
    return apiKey &&
           typeof apiKey === 'string' &&
           apiKey.length > 20 &&
           apiKey.startsWith('AIza');
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processDocumentWithGemini,
        getPromptForDocumentType,
        parseGeminiResponse,
        generateSyntheticBoundingBoxes,
        validateApiKey
    };
}
