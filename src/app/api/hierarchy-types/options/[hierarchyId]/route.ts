import { getHierarchyOptionById } from "@/services/academicsServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hierarchyId: string }> }
) {
  const hierarchyId = (await params).hierarchyId;
  const hierarchy = await getHierarchyOptionById(Number(hierarchyId));
  return Response.json(hierarchy);
}
