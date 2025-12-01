-- CreateTable
CREATE TABLE "admin" (
    "admin_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "categori" (
    "categori_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "admin_id" INTEGER,

    CONSTRAINT "categori_pkey" PRIMARY KEY ("categori_id")
);

-- CreateTable
CREATE TABLE "produk" (
    "produk_id" SERIAL NOT NULL,
    "categori_id" INTEGER,
    "suplier_id" INTEGER,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(150),
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("produk_id")
);

-- CreateTable
CREATE TABLE "suplier" (
    "suplier_id" SERIAL NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "contact" VARCHAR(100),

    CONSTRAINT "suplier_pkey" PRIMARY KEY ("suplier_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- AddForeignKey
ALTER TABLE "categori" ADD CONSTRAINT "categori_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("admin_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_categori_id_fkey" FOREIGN KEY ("categori_id") REFERENCES "categori"("categori_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_suplier_id_fkey" FOREIGN KEY ("suplier_id") REFERENCES "suplier"("suplier_id") ON DELETE SET NULL ON UPDATE NO ACTION;
