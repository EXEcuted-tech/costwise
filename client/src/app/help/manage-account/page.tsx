"use client";
import React, { useState } from "react";
import Header from "@/components/header/Header";
import Link from "next/link";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { PiBookOpenText } from "react-icons/pi";

const ManageAccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  // =============> DB schema for article <====================
  // Select * from article where category = "manage_account"
  // article_id, category, heading, content, updated
  //
  const [sections, setSections] = useState([
    {
      heading: "Heading 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.",
    },
    {
      heading: "Heading 2",
      content:
        "Quisque vestibulum vel arcu nec faucibus. Nam placerat porttitor eros vitae dictum. Cras velit dolor, hendrerit volutpat metus non, egestas elementum enim. Maecenas id tincidunt risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque mattis lorem eget augue finibus, eu tincidunt mi convallis. Nulla facilisi.",
    },
  ]);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle Input change
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [name]: value,
    };
    setSections(updatedSections);
  };

  // Add new heading section
  const addSection = () => {
    setSections([
      ...sections,
      { heading: `New Heading`, content: "New content" },
    ]);
  };

  // Remove heading section
  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  return (
    <div className="bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20 h-[100vh] overflow-hidden">
      <div>
        <Header icon={PiBookOpenText} title="User's Manual"></Header>
      </div>
      <div className="flex h-[90%] w-[98%] pl-[90px] pt-[15px] -z-50">
        <div className="flex flex-col bg-white w-full rounded-xl p-10 drop-shadow-lg">
          <div className="flex flex-row w-full items-center justify-start border-b border-[#ACACAC] gap-[15px]">
            <Link href="/help">
              <GoArrowLeft className="text-primary text-[1em] xl:text-[2em] hover:opacity-75 hover:animate-shrink-in transition ease-in-out duration-200" />
            </Link>
            <p className="flex items-center justify-start text-primary text-[40px] font-bold">
              Manage your account
            </p>
            <div
              onClick={handleEditClick}
              className="flex justify-center items-center h-[50%] cursor-pointer transition-colors duration-200 ease-in-out"
            >
              <FaPencilAlt className="w-[30px] h-auto text-primary" />
            </div>
          </div>
          <div id="scroll-style" className="overflow-y-scroll">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex flex-col pt-[50px] text-[30px] text-tertiary"
              >
                {isEditing ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      name="heading"
                      value={section.heading}
                      onChange={(e) => handleChange(e, index)}
                      className="border p-2 mb-2 w-full"
                    />
                    <button onClick={() => removeSection(index)}>
                      <FaTrash className="text-primary cursor-pointer" />
                    </button>
                  </div>
                ) : (
                  <h1>{section.heading}</h1>
                )}
                <div className="flex flex-col text-[24px] pt-[10px] text-tertiary">
                  {isEditing ? (
                    <textarea
                      name="content"
                      value={section.content}
                      onChange={(e) => handleChange(e, index)}
                      className="border p-2 w-full"
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
                  className="flex items-center text-primary hover:opacity-75 transition-all"
                >
                  <FaPlus className="mr-2" /> Add New Section
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccountPage;
