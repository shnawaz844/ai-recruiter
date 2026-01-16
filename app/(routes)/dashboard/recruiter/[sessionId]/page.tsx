"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { recruiterAgent } from "../../_components/RecruiterCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedRecruiter: recruiterAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

/**
 * RecruitmentCallAgent Component
 *
 * Provides an AI-powered recruitment voice assistant interface where users can
 * start a voice call with an AI recruiter agent, interact in real-time,
 * view live transcripts, and generate a candidate evaluation report.
 */
function RecruitmentCallAgent() {
  const { sessionId } = useParams(); // Get sessionId from route parameters
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>(); // Current session details
  const [callStarted, setCallStarted] = useState(false); // Call connection status
  const [vapiInstance, setVapiInstance] = useState<any>(null); // Instance of Vapi for voice interaction
  const [currentRole, setCurrentRole] = useState<string | null>(null); // Current speaking role (user/assistant)
  const [liveTranscript, setLiveTranscript] = useState<string>(""); // Live transcription text
  const [messages, setMessages] = useState<messages[]>([]); // Finalized chat messages log
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [vapiCallId, setVapiCallId] = useState<string | null>(null); // Vapi call ID for recording retrieval
  const router = useRouter();
  const callActiveRef = useRef(false);

  // Load session details on component mount or when sessionId changes
  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Fetch session detail data from backend API
  const GetSessionDetails = async () => {
    const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
    console.log("Session deatails", result.data);
    setSessionDetail(result.data);
  };

  /**
   * StartCall
   * Initializes and starts the voice call with the AI HR Recruiter Voice Agent
   * using the Vapi SDK and sets up event listeners for call and speech events.
   */
  const StartCall = () => {
    console.log("Starting recruitment call", sessionDetail);
    if (!sessionDetail) return;
    setLoading(true);

    // Initialize Vapi instance with your API key
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // Configuration for the AI recruiter voice agent
    const VapiAgentConfig = {
      name: "AI HR Recruiter Voice Agent",

      // Use the recruiter's custom greeting/prompt
      firstMessage: sessionDetail.selectedRecruiter?.agentPrompt,

      transcriber: {
        model: "nova-2",
        provider: "deepgram",
        language: "hi",
      },

      voice: {
        model: "eleven_turbo_v2_5",
        // Select voice based on recruiter's gender
        voiceId: sessionDetail.selectedRecruiter?.gender === "male"
          ? process.env.NEXT_PUBLIC_MALE_VOICE_ID!
          : process.env.NEXT_PUBLIC_FEMALE_VOICE_ID!,
        provider: "11labs",
        stability: 0.4,
        similarityBoost: 0.8,
      },

      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a professional HR recruiter conducting an initial screening call.

Your Role: ${sessionDetail.selectedRecruiter?.specialist || "HR Recruiter"}

Your goals:
1. Introduce the job role clearly and professionally
2. Ask if the candidate is interested before proceeding
3. Conduct a realistic screening interview
4. Evaluate the candidate silently while speaking naturally
5. Keep the conversation friendly, human, and conversational
6. Do NOT sound like an exam or a chatbot
7. Ask follow-up questions when answers are vague
8. End with a professional closing statement

Job Role Context:
You are recruiting for positions related to: ${sessionDetail.selectedRecruiter?.specialist}

Evaluation Criteria (internal only - DO NOT reveal these scores):
- Communication skills and clarity
- Relevant experience for the role
- Confidence and professionalism
- Technical/domain skill match
- Interest level and cultural fit

Interview Flow:
1. Greet warmly and introduce yourself professionally
2. Explain the role briefly (30-45 seconds)
3. Ask: "Are you interested in exploring this opportunity?"
4. If yes, proceed with 4-6 screening questions:
   - Current role and relevant experience
   - Key skills related to this position
   - Availability and notice period
   - Salary expectations (if appropriate)
   - Why interested in this role
   - Any questions they have for you
5. Thank them professionally and mention next steps

Behavior Guidelines:
- Speak as a real recruiter would on a phone call
- Keep responses natural, warm, and conversational
- Listen actively and ask relevant follow-ups
- Don't be overly formal or robotic
- Show genuine interest in the candidate
- Keep the call focused but not rushed (aim for 5-8 minutes)
- End on a positive, professional note

Language & Communication Style:
- You are strictly bilingual and comfortable speaking in English, Hindi, or Hinglish (Mix of both).
- Adapt your language based on how the candidate speaks:
  - If they speak English → Reply in professional English.
  - If they speak Hindi → Reply in polite, professional Hindi.
  - If they use Hinglish → Reply in natural Hinglish.
- Maintain professionalism regardless of the language used.

Remember: You're building a relationship, not interrogating. Make the candidate feel comfortable while gathering the information you need.
        `,
          },
        ],
      },
    };

    //@ts-ignore
    vapi.start(VapiAgentConfig);

    // Event listeners for Vapi voice call lifecycle

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-start", async (data: any) => {
      callActiveRef.current = true;
      setLoading(false);
      setCallStarted(true);
      console.log("Call started event received");
      console.log("Full call-start data:", JSON.stringify(data, null, 2), data);

      // Try to get call ID from the vapi instance itself
      //@ts-ignore
      console.log("Vapi instance properties:", Object.keys(vapi));
      //@ts-ignore
      console.log("Vapi call:", vapi.call);
      //@ts-ignore
      console.log("Vapi callId:", vapi.callId);
      //@ts-ignore
      console.log("Vapi _call:", vapi._call);
      //@ts-ignore
      console.log("Vapi activeCall:", vapi.activeCall);

      // Try to extract call ID from vapi instance
      //@ts-ignore
      const instanceCallId = vapi.call?.callClientId || vapi.call?._callClientId || vapi.call?.id || vapi.callId;
      console.log("Instance call ID:", instanceCallId, vapi.call);

      if (instanceCallId) {
        setVapiCallId(instanceCallId);
        console.log("✅ Call ID found in vapi instance:", instanceCallId);

        try {
          await axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: instanceCallId
          });
          console.log("✅ Vapi call ID saved to database");
        } catch (error) {
          console.error("❌ Failed to save Vapi call ID:", error);
        }
      } else {
        console.log("⚠️ No call ID found in vapi instance yet, waiting for message events...");
      }
    });

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-end", (data: any) => {
      callActiveRef.current = false;
      setCallStarted(false);
      setVapiInstance(null);
      console.log("Call ended", data);
      if (vapiCallId) {
        console.log("Recording should be available for call ID:", vapiCallId);
      }
    });

    vapi.on("message", (message) => {
      if (!callActiveRef.current) return;

      // Log all messages to debug
      console.log("Vapi message received:", message);

      // Check for end-of-call-report to get recording URL
      if (message.type === "end-of-call-report") {
        console.log("📞 End-of-call-report received:", message);
        //@ts-ignore
        const recordingUrl = message.recordingUrl || message.artifact?.recordingUrl || message.stereoRecordingUrl;

        if (recordingUrl) {
          console.log("✅ Recording URL captured:", recordingUrl);
          // Save recording URL to database
          axios.post('/api/save-recording-url', {
            sessionId: sessionId,
            recordingUrl: recordingUrl
          }).then(() => {
            console.log("✅ Recording URL saved to database");
          }).catch(error => {
            console.error("❌ Failed to save recording URL:", error);
          });
        } else {
          console.log("⚠️ No recording URL in end-of-call-report");
        }
      }

      // Check for call-start message type to get call ID
      if (message.type === "call-start") {
        console.log("Call-start message detected:", message);
        // Try to extract call ID from various possible locations
        //@ts-ignore
        const callId = message.call?.id || message.callId || message.id;
        if (callId) {
          setVapiCallId(callId);
          console.log("✅ Call ID captured from message:", callId);

          // Save the Vapi call ID to the database
          axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: callId
          }).then(() => {
            console.log("✅ Vapi call ID saved to database");
          }).catch(error => {
            console.error("❌ Failed to save Vapi call ID:", error);
          });
        }
      }

      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          // Show live partial transcript while user/assistant is speaking
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Add finalized transcript to messages log
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
    vapi.on("error", (err) => {
      if (err?.errorMsg === "Meeting has ended") {
        console.log("Meeting already ended, ignoring");
        return;
      }

      console.error("Vapi error:", err);
    });
  };

  /**
   * endCall
   * Ends the ongoing voice call, cleans up listeners, generates
   * a candidate evaluation report, and redirects the user back to dashboard.
   */
  const endCall = async () => {
    if (!vapiInstance || !callActiveRef.current) {
      router.replace("/dashboard");
      return;
    }

    callActiveRef.current = false;
    // Generate candidate evaluation report based on chat messages
    try {
      const result = await GenerateReport();
    } catch (e) {
      console.error("Report generation failed", e);
    }

    // if (!vapiInstance) return;

    // Stop the Vapi call and remove event listeners
    try {
      vapiInstance.stop();
    } catch {
      // call already ended — ignore
      console.log("Meeting already ended, ignoring");
      return;
    }

    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");
    vapiInstance.off("speech-start");
    vapiInstance.off("speech-end");

    setCallStarted(false);
    setVapiInstance(null);

    toast.success("Candidate evaluation report generated!");

    // Redirect to dashboard after call ends and report is generated
    router.replace("/dashboard");
  };

  /**
   * GenerateReport
   * Sends the collected messages and session details to backend API to
   * create a candidate evaluation report.
   */
  const GenerateReport = async () => {
    setLoading(true);
    const result = await axios.post("/api/recruitment-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
    });

    console.log(result.data);
    setLoading(false);

    return result.data;
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      {/* Status bar showing if call is connected */}
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"
              }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>{" "}
        {/* TODO: Add timer */}
      </div>

      {/* Main content shows recruiter details and conversation */}
      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedRecruiter?.image}
            alt={sessionDetail.selectedRecruiter?.specialist ?? ""}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail.selectedRecruiter?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Recruiter</p>

          {/* Show last 4 finalized messages and live transcript */}
          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages.slice(-4).map((msg, index) => (
              <h2 className="text-gray-400 p-2" key={index}>
                {msg.role}: {msg.text}
              </h2>
            ))}
            {liveTranscript && (
              <h2 className="text-lg">
                {currentRole} : {liveTranscript}
              </h2>
            )}
          </div>

          {/* Start or End Call buttons */}
          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <PhoneCall />}{" "}
              Start Call
            </Button>
          ) : (
            <Button variant="destructive" onClick={endCall} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />}{" "}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default RecruitmentCallAgent;
