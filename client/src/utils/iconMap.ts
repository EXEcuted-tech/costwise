import { IconType } from 'react-icons';
import { RiDashboard2Fill, RiFormula } from 'react-icons/ri';
import { BsFillFolderFill } from 'react-icons/bs';
import { BiSolidReport } from 'react-icons/bi';
import { GiMoneyStack, GiBookmarklet } from 'react-icons/gi';
import { MdOutlineInventory, MdOutlineQuestionMark, MdLogout, MdMoreHoriz } from 'react-icons/md';
import { GoHistory } from 'react-icons/go';
import { FaBell } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaFile } from "react-icons/fa";
import { BiSolidFile } from "react-icons/bi";
import { BiFile } from "react-icons/bi";

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
  FaBell,
  MdOutlineQuestionMark,
  MdLogout,
  MdMoreHoriz,
  ImUsers,
  HiWrenchScrewdriver,
  GiBookmarklet,
  FaFile,
  BiSolidFile,
  BiFile
};
