// iconMap.ts
import { IconType } from 'react-icons';
import { RiDashboard2Fill, RiFormula } from 'react-icons/ri';
import { BsFillFolderFill } from 'react-icons/bs';
import { BiSolidReport } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { MdOutlineInventory } from 'react-icons/md';
import { GoHistory } from 'react-icons/go';

interface IconMap {
  [key: string]: IconType;
}

export const iconMap: IconMap = {
  RiDashboard2Fill,
  RiFormula,
  BsFillFolderFill,
  BiSolidReport,
  GiMoneyStack,
  MdOutlineInventory,
  GoHistory,
};
