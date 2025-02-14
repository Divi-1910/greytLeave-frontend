-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_emailAddress_key" ON "Admin"("emailAddress");
