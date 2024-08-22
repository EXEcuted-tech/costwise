"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import { BiSolidReport } from "react-icons/bi";

const CostCalculation = () => {
    return (
        <div className='w-full'>
            <div>
                <Header icon={BiSolidReport} title="Cost Calculation"></Header>
            </div>
        </div>
    )
}