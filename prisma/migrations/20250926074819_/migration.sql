-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('activo', 'inactivo', 'graduado', 'suspendido');

-- AlterTable
ALTER TABLE "Enrolled" ADD COLUMN     "detailed_status" "StudentStatus",
ALTER COLUMN "status" SET DEFAULT true;
