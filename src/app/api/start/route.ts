import prisma from "@/lib/prisma"

const DEFAULT_PROGRAMS = [
    "E-Learning",
    "Presencial",
    "Semi-Presencial",
    "Presencial externo",
    "Semi-Presencial externo",
]

export async function GET(request: Request){
    const response = []
    const programs = await prisma.program.findMany()
    if(programs.length === 0){
        await prisma.program.createMany({
            data: DEFAULT_PROGRAMS.map(name => ({ name }))
        })

        response.push('Programas por defecto creados')
    }

    return Response.json({ message: response })
}