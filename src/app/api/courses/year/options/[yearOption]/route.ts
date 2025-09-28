import { Option } from "@/components/common/Dropdown";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ yearOption: string }> }
) {
  const year = (await params).yearOption;

  try {
    if (!year || isNaN(Number(year))) {
      return new Response("Año inválido", { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Año inválido", { status: 400 });
  }

  const option: Option = {
    value: year,
    name: year,
  };

  return Response.json(option);
}
