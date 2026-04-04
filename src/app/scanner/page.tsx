'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ScannerService from '@/lib/scanner-service';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNavStore } from '@/lib/store/nav-store';
import { ScanningOverlay } from '@/components/scanner/ScanningOverlay';
import { MissionCompleteToast } from '@/components/ui/MissionCompleteToast';
import { Mission } from '@/types';
import type { WebcamCaptureRef } from '@/components/scanner/WebcamCapture';

// Dynamically import WebcamCapture to avoid SSR issues
const WebcamCapture = dynamic(
    () => import('@/components/scanner/WebcamCapture'),
    { ssr: false }
);

type CameraState = 'idle' | 'requesting' | 'ready' | 'denied' | 'error';

export default function ScannerPage() {
    const router = useRouter();
    const { user } = useAuth();
    const webcamRef = useRef<WebcamCaptureRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [cameraState, setCameraState] = useState<CameraState>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { setActions, reset } = useNavStore();
    const [completedMission, setCompletedMission] = useState<Mission | null>(null);

    const requestCamera = useCallback(async () => {
        setCameraState('requesting');
        setErrorMessage(null);

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraState('denied');
                setErrorMessage('Camera requires HTTPS. Tap Gallery to take a photo instead.');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            stream.getTracks().forEach(track => track.stop());
            setCameraState('ready');
        } catch (err: any) {
            console.error('Camera error:', err);
            setCameraState('denied');

            if (err.name === 'NotAllowedError') {
                setErrorMessage('Camera permission denied. Please allow access in browser settings.');
            } else if (err.name === 'NotFoundError') {
                setErrorMessage('No camera found on this device.');
            } else if (err.name === 'NotReadableError') {
                setErrorMessage('Camera is in use by another app.');
            } else if (err.name === 'TypeError' || err.message?.includes('secure')) {
                setErrorMessage('Camera requires HTTPS. Use localhost, ngrok, or tap Gallery to take a photo.');
            } else {
                setErrorMessage('Camera unavailable. Tap Gallery to take or select a photo.');
            }
        }
    }, []);

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            setErrorMessage('Failed to capture image. Please try again.');
            return;
        }

        setIsAnalyzing(true);
        setErrorMessage(null);

        try {
            const result = await ScannerService.analyzeImage(imageSrc);

            if (result.success) {
                const params = new URLSearchParams();
                params.set('result', JSON.stringify(result));
                router.push(`/scanner/ideas?${params.toString()}`);
            } else {
                setErrorMessage('Unable to analyze item. Please try again.');
            }
        } catch (err) {
            console.error('Scan error:', err);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [router]);

    // Auto-request camera on page load for better UX
    useEffect(() => {
        const hasAutoRequested = sessionStorage.getItem('cameraAutoRequested');

        if (cameraState === 'idle' && !hasAutoRequested) {
            sessionStorage.setItem('cameraAutoRequested', 'true');
            const timer = setTimeout(() => {
                requestCamera();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [requestCamera, cameraState]);

    useEffect(() => {
        setActions({
            label: 'Capture',
            onClick: capture,
            icon: 'camera',
            disabled: isAnalyzing || cameraState !== 'ready',
            loading: isAnalyzing,
            variant: 'primary'
        });

        return () => reset();
    }, [capture, isAnalyzing, cameraState, setActions, reset]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setErrorMessage(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const imageSrc = reader.result as string;
                const result = await ScannerService.analyzeImage(imageSrc);

                if (result.success) {
                    const params = new URLSearchParams();
                    params.set('result', JSON.stringify(result));
                    router.push(`/scanner/ideas?${params.toString()}`);
                } else {
                    setErrorMessage('Unable to analyze item. Please try again.');
                }
            } catch (err) {
                console.error('Scan error:', err);
                setErrorMessage('An error occurred. Please try again.');
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-[#f1f8f6] font-body text-[#29302f] antialiased min-h-screen overflow-x-hidden">
            <style jsx>{`
                .scan-line {
                    animation: scan 3s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .grid-overlay {
                    background-size: 40px 40px;
                    background-image: 
                        linear-gradient(to right, rgba(185, 249, 214, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(185, 249, 214, 0.1) 1px, transparent 1px);
                }
            `}</style>
            
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-[#f1f8f6]/80 backdrop-blur-xl shadow-[0px_40px_64px_-10px_rgba(41,48,47,0.06)] flex items-center justify-between px-6 h-16 max-w-md left-1/2 -translate-x-1/2">
                <button onClick={() => router.push('/')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#eaf2f0] transition-colors active:scale-95 duration-200 text-[#29664c]">
                    <span className="material-symbols-outlined whitespace-nowrap align-middle">arrow_back</span>
                </button>
                <h1 className="text-[#29664c] font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight uppercase">SCAN ITEM</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </header>

            <main className="min-h-screen pt-20 pb-32 px-6 flex flex-col items-center">
                {/* Main Camera Viewport */}
                <div className="relative w-full aspect-[3/4] max-w-md rounded-xl overflow-hidden bg-[#d4dfdd] shadow-[0px_40px_64px_-10px_rgba(41,48,47,0.12)]">
                    
                    {cameraState === 'ready' ? (
                        <WebcamCapture
                            ref={webcamRef}
                            onUserMediaError={() => {
                                setCameraState('error');
                                setErrorMessage('Camera stopped unexpectedly.');
                            }}
                            className="absolute inset-0 w-full h-full object-cover [&>video]:object-cover"
                        />
                    ) : (
                        <img 
                            className="w-full h-full object-cover grayscale-[20%] contrast-125" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2ZtgHxOaBSioWxz7Iy3yhIeCiCpdGu_XXpA5X-yuBVLzfLagVuXPDNVeBBEQkmtGreZm2_JXMkgKgPdM0I82FNhCAIOY9t6mQGu-y7fi_JALFsJgf-3_nQMFnFj738z9H-q1JrgXJV_jwdpBaXbO5iYm7gGz4xhcQEQoXMYneREg5NeW8juiP3u-PvPsYkOpZZd96LeXg0uep_osBiVnBKlH5SgCbDgxEtH6hrj44j3tidjdNv4JGIYSpAl5xwCpvb-BsHx_UlhQ" 
                            alt="Camera disabled placeholder"
                        />
                    )}

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 grid-overlay pointer-events-none"></div>

                    {/* Scanning Line */}
                    {!isAnalyzing && <div className="absolute left-0 right-0 h-[2px] bg-[#29664c] shadow-[0_0_15px_rgba(41,102,76,0.8)] scan-line z-10 pointer-events-none"></div>}

                    {/* Corner Brackets */}
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-[#29664c]/60 rounded-tl-sm pointer-events-none"></div>
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-[#29664c]/60 rounded-tr-sm pointer-events-none"></div>
                    <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-[#29664c]/60 rounded-bl-sm pointer-events-none"></div>
                    <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-[#29664c]/60 rounded-br-sm pointer-events-none"></div>
                    
                    {errorStateOverlay()}
                </div>

                {/* Feedback Pill */}
                <div className="mt-8 bg-[#ffffff] py-4 px-8 rounded-full shadow-[0px_40px_64px_-10px_rgba(41,48,47,0.06)] flex items-center gap-3 animate-pulse">
                    <span className="material-symbols-outlined text-[#29664c]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <span className="text-[#29302f] font-semibold text-sm tracking-wide">Tip: Hold steady</span>
                </div>

                {/* Capture Section */}
                <div className="mt-12 w-full max-w-md">
                    <button 
                        onClick={cameraState === 'ready' ? capture : requestCamera}
                        disabled={isAnalyzing}
                        className="group w-full bg-[#29664c] py-6 rounded-xl flex items-center justify-center gap-4 transition-all duration-300 hover:bg-[#1b5a40] hover:-translate-y-1 active:scale-95 shadow-[0px_20px_40px_-12px_rgba(41,102,76,0.3)] disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[#c8ffe0] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                        <span className="text-[#c8ffe0] font-headline font-extrabold text-xl tracking-tight uppercase">
                            {cameraState === 'ready' ? (isAnalyzing ? 'ANALYZING...' : 'TAP TO CAPTURE') : 'START CAMERA'}
                        </span>
                    </button>

                    {/* Secondary Controls */}
                    <div className="mt-8 flex justify-center items-center gap-8 text-[#29302f]/40">
                        <div className="flex flex-col items-center gap-2">
                            <button className="w-12 h-12 rounded-full bg-[#e1eae8] flex items-center justify-center hover:bg-[#dbe5e2] transition-colors text-inherit">
                                <span className="material-symbols-outlined">flash_off</span>
                            </button>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#29302f]/60">Flash</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <button className="w-12 h-12 rounded-full bg-[#e1eae8] flex items-center justify-center hover:bg-[#dbe5e2] transition-colors text-[#29664c]">
                                <span className="material-symbols-outlined">filter_center_focus</span>
                            </button>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#29664c]">Auto</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-full bg-[#e1eae8] flex items-center justify-center hover:bg-[#dbe5e2] transition-colors text-inherit">
                                <span className="material-symbols-outlined">image</span>
                            </button>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#29302f]/60">Gallery</span>
                        </div>
                    </div>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </main>

            {/* Scanning Overlay */}
            {isAnalyzing && <ScanningOverlay />}
            
            <MissionCompleteToast
                mission={completedMission}
                onClose={() => setCompletedMission(null)}
            />
        </div>
    );

    function errorStateOverlay() {
        if (cameraState === 'ready' && !errorMessage) return null;
        if (cameraState === 'idle') return null;
        if (cameraState === 'requesting') {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
                    <div className="w-12 h-12 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white font-bold uppercase tracking-wider">Requesting access...</p>
                </div>
            );
        }

        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/70 z-20">
                <span className="material-symbols-outlined text-5xl text-[#fb5151] mb-2">videocam_off</span>
                <p className="text-white text-sm mb-4 font-bold">{errorMessage || 'Camera Unavailable'}</p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-[#29664c] text-white font-bold rounded-full active:scale-95 transition-all"
                >
                    Use Gallery
                </button>
            </div>
        );
    }
}
