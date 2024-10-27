"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Link from "next/link";
import { FaPencilAlt, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { PiBookOpenText } from "react-icons/pi";
import getArticle from "@/utils/article/getArticle";
import updateArticle from "@/utils/article/updateArticle";
import { useSidebarContext } from "@/contexts/SidebarContext";
import Alert from "@/components/alerts/Alert";

const ManageAccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState([
    {
      heading: "Insert Heading",
      content: "Insert Content",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useSidebarContext();
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>("");
  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle Input change
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedSections: any = [...sections];
    updatedSections[index] = {
      ...(updatedSections[index] as { [key: string]: string }),
      [name]: value,
    };
    setSections(updatedSections);
  };

  // Add new heading section
  const addSection = () => {
    setSections((prevSections: any) => [
      ...prevSections,
      { heading: "New Heading", content: "New content" },
    ]);
  };

  // Remove heading section
  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  // Saving Changes to Database
  const saveEdit = async () => {
    const content = JSON.stringify(sections);

    const hasEmptySection = sections.some(
      (section) => !section.heading.trim() || !section.content.trim()
    );

    if (hasEmptySection) {
      setAlertMessages([
        ...alertMessages,
        "All sections must have both a heading and content..",
      ]);
      setAlertStatus("critical");
      return;
    }

    try {
      await updateArticle("Manage Account", content);
      fetchArticle();
    } catch (error) {
      console.error("Error updating article:", error);
      setAlertMessages("Failed to save changes. Please try again.");
    }
    setIsEditing(false);
  };

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const content = await getArticle("Manage Account");
      const parsedSections = JSON.parse(content);
      setSections(parsedSections);
    } catch (error) {
      console.error("Error fetching article:", error);
      setAlertMessages("Failed to load article. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get Article Data
  useEffect(() => {
    fetchArticle();
  }, []);

  // Loading animation
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-cover dark:bg-[#121212] bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20 h-[100vh] overflow-hidden">
      <Header icon={PiBookOpenText} title="User's Manual" />
      <div className="flex h-[90%] w-[98%] pl-[90px] pt-[15px] -z-50">
        <div className="flex flex-col bg-white dark:bg-[#3C3C3C] w-full rounded-xl p-10 drop-shadow-lg">
          {/* Error Alert */}
          <div className="fixed top-4 right-4 z-50">
            <div className="flex flex-col items-end space-y-2">
              {alertMessages &&
                alertMessages.map((msg, index) => (
                  <Alert
                    className="!relative"
                    variant={
                      alertStatus as
                        | "default"
                        | "information"
                        | "warning"
                        | "critical"
                        | "success"
                        | undefined
                    }
                    key={index}
                    message={msg}
                    setClose={() => {
                      setAlertMessages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-start border-b border-[#ACACAC] gap-[15px]">
            <Link href="/help">
              <GoArrowLeft className="dark:text-white text-primary text-[1.5em] xl:text-[2em] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
            </Link>
            <p className="dark:text-white flex items-center justify-start text-primary text-[40px] font-bold">
              Manage your account
            </p>
            {isAdmin && (
              <div className="flex justify-center items-center h-[50%] cursor-pointer transition-colors duration-200 ease-in-out">
                {!isEditing ? (
                  <FaPencilAlt
                    onClick={handleEditClick}
                    className="dark:text-white w-[30px] h-auto text-primary hover:animate-shake-tilt"
                  />
                ) : (
                  <div className="animate-pop-out flex items-center gap-2">
                    <FaCheck
                      onClick={saveEdit}
                      className="hover:brightness-50 w-[30px] h-auto text-green-500 cursor-pointer"
                    />
                    <FaTimes
                      onClick={handleEditClick}
                      className="hover:brightness-50 w-[30px] h-auto text-red-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoading ? (
            <LoadingSpinner /> // Show loading spinner
          ) : (
            <div id="scroll-style" className="px-28 overflow-y-scroll">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex flex-col pt-[50px] text-[30px] text-tertiary dark:text-white"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        name="heading"
                        value={section.heading}
                        onChange={(e) => handleChange(e, index)}
                        className="animate-pop-out dark:bg-[#3C3C3C] dark:border-[#C5C5C5] rounded-lg border p-2 mb-2 w-full font-bold"
                        placeholder="Section Heading"
                      />
                      <button onClick={() => removeSection(index)}>
                        <FaTrash className="hover:text-[#d13232] text-primary cursor-pointer dark:text-white dark:hover:brightness-50" />
                      </button>
                    </div>
                  ) : (
                    <h1 className="font-bold text-[40px]">{section.heading}</h1>
                  )}
                  <div className="flex flex-col text-[24px] pt-[10px] text-tertiary dark:text-white">
                    {isEditing ? (
                      <textarea
                        name="content"
                        value={section.content}
                        onChange={(e) => handleChange(e, index)}
                        className="animate-pop-out dark:bg-[#3C3C3C] dark:border-[#C5C5C5] rounded-lg border p-2 w-full h-[150px]"
                        placeholder="Section Content"
                      />
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <div className="flex items-center justify-center pt-[20px]">
                  <button
                    onClick={addSection}
                    className="flex items-center text-primary dark:text-white hover:opacity-75 transition-all"
                  >
                    <FaPlus className="mr-2 dark:text-white" /> Add New Section
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAccountPage;
