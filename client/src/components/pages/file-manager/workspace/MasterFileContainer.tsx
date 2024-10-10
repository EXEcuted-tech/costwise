import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FaPencilAlt } from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
import WorkspaceTable from './WorkspaceTable';
import { BOM, File, FodlPair, FodlRecord, FormulationRecord, MaterialRecord, RemovedId } from '@/types/data';
import api from '@/utils/api';
import { formatMonthYear, transformMonthYearToDate } from '@/utils/costwiseUtils';
import Alert from '@/components/alerts/Alert';

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
  const [removedMaterialIds, setRemovedMaterialIds] = useState<number[]>([]);
  const [removedIds, setRemovedIds] = useState<RemovedId[]>([]);

  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

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
            id: fodlData.fodl_id,
            itemCode: fodlData.fg_code,
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
        const validResults = response.data.data.map((data: { material_id: any, material_code: any; material_desc: any; unit: any; material_cost: string; }) => ({
          id: data.material_id,
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
                  });
                }
              });
            }

            if (index !== formulations.length - 1) {
              const emptyFodlRecord: FormulationRecord = {
                rowType: 'endIdentifier',
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
  const onSaveFodlSheet = async (updatedData: any[]) => {
    try {
      const hasEmptyEntry = updatedData.some(item => {
        return (
          typeof item === 'object' &&
          item !== null &&
          !Array.isArray(item) &&
          (item.itemCode === '' &&
            item.itemDescription === '' &&
            item.unit === '' &&
            item.factoryOverhead === '' &&
            item.directLabor === '')
        );
      });

      if (hasEmptyEntry) {
        setAlertMessages(['One or more entries are empty. Please fill in all required fields.']);
        return;
      }

      const settings = JSON.parse(data.settings);
      const transformedFodlData = updatedData.map(item => ({
        fodl_id: item.id,
        factory_overhead: parseFloat(item.factoryOverhead.toString()),
        direct_labor: parseFloat(item.directLabor.toString()),
        monthYear: settings.monthYear
      }));

      const transformedFgData = updatedData.map(item => ({
        fg_code: item.itemCode,
        fg_desc: item.itemDescription,
        unit: item.unit,
      }));

      const payload = {
        fodls: transformedFodlData,
        finished_goods: transformedFgData,
        file_id: data.file_id
      };

      const updateResponse = await api.post('/fodls/update_batch', payload);

      if (updateResponse.data.status !== 200) {
        setIsLoading(false);
        if (updateResponse.data.errors) {
          setAlertMessages(updateResponse.data.errors);
        } else if (updateResponse.data.message) {
          setAlertMessages([updateResponse.data.message]);
        }
      }

      setSuccessMessage("FODL sheets saved successfully.");

      if (removedFodlIds.length > 0) {
        try {
          const deleteBulkResponse = await api.post('/fodls/delete_bulk', {
            fodl_ids: removedFodlIds,
            file_id: data.file_id
          });

          if (deleteBulkResponse.data.status !== 200) {
            setAlertMessages(['Failed to bulk delete Fodl IDs.']);
          } else {
            setSuccessMessage("FODL records deleted successfully.");
          }
        } catch (deleteBulkError) {
          setAlertMessages(['An error occurred while deleting FODL records.']);
        }

        setRemovedFodlIds([]);
      }

      // await fetchFodlSheet();
    } catch (error: any) {
      if (error.response?.data?.message) {
        setAlertMessages([error.response.data.message]);
      } else if (error.response?.data?.errors) {
        const errorMessages = [];
        for (const key in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(key)) {
            errorMessages.push(...error.response.data.errors[key]);
          }
        }
        setAlertMessages(errorMessages);
      } else {
        setAlertMessages(['Error saving sheets due to invalid inputs. Retry again!']);
      }
    }
  };

  const onSaveMaterialSheet = async (materials: any[]) => {
    try {
      // console.log(materials);
      const hasEmptyEntry = materials.some(item => {
        return (
          typeof item === 'object' &&
          item !== null &&
          !Array.isArray(item) &&
          (item.itemCode === '' &&
            item.itemDescription === '' &&
            item.unit === '' &&
            item.materialCost === '')
        );
      });

      if (hasEmptyEntry) {
        setAlertMessages(['One or more entries are empty. Please fill in all required fields.']);
        return;
      }

      const settings = JSON.parse(data.settings);
      const transformedMaterials = materials.map((item) => ({
        material_id: item.id,
        material_code: item.itemCode,
        material_desc: item.itemDescription,
        material_cost: parseFloat(item.materialCost.toString()),
        unit: item.unit,
        date: transformMonthYearToDate(settings.monthYear)
      }));

      const payload = {
        materials: transformedMaterials,
        file_id: data.file_id
      };

      const saveResponse = await api.post('/materials/update_batch', payload);

      if (saveResponse.data.status === 200) {
        setSuccessMessage('Material sheet saved successfully.');

        if (removedMaterialIds.length > 0) {
          try {
            const deletePayload = {
              material_ids: removedMaterialIds,
              file_id: data.file_id,
            };
            const deleteResponse = await api.post('/materials/delete_bulk', deletePayload);

            if (deleteResponse.data.status === 200) {
              setSuccessMessage('Material records deleted successfully.');
              setRemovedFodlIds([]);
            } else {
              setAlertMessages(['Failed to bulk delete Material IDs.']);
            }
          } catch (deleteError) {
            setAlertMessages(['An error occurred while deleting Material records.']);
          }
        }
      } else {
        const errorMsg = saveResponse.data.message || 'Failed to save material sheet.';
        setAlertMessages([errorMsg]);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setAlertMessages([error.response.data.message]);
      } else if (error.response?.data?.errors) {
        const errorMessages = [];
        for (const key in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(key)) {
            errorMessages.push(...error.response.data.errors[key]);
          }
        }
        setAlertMessages(errorMessages);
      } else {
        setAlertMessages(['Error saving Material sheet. Please try again.']);
      }
    }
  };

  const onSaveBOMSheet = async (updatedData: any, bomId: number) => {
    // console.log(updatedData);
    // const hasEmptyEntry = updatedData.some(item => {
    //   return (

    //   );
    // });

    // if (hasEmptyEntry) {
    //   setAlertMessages(['One or more entries are empty. Please fill in all required fields.']);
    //   return;
    // }
    //1. Check if the addedRow is null (same like other onSaveBomSheets)
    try {
      const bomResponse = await api.get('/boms/retrieve', {
        params: { col: 'bom_id', value: bomId },
      });

      const formulaArray = JSON.parse(bomResponse.data.data[0].formulations);
      if (bomResponse.data.status == 200) {
        const formulations = splitFormulations(updatedData, formulaArray);

        formulations.forEach(async ({ id, formulations }, index) => {
          const formulationData = formulations;
          const finishedGood = formulationData[0];

          let fgRow = {
            fg_id: finishedGood.id,
            fg_code: finishedGood.itemCode,
            fg_desc: finishedGood.description,
            total_batch_qty: finishedGood.batchQty,
            unit: finishedGood.unit,
            formulation_no: parseInt(finishedGood.formulation ?? '0', 10),
          };

          const fgResponse = await api.post('/finished_goods/update', fgRow);

          if (fgResponse.data.status !== 200) {

          }

          let emulsion = formulationData[1]?.description === 'EMULSION' ? formulationData[1] : null;

          if (!emulsion) {
            const emulsions = formulationData.filter(item => item.description === 'EMULSION');

            if (emulsions.length === 1) {
              emulsion = emulsions[0];
            }
            else if (emulsions.length > 1) {
              emulsion = formulationData[1];
            }
          }

          const transformedEmulsionData = emulsion
            ? {
              level: emulsion.level,
              batch_qty: emulsion.batchQty,
              unit: emulsion.unit
            }
            : {};

          const materials = formulationData.slice(2);

          const transformedMaterialData = materials.map(item => ({
            material_id: item.id,
            material_code: item.itemCode,
            material_desc: item.description,
            unit: item.unit,
            level: item.level,
            batchQty: item.batchQty,
          }));

          const payload = {
            emulsion: formulationData[1].description == 'EMULSION' ? transformedEmulsionData : {},
            materials: transformedMaterialData,
            formulation_id: id,
            formula_code: finishedGood.formula
          };
          const saveResponse = await api.post('/boms/update_batch', payload);
          if (saveResponse.data.status == 200) {
            setIsLoading(false);
            setSuccessMessage("FODL sheets saved successfully.");
          } else {
            setIsLoading(false);
            if (saveResponse.data.message) {
              setAlertMessages([saveResponse.data.message]);
            } else if (saveResponse.data.errors) {
              setAlertMessages(saveResponse.data.errors);
            }
          }
          // deletionzzz afterzz
        });
        const finishedGoodIds = removedIds
          .filter(item => item.rowType === 'finishedGood')
          .map(item => item.id);

        const materialIds = removedIds
          .filter(item => item.rowType === 'material')
          .map(item => ({
            id: item.id,
            track_id: item.track_id
          }));

        const emulsionIds = removedIds
          .filter(item => item.rowType === 'emulsion')
          .map(item => item.id);

        if (materialIds.length > 0) {
          const groupedByFormulationId = materialIds.reduce((acc, curr) => {
            const { track_id, id } = curr;

            if (!acc[track_id]) {
              acc[track_id] = [];
            }

            acc[track_id].push(id);

            return acc;
          }, {} as { [key: number]: number[] });

          for (const [formulation_id, material_ids] of Object.entries(groupedByFormulationId)) {
            const payload = {
              formulation_id: parseInt(formulation_id, 10),
              material_ids: material_ids
            };

            try {
              const deleteMaterialResponse = await api.post('/formulations/delete_material', payload);
              if (deleteMaterialResponse.data.status === 200) {
                setSuccessMessage(`Materials are deleted successfully.`);
              } else {
                setAlertMessages([`Failed to delete materials for formulation_id ${formulation_id}.`]);
              }
            } catch (deleteMaterialError) {
              setAlertMessages([`An error occurred while deleting materials for formulation_id ${formulation_id}.`]);
            }
          }
        }

        if (emulsionIds.length > 0) {
          try {
            const updateEmulsionResponses = await Promise.all(
              emulsionIds.map(async (formulation_id) => {
                return await api.post('/formulations/update_emulsion', {
                  formulation_id: formulation_id
                });
              })
            );

            const failedUpdates = updateEmulsionResponses.filter(
              response => response.data.status !== 200
            );

            if (failedUpdates.length > 0) {
              setAlertMessages(['Failed to update some emulsions.']);
            } else {
              setSuccessMessage("Emulsions updated successfully.");
            }
          } catch (error) {
            setAlertMessages(['An error occurred while updating emulsions.']);
          }
        }

        if (finishedGoodIds.length > 0) {
          try {
            const deleteFgResponse = await api.post('/formulations/delete_fg', {
              fg_ids: finishedGoodIds,
              bom_id: bomId,
            });

            if (deleteFgResponse.data.status !== 200) {
              setAlertMessages(['Failed to delete records.']);
            } else {
              setSuccessMessage("Finished Goods deleted successfully.");
            }
          } catch (deleteFgError) {
            setAlertMessages(['An error occurred while deleting Finished Goods.']);
          }
        }

        setRemovedIds([]);

        setIsLoading(false);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setAlertMessages([error.response.data.message]);
      } else if (error.response?.data?.errors) {
        const errorMessages = [];
        for (const key in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(key)) {
            errorMessages.push(...error.response.data.errors[key]);
          }
        }
        setAlertMessages(errorMessages);
      } else {
        setAlertMessages(['Error saving Material sheet. Please try again.']);
      }
    }
  }

  const splitFormulations = (
    data: FormulationRecord[],
    ids: number[]
  ): { id: number; formulations: FormulationRecord[] }[] => {
    const formulations: FormulationRecord[][] = [];
    let currentFormulation: FormulationRecord[] = [];

    if (!Array.isArray(data)) {
      console.error('Error: data is not an array.');
      throw new Error('The "data" argument must be an array.');
    }

    if (!ids) {
      console.error('Error: ids is undefined or null.');
      throw new Error('The "ids" argument is required and cannot be undefined.');
    }

    if (!Array.isArray(ids)) {
      console.error('Error: ids is not an array.');
      throw new Error('The "ids" argument must be an array of numbers.');
    }
    data.forEach((item, index) => {
      const isSeparator =
        item.formula === null &&
        item.level === null &&
        item.itemCode === null &&
        item.description === "" &&
        item.formulation === null &&
        item.batchQty === null &&
        item.unit === "";

      if (isSeparator) {
        if (currentFormulation.length > 0) {
          formulations.push(currentFormulation);
          currentFormulation = [];
        }
      } else {
        currentFormulation.push(item);
      }
    });

    if (currentFormulation.length > 0) {
      formulations.push(currentFormulation);
    }

    if (ids.length !== formulations.length) {
      console.warn(
        `The number of IDs (${ids.length}) does not match the number of formulations (${formulations.length}).`
      );
      const minLength = Math.min(ids.length, formulations.length);
      return formulations.slice(0, minLength).map((formulation, index) => ({
        id: ids[index],
        formulations: formulation,
      }));
    }

    const mappedFormulations = formulations.map((formulation, index) => ({
      id: ids[index],
      formulations: formulation,
    }));

    return mappedFormulations;
  };



  return (
    <>
      <div className="absolute top-0 right-0">
        {alertMessages && alertMessages.map((msg, index) => (
          <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
            setAlertMessages(prev => prev.filter((_, i) => i !== index));
          }} />
        ))}
        {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
      </div>
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
                removedIds={removedFodlIds}
                setRemovedIds={setRemovedFodlIds}
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
                onSave={onSaveMaterialSheet}
                removedIds={removedMaterialIds}
                setRemovedIds={setRemovedMaterialIds}
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
                      onSaveBOM={onSaveBOMSheet}
                      bomId={bom.bom_id}
                      removedBomIds={removedIds}
                      setRemovedBomIds={setRemovedIds}
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
    </>
  )
}

export default MasterFileContainer;
