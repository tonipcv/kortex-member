/*
  Warnings:

  - You are about to drop the column `agency` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `bank_accounts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bank_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "country" TEXT NOT NULL DEFAULT 'BR',
    "balance" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bank_accounts" ("balance", "bank", "createdAt", "id", "name", "updatedAt", "userId") SELECT "balance", "bank", "createdAt", "id", "name", "updatedAt", "userId" FROM "bank_accounts";
DROP TABLE "bank_accounts";
ALTER TABLE "new_bank_accounts" RENAME TO "bank_accounts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
