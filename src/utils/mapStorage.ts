const DB_NAME = 'PetualanganPetaDB';
const STORE_NAME = 'mapAssets';
const MAP_KEY = 'originalMapImage';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMapImageToDB(dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, MAP_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save map image in IndexedDB:', err);
    try {
      localStorage.setItem(MAP_KEY, dataUrl);
    } catch {
      // Storage quota exceeded
    }
  }
}

export async function getMapImageFromDB(): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(MAP_KEY);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as string);
        } else {
          resolve(localStorage.getItem(MAP_KEY));
        }
      };
      req.onerror = () => resolve(localStorage.getItem(MAP_KEY));
    });
  } catch {
    return localStorage.getItem(MAP_KEY);
  }
}

export async function clearSavedMap(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(MAP_KEY);
    localStorage.removeItem(MAP_KEY);
  } catch {
    localStorage.removeItem(MAP_KEY);
  }
}
