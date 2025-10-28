import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ AI Caption + Hashtag Generator
export const generateAICaption = async (topic) => {
  try {
    const prompt = `
      Generate a short engaging social media caption about: "${topic}"
      Also suggest 4-5 relevant hashtags.
      Output JSON like:
      {"caption": "...", "hashtags": ["#example1", "#example2"]}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Caption generation failed:", error);
    return { caption: topic, hashtags: [] };
  }
};

// ✅ AI Thumbnail Generator
export const generateAIThumbnail = async (title) => {
  try {
    const prompt = `Generate a YouTube-style thumbnail for a video titled: "${title}". Return a realistic vibrant image.`;

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return { imageUrl: image.data[0].url };
  } catch (error) {
    console.error("Thumbnail generation failed:", error);
    return { imageUrl: "" };
  }
};


// ✅ AI Insights Summary
export const generateAIInsights = async (attendance, performance, sentiment) => {
  try {
    const summaryPrompt = `
      Analyze the following academic and behavioral data:
      - Attendance rates: ${JSON.stringify(attendance)}
      - Performance: ${JSON.stringify(performance)}
      - Guardian Sentiment: ${JSON.stringify(sentiment)}

      Generate a summarized AI insight for the admin dashboard in JSON:
      {
        "summary": "short 2-line insight",
        "recommendations": ["item1", "item2", "item3"],
        "overallHealth": "Excellent / Good / Needs Attention"
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: summaryPrompt }],
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI insights error:", error);
    return {
      summary: "AI analysis unavailable at the moment.",
      recommendations: ["Check data connection", "Try again later"],
      overallHealth: "Pending",
    };
  }
};
