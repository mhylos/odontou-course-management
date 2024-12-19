import { PaymentTypeCreateBody } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { getAllPaymentTypes } from "@/services/courseServices";

export async function GET() {
  const paymentTypes = await getAllPaymentTypes();
  return Response.json(paymentTypes);
}

export async function POST(request: Request) {
  const body: PaymentTypeCreateBody = await request.json();
  const paymentType = await prisma.paymentTypes.create({
    data: body,
  });
  return Response.json(paymentType);
}
