import { MonteCarloSimulator, SimulationParams } from "../lib/quant/engine";

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<SimulationParams>) => {
    const params = event.data;

    try {
        const simulator = new MonteCarloSimulator(params);
        const result = simulator.runBatch();

        // Send result back to main thread
        self.postMessage({ type: "SUCCESS", payload: result });
    } catch (error) {
        self.postMessage({
            type: "ERROR",
            payload: error instanceof Error ? error.message : "Unknown simulation error"
        });
    }
};
