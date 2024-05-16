import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createTutorRequestSchema } from '@/lib/forms/schemas';
import { validateForm } from '@/lib/forms/helpers';
import { getBackendPermission } from '@/lib/auth/roles';

const prisma = new PrismaClient();

export async function GET(req) {
    const response = await getBackendPermission("teacher");
    if (!response.isValid) return response.error;
    const user = response.user;

    // Get the teacher from the database
    const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });

    // Get all the tutor requests that the teacher has made and return them
    const tutorRequests = await prisma.tutorRequest.findMany({
        where: {
            teacherId: teacher.id,
        },
    });

    return NextResponse.json(tutorRequests);
}