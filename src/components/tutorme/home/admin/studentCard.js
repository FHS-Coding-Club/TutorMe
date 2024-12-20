"use client";

import { getSubjectIcon, getSubjectColor } from "@/components/utils/common";
import { IoEllipsisVerticalOutline, IoLanguageOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { CalendarCheck } from "lucide-react";
import { MdOutlinePending } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Progress,
  Chip,
} from "@nextui-org/react";

const StudentCard = ({
  id,
  student,
  studentEmail,
  subject,
  genderPref,
  tutor,
  matchedTutor,
  status,
  onMatch,
  onApprove,
  onDeny,
}) => {
  const getTutorName = () => {
    if (status === "APPROVED") {
      if (tutor?.name) {
        return tutor.name;
      }
      if (matchedTutor?.name) {
        return matchedTutor.name;
      }
    }

    if (status === "PENDING_CONFIRMATION" && matchedTutor?.name) {
      return `${matchedTutor.name} (Pending)`;
    }

    return "No Tutor Yet";
  };

  return (
    <Card className="w-10/12 h-[360px] bg-white hover:shadow-[#FACC14] border shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 mx-10">
      <CardHeader className="text-black-700 items-center justify-center flex-col">
        <strong>{student}</strong>
        <div className="flex items-center gap-1 flex-row text-gray-400">
          <p>{studentEmail}</p>
        </div>
      </CardHeader>
      <CardBody className="text-black gap-4 overflow-hidden">
        <div className="flex items-center gap-1">
          <p>Subject</p>
          <IoEllipsisVerticalOutline size={20} className="mt-1" />
          <Chip
            size="md"
            className={cn(
              getSubjectColor(subject),
              "flex items-center gap-1 px-2 mt-1"
            )}
            endContent={getSubjectIcon(subject)}
          >
            {subject}
          </Chip>
        </div>
        <div className="flex items-center gap-1">
          <p>Gender Preference</p>
          <IoEllipsisVerticalOutline size={20} className="mt-1" />
          {genderPref === "F" ? (
            <p>Female</p>
          ) : genderPref === "M" ? (
            <p>Male</p>
          ) : (
            <p>No Preference</p>
          )}
        </div>
        <div className="flex items-start justify-start flex-row">
          <p className="text-center">Tutor</p>
          <IoEllipsisVerticalOutline size={20} className="mt-1" />
          <p>{getTutorName()}</p>
        </div>

        <div>
          {status === "APPROVED" ? (
            <div>
              <strong className="text-center pb-2 flex item-center justify-start items-center">
                Completed
              </strong>
              <Progress color="success" value={100} className="max-w-xl" />
              <div className="flex justify-between pt-1">
                <p className="text-gray-400">Tutor has been assigned!</p>
                <div className="justify-end">
                  <FaRegCheckCircle size={25} className="text-green-600" />
                </div>
              </div>
            </div>
          ) : status === "PENDING_CONFIRMATION" ? (
            <div>
              <strong className="text-center pb-2 flex item-center justify-start items-center">
                Pending Confirmation
              </strong>
              <Progress
                color="warning"
                value={75}
                className="max-w-xl"
                classNames={{
                  indicator: "bg-yellow-400",
                }}
              />
              <div className="flex justify-between pt-1">
                <p className="text-gray-400">Waiting for confirmation</p>
                <div className="flex justify-end">
                  <CalendarCheck size={25} className="text-orange-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              <strong className="text-center pb-2 flex item-center justify-start items-center">
                Pending
              </strong>
              <Progress color="danger" value={30} className="max-w-xl" />
              <div className="flex justify-between pt-1">
                <p className="text-gray-400">Waiting for tutor match</p>
                <div className="flex justify-end">
                  <MdOutlinePending size={30} className="text-red-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="justify-end gap-2 mb-2">
        {status === "PENDING_CONFIRMATION" && (
          <>
            <Button
              className="bg-gradient-to-tr from-green-600 to-green-300 text-white"
              size="md"
              icon={FaCheck}
              endContent={<FaCheck size="15" />}
              onClick={() => onApprove(id)}
            >
              Approve
            </Button>
            <Button
              className="bg-gradient-to-tr from-red-600 to-red-300 text-white"
              size="md"
              icon={FaTimes}
              endContent={<FaTimes size="15" />}
              onClick={() => onDeny(id)}
            >
              Deny
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
export default StudentCard;
