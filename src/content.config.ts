import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const video = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/video" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    vimeoId: z.string(),
  }),
});

const image = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/image" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    image: z.string(),
  }),
});

const web = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/web" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    url: z.string(),
    screenshot: z.string(),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/music" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    bandcampId: z.string(),
    bandcampType: z.enum(["album", "track"]),
  }),
});

export const collections = { video, image, web, music };
