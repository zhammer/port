import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const preview = z.object({
  image: z.string().optional(),
  separator: z.number(),
  position: z.string().optional(),
}).optional();

const video = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/video" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    preview,
    vimeoId: z.string(),
  }),
});

const image = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/image" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    preview,
    image: z.union([z.string(), z.array(z.string())]),
  }),
});

const web = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/web" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    preview,
    url: z.string(),
    screenshot: z.string().optional(),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/music" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    preview,
    bandcampId: z.string(),
    bandcampType: z.enum(["album", "track"]),
  }),
});

export const collections = { video, image, web, music };
