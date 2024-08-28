import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function GetBestMatch(student) {

  let bestMatch = null;
  let bestMatchScore = 0;
  let bestTutor;

  const tutors = await prisma.tutor.findMany()

  for (const tutor of tutors) {
    let matchScore = 0;

    // Check if gender matches
    if (student.gender === tutor.gender) {
      matchScore += 2;
    }

    // Check if the student's wanted subject matches the tutor's subjects
    if (tutor.subjects.includes(student.wantedSubject)) {
      matchScore += 3;
    }

    // Calculate age difference score
    const ageDifference = Math.abs(student.age - tutor.age);
    matchScore += 5 - ageDifference;

    if (matchScore > bestMatchScore) {
      bestMatch = tutor;
      bestMatchScore = matchScore;
      bestTutor = tutor
    }
  }

  return bestTutor;
}
