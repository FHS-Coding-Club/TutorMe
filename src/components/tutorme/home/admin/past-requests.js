"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import StudentCard from "./studentCard";
import { IoFilter } from "react-icons/io5";
import Select from "react-select";

const PastRequests = () => {
  const [studentArr, setStudentArr] = useState([]);
  const [updateArr, setUpdateArr] = useState([]);
  const [listStudent, setListStudent] = useState([]);
  const [isReversed, setIsReversed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/admin/past-tutor-requests");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudentArr(data);
        setUpdateArr(data);
        display(data, isReversed);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tutor requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const search = (value) => {
    const searchTerm = value.toLowerCase().trim();
    const returnArr = studentArr.filter((student) =>
      innerSearch(student, searchTerm)
    );
    setUpdateArr(returnArr);
    setNoResults(returnArr.length === 0);
    display(returnArr, isReversed);
  };

  const innerSearch = (student, searchTerm) => {
    const searchFields = [
      student.student,
      student.studentEmail,
      student.subject,
      student.teacher?.user?.name,
    ];

    return searchFields.some(
      (field) => field && field.toLowerCase().includes(searchTerm)
    );
  };

  const display = (returnArr, reverse) => {
    let myTempArr = JSON.parse(JSON.stringify(returnArr));
    if (reverse) {
      myTempArr.reverse();
    }
    setListStudent(myTempArr);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // ... existing code ...

  return (
    <div className="h-full w-full flex flex-col items-center">
      <>
        <div className="flex flex-row m-4 justify-center items-center w-full">
        <Select
                      
                      className="min-w-[15%] h-10 px-4 basic-multi-select"
                      classNamePrefix="select"
                      placeholder={
                        <div className="flex items-center">
                          <IoFilter className="mr-2" />
                          <span>Filter</span>
                        </div>
                      }
                      
                    />
          <Input
            type="text"
            id="inputSearch"
            placeholder="Search"
            className="w-[60%]"
            onKeyUp={(event) => {
              search(event.target.value);
            }}
          />
        </div>
        <div className="w-full overflow-y-auto max-h-[calc(100vh-120px)]">
          {noResults ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg">No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 sm:gap-x-10 gap-x-20 gap-y-10 p-4 mx-auto max-w-6xl">
              {listStudent.map((student) => (
                <StudentCard
                  id={student.id}
                  student={student.student}
                  studentEmail={student.studentEmail}
                  subject={student.subject}
                  genderPref={student.genderPref}
                  teacherName={student.teacher?.user?.name}
                  key={student.id}
                />
              ))}
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default PastRequests;
