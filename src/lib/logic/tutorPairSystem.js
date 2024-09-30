import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function GetBestMatch(student) {
  let bestMatch = null;
  let bestMatchScore = -99;
  let cachedTutor = null;

  try {
    const tutors = await prisma.tutor.findMany();

    tutorLoop: for (const tutor of tutors) {
      if (tutor.matchedRequest.length() > 3) {
        continue;
      }

      let matchScore = 0;
      let subjectScore = 0;

      for (const subject of tutor.subjects) {
        if (student.subject != subject) {
          continue;
        } else {
          subjectScore++;
          break;
        }
      }

      if (subjectScore == 0) {
        continue tutorLoop;
      } else {
        cachedTutor = tutor;
      }

      // Check if gender matches
      if (student.genderPref == tutor.gender) {
        matchScore += 2;
      }

      if (matchScore > bestMatchScore) {
        bestMatch = tutor;
        bestMatchScore = matchScore;
      }
    }

    if (bestMatchScore <= 0) {
      if (cachedTutor != null) {
        console.log("could not match gender, forced to choose cachedTutor");
        return cachedTutor;
      } else {
        console.log(
          "returning...................................................."
        );
        return "could not find a good match... sending email to mister decker";
      }
    }
    return bestMatch;
  } catch (error) {
    console.log(error);
  }
}
