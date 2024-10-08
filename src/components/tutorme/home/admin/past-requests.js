"use client";

import React, { useState, useEffect } from "react";
import {
  subjectsOptions,
  formatOptionLabel,
  customStyles,
  getSubjectIcon,
  getSubjectColor,
} from "@/components/utils/common";
import StudentCard from "./studentCard";
import { IoFilter, IoSearchOutline } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Switch,
} from "@nextui-org/react";
import Select from "react-select";
import { DeleteIcon, EditIcon, EyeIcon, CheckIcon } from "lucide-react";

const PastRequests = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentArr, setStudentArr] = useState([]);
  const [updateArr, setUpdateArr] = useState([]);
  const [listStudent, setListStudent] = useState([]);
  const [isReversed, setIsReversed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editGenderPref, setEditGenderPref] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tutors, setTutors] = useState([]);

  const [viewMode, setViewMode] = useState("card");

  const renderCell = React.useCallback((request, columnKey) => {
    switch (columnKey) {
      case "student":
        const initials = request.student
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <User
            name={request.student}
            description={request.studentEmail}
            avatarProps={{
              src: null,
              name: initials,
              color: "primary",
            }}
          >
            {request.studentEmail}
          </User>
        );
      case "subject":
        return (
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              className={cn(
                getSubjectColor(request.subject),
                "flex items-center gap-1 px-2"
              )}
              endContent={getSubjectIcon(request.subject)}
            >
              {request.subject}
            </Chip>
          </div>
        );
      case "teacher":
        return request.teacher?.user?.name || "Unassigned";
      case "genderPref":
        switch (request.genderPref) {
          case "F":
            return "Female";
          case "M":
            return "Male";
          default:
            return "No Preference";
        }
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Assign Tutor">
              <span
                className="text-lg text-primary cursor-pointer active:opacity-50"
                onClick={() => handleAssign(request)}
              >
                <MdAssignment />
              </span>
            </Tooltip>
            <Tooltip content="Confirm Request">
              <span
                className="text-lg  cursor-pointer active:opacity-50 text-green-500"
                onClick={() => handleAssign(request)}
              >
                <CheckIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return request[columnKey];
    }
  }, []);

  const columns = [
    { name: "STUDENT", uid: "student" },
    { name: "SUBJECT", uid: "subject" },
    { name: "GENDER PREFERENCE", uid: "genderPref" },
    { name: "ASSIGNED TUTOR", uid: "teacher" },
    { name: "ACTIONS", uid: "actions" },
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/tutors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssign = (student) => {
    setSelectedStudent(student);

    onOpen();
  };

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
        <div className="flex flex-row m-4 justify-center items-center w-full z-50">
          <div className="flex justify-end items-center">
            <Switch
              checked={viewMode === "table"}
              onChange={() =>
                setViewMode(viewMode === "card" ? "table" : "card")
              }
            >
              {viewMode === "card" ? "Card View" : "Table View"}
            </Switch>
          </div>
          <Select
            className="w-[13%] h-10 px-4 basic-multi-select "
            classNamePrefix="select"
            options={subjectsOptions}
            isClearable={true}
            placeholder={
              <div className="flex items-center">
                <IoFilter className="mr-2" />
                <span>Filter</span>
              </div>
            }
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
          />
          <Input
            type="text"
            id="inputSearch"
            placeholder="Search for request"
            className="w-[60%]"
            onKeyUp={(event) => {
              search(event.target.value);
            }}
            startContent={
              <IoSearchOutline className="text-gray-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        <div className="w-full overflow-y-auto max-h-[calc(100vh-120px)]">
          {noResults ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg">No results found</p>
            </div>
          ) : viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 sm:gap-x-10 gap-x-20 gap-y-10 p-4 mx-auto max-w-7xl">
              {listStudent.map((student) => (
                <StudentCard
                  id={student.id}
                  student={student.student}
                  studentEmail={student.studentEmail}
                  subject={student.subject}
                  genderPref={student.genderPref}
                  teacherName={student.teacher?.user?.name}
                  key={student.id}
                  onAssign={handleAssign}
                />
              ))}
            </div>
          ) : (
            <Table aria-label="Past Requests table">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={listStudent}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Assign Tutor
              </ModalHeader>
              <ModalBody>
                <>
                  <div className="mb-4">
                    <p className="pb-2">
                      Manually assign a tutor for this request
                    </p>
                    <Select
                      value={editSubject}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select Tutor"
                      options={tutors.map((tutor) => ({
                        value: tutor.id,
                        label: tutor.name,
                      }))}
                      maxMenuHeight={200} // Limit the height of the dropdown menu
                      menuPlacement="auto" // Automatically adjust menu placement
                      menuPortalTarget={document.body} // Render menu in a portal
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure menu appears on top
                      }}
                    />
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isProcessing}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  //onPress={handleSaveClick}
                  disabled={formLoading || success || isProcessing}
                  className={cn("", {
                    "bg-green-500": success,
                    "hover:bg-green-600": success,
                  })}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : success ? (
                    "Success"
                  ) : (
                    "Save"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PastRequests;
