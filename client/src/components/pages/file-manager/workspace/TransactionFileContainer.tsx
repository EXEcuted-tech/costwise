import React, { useEffect, useRef, useState } from 'react'
import FileLabel from './FileLabel'
import WorkspaceTable from './WorkspaceTable'
import { FaPencilAlt } from 'react-icons/fa'
import { TbProgress } from 'react-icons/tb'
import { File, TransactionRecord } from '@/types/data';
import api from '@/utils/api'
import Alert from '@/components/alerts/Alert'
import PrimaryPagination from '@/components/pagination/PrimaryPagination'

const TransactionFileContainer = (data: File) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [transactionData, setTransactionData] = useState<TransactionRecord[]>([]);
  const [transactionsCount, setTransactionsCount] = useState(0);
  
  const [showScrollMessage, setShowScrollMessage] = useState(true);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
  };

  const itemsPerPage = 100;
  // addedRowsCount
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListPage = transactionData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("edit") === "true") {
      setIsEdit(true);
    }

    setIsLoading(true);

    if (data.settings) {
      const settings = JSON.parse(data.settings);

      const fetchAllData = async () => {
        try {
          await Promise.all([
            fetchTransactionsSheet(settings.transaction_ids),
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [data])

  const fetchTransactionsSheet = async (transaction_ids: Number[]) => {
    try {
      const response = await api.get('/transactions/retrieve_batch', {
        params: { col: 'transaction_id', values: transaction_ids },
      });

      if (response.data.status === 200) {
        setTransactionsCount(response.data.data.length);
        const validResults: any[] = [];
        response.data.data.forEach((data: any, index: number) => {
          const settings = data.settings ? JSON.parse(data.settings) : {};
          validResults.push({
            id: data.transaction_id,
            year: data.year,
            month: data.month,
            date: data.date,
            journal: data.journal,
            entryNumber: data.entry_num,
            description: data.trans_desc,
            project: data.project,
            glAccount: String(data.gl_account),
            glDescription: data.gl_desc,
            warehouse: data.warehouse,
            itemCode: data.material_id != null
              ? data.material?.material_code
              : data.fg_id != null
                ? data.finished_good?.fg_code
                : (settings.item_code ?? ''),
            itemDescription: data.material_id != null
              ? data.material?.material_desc
              : data.fg_id != null
                ? data.finished_good?.fg_desc
                : (settings.item_desc ?? ''),
            quantity: data.fg_id != null
              ? parseFloat(data.finished_good?.total_batch_qty)
              : (parseFloat(settings.qty) ?? ''),
            amount: data.material_id != null
              ? parseFloat(data.material?.material_cost)
              : data.fg_id != null
                ? parseFloat(data.finished_good?.rm_cost)
                : (parseFloat(settings.amount) ?? 0.0),
            unitCode: data.material_id != null
              ? data.material?.unit
              : data.fg_id != null
                ? data.finished_good?.unit
                : (settings.unit ?? ''),
          });
        });

        setTransactionData(validResults);

      } else {
        console.error('No materials found');
      }

    } catch (error) {
      console.error('Error fetching Material sheet:', error);
    }
  };

  const onSaveTransactionsSheet = async (transactions: any[]) => {
    // try {
    console.log(transactions);
    const hasEmptyEntry = transactions.some(item => {
      console.log(item);
      return (
        (item.date === "" ||
          item.amount === "" ||
          item.journal === "" ||
          item.entryNumber === "" ||
          item.description === "" ||
          item.project === "" ||
          item.glAccount === "" ||
          item.glDescription === "" ||
          item.warehouse === "" ||
          item.itemCode === "" ||
          item.itemDescription === "" ||
          item.quantity === "" ||
          item.unitCode === "" ||
          item.date === "" ||
          item.year === ""||
          item.month === ""
        )
      );
    });

    console.log(hasEmptyEntry);
    if (hasEmptyEntry) {
      setAlertMessages(['One or more entries are empty. Please fill in all required fields.']);
      return;
    }

    const transformedTransactions = transactions.map((item) => ({
      transaction_id: item.id,
      journal: item.journal,
      entry_num: item.entryNumber,
      trans_desc: item.description,
      project: item.project,
      gl_account: item.glAccount,
      gl_desc: item.glDescription,
      warehouse: item.warehouse,
      date: item.date,
      month: item.month,
      year: item.year,
      settings: item.settings
    }));

    const payload = {
      transactions: transformedTransactions,
    };

    console.log(payload);
    // const saveResponse = await api.post('/materials/update_batch', payload);

    //   if (saveResponse.data.status === 200) {
    //     setSuccessMessage('Material sheet saved successfully.');

    //     if (removedMaterialIds.length > 0) {
    //       try {
    //         const deletePayload = {
    //           material_ids: removedMaterialIds,
    //           file_id: data.file_id,
    //         };
    //         const deleteResponse = await api.post('/materials/delete_bulk', deletePayload);

    //         if (deleteResponse.data.status === 200) {
    //           setSuccessMessage('Material records deleted successfully.');
    //           setRemovedFodlIds([]);
    //         } else {
    //           setAlertMessages(['Failed to bulk delete Material IDs.']);
    //         }
    //       } catch (deleteError) {
    //         setAlertMessages(['An error occurred while deleting Material records.']);
    //       }
    //     }
    //   } else {
    //     const errorMsg = saveResponse.data.message || 'Failed to save material sheet.';
    //     setAlertMessages([errorMsg]);
    //   }
    // } catch (error: any) {
    //   if (error.response?.data?.message) {
    //     setAlertMessages([error.response.data.message]);
    //   } else if (error.response?.data?.errors) {
    //     const errorMessages = [];
    //     for (const key in error.response.data.errors) {
    //       if (error.response.data.errors.hasOwnProperty(key)) {
    //         errorMessages.push(...error.response.data.errors[key]);
    //       }
    //     }
    //     setAlertMessages(errorMessages);
    //   } else {
    //     setAlertMessages(['Error saving Material sheet. Please try again.']);
    //   }
    // }
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
      <div className='bg-white rounded-[10px] drop-shadow mb-[35px] overflow-hidden'>
        <FileLabel {...data} />
        {!isLoading ?
          <>
            <div className=''>
              {/* Production Transactions */}
              <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
                <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>PRODUCTION TRANSACTIONS</h1>
                {isEdit ?
                  <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin' />
                  :
                  <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
                    onClick={() => { setIsEdit(true) }} />
                }
              </div>
              {showScrollMessage && (
                <div className="scroll-message">
                  Move mouse to right or left direction to scroll horizontally
                </div>
              )}

              <div className='p-[20px] overflow-x-auto'>
                <WorkspaceTable
                  data={currentListPage}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  isTransaction={true}
                  onSave={onSaveTransactionsSheet}
                  removedIds={removedIds}
                  setRemovedIds={setRemovedIds}
                  transactionCount={transactionsCount}
                  setTransactionCount = {setTransactionsCount}
                />
              </div>
            </div>
            {currentListPage.length > 0 &&
              < div className='relative py-[1%]'>
                <PrimaryPagination
                  data={transactionData}
                  itemsPerPage={itemsPerPage}
                  handlePageChange={handlePageChange}
                  currentPage={currentPage}
                />
              </div>
            }
          </>
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
      </div >
    </>
  )
}


export default TransactionFileContainer;
