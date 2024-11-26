import prisma from "@/lib/prisma"

export const dynamic = 'force-static'

export default function GET(request: Request){
    const courses = prisma.course.findMany()
    return courses
}

