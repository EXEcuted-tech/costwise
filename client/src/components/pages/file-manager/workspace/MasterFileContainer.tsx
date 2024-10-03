import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FaPencilAlt } from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
import WorkspaceTable from './WorkspaceTable';
import { File, FodlPair, FodlRecord, MaterialRecord } from '@/types/data';
import api from '@/utils/api';

const MasterFileContainer = (data: File) => {
  const [isEditA, setIsEditA] = useState(false);
  const [isEditB, setIsEditB] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fodlFileData, setFodlFileData] = useState<FodlRecord[]>([]);
  const [materialData, setMaterialData] = useState<MaterialRecord[]>([]);

  useEffect(() => {
    if (localStorage.getItem("edit") === "true") {
      setIsEditA(true);
    }

    // add ug loading here
    if (data.settings) {
      const settings = JSON.parse(data.settings);
      fetchFodlSheet(settings.fodls);
      fetchMaterialSheet(settings.material_ids);
    }
  }, [data])

  const fetchFodlSheet = async (fodls: FodlPair[]) => {
    setIsLoading(true);

    try {
      const fetchPromises = fodls.map(async (fodl) => {
        try {
          const response = await api.get('/fodls/retrieve', {
            params: { col: 'fodl_id', value: fodl.fodl_id },
          });
          if (response.data.status === 200) {
            const fetchedData = response.data.data[0];
            const fgResponse = await api.get('/finished_goods/retrieve_first', {
              params: { col: 'fg_code', value: fodl.fg_code },
            });

            if (fgResponse.data.status === 200) {
              return {
                itemCode: fodl.fg_code,
                itemDescription: fgResponse.data.data.fg_desc,
                unit: fgResponse.data.data.unit,
                factoryOverhead: parseFloat(fetchedData.factory_overhead),
                directLabor: parseFloat(fetchedData.direct_labor),
              } as FodlRecord;
            }
          } else {
            console.error(`Unexpected status for fodl_id ${fodl.fodl_id}:`, response.data.status);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching data for fodl_id ${fodl.fodl_id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const validResults = results.filter((item): item is FodlRecord => item !== null);

      setFodlFileData(validResults);
    } catch (error) {
      console.error('Error fetching FODL sheet:', error);
      // setError('Failed to fetch FODL data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterialSheet = async (material_ids: Number[]) => {
    setIsLoading(true);
    console.log(material_ids);

    try {
      const fetchPromises = material_ids.map(async (material) => {
        try {
          const response = await api.get('/materials/retrieve', {
            params: { col: 'material_id', value: material },
          });
          if (response.data.status === 200) {
            const data = response.data.data[0];

            return {
              itemCode: data.material_code,
              itemDescription: data.material_desc,
              unit: data.unit,
              materialCost: parseFloat(data.material_cost)
            } as MaterialRecord;

          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const validResults = results.filter((item): item is MaterialRecord => item !== null);

      setMaterialData(validResults);
    } catch (error) {
      console.error('Error fetching FODL sheet:', error);
      // setError('Failed to fetch FODL data. Please try again later.');
    }
  };

  return (
    <div className='w-full bg-white rounded-[10px] drop-shadow mb-[35px]'>
      <FileLabel {...data} />
      <div className='overflow-auto'>

        {/* FODL Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>FODL COST</h1>
          {isEditA ?
            <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
            :
            <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
              onClick={() => { setIsEditA(true) }} />
          }
        </div>
        <div className={`${isEditA ? 'pb-[30px] pt-[15px]' : 'py-[30px]'} px-[40px]`}>
          <WorkspaceTable data={fodlFileData} isEdit={isEditA} setIsEdit={setIsEditA} isTransaction={false} />
        </div>

        {/* Material Cost */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>MATERIAL COST</h1>
          {isEditB ?
            <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
            :
            <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
              onClick={() => { setIsEditB(true) }} />
          }
        </div>
        <div className={`${isEditA ? 'pb-[30px] pt-[15px]' : 'py-[30px]'} px-[40px]`}>
          <WorkspaceTable data={materialData} isEdit={isEditB} setIsEdit={setIsEditB} isTransaction={false} />
        </div>
      </div>
    </div>
  )
}

export default MasterFileContainer;

const dummyData = [
  {
    itemCode: 'FG-01',
    itemDescription: 'HOTDOG 1k',
    rmCost: 56.93,
    factoryOverhead: 11.00,
    directLabor: 4.00,
    total: 71.93,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    rmCost: 8.64,
    factoryOverhead: 11.00,
    directLabor: 4.00,
    total: 71.93,
  },
];

const fodlData = [
  {
    itemCode: 'FG-01',
    itemDescription: 'HOTDOG 1k',
    factoryOverhead: 11.00,
    directLabor: 4.00,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    factoryOverhead: 11.00,
    directLabor: 4.00,
  },
];