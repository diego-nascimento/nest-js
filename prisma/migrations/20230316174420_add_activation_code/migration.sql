-- CreateTable
CREATE TABLE "activecustomer" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "activecustomer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activecustomer" ADD CONSTRAINT "activecustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
