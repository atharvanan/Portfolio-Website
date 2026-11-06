import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import {
  profile as defaultProfile,
  navLinks as defaultNavLinks,
  about as defaultAbout,
  education as defaultEducation,
  certifications as defaultCertifications,
  experience as defaultExperience,
  projects as defaultProjects,
  skillGroups as defaultSkillGroups,
  sectionHeaders as defaultSectionHeaders,
  siteMetadata as defaultSiteMetadata,
  Profile,
  NavLink,
  EducationEntry,
  Certification,
  ExperienceEntry,
  Project,
  SkillGroup,
  SectionHeaders,
  PortfolioData,
  defaultPortfolioData,
} from "./data";

export { type PortfolioData, defaultPortfolioData };

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio.json");

// MongoDB Singleton Client
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    // Preserve client across module reloads in development
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Fetch portfolio data:
 * 1. From MongoDB Atlas if MONGODB_URI is provided.
 * 2. From local data/portfolio.json if it exists.
 * 3. Fallback to default data in lib/data.ts.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const mongoPromise = getMongoClientPromise();

  if (mongoPromise) {
    try {
      const client = await mongoPromise;
      const db = client.db(process.env.MONGODB_DB_NAME || "portfolio");
      const collection = db.collection("content");
      const doc = await collection.findOne({ _id: "portfolio_main" as any });

      if (doc && doc.data) {
        return doc.data as PortfolioData;
      }
    } catch (err) {
      console.error("[MongoDB Error in getPortfolioData]:", err);
    }
  }

  // Fallback to local data/portfolio.json file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(fileContent) as PortfolioData;
    }
  } catch (err) {
    console.error("[Local file read error in getPortfolioData]:", err);
  }

  return defaultPortfolioData;
}

/**
 * Save portfolio data:
 * 1. To MongoDB Atlas if MONGODB_URI is provided.
 * 2. To local data/portfolio.json as local backup.
 */
export async function savePortfolioData(data: PortfolioData): Promise<{ success: boolean; storage: "mongodb" | "local" }> {
  let storageType: "mongodb" | "local" = "local";
  const mongoPromise = getMongoClientPromise();

  if (mongoPromise) {
    try {
      const client = await mongoPromise;
      const db = client.db(process.env.MONGODB_DB_NAME || "portfolio");
      const collection = db.collection("content");

      await collection.updateOne(
        { _id: "portfolio_main" as any },
        {
          $set: {
            data,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
      storageType = "mongodb";
    } catch (err) {
      console.error("[MongoDB Error in savePortfolioData]:", err);
      throw new Error(`Failed to save to MongoDB: ${(err as Error).message}`);
    }
  }

  // Also save locally whenever possible (local development only, skip on Vercel read-only serverless filesystem)
  if (!process.env.VERCEL) {
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      if (storageType !== "mongodb") {
        console.warn("[Local file write warning]:", err);
      }
    }
  }

  return { success: true, storage: storageType };
}
