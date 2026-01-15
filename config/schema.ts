import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { number } from "motion";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer()
});

export const SessionChatTable = pgTable('sessionChatTable', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar().notNull(),
    notes: text(),
    selectedRecruiter: json(), // HR recruiter agent selected for this screening call
    conversation: json(),
    report: json(), // Candidate evaluation report
    vapiCallId: varchar(), // Vapi call ID for recording retrieval
    recordingUrl: text(), // Direct recording URL from Vapi end-of-call-report
    createdBy: varchar().references(() => usersTable.email),
    createdOn: varchar(),
})
