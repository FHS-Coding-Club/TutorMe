import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const uniqueStudent = await prisma.tutorRequest.findUnique({

    })
  } catch (error) {

  }
}
