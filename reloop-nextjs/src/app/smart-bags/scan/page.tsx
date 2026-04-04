'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DemoManager from '@/lib/demo-manager';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ScanBagPage() {
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [scannedQR, setScannedQR] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        await DemoManager.simulateDelay(1500);

        const qr = DemoManager.getUnregisteredBagQR();
        setScannedQR(qr);
        setScanning(false);
    };

    const handleRegister = async () => {
        if (!scannedQR) return;

        setRegistering(true);
        await DemoManager.simulateDelay(1000);

        const result = DemoManager.registerSmartBag(scannedQR);

        if (result.success) {
            router.push(`/smart-bags/${result.bag.id}`);
        } else {
            alert('This bag is already registered!');
            setScannedQR(null);
        }

        setRegistering(false);
    };

    if (scannedQR) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-32 h-32 bg-green-500 rounded-full border-4 border-dark shadow-brutal flex items-center justify-center mb-6"
                >
                    <span className="material-symbols-outlined text-white text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-2xl font-black text-dark dark:text-white mb-2">Bag Found!</h1>
                    <p className="text-dark/70 dark:text-white/70 text-sm max-w-xs">
                        Register this bag to your account to start earning coins
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-6 mb-6 w-full max-w-xs"
                >
                    <p className="text-xs font-bold text-dark/50 dark:text-white/50 mb-1">QR CODE</p>
                    <p className="text-lg font-black text-dark dark:text-white">{scannedQR}</p>

                    <div className="mt-4 pt-4 border-t-2 border-dashed border-dark/10 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-dark/70 dark:text-white/70">
                            <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Dynamic QR - Not assigned
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark/70 dark:text-white/70">
                            <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Ready for registration
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 w-full max-w-xs"
                >
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full bg-green-500 text-white font-black py-4 rounded-2xl border-2 border-dark shadow-brutal flex items-center justify-center gap-2 active:translate-y-0.5 transition-transform"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        {registering ? 'Registering...' : 'Register Bag'}
                    </button>
                    <button
                        onClick={() => setScannedQR(null)}
                        className="w-full bg-white dark:bg-dark-surface text-dark dark:text-white font-bold py-3 rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                    >
                        Scan Different Bag
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Scan Smart Bag" backHref="/smart-bags" />

            <div className="px-5 pb-28 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                {/* Camera View Simulation */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full max-w-sm aspect-square bg-dark rounded-3xl border-4 border-dark shadow-brutal overflow-hidden mb-6"
                >
                    {/* Simulated camera feed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-48 h-48 border-4 border-green-400 rounded-2xl"
                        />
                    </div>

                    {/* Scan line animation */}
                    {scanning && (
                        <motion.div
                            initial={{ top: '10%' }}
                            animate={{ top: '90%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-green-400 shadow-glow-green"
                        />
                    )}
                </motion.div>

                <div className="text-center mb-6">
                    <p className="text-lg font-black text-dark dark:text-white mb-2">
                        {scanning ? 'Scanning...' : 'Position QR Code'}
                    </p>
                    <p className="text-sm text-dark/60 dark:text-white/60 max-w-xs">
                        {scanning ? 'Please hold steady while we scan the code' : 'Align the QR code within the frame to scan'}
                    </p>
                </div>

                <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-20 h-20 bg-green-500 rounded-full border-4 border-dark shadow-brutal flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {scanning ? (
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="material-symbols-outlined text-white text-4xl"
                        >
                            refresh
                        </motion.span>
                    ) : (
                        <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>camera</span>
                    )}
                </button>

                {/* Demo Hint */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-card-yellow rounded-xl border-2 border-dark shadow-brutal-sm px-4 py-3 max-w-sm"
                >
                    <p className="text-xs font-bold text-dark">💡 Demo Mode</p>
                    <p className="text-xs text-dark/70 mt-1">
                        Tap the camera button to simulate scanning a QR code. In production, this will use your device camera.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
