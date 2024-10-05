import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FaPencilAlt } from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
import WorkspaceTable from './WorkspaceTable';
import { BOM, File, FodlPair, FodlRecord, FormulationRecord, MaterialRecord } from '@/types/data';
import api from '@/utils/api';
import { formatMonthYear } from '@/utils/costwiseUtils';

const MasterFileContainer = (data: File) => {

  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({
    A: false, // FODL COST
    B: false, // MATERIAL COST
  });

  const [isLoading, setIsLoading] = useState(true);

  const [fodlFileData, setFodlFileData] = useState<FodlRecord[]>([]);
  const [materialData, setMaterialData] = useState<MaterialRecord[]>([]);
  const [bomSheets, setBomSheets] = useState<BOM[]>([]);
  const [removedFodlIds, setRemovedFodlIds] = useState<number[]>([]);

  useEffect(() => {
    if (localStorage.getItem("edit") === "true") {
      setIsEdit(prev => ({ ...prev, A: true }));
    }
    setIsLoading(true);

    if (data.settings) {
      const settings = JSON.parse(data.settings);

      const fetchAllData = async () => {
        try {
          await Promise.all([
            fetchFodlSheet(settings.fodls),
            fetchMaterialSheet(settings.material_ids),
            fetchBOMSheets(settings.bom_ids),
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [data]);

  const toggleEdit = (key: string) => {
    setIsEdit(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchFodlSheet = async (fodls: FodlPair[]): Promise<void> => {
    try {
      const allFodlIds: number[] = fodls.map((fodl) => fodl.fodl_id);
      const fodlResponse = await api.get('/fodls/retrieve_batch', {
        params: { col: 'fodl_id', values: allFodlIds },
      });

      if (fodlResponse.data.status !== 200) {
        throw new Error("Failed to fetch FODL records");
      }

      const fodlDataArray = fodlResponse.data.data;

      const allFgCodes: string[] = Array.from(new Set(fodls.map((fodl) => fodl.fg_code)));
      const finishedGoodResponse = await api.get('/finished_goods/retrieve_batch', {
        params: { col: 'fg_code', values: allFgCodes },
      });

      if (finishedGoodResponse.data.status !== 200) {
        throw new Error("Failed to fetch finished goods records");
      }

      const finishedGoodDataArray = finishedGoodResponse.data.data;

      const fodlRecords: FodlRecord[] = fodls.map((fodl) => {
        const fodlData = fodlDataArray.find((f: { fodl_id: number; }) => f.fodl_id === fodl.fodl_id);
        const fgData = finishedGoodDataArray.find((fg: { fg_code: string; }) => fg.fg_code === fodl.fg_code);

        if (fodlData && fgData) {
          return {
            id: fodl.fodl_id,
            itemCode: fodl.fg_code,
            itemDescription: fgData.fg_desc,
            unit: fgData.unit,
            factoryOverhead: parseFloat(fodlData.factory_overhead),
            directLabor: parseFloat(fodlData.direct_labor),
          } as FodlRecord;
        }

        return null;
      }).filter((item): item is FodlRecord => item !== null);

      setFodlFileData(fodlRecords);
    } catch (error) {
      console.error('Error fetching FODL sheet:', error);
    }
  };


  const fetchMaterialSheet = async (material_ids: Number[]) => {
    try {
      const response = await api.get('/materials/retrieve_batch', {
        params: { col: 'material_id', values: material_ids },
      });

      if (response.data.status === 200) {
        const validResults = response.data.data.map((data: { material_code: any; material_desc: any; unit: any; material_cost: string; }) => ({
          itemCode: data.material_code,
          itemDescription: data.material_desc,
          unit: data.unit,
          materialCost: parseFloat(data.material_cost),
        }));
        setMaterialData(validResults);
      } else {
        console.error('No materials found');
      }
    } catch (error) {
      console.error('Error fetching Material sheet:', error);
    }
  };

  const fetchBOMSheets = async (bom_ids: number[]): Promise<void> => {
    setIsLoading(true);
    try {
      const bomResponse = await api.get('/boms/retrieve_batch', {
        params: { col: 'bom_id', values: bom_ids },
      });

      if (bomResponse.data.status !== 200) {
        throw new Error("Failed to fetch BOMs");
      }

      const bomDataArray = bomResponse.data.data;
      const allFormulationIds: number[] = [];

      bomDataArray.forEach((bomData: { formulations: string }) => {
        const formulations = JSON.parse(bomData.formulations);
        allFormulationIds.push(...formulations);
      });

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

      const finishedGoodDataArray = finishedGoodResponse.data.data;
      const materialResponse = await api.get('/materials/retrieve_batch', {
        params: { col: 'material_id', values: allMaterialIds },
      });

      if (materialResponse.data.status !== 200) {
        throw new Error("Failed to fetch materials");
      }

      const materialDataArray = materialResponse.data.data;

      const bomSheets = bomDataArray.map((bomData: { formulations: string; bom_id: any; bom_name: any }) => {
        const formulations = JSON.parse(bomData.formulations);
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
                formula: formulation.formula_code,
                level: null,
                itemCode: finishedGood.fg_code,
                description: finishedGood.fg_desc,
                formulation: parseFloat(finishedGood.formulation_no).toString(),
                batchQty: parseFloat(finishedGood.total_batch_qty),
                unit: finishedGood.unit,
              };
              currentFormulations.push(fgRow);
            }

            if (formulation.emulsion) {
              const emulsionData = JSON.parse(formulation.emulsion);
              if (Object.keys(emulsionData).length !== 0) {
                currentFormulations.push({
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
                    formula: null,
                    level: parseFloat(materialInfo.level).toString(),
                    itemCode: materialDetails.material_code,
                    description: materialDetails.material_desc,
                    formulation: null,
                    batchQty: materialInfo.qty,
                    unit: materialDetails.unit,
                  });
                }
              });
            }

            if (index !== formulations.length - 1) {
              const emptyFodlRecord: FormulationRecord = {
                formula: null,
                level: null,
                itemCode: null,
                description: "",
                formulation: null,
                batchQty: null,
                unit: ""
              };
              currentFormulations.push(emptyFodlRecord);
            }
          }
        });

        return {
          bom_id: Number(bomData.bom_id),
          bomName: bomData.bom_name,
          formulations: currentFormulations,
        };
      });

      setBomSheets(bomSheets);

      const newEditFlags: { [key: string]: boolean } = {};
      bomSheets.forEach((bom: { bom_id: any }) => {
        const editKey = `C-${bom.bom_id}`;
        newEditFlags[editKey] = false;
      });

      setIsEdit((prev) => ({ ...prev, ...newEditFlags }));
    } catch (error) {
      console.error("Error fetching BOM sheets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // onSave functions
  // const onSaveFodlSheet = async (updatedData: any[]) => {
  //   try {
  //     console.log(updatedData);
  //     const settings = JSON.parse(data.settings);

  //     const transformedFodlData = updatedData.map(item => ({
  //       fodl_id: item.id,
  //       factory_overhead: parseFloat(item.factoryOverhead.toString()),
  //       direct_labor: parseFloat(item.directLabor.toString()),
  //       monthYear: settings.monthYear
  //     }));

  //     const transformedFgData = updatedData.map(item => ({
  //       fg_code: item.itemCode,
  //       fg_desc: item.itemDescription,
  //       unit: item.unit,
  //     }));

  //     const payload = {
  //       fodls: transformedFodlData,
  //       finished_goods: transformedFgData,
  //     };

  //     const response = await api.post('/fodls/update_batch', payload);

  //     if (response.data.status !== 200) {
  //       throw new Error(`Failed to save sheets: ${response.data.message}`);
  //     }

  //     // Refetch data to ensure it's up-to-date
  //     // fetchFodlSheet(JSON.parse(data.settings).fodls);
  //     console.log('FODL and Finished Goods sheets saved successfully', response);
  //   } catch (error) {
  //     console.error('Error saving sheets:', error);
  //   }
  // };

  const onSaveFodlSheet = async (updatedData: any[]) => {
    try {
      console.log('Updated Data:', updatedData);
      const settings = JSON.parse(data.settings);

      // Transform Fodl Data for Update
      const transformedFodlData = updatedData.map(item => ({
        fodl_id: item.id,
        factory_overhead: parseFloat(item.factoryOverhead.toString()),
        direct_labor: parseFloat(item.directLabor.toString()),
        monthYear: settings.monthYear
      }));

      // Transform Finished Goods Data for Update
      const transformedFgData = updatedData.map(item => ({
        fg_code: item.itemCode,
        fg_desc: item.itemDescription,
        unit: item.unit,
      }));

      const payload = {
        fodls: transformedFodlData,
        finished_goods: transformedFgData,
      };

      // Perform Batch Update
      const updateResponse = await api.post('/fodls/update_batch', payload);

      if (updateResponse.data.status !== 200) {
        throw new Error(`Failed to save sheets: ${updateResponse.data.message}`);
      }

      console.log('FODL and Finished Goods sheets saved successfully', updateResponse);
      // toast.success('FODL and Finished Goods sheets saved successfully.');

      // Handle Bulk Deletions After Successful Update
      if (removedFodlIds.length > 0) {
        console.log('Handling Bulk Deletions for Fodl IDs:', removedFodlIds);

        try {
          const deleteBulkResponse = await api.post('/fodls/delete_bulk', {
            fodl_ids: removedFodlIds
          });

          if (deleteBulkResponse.data.status !== 200) {
            console.error(`Failed to bulk delete Fodl IDs: ${deleteBulkResponse.data.message}`);
            // toast.error(`Failed to delete some FODL records: ${deleteBulkResponse.data.message}`);
          } else {
            console.log(`Fodl IDs ${removedFodlIds.join(', ')} deleted successfully.`);
            // toast.success('FODL records deleted successfully.');
          }
        } catch (deleteBulkError) {
          console.error('Error bulk deleting Fodl records:', deleteBulkError);
          // toast.error('An error occurred while deleting FODL records.');
        }

        // Clear the removedFodlIds after handling deletions
        setRemovedFodlIds([]);
      }

      // Refetch data to ensure it's up-to-date
      // await fetchFodlSheet();

    } catch (error: any) { // Adjusted to capture 'message' property
      console.error('Error saving sheets:', error);
      // // Provide user feedback
      // toast.error(`Error saving sheets: ${error.message}`);
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
              onSave={onSaveFodlSheet}
              removedFodlIds={removedFodlIds}
              setRemovedFodlIds={setRemovedFodlIds}
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
              removedFodlIds={removedFodlIds}
              setRemovedFodlIds={setRemovedFodlIds}
            />
          </div>

          {/* Dynamic BOM Sheets */}
          {bomSheets.map((bom) => {
            const editKey = `C-${bom.bom_id}`;
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
                    removedFodlIds={removedFodlIds}
              setRemovedFodlIds={setRemovedFodlIds}
                  />
                </div>
              </div>
            )
          })}
        </div>
        :
        <div className='flex justify-center items-center overflow-auto min-h-[552px]'>
          <div className='flex flex-col justify-center'>
            <div className='flex justify-center'>
              <div className="🤚">
                <div className="👉"></div>
                <div className="👉"></div>
                <div className="👉"></div>
                <div className="👉"></div>
                <div className="🌴"></div>
                <div className="👍"></div>
              </div>
            </div>

            <div className='ml-[100px] mt-[50px] flex justify-center'>
              <h1 className="flex items-center text-3xl h-[2em] font-bold text-neutral-400">
                Loading...
                <span className="relative ml-3 h-[1.2em] w-[470px] overflow-hidden">
                  <span
                    className="absolute h-full w-full -translate-y-full animate-slide leading-none text-primary"
                  >
                    Organizing your information!
                  </span>
                  <span
                    className="absolute h-full w-full -translate-y-full animate-slide leading-none text-primary [animation-delay:0.83s]"
                  >
                    Slowly sorting your files!
                  </span>
                  <span
                    className="absolute h-full w-full -translate-y-full animate-slide leading-none text-primary [animation-delay:1.83s]"
                  >
                    Skimming your documents!
                  </span>
                </span>
              </h1>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default MasterFileContainer;
