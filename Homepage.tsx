"use client";
import Navbarx from '@/components/Navbarx';
import Tablets from '@/pages/Tablets';
import React from 'react';

const Homepage = () => {

  return (
    <>
      <Navbarx />
      <h1 className="flex justify-center text-2xl py-4">Tablets</h1>
      <Tablets />
    </>
  )
}

export default Homepage;
