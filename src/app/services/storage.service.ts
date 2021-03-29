import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";


export interface StorageChange {
  key: string;
  value: string;
  storageArea: "localStorage";
}

export interface StorageGetItem {
  key: string;
  storageArea: "localStorage";
}

@Injectable({ providedIn: "root" })
export class StorageService {
  public storageChange$: ReplaySubject<StorageChange> = new ReplaySubject();

  constructor() {}

  public setStorageItem(change: StorageChange) {
    window[change.storageArea].setItem(change.key, change.value);
    this.storageChange$.next(change);
  }

  public getStorageItem(getItem: StorageGetItem) {
    window[getItem.storageArea].getItem(getItem.key);
  }
}