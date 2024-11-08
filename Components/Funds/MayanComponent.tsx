import { useState } from "react";
import { Root } from "react-dom/client"
import MayanSwapWidget from "./MayanSwapWidget";
import KlasterComponent from "./KlasterComponent";

const MayanComponent = ({ root }: { root: Root }) => {

    const [displayMayanSwap, setDisplayMayanSwap] = useState<Boolean>(false);
    const [displayKlaster, setDisplayKlaster] = useState<Boolean>(false);

    const closeBox = () => {
        root.unmount();
    };

    return (
        <div style={{
            position: 'fixed',
            top: '55%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            width: '408px',
            height: '500px',
            backgroundColor: '#E8E8E8',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <button
                onClick={closeBox}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 1100,
                }}
            >
                &times;
            </button>
            <div
                style={{
                    overflowY: 'auto',
                    maxHeight: '90%',
                    width: '100%',
                    padding: '10px 0',
                }}
            >
                <div style={{
                    marginTop: '10px',
                    borderRadius: '10px',
                    zIndex: 1200,
                }}>
                    {displayKlaster ? <KlasterComponent /> : (displayMayanSwap ? <MayanSwapWidget /> : <div
                        style={{
                            backgroundColor: '#F0F4F8',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            margin: '20px auto',
                        }}
                    >
                        <p style={{ fontSize: '16px', color: '#333', marginBottom: '25px' }}>
                            If you have a Klaster account with funds, you can log in using the wallet address associated with it to bridge all your assets to a single chain and, after that, use MayanSwap. Otherwise, just click on "Continue with MayanSwap".
                        </p>

                        {/* Login with Klaster Button */}
                        <button
                            onClick={() => { setDisplayKlaster(true) }}
                            style={{
                                backgroundColor: '#E8E8E8',
                                color: '#666',
                                border: 'none',
                                padding: '12px 20px',
                                fontSize: '18px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginBottom: '15px',
                                width: '100%',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s, transform 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D8D8D8')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E8E8E8')}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                        >
                            Login with Klaster
                        </button>

                        {/* Continue with MayanSwap Button */}
                        <button
                            onClick={() => { setDisplayMayanSwap(true) }}
                            style={{
                                backgroundColor: '#E0F7FF',
                                color: '#0077CC',
                                border: 'none',
                                padding: '12px 20px',
                                fontSize: '18px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                width: '100%',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s, transform 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#CDEBFF')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E0F7FF')}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                        >
                            Continue with MayanSwap
                        </button>
                    </div>)}
                </div>
            </div>
        </div>
    );
}

export default MayanComponent;