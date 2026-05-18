const Groq = require('groq-sdk');

let groqClient = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

async function generateOfferContent(data) {
  const client = getGroqClient();

  if (!client) {
    console.log('Groq API key not set, using fallback content');
    return null;
  }

  const { candidate_name, role, department, salary, joining_date, company_name, hr_name, hr_title, template } = data;

  const formattedSalary = `$${parseFloat(salary).toLocaleString()}`;
  const formattedDate = new Date(joining_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `You are an expert HR professional at a Fortune 500 company. Generate a professional, warm, and comprehensive offer letter for a new hire.

Details:
- Candidate Name: ${candidate_name}
- Position: ${role}
- Department: ${department || 'General'}
- Annual Salary: ${formattedSalary}
- Start Date: ${formattedDate}
- Company: ${company_name}
- HR Manager: ${hr_name}, ${hr_title || 'Head of Human Resources'}

${template ? `Use this template as a base and enhance it with professional language:\n${template}\n` : ''}

Generate a complete, professional offer letter that includes:
1. Warm congratulatory opening
2. Position details and reporting structure
3. Compensation breakdown
4. Benefits overview
5. Employment terms
6. Acceptance deadline
7. Professional closing

Use formal but welcoming language. Make it feel genuine and exciting.
Do NOT include any markdown formatting, just plain text.
Do NOT include any placeholders like {{...}}.
Use the actual values provided above.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR professional who writes compelling, professional offer letters. Write in a formal but warm tone.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return completion.choices[0]?.message?.content || null;
  } catch (err) {
    console.error('Groq API error:', err.message);
    return null;
  }
}

module.exports = { generateOfferContent };
