export const closePopups = () => {
    removePopup(".popup-clicked-class");
    removePopup(".popup-hovered-class");
};

export const removePopup = (selector) => {
    const elementToRemove = document.querySelector(selector);
    if (elementToRemove) elementToRemove.remove();
};

