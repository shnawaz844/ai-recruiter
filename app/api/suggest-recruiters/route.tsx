import { openai } from "@/config/OpenAiModel";
import { AIRecruiterAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
You are a strict JSON API.

You are given a fixed list of recruiters as JSON.
Your job is to analyze user symptoms and return ONLY the most relevant recruiters from that list.

Rules (non-negotiable):
- Use ONLY recruiters from the provided list.
- Do NOT modify any field values.
- Do NOT add or remove fields.
- Do NOT invent new recruiters.
- Do NOT return explanations, text, or markdown.
- Do NOT wrap the response in code blocks.
- Return ONLY a valid JSON array.
- If multiple teachers are relevant, return multiple objects.
- If nothing matches, return an empty array [].

Doctor List:
${JSON.stringify(AIRecruiterAgents)}
`,
        },
        {
          role: "user",
          content: `
User symptoms/notes:
${notes}

Select the most appropriate doctor(s) from the list above and return the response strictly in this format:

[
  {
    "id": number,
    "specialist": string,
    "description": string,
    "image": string,
    "agentPrompt": string,
    "voiceId": string,
    "subscriptionRequired": boolean
  }
]
`,
        },
      ],
    });

    const rawResp = completion.choices[0].message;

    //@ts-ignore
    const Resp = rawResp.content
      .trim()
      .replace("```json", "")
      .replace("```", "");
    const JSONResp = JSON.parse(Resp);

    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
