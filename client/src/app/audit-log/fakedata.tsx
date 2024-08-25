import React from "react";
import AuditLogPage, { AuditTableProps } from "@/app/audit-log/page";

const fakeAuditAllData: AuditTableProps[] = [
  {
    dateTimeAdded: 'January 12, 2024 12:50:22',
    employeeNo: '#112391',
    userType: 'Regular User',
    actionEvent: 'Record changed: BOM_V1_Cost.csv'
  },
  {
    dateTimeAdded: 'January 13, 2024 12:50:22',
    employeeNo: '#123531',
    userType: 'Regular User',
    actionEvent: 'Record changed: BOM_V3_Cost.csv'
  },
  {
    dateTimeAdded: 'January 14, 2024 12:50:22',
    employeeNo: '#125131',
    userType: 'Regular User',
    actionEvent: 'Record changed: BOM_V5_Cost.csv'
  },
  {
    dateTimeAdded: 'January 15, 2024 12:50:22',
    employeeNo: '#199999',
    userType: 'Regular User',
    actionEvent: 'Record changed: BOM_V7_Cost.csv'
  },
  {
    dateTimeAdded: 'January 17, 2024 12:50:22',
    employeeNo: '#188888',
    userType: 'Regular User',
    actionEvent: 'Record changed: BOM_V9_Cost.csv'
  },
];

const FakeData: React.FC = () => {
  return (
    <div>
      <AuditLogPage fileData={fakeAuditAllData} />
    </div>
  );
};

export default FakeData;