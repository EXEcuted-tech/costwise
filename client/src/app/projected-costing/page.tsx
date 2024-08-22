import Header from "@/components/header/Header"
import { MdOutlineAnalytics } from "react-icons/md";


const ProjectedCostPage = () => {
    return (
        <div className='overflow-hidden bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20' style={{ backgroundImage: "url('/images/usermanbg.png')" }}>
            <div>
                <Header icon={MdOutlineAnalytics} title={"Projected Costing"} />
            </div>
            <div className='w-full ml-[45px] pr-[45px] h-[90vh] flex flex-col items-start justify-start pt-[15px] py-[15px]
            '>
                <p className="text-[30px] text-tertiary">Equipment Costs</p>
                <div className="flex flex-row h-[10%] bg-red-600 w-[80%] items-start justify-center">
                    li
                </div>
            </div>
        </ div>
    )
}

export default ProjectedCostPage