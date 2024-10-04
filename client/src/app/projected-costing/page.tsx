"use client";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { Chart as ChartJS } from "chart.js/auto";
import LineChart from "@/components/charts/LineChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useSidebarContext } from "@/contexts/SidebarContext";
import api from "@/utils/api";
import config from "@/server/config";

const ProjectedCostPage = () => {
  const { isOpen } = useSidebarContext();
  const [isActiveStart, setIsActiveStart] = useState(false);
  const [isActiveEnd, setIsActiveEnd] = useState(false);
  const [activeStart, setActiveStart] = useState("(Year)");
  const [activeEnd, setActiveEnd] = useState("(Half)");
  const [yearList, setyearList] = useState([
    { year: 2022 },
    { year: 2023 },
    { year: 2024 },
  ]);
  const [half, setHalf] = useState([{ half: "First" }, { half: "Second" }]);
  const [file, setFile] = useState('')
  const [priceData, setPriceData] = useState([
    {
      id: 1,
      price: 15.0,
      year: 2023,
      month: "January",
    },
    {
      id: 2,
      price: 25.0,
      year: 2023,
      month: "Febuary",
    },
    {
      id: 3,
      price: 20.0,
      year: 2023,
      month: "March",
    },
    {
      id: 4,
      price: 14.0,
      year: 2023,
      month: "April",
    },
    {
      id: 5,
      price: 12.0,
      year: 2023,
      month: "May",
    },
    {
      id: 6,
      price: 11.0,
      year: 2023,
      month: "June",
    },
  ]);
  const [costData, setCostData] = useState([
    { id: 1, product: "Hotdog", cost: 25.0 },
    { id: 2, product: "Bacon", cost: 33.0 },
    { id: 3, product: "Corned Beef", cost: 5.0 },
    { id: 4, product: "Siomai", cost: 15.0 },
    { id: 5, product: "Beef Loaf", cost: 17.0 },
    { id: 6, product: "Ham", cost: 21.0 },
    { id: 7, product: "Sausage", cost: 12.0 },
  ]);

  const [data] = useState({
    labels: priceData.map((date) => date.month),
    datasets: [
      {
        label: "Price",
        data: priceData.map((prices) => prices.price),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  const [pItemCost, setpItemCost] = useState([
    {
      id: 1,
      material: "Lorem ipsum dolores",
      cost: 0.99,
    },
    {
      id: 2,
      material: "Lorem ipsum dolor",
      cost: 5.33,
    },
    {
      id: 3,
      material: "Lorem ipsum ror",
      cost: 11.25,
    },
    {
      id: 4,
      material: "Lorem ipsum heror",
      cost: 8.94,
    },
    {
      id: 5,
      material: "Lorem ipsum rororor",
      cost: 12.15,
    },
    {
      id: 6,
      material: "Lorem ipsum rorororeee",
      cost: 10.11,
    },
    {
      id: 7,
      material: "Lorem ipsum rorororeee",
      cost: 10.11,
    },
    {
      id: 8,
      material: "Lorem ipsum heror",
      cost: 8.94,
    },
    {
      id: 9,
      material: "Lorem ipsum rororor",
      cost: 12.15,
    },
    {
      id: 10,
      material: "Lorem ipsum rorororeee",
      cost: 10.11,
    },
    {
      id: 11,
      material: "Lorem ipsum rorororeee",
      cost: 10.11,
    },
    {
      id: 12,
      material: "Lorem ipsum rorororeee",
      cost: 13.11,
    },
  ]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true, // Set this to true for responsiveness
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const file = await api.get('/training');
        setFile(file.data.data.settings)
        console.log(file.data.data.settings)
      } catch (error: any) {

      }
    }
    const fetchFGs = async () => {
      try{
        const fg = await api.get('/fg/data');

      }catch (error: any) {

      }
    }
    fetchData()
    fetchFGs()
  })

  return (
    <div className="overflow-auto overflow-x-hidden bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20">
      <div>
        <Header icon={MdOutlineAnalytics} title={"Projected Costing"} />
      </div>
      <div className="w-full ml-[60px] pr-[45px] h-full 2xl:h-[90vh] flex flex-col items-start justify-start pt-[15px] py-[15px]">
        <p className="text-[30px] text-tertiary">Equipment Costs</p>
        <div className="flex flex-row h-[10%] w-full items-start justify-start flex-wrap">
          {/* Dropdown List Start*/}
          <div className="min-w-[200px] relative mt-[15px] text-[16px]">
            <div
              className="text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start hover:border-primary hover:text-primary"
              onClick={() => {
                setIsActiveStart(!isActiveStart);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8]">
                Cost Year
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px]" />
                <p className="">{activeStart}</p>
              </span>
              <ul
                className={`list-none px-[1px] absolute border border-gray-300 rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${!isActiveStart
                  ? "opacity-0 pointer-events-none"
                  : "block opacity-100"
                  } ${yearList.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
              >
                {yearList.map((date) => (
                  <li
                    className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] text-black ${activeStart === date.year ? "shadow-lg bg-gray-50" : " "
                      }`}
                    onClick={() => {
                      setActiveStart(date.year);
                    }}
                  >
                    {date.year}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Dropdown List End*/}
          <div className="min-w-[200px] relative ml-[50px] mt-[15px] text-[16px]">
            <div
              className="text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start hover:border-primary hover:text-primary"
              onClick={() => {
                setIsActiveEnd(!isActiveEnd);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8]">
                Year Half
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px]" />
                <p className="">{activeEnd}</p>
              </span>
            </div>
            <ul
              className={`list-none px-[1px] absolute border border-gray-300 rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${!isActiveEnd ? "opacity-0 pointer-events-none" : "opacity-100"
                } ${half.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
            >
              {half.map((half) => (
                <li
                  className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] ${activeEnd === half.half ? "shadow-lg bg-gray-50" : " "
                    }`}
                  onClick={() => {
                    setActiveEnd(half.half);
                  }}
                >
                  {half.half}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={`${isOpen ? "flex flex-col 4xl:flex-row" : "flex flex-col 2xl:flex-row"
            } w-[97%] h-full gap-[2%] rounded-xl mt-[10px] 2xl:mt-0`}
        >
          {/* Left Div */}
          <div
            className={`${isOpen ? "w-full 4xl:w-[65%]" : "w-full 2xl:w-[65%]"
              } flex flex-col h-full rounded-lg shadow-xl`}
          >
            <div className="flex text-[30px] text-[#585858] font-bold h-[10%] bg-white items-center justify-start  border-b-2 pl-10">
              <p className="w-[95%]">GRAPHS</p>
              <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
            </div>
            <div className="flex items-center justify-center h-[45%] w-[100%] bg-white">
              <LineChart
                chartData={data}
                options={lineChartOptions}
                className="w-full h-full max-h-[300px]"
              />
            </div>
            <div className="flex text-[30px]  font-bold h-[10%] bg-white items-center justify-start pl-10">
              <p className="w-[95%] text-[#585858]">Estimated Summary</p>
            </div>
            <div className="flex items-center justify-center h-[40%] bg-white"></div>
          </div>
          {/* Right Div */}
          <div
            className={`${isOpen ? "w-full 4xl:w-[45%]" : "w-full 2xl:w-[45%]"
              } flex flex-col gap-[10px] h-full mt-[10px] 2xl:mt-0`}
          >
            <div
              className={`${isOpen
                ? "flex flex-col 2xl:flex-row 4xl:flex-col"
                : "flex flex-row 2xl:flex-col"
                } gap-[20px] w-full`}
            >
              {/* Predictions Section */}
              <div
                className={`${isOpen ? "h-full " : ""
                  } flex flex-col bg-white p-[10px] m-1 w-full border-l-[15px] border-blue-500 rounded-e-lg shadow-lg`}
              >
                <div className="border-b-1 border-[#D9D9D9] flex flex-row">
                  <p className="text-[24px] font-bold w-[95%]">Prediction</p>
                  <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
                </div>
                <div className="flex flex-row w-full h-full items-center justify-center">
                  <div className="flex flex-col w-full items-center justify-center text-[#005898] font-bold">
                    <p className="text-[32px]">22.9%</p>{" "}
                    <p className="text-[1em]">Growth Rate (Surge)</p>
                  </div>
                  <div className="flex flex-col w-full items-center justify-center text-primary font-bold">
                    <p className="text-[32px]">77.1%</p>{" "}
                    <p className="text-[1em]">Drop Rate (Recline)</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Projected Product Cost Case Section */}
            <div className="flex flex-col bg-white p-[10px] m-1 h-full rounded-lg shadow-lg">
              <div className="flex flex-row p-[5px]">
                <p className="text-[24px] font-bold w-[95%]">
                  Projected Item Cost
                </p>
                <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
              </div>
              <div className="table-container overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="sticky top-0 bg-white z-10 border-y-1 border-[#D9D9D9]">
                    <tr className="border-y-1 border-[#D9D9D9]">
                      <th className="px-10 py-2 text-left">
                        <p>Item</p>
                      </th>
                      <th className="px-10 py-2 text-left">
                        <p>Cost</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto max-h-96 w-full">
                    {pItemCost.map((item) => (
                      <tr
                        key={item.id}
                        className={`text-[#383838] ${item.id % 2 === 0 ? "bg-[#F6EBEB]" : " "
                          } w-full`}
                      >
                        <td className="px-10 py-2">
                          <p>{item.material}</p>
                        </td>
                        <td className="px-10 py-2">
                          <p>{item.cost}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedCostPage;
