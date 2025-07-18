const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeQuestions = async (textContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Analyze the following academic content and predict the most important questions that are likely to appear in exams.
    Focus on:
    1. Frequently mentioned concepts
    2. Key definitions and formulas
    3. Important processes and procedures
    4. Common problem-solving scenarios
    
    Content: ${textContent}
    
    Please provide 10-15 predicted questions in a clear, numbered format.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Encountered an error, Please try again');
  }
};

exports.chat = async (prompt, imageFile = null) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }

    let model;
    let content;
    
    if (imageFile) {
      // Use Gemini Pro Vision for image + text
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert image to base64 or use the file buffer
      const imageData = {
        inlineData: {
          data: imageFile.buffer.toString('base64'),
          mimeType: imageFile.mimetype
        }
      };
      
      content = [prompt, imageData];
    } else {
      // Use Gemini Pro for text only
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Enhanced prompt for better educational responses
      const enhancedPrompt = `
      You are PrepStation, an educational AI assistant for university students. 
      Provide helpful, accurate, and educational responses to academic questions.
      
      Student's question: ${prompt}
      
      Please provide a comprehensive, well-structured response that includes:
      - Clear explanations
      - Relevant examples when appropriate
      - Step-by-step solutions for problems
      - Additional context or related concepts
      
      Keep the response educational and suitable for university-level students.
      `;
      
      content = enhancedPrompt;
    }
    
    const result = await model.generateContent(content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    });
    
    // Provide more specific error messages
    if (error.message.includes('API_KEY')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    } else if (error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your usage limits.');
    } else if (error.message.includes('model')) {
      throw new Error('Gemini model not available. Please check the model name.');
    } else {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }
}; 