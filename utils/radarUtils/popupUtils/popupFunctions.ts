export const closePopups = (): void => {
    removePopup(".popup-clicked-class");
    removePopup(".popup-hovered-class");
};

export const removePopup = (selector: string): void => {
    const elementToRemove = document.querySelector(selector);
    if (elementToRemove) elementToRemove.remove();
};
