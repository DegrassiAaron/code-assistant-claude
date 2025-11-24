/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import path from "path";

/**
 * Check if a file or directory exists
 *
 * @param filePath - Path to check
 * @returns True if exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a file safely with error handling
 *
 * @param filePath - Path to file
 * @returns File content or null if not found
 */
export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Read and parse JSON file safely
 *
 * @param filePath - Path to JSON file
 * @returns Parsed object or null if not found/invalid
 */
export async function readJsonSafe<T = any>(
  filePath: string,
): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Create directory recursively if it doesn't exist
 *
 * @param dirPath - Directory path to create
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Write file with automatic directory creation
 *
 * @param filePath - Path to file
 * @param content - File content
 */
export async function writeFileSafe(
  filePath: string,
  content: string,
): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  await fs.writeFile(filePath, content, "utf-8");
}
