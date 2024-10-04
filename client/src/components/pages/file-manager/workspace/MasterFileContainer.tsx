import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FaPencilAlt } from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
import WorkspaceTable from './WorkspaceTable';
import { BOM, File, FodlPair, FodlRecord, FormulationRecord, MaterialRecord } from '@/types/data';
import api from '@/utils/api';

const MasterFileContainer = (data: File) => {
  // Initialize isEdit with keys 'A', 'B'
  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({
    A: false, // FODL COST
    B: false, // MATERIAL COST
    // 'C-<bom_id>' etc. will be added dynamically
  });

  const [isLoading, setIsLoading] = useState(false);

  const [fodlFileData, setFodlFileData] = useState<FodlRecord[]>([]);
  const [materialData, setMaterialData] = useState<MaterialRecord[]>([]);
  const [bomSheets, setBomSheets] = useState<BOM[]>([]);

  useEffect(() => {
    if (localStorage.getItem("edit") === "true") {
      setIsEdit(prev => ({ ...prev, A: true }));
    }

    setIsLoading(true);
    if (data.settings) {
      const settings = JSON.parse(data.settings);
      fetchFodlSheet(settings.fodls);
      fetchMaterialSheet(settings.material_ids);
      fetchBOMSheets(settings.bom_ids);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, [data])

  const toggleEdit = (key: string) => {
    setIsEdit(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
                directLabor: parseFloat(fetchedData.direct_labor)
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
      console.error('Error fetching Material sheet:', error);
      // setError('Failed to fetch Material data. Please try again later.');
    }
  };

  const fetchBOMSheets = async (bom_ids: Number[]) => {
    setIsLoading(true);
    try {
      const fetchPromises = bom_ids.map(async (bom) => {
        try {
          const response = await api.get('/boms/retrieve', {
            params: { col: 'bom_id', value: bom },
          });

          if (response.data.status === 200) {
            const bomData = response.data.data[0];
            const formulations = JSON.parse(bomData.formulations);
            const totalFormulations = formulations.length;

            const formulationPromises = formulations.map(async (formulationId: number, index: number) => {
              try {
                const formulationResponse = await api.get('/formulations/retrieve', {
                  params: { col: 'formulation_id', value: formulationId },
                });

                if (formulationResponse.data.status == 200) {
                  const formulaData = formulationResponse.data.data[0];
                  const currentFormulationRecords: FormulationRecord[] = [];

                  const finishedGoodResponse = await api.get('/finished_goods/retrieve', {
                    params: { col: 'fg_id', value: formulaData.fg_id },
                  });

                  if (finishedGoodResponse.data.status == 200) {
                    const fgData = finishedGoodResponse.data.data[0];

                    let fgRow: FormulationRecord = {
                      formula: formulaData.formula_code,
                      level: null,
                      itemCode: fgData.fg_code,
                      description: fgData.fg_desc,
                      formulation: parseFloat(fgData.formulation_no).toString(),
                      batchQty: parseFloat(fgData.total_batch_qty),
                      unit: fgData.unit
                    };
                    currentFormulationRecords.push(fgRow);

                    const emulsionData = JSON.parse(formulaData.emulsion);

                    if (Object.keys(emulsionData).length != 0) {
                      let emulsionRow: FormulationRecord = {
                        formula: null,
                        level: emulsionData.level,
                        itemCode: null,
                        description: "EMULSION",
                        formulation: null,
                        batchQty: emulsionData.batch_qty,
                        unit: emulsionData.unit
                      };

                      currentFormulationRecords.push(emulsionRow);
                    }

                    if (formulaData.material_qty_list && Object.keys(formulaData.material_qty_list).length !== 0) {
                      const materialData = JSON.parse(formulaData.material_qty_list);
                      const materialPromises = materialData.map(async (material: { [x: string]: any; }) => {
                        const materialId = Object.keys(material)[0];
                        const materialInfo = material[materialId];
                        const materialResponse = await api.get('/materials/retrieve', {
                          params: { col: 'material_id', value: materialId },
                        });

                        if (materialResponse.data.status == 200) {
                          const materialDetails = materialResponse.data.data[0];

                          let materialRow: FormulationRecord = {
                            formula: null,
                            level: parseFloat(materialInfo.level).toString(),
                            itemCode: materialDetails.material_code,
                            description: materialDetails.material_desc,
                            formulation: null,
                            batchQty: materialInfo.qty,
                            unit: materialDetails.unit
                          };

                          return materialRow;
                        }
                        return null;
                      });

                      const materialResults = await Promise.all(materialPromises);
                      materialResults.forEach(materialRow => {
                        if (materialRow) currentFormulationRecords.push(materialRow);
                      });
                    }

                    let emptyFodlRecord: FormulationRecord = {
                      formula: null,
                      level: null,
                      itemCode: null,
                      description: "",
                      formulation: null,
                      batchQty: null,
                      unit: ""
                    };

                    if (index !== totalFormulations - 1) {
                      currentFormulationRecords.push(emptyFodlRecord);
                    }

                    return currentFormulationRecords;
                  }
                }
              } catch (error) {
                console.error('Error fetching formulation:', error);
                return [];
              }
            });
            const formulationsResults = await Promise.all(formulationPromises);
            const formulationsRecords = formulationsResults.flat();

            const bomNew: BOM = {
              bom_id: Number(bom),
              bomName: bomData.bom_name,
              formulations: formulationsRecords,
            };
            return bomNew;
          }
        } catch (error) {
          console.error('Error fetching BOM:', error);
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      console.log("BOM Results", results);
      const filteredResults: BOM[] = results.filter(
        (bom): bom is BOM => bom !== null && bom !== undefined
      );
      setBomSheets(filteredResults);

      const newEditFlags: { [key: string]: boolean } = {};
      filteredResults.forEach(bom => {
        const editKey = `C-${bom.bom_id}`;
        newEditFlags[editKey] = false;
      });
      setIsEdit(prev => ({ ...prev, ...newEditFlags }));
    } catch (error) {
      console.error('Error fetching BOM sheets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full bg-white rounded-[10px] drop-shadow mb-[35px]'>
      <FileLabel {...data} />
      {!isLoading ?
        <div className='overflow-auto'>
          {/* FODL Costing */}
          <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
            <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>FODL COST</h1>
            {isEdit['A'] ?
              <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
              :
              <FaPencilAlt
                className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
                onClick={() => toggleEdit('A')}
              />
            }
          </div>
          <div className={`${isEdit['A'] ? 'pb-[30px] pt-[15px]' : 'py-[30px]'} px-[40px]`}>
            <WorkspaceTable
              data={fodlFileData}
              isEdit={isEdit['A']}
              setIsEdit={() => toggleEdit('A')}
              isTransaction={false}
            />
          </div>

          {/* Material Cost */}
          <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
            <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>MATERIAL COST</h1>
            {isEdit['B'] ?
              <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
              :
              <FaPencilAlt
                className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
                onClick={() => toggleEdit('B')}
              />
            }
          </div>
          <div className={`${isEdit['B'] ? 'pb-[30px] pt-[15px]' : 'py-[30px]'} px-[40px]`}>
            <WorkspaceTable
              data={materialData}
              isEdit={isEdit['B']}
              setIsEdit={() => toggleEdit('B')}
              isTransaction={false}
            />
          </div>

          {/* Dynamic BOM Sheets */}
          {bomSheets.map((bom) => {
            const editKey = `C-${bom.bom_id}`; // Unique key for each BOM section
            return (
              <div key={bom.bom_id} className='mb-8'>
                {/* BOM Header */}
                <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
                  <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px] uppercase'>{bom.bomName}</h1>
                  {isEdit[editKey] ?
                    <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
                    :
                    <FaPencilAlt
                      className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
                      onClick={() => toggleEdit(editKey)}
                    />
                  }
                </div>
                {/* BOM Formulations Table */}
                <div className={`${isEdit[editKey] ? 'pb-[30px] pt-[15px]' : 'py-[30px]'} px-[40px]`}>
                  <WorkspaceTable
                    data={bom.formulations}
                    isEdit={isEdit[editKey]}
                    setIsEdit={() => toggleEdit(editKey)}
                    isTransaction={false}
                  />
                </div>
              </div>
            )
          })}
        </div>
        :
        <>
          LOADING...
        </>
      }
    </div>
  )
}

export default MasterFileContainer;
