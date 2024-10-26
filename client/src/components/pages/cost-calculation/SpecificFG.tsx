"use client";
import React, { useState, useEffect } from "react";
import { CgRemoveR } from "react-icons/cg";
import CustomGoodsSelect from "@/components/form-controls/CustomGoodsSelect";
import * as XLSX from "xlsx";
import { SpecificFinishedGood, Component } from "@/types/data";
import api from "@/utils/api";
import Alert from "@/components/alerts/Alert";
import { Spinner } from "@nextui-org/react";

type SpecificFGProps = {
  id: number;
  removeSheet: (id: number) => void;
  isOpen: boolean;
  monthYear: { value: number; label: string };
  updateSheetData: (id: number, data: SpecificFinishedGood) => void;
  FGOptions: { name: string; id: number }[];
  selectedGoods: { name: string; id: number }[];
  setSelectedGoods: (goods: { name: string; id: number }[]) => void;
};

const SpecificFG: React.FC<SpecificFGProps> = ({
  id,
  removeSheet,
  isOpen,
  monthYear,
  updateSheetData,
  FGOptions,
  selectedGoods,
  setSelectedGoods
}) => {
  const columnNames = [
    "Formula",
    "Level",
    "Item Code",
    "Description",
    "Batch Qty",
    "Unit",
    "Cost",
    "Total Cost",
  ];
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedFG, setSelectedFG] = useState<{ name: string; id: number }>({
    name: "",
    id: 0,
  });
  const [selectedFGDetails, setSelectedFGDetails] = useState<
    any[]
  >([]);

  //Retrieve FG info
  const handleChange = async (selectedValue: { name: string; id: number }) => {
    try {
      if (selectedValue.id) {
        setSelectedFG(selectedValue);
        const combinedArray = [...selectedGoods];
        combinedArray.push(selectedValue)
        const distinctArray = Array.from(new Set(combinedArray));
        setSelectedGoods(distinctArray);
        const response = await api.get(
          "/cost_calculation/retrieve_fg_details",
          { params: { fg_id: selectedValue.id } }
        );

        if (response.status === 200) {
          const fgData = response.data.data;
          console.log(fgData);
          setSelectedFGDetails([fgData]);
          setIsLoading(false);
          updateSheetData(id, fgData);
        } else {
          setAlertMessages([...alertMessages, "Error retrieving FG info."]);
          setAlertStatus("critical");
        }
      }
    } catch (error) {
      console.error("Error retrieving FG info:", error);
      setAlertMessages([...alertMessages, "Error retrieving FG info."]);
      setAlertStatus("critical");
    }
  };

  return (
    <>
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
                  setAlertMessages((prev) => prev.filter((_, i) => i !== index));
                }}
              />
            ))}
        </div>
      </div>
      <div
        className={`${isOpen ? "" : ""
          } relative w-auto h-[40rem] ml-[5rem] mr-[35px] mb-10 bg-white dark:bg-[#3C3C3C] rounded-2xl border-1 border-[#656565] shadow-md animate-pull-down`}
      >
        {/* Header */}
        <div className="flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-7 drop-shadow-xl">
          <CustomGoodsSelect
            options={FGOptions.map((fg) => ({ value: fg.id, label: fg.name }))}
            placeholder="Choose Finished Good"
            isOpen={isOpen}
            onChange={handleChange}
            disabledOptions={selectedGoods}
          />

          {/* Delete Button */}
          <button
            onClick={() => removeSheet(id)}
            className="text-[30px] ml-auto mr-4 cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out"
          >
            <CgRemoveR />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="h-[582px] rounded-b-2xl overflow-x-auto overflow-y-scroll">
          <table className="table-auto text-[17px] w-full border-collapse">
            <thead>
              <tr>
                {columnNames.map((columnName, index) => (
                  <th
                    key={index}
                    className={`text-center animate-zoomIn whitespace-nowrap font-bold text-[#6B6B6B] dark:text-[#d1d1d1] py-2 px-6 border-b border-[#ACACAC]`}
                  >
                    {columnName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columnNames.length}
                    className="text-center py-[14rem] dark:text-white"
                  >
                    {/* <Spinner color="danger" size="lg" label="Loading..." /> */}
                    No finished good selected. <br /> Select a finished good to
                    create the cost calculation breakdown sheet.
                  </td>
                </tr>
              ) : selectedFGDetails ? (
                <>
                  <tr className={`text-[#6B6B6B] bg-[#ffebeb] font-semibold`}>
                    <td className="text-center px-6 py-2">
                      {selectedFGDetails[0].formula_code}
                    </td>
                    <td className="text-center"></td>
                    <td>{selectedFGDetails[0].code}</td>
                    <td>{selectedFGDetails[0].desc}</td>
                    <td className="text-right pr-12">
                      {selectedFGDetails[0].batch_qty}
                    </td>
                    <td>{selectedFGDetails[0].unit}</td>
                    <td className="text-right pr-4">
                      {selectedFGDetails[0].rm_cost}
                    </td>
                    <td className="text-right pr-7">
                      {parseFloat(selectedFGDetails[0].total_cost).toFixed(2)}
                    </td>
                  </tr>

                  {/* Emulsion row */}
                  {selectedFGDetails[0]?.components[0] &&
                    Object.keys(selectedFGDetails[0].components[0]).length >
                    0 && (
                      <tr className={`text-[#6B6B6B] dark:text-[#d1d1d1]`}>
                        <td className="text-center px-6 py-3"></td>
                        <td className="text-center">
                          {selectedFGDetails[0].components[0].level}
                        </td>
                        <td></td>
                        <td>EMULSION</td>
                        <td className="text-right pr-12">
                          {selectedFGDetails[0].components[0].qty}
                        </td>
                        <td>{selectedFGDetails[0].components[0].unit}</td>
                        <td className="text-right pr-4"></td>
                        <td className="text-right pr-7"></td>
                      </tr>
                    )}

                  {selectedFGDetails[0]?.components
                    ?.slice(1)
                    .map((component: { level: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; item_code: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; batch_quantity: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; unit: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; cost: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; total_cost: string; }, index: React.Key | null | undefined) => (
                      <tr key={index} className={`text-[#6B6B6B] dark:text-[#d1d1d1]`}>
                        <td className="text-center px-6 py-3"></td>
                        <td className="text-center">{component.level}</td>
                        <td>{component.item_code}</td>
                        <td>{component.description}</td>
                        <td className="text-right pr-12">
                          {component.batch_quantity}
                        </td>
                        <td>{component.unit}</td>
                        <td className="text-right pr-4">{component.cost}</td>
                        <td className="text-right pr-7">
                          {parseFloat(component.total_cost).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <tr>
                  <td colSpan={columnNames.length} className="text-center py-6">
                    No finished good selected. Select a finished good to create
                    the cost calculation breakdown sheet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SpecificFG;
