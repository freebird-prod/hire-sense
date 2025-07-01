import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { generateUploadUrl } from "./_generated/server";

export const generateResumeUploadUrl = mutation(async (ctx) => {
  return await generateUploadUrl(ctx);
});

export const saveResume = mutation({
  args: {
    name: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("resumes", {
      name: args.name,
      fileUrl: args.fileUrl,
      createdAt: Date.now(),
    });
  },
});
