"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import RecruiterCard, { recruiterAgent } from "./RecruiterCard";
import SuggestedRecruiterCard from "./SuggestedRecruiterCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "../recruiter/[sessionId]/page";

function AddNewSessionDialog() {
  // 🧠 Local state management
  const [note, setNote] = useState<string>(); // stores user notes for session
  const [loading, setLoading] = useState(false); // tracks loading state
  const [suggestedRecruiters, setSuggestedRecruiters] = useState<recruiterAgent[]>(); // stores suggested recruiters
  const [selectedRecruiter, setSelectedRecruiter] = useState<recruiterAgent>({
    id: 1,
    specialist: "Software Engineer Recruiter",
    description: "Screens candidates for software engineering roles - frontend, backend, and full-stack positions.",
    image: "/recruiter-tech.jpg",
    agentPrompt:
      "Hi! I'm calling from the recruitment team. Thank you for taking the time to speak with me today. We have an exciting Software Engineer position that I'd love to discuss with you. Before we dive in, let me give you a quick overview of the role. We're looking for a talented engineer to join our development team. Does this sound like something you'd be interested in exploring further?",
    voiceId: "chris",
    gender: "male",
    subscriptionRequired: false,
  }); // tracks selected recruiter
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]); // stores past session list

  const router = useRouter();
  const { has } = useAuth();

  // ✅ Checks if user has a paid subscription (Clerk custom role)
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  // 🧾 Fetch session history when dialog mounts
  useEffect(() => {
    GetHistoryList();
  }, []);

  // 📥 Get all previous session records
  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };

  // 🧠 Handles the "Next" button click — suggests recruiters based on user input
  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-recruiters", {
      notes: note,
    });

    console.log(result.data);
    setSuggestedRecruiters(result.data);
    setLoading(false);
  };

  // 💼 Handles "Start Recruitment" button — saves session and redirects
  const onStartRecruitment = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedRecruiter: selectedRecruiter,
    });

    console.log(result.data);
    if (result.data?.sessionId) {
      // 🔁 Redirect to the new recruitment call page
      router.push("/dashboard/recruiter/" + result.data.sessionId);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      {/* 🔘 Open Dialog Button */}
      <DialogTrigger asChild>
        <Button
          className="mt-3"
          disabled={!paidUser && historyList?.length >= 1} // restrict for free users
        >
          + Start Recruitment
        </Button>
      </DialogTrigger>

      {/* 🗂️ Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recruitment Session Details</DialogTitle>
          <DialogDescription asChild>
            {/* Step 1: Enter Notes */}
            <div>
              <h2>Enter notes for this recruitment session</h2>
              <Textarea
                placeholder="Add session notes here (e.g., job role, candidate name)..."
                className="h-[200px] mt-1"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Dialog Footer with Buttons */}
        <DialogFooter>
          {/* Cancel Button */}
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {/* Next or Start Button depending on the step */}

          <Button
            disabled={loading || !selectedRecruiter}
            onClick={() => onStartRecruitment()}
          >
            Start Recruitment{" "}
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
