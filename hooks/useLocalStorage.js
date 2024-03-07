const useLocalSorage = () => {
  const setItem = async (key, value) => {
    localStorage.setItem(key, value);
  };

  const getItem = async (key) => {
    return localStorage.getItem(key);
  };

  const removeItem = async (key) => {
    localStorage.removeItem(key);
  };

  const clearStorage = async () => {
    localStorage.clear();
  };

  const removeListOfItems = async (keys) => {
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clearStorage,
    removeListOfItems,
  };
};

export default useLocalSorage;
