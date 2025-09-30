import { useState, useRef, useCallback } from 'react';

export const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(audioUrl);
                stream.getTracks().forEach(track => track.stop()); // Stop mic access
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            alert("Microphone access was denied. Please allow microphone access in your browser settings to use the recording feature.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    return { isRecording, recordedAudioUrl, startRecording, stopRecording };
};
