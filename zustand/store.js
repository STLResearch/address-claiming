import { create } from "zustand";

export const createUSDCBalStore = create((set) => ({
      USDCBal:'0',
      setUSDCBal: (newBal) =>{
        set((state) => {
            state.USDCBal=newBal;
            return {USDCBal:state.USDCBal};
      })
    }
}))
  