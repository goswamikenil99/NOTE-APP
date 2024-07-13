import React from 'react'

const EmptyCard = ({imgSrc , message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20 '>
        <img src={imgSrc} alt="No Notes" />
        <p className='w-1/2 text-xl font-medium text-slate-700 text-center leading-7'>{message}</p>
    </div>
  )
}

export default EmptyCard