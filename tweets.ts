import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateTweet = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to generate tweets");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates engaging, authentic tweets. Keep tweets under 280 characters. Make them conversational, relatable, and engaging. Avoid hashtags unless specifically requested. Focus on creating tweets that spark conversation or provide value."
        },
        {
          role: "user",
          content: `Generate a tweet about: ${args.prompt}`
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const generatedTweet = response.choices[0].message.content;
    if (!generatedTweet) {
      throw new Error("Failed to generate tweet");
    }

    // Save to database
    await ctx.runMutation(api.tweets.saveTweet, {
      generatedTweet,
      prompt: args.prompt,
      type: "generated" as const,
    });

    return generatedTweet;
  },
});

export const improveTweet = action({
  args: {
    originalTweet: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to improve tweets");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who improves tweets to make them more engaging, clear, and impactful. Keep tweets under 280 characters. Focus on improving clarity, engagement, and readability while maintaining the original message and tone."
        },
        {
          role: "user",
          content: `Improve this tweet to make it more engaging and impactful: "${args.originalTweet}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const improvedTweet = response.choices[0].message.content;
    if (!improvedTweet) {
      throw new Error("Failed to improve tweet");
    }

    // Save to database
    await ctx.runMutation(api.tweets.saveTweet, {
      originalTweet: args.originalTweet,
      generatedTweet: improvedTweet,
      type: "improved" as const,
    });

    return improvedTweet;
  },
});

export const saveTweet = mutation({
  args: {
    originalTweet: v.optional(v.string()),
    generatedTweet: v.string(),
    prompt: v.optional(v.string()),
    type: v.union(v.literal("generated"), v.literal("improved")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to save tweets");
    }

    return await ctx.db.insert("tweets", {
      userId,
      originalTweet: args.originalTweet,
      generatedTweet: args.generatedTweet,
      prompt: args.prompt,
      type: args.type,
      isFavorite: false,
    });
  },
});

export const getUserTweets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tweets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const toggleFavorite = mutation({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet || tweet.userId !== userId) {
      throw new Error("Tweet not found or unauthorized");
    }

    await ctx.db.patch(args.tweetId, {
      isFavorite: !tweet.isFavorite,
    });
  },
});

export const deleteTweet = mutation({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet || tweet.userId !== userId) {
      throw new Error("Tweet not found or unauthorized");
    }

    await ctx.db.delete(args.tweetId);
  },
});
