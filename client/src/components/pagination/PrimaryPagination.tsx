import React from 'react'
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B22222',
    },
  },
});

interface PrimaryPaginationProps {
  data: any[];
  itemsPerPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  currentPage: number;
}

const PrimaryPagination:React.FC<PrimaryPaginationProps> = ({ data, itemsPerPage, handlePageChange, currentPage }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <ThemeProvider theme={theme}>
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)}
          shape="rounded"
          showFirstButton
          showLastButton
          color="primary"
          className=""
          onChange={handlePageChange}
          page={currentPage}
        />
        <div className="text-[#969696] text-xs">
          Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default PrimaryPagination