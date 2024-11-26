import prisma from "@/lib/prisma"

export const dynamic = 'force-static'

type ProgramResponse = {
    id: number
    name: string
}

type ProgramRequest = {
    name: string
}

export async function GET(request: Request){
    const programs = prisma.program.findMany()
    return programs
}