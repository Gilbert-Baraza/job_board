-- CreateTable
CREATE TABLE "HiringRecord" (
    "id" TEXT NOT NULL,
    "application_id" INTEGER NOT NULL,

    CONSTRAINT "HiringRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiringRecord_application_id_key" ON "HiringRecord"("application_id");

-- AddForeignKey
ALTER TABLE "HiringRecord" ADD CONSTRAINT "HiringRecord_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
