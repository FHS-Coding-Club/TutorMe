import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getBackendPermission } from '@/lib/auth/roles';
import GetBestMatch from '@/lib/logic/tutorPairSystem';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const response = await getBackendPermission("admin");
    if (!response.isValid) return response.error;
    const user = response.user;

    // Get all the tutor requests that have made and return them
    const tutorRequests = await prisma.tutorRequest.findMany();
    for (const student of tutorRequests) {
      const bestTutor = await GetBestMatch(student)
      console.log(bestTutor)
    }

    return NextResponse.json(tutorRequests);
  } catch (err) {
    console.log(err)
  }
}
