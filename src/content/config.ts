import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const materialSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum([
    'UI/UX',
    'Web Development', 
    'Mobile Development',
    'DevOps',
    'QA',
    'Backend',
    'Frontend',
    'Cyber Security',
    'AI/ML',
    'Database',
    'Cloud'
  ]),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  estimatedTime: z.string().optional(),
  prerequisites: z.array(z.string()).default([]),
  // Fields for curriculum index
  type: z.enum(['curriculum', 'article']).default('article').optional(),
  totalLessons: z.number().optional(),
  curriculumSlug: z.string().optional(),
  order: z.number().optional(), // For lessons within a curriculum
});

const materials = defineCollection({
  type: 'content',
  schema: materialSchema,
});

export const collections = { blog, materials };
