import React, { useCallback, useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { formatHeader, formatMonthYear } from '@/utils/costwiseUtils';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { CompareFormulaProps } from './CompareFormulaContainer';
import { FiArchive } from 'react-icons/fi';
import { BOM, FormulationRecord } from '@/types/data';
import api from '@/utils/api';
import Spinner from '@/components/loaders/Spinner';
import Loader from '@/components/loaders/Loader';
import { FaRegCalendarDays } from 'react-icons/fa6';

const BOMListContainer = () => {
  const router = useRouter();
  const { setViewBOM, selectedBomId } = useFormulationContext();
  const [data, setData] = useState<BOM | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [monthYear, setMonthYear] = useState<number>(202401);

  const minProductCost = Math.min(...(data?.formulations.filter(info => info.rowType === 'finishedGood').map(info => Number(info.cost)) ?? []));

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const bomResponse = await api.get('/boms/retrieve', {
        params: { col: 'bom_id', value: selectedBomId },
      });

      if (bomResponse.data.status !== 200) {
        throw new Error("Failed to fetch BOM");
      }

      const bomData = bomResponse.data.data[0];
      const formulations = JSON.parse(bomData.formulations);
      const allFormulationIds = formulations;

      const formulationResponse = await api.get('/formulations/retrieve_batch', {
        params: { col: 'formulation_id', values: allFormulationIds },
      });

      if (formulationResponse.data.status !== 200) {
        throw new Error("Failed to fetch formulations");
      }

      const formulationDataArray = formulationResponse.data.data;
      const allMaterialIds: number[] = [];
      const allFinishedGoodIds: number[] = [];

      formulationDataArray.forEach((formulation: { material_qty_list: string; fg_id: number }) => {
        allFinishedGoodIds.push(formulation.fg_id);

        if (formulation.material_qty_list) {
          const materialList = JSON.parse(formulation.material_qty_list);
          materialList.forEach((material: {}) => {
            const materialId = Object.keys(material)[0];
            allMaterialIds.push(parseInt(materialId, 10));
          });
        }
      });

      const finishedGoodResponse = await api.get('/finished_goods/retrieve_batch', {
        params: { col: 'fg_id', values: allFinishedGoodIds },
      });

      if (finishedGoodResponse.data.status !== 200) {
        throw new Error("Failed to fetch finished goods");
      }

      setMonthYear(finishedGoodResponse.data.data[0].monthYear);
      const finishedGoodDataArray = finishedGoodResponse.data.data;

      const materialResponse = await api.get('/materials/retrieve_batch', {
        params: { col: 'material_id', values: allMaterialIds },
      });

      if (materialResponse.data.status !== 200) {
        throw new Error("Failed to fetch materials");
      }

      const materialDataArray = materialResponse.data.data;

      const currentFormulations: FormulationRecord[] = [];

      formulations.forEach((formulationId: number, index: number) => {
        const formulation = formulationDataArray.find(
          (f: { formulation_id: number }) => f.formulation_id === formulationId
        );

        if (formulation) {
          const finishedGood = finishedGoodDataArray.find(
            (fg: { fg_id: number }) => fg.fg_id === formulation.fg_id
          );

          if (finishedGood) {
            let fgRow: FormulationRecord = {
              id: finishedGood.fg_id,
              track_id: formulationId,
              rowType: 'finishedGood',
              formula: formulation.formula_code,
              level: null,
              itemCode: finishedGood.fg_code,
              description: finishedGood.fg_desc,
              formulation: parseFloat(finishedGood.formulation_no).toString(),
              batchQty: parseFloat(finishedGood.total_batch_qty),
              unit: finishedGood.unit,
              isLeastCost: finishedGood.is_least_cost,
              cost: finishedGood.rm_cost,
            };
            currentFormulations.push(fgRow);
          }

          if (formulation.emulsion) {
            const emulsionData = JSON.parse(formulation.emulsion);
            if (Object.keys(emulsionData).length !== 0) {
              currentFormulations.push({
                id: formulationId,
                track_id: formulationId,
                rowType: 'emulsion',
                formula: null,
                level: emulsionData.level,
                itemCode: null,
                description: "EMULSION",
                formulation: null,
                batchQty: emulsionData.batch_qty,
                unit: emulsionData.unit,
              });
            }
          }

          if (formulation.material_qty_list) {
            const materials = JSON.parse(formulation.material_qty_list);
            materials.forEach((material: { [x: string]: any }) => {
              const materialId = Object.keys(material)[0];
              const materialInfo = material[materialId];
              const materialDetails = materialDataArray.find(
                (m: { material_id: string }) => m.material_id == materialId
              );

              if (materialDetails) {
                currentFormulations.push({
                  id: materialDetails.material_id,
                  track_id: formulationId,
                  rowType: 'material',
                  formula: null,
                  level: parseFloat(materialInfo.level).toString(),
                  itemCode: materialDetails.material_code,
                  description: materialDetails.material_desc,
                  formulation: null,
                  batchQty: materialInfo.qty,
                  unit: materialDetails.unit,
                  cost: materialDetails.material_cost,
                  status: materialInfo.status,
                });
              }
            });
          }
        }
      });

      const processedBomData = {
        ...bomData,
        formulations: currentFormulations,
      };

      setData(processedBomData);
    } catch (error) {
      console.error("Error fetching BOM data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBomId]);

  useEffect(() => {
    if (selectedBomId) {
      fetchData();
    }
  }, [fetchData, selectedBomId]);

  return (
    <div className='bg-white dark:bg-[#3C3C3C] rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[20px] w-full'>
      {/* header */}
      <div className='flex items-center py-[10px]'>
        <IoIosArrowRoundBack className='text-primary dark:text-[#ff4d4d] text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] cursor-pointer'
          onClick={() => {
            setViewBOM(false);
          }} />
        <h1 className='font-bold text-[28px] text-primary dark:text-[#ff4d4d]'>
          Bill of Materials
        </h1>
      </div>
      <hr className='border-[#ACACAC]' />
      <div className='flex items-center pt-[15px]'>
        <FiArchive className='text-[28px] mr-[5px]' />
        {isLoading ? (
          <Loader className='w-[200px] h-[30px]' />
        ) : (
          <>
            <p className='text-black text-[25px] font-black underline underline-offset-4 mr-[5px] dark:text-white'>{data?.bom_name} </p>
            <p className='text-[25px] text-[#8F8F8F] font-semibold italic dark:text-[#d1d1d1]'>({data?.formulations[0]?.description})</p>
          </>
        )}
      </div>
      <div className='flex w-full items-center'>
        <FaRegCalendarDays className='text-[#8F8F8F] text-[18px] mr-[5px]' />
        <h1 className='flex text-[#8F8F8F] text-[18px]'>
          For the month of
          {
            !isLoading ?
              <span className='font-semibold italic text-primary dark:text-[#ff4d4d]'>
                ‎ {formatMonthYear(monthYear)}
              </span>
              :
              <span className='ml-[5px] !w-[150px] h-[10px]'>
                <Loader className='w-[50px] !h-[30px]' />
              </span>
          }
        </h1>
      </div>
      <div className='flex w-full items-center pt-[10px]'>
        <p className='w-full text-[#8F8F8F] text-[18px]'>
          The following formulas are being compared:
        </p>
      </div>
      <div className='flex flex-wrap items-center w-full'>
        {isLoading ? (
          <Loader className='w-[200px] h-[30px]' />
        ) : (
          data?.formulations
            .filter(item => item.rowType === 'finishedGood')
            .map((info, index, array) => (
              <p key={index} className='italic font-semibold text-[18px] dark:text-white'>
                {info.description} ({info.formula})
                {index !== array.length - 1 && ',\u00A0'}
              </p>
            ))
        )}
      </div>
      <div className='rounded-[5px] border border-[#656565] dark:border-[#5C5C5C] overflow-x-auto mt-[10px]'>
        <table className='table-auto w-full border-collapse'>
          <thead>
            <tr>
              {data && Object.keys(data.formulations[0])
                .filter(key =>
                  !key.toLowerCase().includes('id') &&
                  !key.toLowerCase().includes('rowtype') &&
                  !key.toLowerCase().includes('track_id') &&
                  !key.toLowerCase().includes('isleastcost') &&
                  key !== 'cost'
                )
                .concat(['materialCost', 'productCost'])
                .map((key) => {
                  let textAlignClass = 'text-left';
                  if (key === 'level' || key === 'formulation') {
                    textAlignClass = 'text-center';
                  } else if (key === 'batchQty' || key === 'materialCost' || key === 'productCost') {
                    textAlignClass = 'text-right';
                  }

                  return (
                    <th key={key} className={`${textAlignClass} animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] dark:text-[#d1d1d1] py-2 px-6`}>
                      {formatHeader(key)}{key == 'batchQty' && '.'}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className='flex justify-center'>
                <td colSpan={9} className="text-center py-4">
                  <Spinner />
                </td>
              </tr>
            ) : (
              data && data.formulations.reduce((acc: FormulationRecord[][], currentFormula, index, array) => {
                if (currentFormula.rowType === 'finishedGood' || index === 0) {
                  const nextFinishedGoodIndex = array.findIndex((item, i) => i > index && item.rowType === 'finishedGood');
                  const groupEndIndex = nextFinishedGoodIndex === -1 ? array.length : nextFinishedGoodIndex;
                  acc.push(array.slice(index, groupEndIndex));
                }
                return acc;
              }, []).map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {group.map((info, index) => {
                    const isOutOfStock = info.rowType === 'material' && info.status === 0;
                    return (
                      <tr key={index} className={`
                          ${info.rowType === 'finishedGood' ? (info.isLeastCost === 1 ? 'bg-[#fff873] text-black dark:text-black' : 'text-black dark:text-white')
                        : (index % 2 === 1 ? 'bg-[#FCF7F7] dark:bg-[#4C4C4C]' : '')} 
                          ${isOutOfStock ? 'bg-[#FFE5E5] dark:bg-[#FF9999] text-primary' : ''}
                          animate-zoomIn text-center ${info.rowType === 'finishedGood' ? 'font-bold' : 'font-medium'} 
                          ${info.rowType === 'finishedGood' ? '' : 'text-[#6B6B6B] dark:text-[#d1d1d1]'} text-[18px] ${info.rowType === 'finishedGood' ? 'border-y border-[#ACACAC]' : ''}`}>
                        <td className={`py-[10px] ${info.rowType === 'finishedGood' ? 'relative text-left px-6' : ''}`}>
                          {info.rowType === 'finishedGood' && (
                            <>
                              {info.isLeastCost === 1 && (
                                <>
                                  <div className="absolute bottom-[-5px] left-[30%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#D9D9D9]"></div>
                                  <div className="absolute font-light text-black top-[50px] left-0 right-0 mx-auto w-max bg-[#D9D9D9] rounded-full px-4 py-2 shadow-lg z-10">
                                    Least-Cost Formula
                                  </div>
                                </>
                              )}
                              {Number(info.cost) === minProductCost && info.isLeastCost === 0 && (
                                <>
                                  <div className="absolute bottom-[-5px] left-[30%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#D9D9D9]"></div>
                                  <div className="absolute font-light text-black top-[50px] left-0 right-0 mx-auto w-max bg-[#D9D9D9] rounded-full px-4 py-2 shadow-lg z-10">
                                    Not Ideal Due to Material Shortage
                                  </div>
                                </>
                              )}
                              {info.formula}
                            </>
                          )}
                        </td>
                        <td className={`${info.rowType !== 'finishedGood' ? 'py-[10px]' : ''}`}>{info.rowType !== 'finishedGood' ? info.level : ''}</td>
                        <td className='text-left px-6'>{info.itemCode}</td>
                        <td className='text-left px-6'>{info.description}</td>
                        <td className='text-center px-6'>{info.formulation}</td>
                        <td className='text-right px-6'>{info.batchQty?.toFixed(2)}</td>
                        <td className='text-left px-6'>{info.unit}</td>
                        <td className='text-right px-6'>{info.rowType !== 'finishedGood' ? info.cost : ''}</td>
                        <td className='text-right px-6'>{info.rowType === 'finishedGood' ? info.cost : ''}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BOMListContainer