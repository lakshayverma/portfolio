export interface PromptConfig {
  id: string;
  title: string;
  outputContext: string;
  promptSyntax: string;
  subjectId: string;
  goal: string;
  description: string;
  timeOfDay: string;
  tone: string[];
  primaryRatio: string;
  secondaryRatio: string;
  platform: string[];
  textPlacements: string;
  fontStyle: string;
  imageStyle: string;
  keywords: string[];
  scenery: string;
  additionalElements: Record<string, boolean>;
  customAdditions: string;
  compiledOutputOverride?: string;
}

const DB_NAME = 'PromptStudioDB_Next_v1';
const STORE_NAME = 'prompts';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is not available on server'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveToDB = async (promptData: PromptConfig): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(promptData);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllFromDB = async (): Promise<PromptConfig[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
