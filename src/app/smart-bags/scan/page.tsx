'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';
import { Html5Qrcode } from 'html5-qrcode';
import Link from 'next/link';

export default function ScanBagPage() {
    const router = useRouter();
    const { user, isDemo } = useAuth();
    const [scanning, setScanning] = useState(false);
    const [scannedQR, setScannedQR] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState('');
    const [manualInput, setManualInput] = useState('');
    const [cameraError, setCameraError] = useState('');
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const scannerInitialized = useRef(false);

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current && scannerInitialized.current) {
                html5QrCodeRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
            }
        };
    }, []);

    useEffect(() => {
        if (!scanning || scannedQR) return;

        const initScanner = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const qrReaderEl = document.getElementById('qr-reader');
            if (!qrReaderEl) {
                setCameraError('Scanner element not found. Please try again.');
                setScanning(false);
                return;
            }

            try {
                const html5QrCode = new Html5Qrcode('qr-reader');
                html5QrCodeRef.current = html5QrCode;
                const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
                
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    config,
                    (decodedText) => {
                        setScannedQR(decodedText.toUpperCase());
                        html5QrCode.stop().then(() => {
                            scannerInitialized.current = false;
                            setScanning(false);
                        }).catch(err => console.error('Error stopping:', err));
                    },
                    () => {}
                );
                scannerInitialized.current = true;
            } catch (err: any) {
                setCameraError(err.message || 'Failed to access camera.');
                setScanning(false);
            }
        };

        initScanner();
    }, [scanning, isDemo, scannedQR]);

    const handleScan = async () => {
        setError('');
        setCameraError('');
        setScanning(true);
    };

    const handleManualSubmit = () => {
        if (manualInput.trim()) {
            setScannedQR(manualInput.trim().toUpperCase());
        }
    };

    const handleRegister = async () => {
        if (!scannedQR || !user) return;
        setRegistering(true);
        setError('');

        try {
            if (isDemo) {
                const DemoManager = require('@/lib/demo-manager').default;
                await new Promise(resolve => setTimeout(resolve, 1000));
                const result = DemoManager.registerSmartBag(scannedQR);

                if (result.success) {
                    router.push(`/smart-bags/${result.bag.id}`);
                } else {
                    setError('This bag is already registered!');
                    setScannedQR(null);
                }
            } else {
                const bagId = await DBService.createSmartBag({
                    qrCode: scannedQR,
                    userId: user.uid,
                    ownerName: user.name
                });
                router.push(`/smart-bags/${bagId}`);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to register bag');
        } finally {
            setRegistering(false);
        }
    };

    if (scannedQR) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-[#29302f]" style={{ backgroundColor: '#f1f8f6' }}>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-32 h-32 bg-[#29664c] rounded-full shadow-[0_20px_40px_rgba(41,102,76,0.25)] flex items-center justify-center mb-6"
                >
                    <span className="material-symbols-outlined text-white text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#29302f] mb-2">Bag Found!</h1>
                    <p className="text-[#565d5c] text-sm max-w-xs">
                        Register this bag to your account to start tracking impact
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#fb5151]/10 text-[#b31b25] p-3 rounded-xl mb-4 text-sm font-bold border-2 border-[#fb5151]/20 w-full max-w-sm text-center"
                    >
                        ⚠️ {error}
                    </motion.div>
                )}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] p-6 mb-6 w-full max-w-sm"
                >
                    <p className="text-xs font-bold text-[#a7afad] uppercase tracking-widest mb-1">QR CODE</p>
                    <p className="text-xl font-black tracking-tight text-[#29302f]">{scannedQR}</p>

                    <div className="mt-4 pt-4 border-t border-[#d4dfdd] space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#565d5c] font-medium">
                            <span className="material-symbols-outlined text-[#29664c] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Dynamic QR - Not assigned
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#565d5c] font-medium">
                            <span className="material-symbols-outlined text-[#29664c] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Ready for registration
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 w-full max-w-sm"
                >
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full bg-[#29664c] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b5a40] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {registering ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Registering...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">add_circle</span>
                                Register Bag
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => { setScannedQR(null); setError(''); }}
                        className="w-full bg-white text-[#29302f] font-bold py-4 rounded-xl border border-[#d4dfdd] hover:bg-[#eaf2f0] active:scale-95 transition-all"
                    >
                        Scan Different Bag
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[#29302f] flex flex-col" style={{ backgroundColor: '#f1f8f6' }}>
            {/* Header */}
            <header className="w-full sticky top-0 z-50 backdrop-blur-xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] flex items-center justify-between px-6 py-4" style={{ backgroundColor: 'rgba(241,248,246,0.8)' }}>
                <div className="flex items-center gap-4">
                    <Link href="/smart-bags" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eaf2f0] transition-colors active:scale-95 duration-200 text-[#29664c]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1 className="text-xl font-extrabold tracking-tight text-[#29664c]">Scan Smart Bag</h1>
                </div>
                <div className="w-10 h-10" />
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-32">
                {/* Viewport */}
                <div className="w-full max-w-md aspect-square relative group">
                    <div className="absolute inset-0 border-[12px] border-[#29664c] rounded-xl z-10 pointer-events-none" />
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#c8ffe0] rounded-tl-md z-20" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#c8ffe0] rounded-tr-md z-20" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#c8ffe0] rounded-bl-md z-20" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#c8ffe0] rounded-br-md z-20" />

                    <div className="w-full h-full rounded-xl overflow-hidden bg-[#dbe5e2] relative">
                        {scanning ? (
                            <div id="qr-reader" className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=800&fit=crop"
                                alt="Scanner placeholder"
                                className={`w-full h-full object-cover transition-all duration-500 brightness-90 grayscale-[20%] group-hover:brightness-100`}
                            />
                        )}
                        {scanning && (
                            <motion.div
                                animate={{ y: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute top-0 left-0 w-full h-[2px] bg-[#92f7c3] shadow-[0_0_15px_rgba(146,247,195,0.8)] z-15 pointer-events-none"
                            />
                        )}
                    </div>
                </div>

                {cameraError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-[#fb5151]/10 text-[#b31b25] p-3 rounded-xl border border-[#fb5151]/20 w-full max-w-sm text-center font-bold text-sm">
                        {cameraError}
                    </motion.div>
                )}

                {/* Status */}
                <div className="mt-8 text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">
                        {scanning ? 'Scanning...' : 'Ready to Scan'}
                    </h2>
                    <p className="text-[#565d5c] text-sm max-w-[280px] mx-auto font-medium">
                        {scanning ? 'Point your camera at the QR code on your REBAG' : 'Tap the camera button to start scanning your REBAG'}
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-12">
                    <button
                        onClick={handleScan}
                        disabled={scanning}
                        className="w-20 h-20 bg-gradient-to-br from-[#29664c] to-[#1b5a40] text-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(41,102,76,0.25)] active:scale-90 transition-transform duration-200 disabled:opacity-80"
                    >
                        {scanning ? (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="material-symbols-outlined text-4xl">refresh</motion.span>
                        ) : (
                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                        )}
                    </button>
                </div>

                {/* Manual Entry */}
                <div className="mt-16 w-full max-w-md bg-[#eaf2f0] p-8 rounded-xl space-y-6">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#565d5c]">Alternative Entry</span>
                        <h3 className="text-lg font-bold">Or enter QR code manually</h3>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 bg-[#d4dfdd] p-4 rounded-lg relative">
                            <span className="absolute -top-2.5 left-4 px-2 bg-[#eaf2f0] text-[10px] font-bold uppercase text-[#29664c]">Bag ID</span>
                            <input
                                type="text"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                className="bg-transparent border-none outline-none focus:ring-0 w-full text-[#29302f] font-semibold placeholder:text-[#29302f]/40 p-0"
                                placeholder="e.g. BAG-ABC123"
                            />
                        </div>
                        <button
                            onClick={handleManualSubmit}
                            disabled={!manualInput.trim()}
                            className="px-8 bg-[#29664c] text-white font-bold rounded-lg hover:bg-[#1b5a40] active:scale-95 transition-all disabled:opacity-50"
                        >
                            Go
                        </button>
                    </div>
                </div>

                {/* Demo Hint */}
                {isDemo && (
                    <div className="mt-8 w-full max-w-md bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-lg flex items-start gap-3 shadow-sm">
                        <span className="material-symbols-outlined text-[#b45309]">info</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#b45309]">Demo Mode Target</p>
                            <p className="text-xs text-[#92400e] leading-relaxed mt-1">
                                Because you are in demo mode, you can scan <strong>any QR code</strong> from your environment to simulate a successful read. Or use manual entry.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
