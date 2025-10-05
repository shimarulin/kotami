export interface LoginStorageRecord {
  user: string
  sessions: {
    [user: string]: string
  }
}
