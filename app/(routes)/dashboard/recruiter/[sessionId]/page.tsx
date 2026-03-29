"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { recruiterAgent } from "../../_components/RecruiterCard";
import { Circle, Loader, Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
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
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const router = useRouter();
  const callActiveRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, liveTranscript]);

  useEffect(() => {
    if (videoRef.current) {
      if (callStarted && currentRole === "assistant") {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      } else {
        videoRef.current.pause();
        // optionally: videoRef.current.currentTime = 0;
      }
    }
  }, [currentRole, callStarted]);

  useEffect(() => {
    if (callStarted) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // setTimer(0); // Reset timer when call ends? Maybe keep it for report.
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load session details on component mount or when sessionId changes
  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Fetch session detail data from backend API
  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
      console.log("Session details retrieved:", result.data);
      if (!result.data || !result.data.selectedRecruiter) {
        console.warn("⚠️ Session details or recruiter info is missing!");
      }
      setSessionDetail(result.data);
    } catch (error) {
      console.error("❌ Failed to fetch session details:", error);
      toast.error("Failed to load interview session.");
    }
  };

  /**
   * formatToPoints
   * Splits a string into an array of points based on common punctuation (., ?, !).
   */
  const formatToPoints = (text: string) => {
    if (!text) return [];
    // First, split by all punctuation to get individual sentences
    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    const points: string[] = [];
    let currentPoint = "";

    sentences.forEach((s) => {
      const trimmed = s.trim();
      if (trimmed.endsWith('?')) {
        // If there's a current non-question block, push it first
        if (currentPoint) {
          points.push(currentPoint);
          currentPoint = "";
        }
        // Questions always start a new point
        points.push(s);
      } else {
        // Combine non-question sentences
        currentPoint += (currentPoint ? " " : "") + s;
      }
    });

    // Push any remaining non-question block
    if (currentPoint) points.push(currentPoint);
    return points;
  };

  /**
   * Group consecutive messages from the same role to avoid fragmented UI
   */
  const groupedMessages = messages.reduce((acc: messages[], current) => {
    const last = acc[acc.length - 1];
    if (last && last.role === current.role) {
      last.text += " " + current.text;
      return acc;
    }
    return [...acc, { ...current }];
  }, []);

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
    const vapiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    console.log("Vapi Key defined:", !!vapiKey);
    if (!vapiKey) {
      toast.error("Vapi API key is missing. Check your .env file.");
      setLoading(false);
      return;
    }
    const vapi = new Vapi(vapiKey);
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

      console.error("Vapi error details:", err);
      toast.error(`Vapi connection error: ${err?.errorMsg || "Unknown error"}`);
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

  /**
   * toggleMute
   * Toggles the local microphone mute state via Vapi instance
   */
  const toggleMute = () => {
    if (vapiInstance) {
      const newMuteState = !isMuted;
      vapiInstance.setMuted(newMuteState);
      setIsMuted(newMuteState);
      toast.info(newMuteState ? "Microphone muted" : "Microphone unmuted");
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] p-4 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
        {/* Status bar */}
        <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex gap-4 items-center">
            <h2 className="p-1 px-3 border rounded-full flex gap-2 items-center text-sm font-medium bg-secondary/50">
              <Circle
                className={`h-3 w-3 rounded-full ${callStarted ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
              />
              {callStarted ? "Live Session" : "Ready to Connect"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h2 className="font-mono font-bold text-xl text-neutral-700 dark:text-neutral-300">
                {formatTime(timer)}
              </h2>
            </div>
          </div>
        </div>

        {/* Main content - 30/70 Layout */}
        {sessionDetail && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 flex-1 min-h-[600px]">
            {/* Left Column - Agent Info & Controls (30%) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-[#ff6600]/10 to-transparent" />

                {/* Agent Video/Image Container */}
                <div className="relative w-40 h-40 mb-6 mt-4">
                  {/* Continuous Pulse Effect around bot image */}
                  {currentRole === 'assistant' && (
                    <div className="absolute inset-0 bg-[#ff6600] rounded-full animate-ping opacity-25 scale-125" />
                  )}
                  <div className={`absolute inset-0 bg-[#ff6600] rounded-full blur-2xl opacity-20 transition-all duration-500 ${currentRole === 'assistant' ? 'opacity-40 scale-110 animate-pulse' : ''}`} />

                  <div className={`relative w-full h-full rounded-full overflow-hidden border-4 ${currentRole === 'assistant' ? 'border-[#ff6600]' : 'border-white dark:border-neutral-800'} shadow-2xl bg-neutral-200 dark:bg-neutral-800 transition-all duration-300`}>
                    <video
                      ref={videoRef}
                      src={sessionDetail.selectedRecruiter?.gender === "male" ? "/lantaai.mp4" : "/female.mp4"}
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {callStarted && (
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <span className={`w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${currentRole === 'assistant' ? 'bg-[#ff6600] animate-bounce' : 'bg-green-500'}`} />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-white capitalize">
                    {sessionDetail.selectedRecruiter?.specialist}
                  </h2>
                  <p className="text-[#ff6600] font-bold text-sm uppercase tracking-wider mb-4">AI Senior Recruiter</p>

                  <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                    <p>Expert in screening and talent evaluation for {sessionDetail.selectedRecruiter?.specialist} roles.</p>
                  </div>
                </div>

                <div className="mt-auto pt-10 w-full flex flex-col gap-3">
                  {!callStarted ? (
                    <Button
                      className="w-full h-14 rounded-2xl text-lg font-bold bg-[#ff6600] hover:bg-[#ff6600]/90 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
                      onClick={StartCall}
                      disabled={loading}
                    >
                      {loading ? <Loader className="animate-spin" /> : <PhoneCall className="w-5 h-5" />}
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={isMuted ? "secondary" : "outline"}
                        className={`w-full h-14 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-95 gap-3 ${isMuted ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200' : ''}`}
                        onClick={toggleMute}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isMuted ? "Unmute Mic" : "Mute"}
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
                        onClick={endCall}
                        disabled={loading}
                      >
                        {loading ? <Loader className="animate-spin" /> : <PhoneOff className="w-5 h-5" />}
                        End Session
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tips/Info Card */}
              <div className="bg-[#ff6600]/5 border border-[#ff6600]/10 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-2 underline decoration-[#ff6600]">Interview Tips</h3>
                <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 list-disc pl-4">
                  <li>Speak clearly and naturally</li>
                  <li>Be ready to discuss your experience</li>
                  <li>Hindi, English or Hinglish are all supported</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Conversation (70%) */}
            <div className="lg:col-span-7 flex flex-col bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden relative max-h-[700px]">
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/30 shrink-0">
                <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full" />
                  Live Transcript
                </h3>
                {callStarted && (
                  <span className="text-xs font-medium text-green-500 flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active Listening
                  </span>
                )}
              </div>

              {/* Chat Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#ff6600]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#ff6600]/40 transition-colors"
              >
                {!callStarted && messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                      <PhoneCall className="w-8 h-8 text-neutral-400" />
                    </div>
                    <p className="text-neutral-500">The conversation transcript will appear here once the call starts.</p>
                  </div>
                ) : (
                  <>
                    {groupedMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tr-none'
                          : 'bg-[#ff6600] text-white rounded-tl-none'
                          }`}>
                          <p className={`text-[10px] font-bold mb-2 opacity-70 uppercase tracking-wider ${msg.role === 'user' ? 'text-neutral-500' : 'text-white/80'}`}>
                            {msg.role === 'user' ? 'Candidate' : 'AI Recruiter'}
                          </p>
                          {msg.role === 'assistant' ? (
                            <ul className="space-y-2">
                              {formatToPoints(msg.text).map((point, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="mt-1.5 w-1.5 h-1.5 bg-white/50 rounded-full shrink-0" />
                                  <span className="leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="leading-relaxed">{msg.text}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {liveTranscript && (
                      <div className={`flex flex-col ${currentRole === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md border-b-4 border-black/10 ${currentRole === 'user'
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-tr-none'
                          : 'bg-[#ff6600]/90 text-white rounded-tl-none'
                          }`}>
                          <p className={`text-[10px] font-bold mb-2 opacity-70 uppercase tracking-wider ${currentRole === 'user' ? 'text-neutral-500' : 'text-white/80'}`}>
                            {currentRole === 'user' ? 'Candidate' : 'AI Recruiter'}
                          </p>
                          {currentRole === 'assistant' ? (
                            <ul className="space-y-2">
                              {formatToPoints(liveTranscript).map((point, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="mt-1.5 w-1.5 h-1.5 bg-white/50 rounded-full shrink-0" />
                                  <span className="leading-relaxed italic">{point}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="leading-relaxed italic">{liveTranscript}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer Decor */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/20 text-center border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                  Powered by LantaAI • Audio recorded for quality assessment
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruitmentCallAgent;
