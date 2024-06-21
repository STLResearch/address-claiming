
export const removePubLicUserDetailsFromLocalStorage = (key: string, blockchainAddress: string | undefined) => {
  const initialData = localStorage.getItem(key);

  if(initialData && initialData.length>2 && blockchainAddress){
    localStorage.removeItem(key)
  }
}

export const removePubLicUserDetailsFromLocalStorageOnClose = (key: string) => {
  const initialData = localStorage.getItem(key)

  if(initialData && initialData.length>2){
    localStorage.removeItem(key)
  }
}
