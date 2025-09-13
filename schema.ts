import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tweets: defineTable({
    userId: v.id("users"),
    originalTweet: v.optional(v.string()),
    generatedTweet: v.string(),
    prompt: v.optional(v.string()),
    type: v.union(v.literal("generated"), v.literal("improved")),
    isFavorite: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
