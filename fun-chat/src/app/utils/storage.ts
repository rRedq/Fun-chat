import { UserData } from '@alltypes/common';
import { storageKey } from '@shared/const';

function setStorage(data: UserData): void {
  sessionStorage.setItem(storageKey, JSON.stringify(data));
}

function getStorage(): UserData | null {
  const user = sessionStorage.getItem(storageKey);
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

function deleteStorageKey(): void {
  sessionStorage.removeItem(storageKey);
}

export { setStorage, getStorage, deleteStorageKey };
