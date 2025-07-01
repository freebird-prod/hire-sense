import { action } from "./_generated/server";

export const getLatestResume = action(async (ctx) => {
  const resumes = await ctx.db.query("resumes").order("desc").take(1);
  return resumes.length > 0 ? resumes[0] : null;
});
