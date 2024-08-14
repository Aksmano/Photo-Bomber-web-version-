// indexedDB.ts
const DB_NAME = "webpix";
const DB_VERSION = 1;
const STORE_NAME = "webpix_cache";

interface MyData {
  id: string;
  content: any; // Adjust the type to match the actual structure of the data you're storing
}

export namespace IndexedDBUtils {
  export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  export const addItem = async <T>(id: string, content: T): Promise<string> => {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put({ id, content });

      request.onsuccess = () => {
        resolve(request.result as string);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  export const getItem = async <T>(id: string): Promise<T> => {
    const db = await openDB();
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result ? (request.result as MyData).content : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  export const deleteItem = async (id: string): Promise<void> => {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  export const clearAllItems = async (): Promise<void> => {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };
}
