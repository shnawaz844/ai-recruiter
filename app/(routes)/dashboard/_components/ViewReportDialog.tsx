import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../recruiter/[sessionId]/page";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

type props = {
  record: SessionDetail;
};

/**
 * ViewReportDialog Component
 *
 * Displays a detailed AI Recruitment Candidate Evaluation Report
 */
function ViewReportDialog({ record }: props) {
  const report: any = record?.report;
  const formatDate = moment(record?.createdOn).format(
    "MMMM Do YYYY, h:mm a"
  );

  const getRecommendationColor = (rec: string) => {
    if (rec?.includes("Strong") || rec?.includes("Proceed")) return "text-green-600";
    if (rec?.includes("Reject")) return "text-red-500";
    return "text-yellow-600";
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size={"sm"}>
          View Evaluation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6 border border-gray-200 w-[750px]">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-3xl font-bold text-slate-700 mb-6">
              📋 Candidate Evaluation Report
            </h2>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="space-y-6 text-gray-800 text-sm">

              {/* 📌 Session Info */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Role & Session Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <p><strong>Role Applied For:</strong> {report?.roleAppliedFor || record.selectedRecruiter.specialist}</p>
                  <p><strong>Evaluation Date:</strong> {formatDate}</p>
                </div>
              </div>

              {/* 🏁 Hiring Recommendation */}
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-md font-bold uppercase text-gray-500 mb-1">Hiring Recommendation</h3>
                <h2 className={`text-2xl font-extrabold ${getRecommendationColor(report?.hiringRecommendation)}`}>
                  {report?.hiringRecommendation || "Pending Review"}
                </h2>
                {report?.recommendedNextSteps && (
                  <p className="mt-2 text-sm text-gray-600">➡️ Next Step: {report?.recommendedNextSteps}</p>
                )}
              </div>

              {/* 📝 Interview Summary */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Executive Summary
                </h3>
                <hr className="border-t-2 border-slate-200 my-2" />
                <p className="leading-relaxed">{report?.interviewSummary}</p>
              </div>

              {/* 📊 Scores & Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-slate-700">Communication Score</h3>
                  <div className="text-sm mt-1 flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">{report?.communicationScore}/10</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700">Technical Relevance</h3>
                  <div className="text-sm mt-1">{report?.technicalRelevance}</div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-semibold text-slate-700">Cultural Fit Assessment</h3>
                  <p className="text-sm mt-1">{report?.culturalFitAssessment}</p>
                </div>
              </div>

              {/* ✅ Key Skills & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {report?.strengths?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">
                      Key Strengths
                    </h3>
                    <hr className="border-t-2 border-green-200 my-2" />
                    <ul className="list-disc list-inside space-y-1">
                      {report.strengths.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report?.keySkillsIdentified?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">
                      Skills Identified
                    </h3>
                    <hr className="border-t-2 border-blue-200 my-2" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {report.keySkillsIdentified.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 🚩 Red Flags */}
              {report?.redFlags?.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-red-600">
                    Concerns / Red Flags
                  </h3>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {report.redFlags.map((item: string, index: number) => (
                      <li key={index} className="text-red-800">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ⚠️ Footer */}
              <div className="pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
                This is an ISO-standard candidate evaluation based on an AI screening interview. It is for recruitment purposes only.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
