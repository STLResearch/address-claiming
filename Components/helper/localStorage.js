
export const removePubLicUserDetailsFromLocalStorage = (key,user) => {
    let initialData=localStorage.getItem(key)
    if(initialData && initialData.length>2 && user?.blockchainAddress){
        localStorage.removeItem(key)
    }
}
