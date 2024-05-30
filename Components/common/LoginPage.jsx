import Signup from '@/pages/auth/join'
import { useMobile } from "@/hooks/useMobile";

export default function LoginPage() {
  
  const { isMobile } = useMobile();

  if(isMobile){
    return (<div className=' w-screen h-screen '>
    <div className='w-full h-full '>
      <Signup/>

    </div>
  </div>
    )

}

  return (
    <div className='fixed  w-screen h-full  flex items-center justify-center '>
    <div className='w-[100%] h-[100%]  flex justify-center items-center rounded-xl overflow-clip '>
      <Signup/>
    </div>
  </div>
  )
}
