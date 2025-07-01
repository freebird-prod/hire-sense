import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  resumes: defineTable({
    name: "string",
    fileUrl: "string", // Public URL of the PDF
    createdAt: "number",
  }),
});
