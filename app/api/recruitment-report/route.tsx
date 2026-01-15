import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `
You are an Expert AI Recruitment Evaluator. 
You have just completed a screening interview with a candidate (the user) for a specific job role.

Based on:
1) The Recruiter Persona (Agent Info)
2) The Job Role context
3) The full conversation transcript

Generate a detailed **Candidate Evaluation Report**.

Your analysis should be professional, objective, and focused on hiring suitability.

Report Fields Required:

1. **roleAppliedFor**: 
   The position discussed (e.g., "Senior Software Engineer", "Sales Representative").

2. **interviewSummary**: 
   A professional executive summary of the interview (2-3 sentences).

3. **keySkillsIdentified**: 
   List of relevant hard and soft skills demonstrated by the candidate.

4. **communicationScore**: 
   Rating from 1-10 on clarity, professionalism, and articulation.

5. **culturalFitAssessment**: 
   Brief assessment of their attitude, enthusiasm, and potential cultural alignment.

6. **technicalRelevance**: 
   How well their experience matches the role requirements (Low/Medium/High + brief reasoning).

7. **strengths**: 
   List of 2-3 key strengths this candidate brings.

8. **redFlags**: 
   Any concerns, missing skills, or vague answers (if none, return empty list).

9. **hiringRecommendation**: 
   One of: "Strong Recommendation", "Proceed to Next Round", "Borderline/Hold", "Reject".

10. **recommendedNextSteps**: 
    Suggested next interview stage (e.g., "Technical Coding Round", "Manager Interview", "Skills Assessment").

Return the result strictly in the following JSON format:

{
  "roleAppliedFor": "string",
  "interviewSummary": "string",
  "keySkillsIdentified": ["skill1", "skill2"],
  "communicationScore": number,
  "culturalFitAssessment": "string",
  "technicalRelevance": "string",
  "strengths": ["strength1", "strength2"],
  "redFlags": ["concern1", "concern2"],
  "hiringRecommendation": "string",
  "recommendedNextSteps": "string"
}

Rules:
- Be fair and constructive.
- Use professional HR terminology.
- Base evaluations ONLY on the provided conversation.
- Respond with ONLY valid JSON. No extra text or markdown formatting.
`;


export async function POST(req: NextRequest) {
   const { sessionId, sessionDetail, messages } = await req.json();

   try {
      const UserInput = "Recruiter Agent Info:" + JSON.stringify(sessionDetail) + ", Conversation Transcript:" + JSON.stringify(messages);

      const completion = await openai.chat.completions.create({
         model: "google/gemini-2.5-flash", // Using a capable model for evaluation
         messages: [
            { role: 'system', content: REPORT_GEN_PROMPT },
            { role: "user", content: UserInput }
         ],
         response_format: { type: "json_object" }
      });

      const rawResp = completion.choices[0].message;

      //@ts-ignore
      const Resp = rawResp.content.trim().replace('```json', '').replace('```', '')
      const JSONResp = JSON.parse(Resp);

      // Save to Database
      const result = await db.update(SessionChatTable).set({
         report: JSONResp,
         conversation: messages
      }).where(eq(SessionChatTable.sessionId, sessionId));

      return NextResponse.json(JSONResp)
   } catch (e) {
      console.error("Error generating report:", e);
      return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
   }
}