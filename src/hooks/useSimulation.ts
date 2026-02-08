"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type SimulationParams, type SimulationStats } from "@/lib/quant/engine";
import { debounce } from "lodash";

interface UseSimulationProps {
    params: SimulationParams;
}

interface UseSimulationReturn {
    result: SimulationStats | null;
    isCalculating: boolean;
    error: string | null;
}

export function useSimulation({ params }: UseSimulationProps): UseSimulationReturn {
    const [result, setResult] = useState<SimulationStats | null>(null);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Worker
        workerRef.current = new Worker(new URL("../workers/simulation.worker.ts", import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, payload } = event.data;

            if (type === "SUCCESS") {
                setResult(payload);
                setError(null);
            } else if (type === "ERROR") {
                setError(payload);
            }

            setIsCalculating(false);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    // Debounced Simulation Trigger
    const runSimulation = useCallback(
        debounce((currentParams: SimulationParams) => {
            if (!workerRef.current) return;

            setIsCalculating(true);
            // Post message to worker
            workerRef.current.postMessage(currentParams);
        }, 200),
        []
    );

    // Trigger whenever params change
    useEffect(() => {
        runSimulation(params);

        // Cleanup debounce on unmount is tricky inside useEffect, 
        // but runSimulation.cancel() can be called if needed.
        return () => {
            runSimulation.cancel();
        };
    }, [params, runSimulation]);

    return { result, isCalculating, error };
}
