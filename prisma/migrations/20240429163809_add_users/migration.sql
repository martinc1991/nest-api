/*
  Warnings:

  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_menuId_fkey";

-- DropTable
DROP TABLE "Products";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "section" TEXT DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL,
    "menuId" TEXT NOT NULL,
    "published" BOOLEAN DEFAULT true,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
