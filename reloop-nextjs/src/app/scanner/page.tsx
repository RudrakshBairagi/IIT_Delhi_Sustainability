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
            // Check if camera API is available (requires secure context)
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraState('denied');
                setErrorMessage('Camera requires HTTPS. Tap Gallery to take a photo instead.');
                return;
            }

            // Explicitly request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            // Stop the test stream - Webcam component will request its own
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
                // HTTPS requirement - provide helpful alternatives
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
                // In a real app, the backend would return if a mission was completed
                // For now, we just redirect to results
                const params = new URLSearchParams();
                params.set('result', JSON.stringify(result));
                router.push(`/scanner/results?${params.toString()}`);
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

    // Register nav action for capture
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
                    router.push(`/scanner/results?${params.toString()}`);
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
        <div className="min-h-screen bg-dark flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-dark text-white z-10">
                <Link
                    href="/"
                    className="w-10 h-10 flex items-center justify-center bg-dark-surface rounded-xl border border-white/10"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </Link>
                <h1 className="font-black uppercase tracking-wider text-white">Scan Item</h1>
                <div className="w-10 h-10 flex items-center justify-center bg-dark-surface rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-xl">flash_on</span>
                </div>
            </header>

            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden mx-4 my-2 rounded-3xl border-2 border-white/20 bg-dark-surface">
                {/* Idle State - Show Start Button */}
                {cameraState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary">photo_camera</span>
                        </div>
                        <h2 className="text-white font-bold text-lg mb-2">Ready to Scan</h2>
                        <p className="text-white/60 text-sm mb-6">Tap below to start the camera and scan items</p>
                        <button
                            onClick={requestCamera}
                            className="px-8 py-4 bg-primary text-dark font-bold rounded-2xl shadow-brutal active:scale-95 transition-transform"
                        >
                            Start Camera
                        </button>
                    </div>
                )}

                {/* Requesting State */}
                {cameraState === 'requesting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-white/60 font-medium">Requesting camera access...</p>
                    </div>
                )}

                {/* Camera Ready - Show Webcam */}
                {cameraState === 'ready' && (
                    <>
                        <WebcamCapture
                            ref={webcamRef}
                            onUserMediaError={() => {
                                setCameraState('error');
                                setErrorMessage('Camera stopped unexpectedly.');
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Scan Frame */}
                        {!isAnalyzing && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-56 h-56 border-4 border-primary rounded-3xl relative">
                                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Error/Denied State */}
                {(cameraState === 'denied' || cameraState === 'error') && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 bg-card-coral/20 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-card-coral">videocam_off</span>
                        </div>
                        <h2 className="text-white font-bold text-lg mb-2">Camera Unavailable</h2>
                        <p className="text-white/60 text-sm mb-4 max-w-xs">{errorMessage}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={requestCamera}
                                className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-primary text-dark font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                Use Gallery
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message Toast */}
                {errorMessage && cameraState === 'ready' && (
                    <div className="absolute bottom-4 left-4 right-4 bg-card-coral text-dark p-4 rounded-2xl text-center font-bold border-2 border-dark z-30">
                        {errorMessage}
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-dark p-6 space-y-4">
                {/* Tips */}
                <p className="text-white/60 text-sm text-center">
                    {cameraState === 'ready'
                        ? 'Point camera at an item and tap Capture'
                        : 'Upload an image or start the camera to scan'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-dark-surface text-white py-3 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">photo_library</span>
                        Gallery
                    </button>
                    <button
                        onClick={() => router.push('/scanner/history')}
                        className="flex-1 bg-orange text-dark py-3 rounded-2xl font-bold border-2 border-dark flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">history</span>
                        History
                    </button>
                </div>
            </div>

            {/* Scanning Overlay */}
            {isAnalyzing && <ScanningOverlay />}

            {/* Mission Toast */}
            <MissionCompleteToast
                mission={completedMission}
                onClose={() => setCompletedMission(null)}
            />
        </div>
    );
}

