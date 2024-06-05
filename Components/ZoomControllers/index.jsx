import React from 'react'
import { ZoomInIcon, ZoomOutIcon } from '../Icons'
import { handleZoomIn,handleZoomOut } from '@/utils/maputils'

const ZoomControllers = ({map}) => {
  return (
    <div className='z-50 absolute  bottom-[128px] right-[14px] -translate-x-[19px] translate-y-[28px] w-[52px] rounded-lg bg-white bg-opacity-50 flex flex-col items-center justify-center gap-2.5 p-2.5 shadow-md'>
        <div className='w-[32px] h-[32px] flex justify-center cursor-pointer' onClick={()=>handleZoomIn(map)} >
            <ZoomInIcon />
        </div>
        <div className='w-[32px] h-[32px] flex justify-center cursor-pointer' onClick={()=>handleZoomOut(map)}>
            <ZoomOutIcon />
        </div>
    </div>
  )
}

export default ZoomControllers;