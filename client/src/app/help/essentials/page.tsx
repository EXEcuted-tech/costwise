"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/header/Header";
import Link from "next/link";
import { FaPencilAlt, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { PiBookOpenText } from "react-icons/pi";
import getArticle from "@/utils/article/getArticle";
import updateArticle from "@/utils/article/updateArticle";
import { useSidebarContext } from "@/contexts/SidebarContext";
import Alert from "@/components/alerts/Alert";

const EssentialsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<any>([
    { heading: "Insert Heading", content: "Insert Content" },
  ]);
  const [originalSections, setOriginalSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useSidebarContext();
  const [alertMessages, setAlertMessages] = useState<any>({});
  const [alertStatus, setAlertStatus] = useState<any>("");

  const sectionRefs = useRef<any>([]);

  const handleEditClick = () => {
    if (!isEditing) {
      setOriginalSections(sections);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>, index: any) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [name]: value };
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { heading: "New Heading", content: "New content" }]);
  };

  const removeSection = (index: any) => {
    const updatedSections = sections.filter((_: any, i: any) => i !== index);
    setSections(updatedSections);
  };

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const content = await getArticle("Essentials");
      const parsedSections = JSON.parse(content);
      setSections(parsedSections);
      setOriginalSections(parsedSections);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const cancelEdit = () => {
    setSections(originalSections);
    setAlertMessages({});
    setIsEditing(false);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  );

  const saveEdit = async () => {
    const content = JSON.stringify(sections);
    const hasEmptySection = sections.some(
      (section: { heading: string; content: string; }) => !section.heading.trim() || !section.content.trim()
    );

    // Check if there are actual changes
    const changesMade = JSON.stringify(sections) !== JSON.stringify(originalSections);

    if (hasEmptySection) {
      const updatedAlertMessages: any = {};
      let firstEmptyIndex = -1;

      sections.forEach((section: { heading: string; content: string; }, index: number) => {
        if (!section.heading.trim() || !section.content.trim()) {
          updatedAlertMessages[index] = "Section head and content are required.";
          if (firstEmptyIndex === -1) {
            firstEmptyIndex = index;
          }
        }
      });

      setAlertMessages(updatedAlertMessages);
      setAlertStatus("critical");

      // Scroll to the first empty section
      if (firstEmptyIndex !== -1 && sectionRefs.current[firstEmptyIndex]) {
        sectionRefs.current[firstEmptyIndex].scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    } else {
      setAlertMessages({});
    }

    if (!changesMade) {
      setAlertMessages({ general: "No changes detected." });
      setAlertStatus("info");
      return;
    }

    try {
      await updateArticle("Essentials", content);
      setAlertMessages({ general: "Changes saved successfully!" });
      setAlertStatus("success");
      fetchArticle();
    } catch (error) {
      console.error("Error updating article:", error);
      setAlertMessages({ general: "Failed to save changes. Please try again." });
      setAlertStatus("critical");
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-cover dark:bg-[#121212] bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20 h-[100vh] overflow-hidden transition-all duration-400 ease-in-out">
      <Header icon={PiBookOpenText} title="User's Manual" />
      <div className="flex h-[90%] w-[98%] pl-[90px] pt-[15px] -z-50">
        <div className="flex flex-col bg-white dark:bg-[#3C3C3C] w-full rounded-xl p-10 drop-shadow-lg">
          <div className="flex flex-row w-full items-center justify-start border-b border-[#ACACAC] gap-[15px]">
            <Link href="/help">
              <GoArrowLeft className="dark:text-white text-primary text-[1.5em] xl:text-[2em] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
            </Link>
            <p className="dark:text-white flex items-center justify-start text-primary text-[40px] font-bold">
              Essential features
            </p>
            {isAdmin && (
              <div className="flex justify-center items-center h-[50%] cursor-pointer transition-colors duration-200 ease-in-out">
                {!isEditing ? (
                  <FaPencilAlt
                    onClick={handleEditClick}
                    className="dark:text-white hover:animate-shake-tilt w-[30px] h-auto text-primary"
                  />
                ) : (
                  <div className="animate-pop-out flex items-center gap-2">
                    <FaCheck
                      onClick={saveEdit}
                      className="hover:brightness-50 w-[30px] h-auto text-green-500 cursor-pointer"
                    />
                    <FaTimes
                      onClick={cancelEdit}
                      className="hover:brightness-50 w-[30px] h-auto text-red-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div id="scroll-style" className="px-28 overflow-y-scroll">
              {sections.map((section: any, index: any) => (
                <div
                  key={index}
                  ref={(el: any) => (sectionRefs.current[index] = el)}
                  className="flex flex-col pt-[50px] text-[30px] text-tertiary dark:text-white"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="heading"
                          value={section.heading}
                          onChange={(e) => handleChange(e, index)}
                          className={`animate-pop-out dark:bg-[#3C3C3C] dark:border-[#C5C5C5] rounded-lg border p-2 mb-2 w-full ${!section.heading.trim() ? "border-red-500 dark:border-red-500" : ""
                            }`}
                          placeholder="Section Heading"
                        />
                        {alertMessages[index] && (
                          <div className="absolute text-red-500 text-sm -top-5 left-0">
                            {alertMessages[index]}
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeSection(index)}>
                        <FaTrash className="hover:text-[#d13232] text-primary cursor-pointer dark:text-white dark:hover:brightness-50 transition-colors duration-200 ease-in-out" />
                      </button>
                    </div>
                  ) : (
                    <h1 className="font-bold text-[40px]">{section.heading}</h1>
                  )}
                  <div className="flex flex-col text-[24px] pt-[10px] text-tertiary border-black">
                    {isEditing ? (
                      <>
                        <textarea
                          name="content"
                          value={section.content}
                          onChange={(e) => handleChange(e, index)}
                          className={`animate-pop-out dark:bg-[#3C3C3C] dark:border-[#C5C5C5] rounded-lg border p-2 w-full h-[150px] dark:text-white ${!section.content.trim() ? "border-red-500 dark:border-red-500" : ""
                            }`}
                          placeholder="Section Content"
                        />
                      </>
                    ) : (
                      <p className="dark:text-white">{section.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <div className="flex items-center justify-center pt-[20px]">
                  <button
                    onClick={addSection}
                    className="flex items-center text-primary dark:text-white hover:animate-shrink-in text-[20px] font-bold gap-2"
                  >
                    <FaPlus />
                    Add Section
                  </button>
                </div>
              )}
              {alertStatus != "" && alertMessages.general && (
                <Alert variant={alertStatus} message={alertMessages.general} setClose={() => setAlertStatus("")} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EssentialsPage;
