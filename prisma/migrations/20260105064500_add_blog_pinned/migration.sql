-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPost_pinned_idx" ON "BlogPost"("pinned");
