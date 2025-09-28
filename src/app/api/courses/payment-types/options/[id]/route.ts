import { getPaymentOptionById } from "@/services/courseServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const paymentOption = await getPaymentOptionById(Number(id));
  return Response.json(paymentOption);
}
