export { db } from '../firebase';

// Collection references
export const COLLECTIONS = {
  VOCABULARY: "vocabulary",
  CATEGORIES: "categories",
  METADATA: "metadata",
  USERS: "users",
} as const;
