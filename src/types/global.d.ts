declare global {
    interface Window {
        puter?: {
            ai?: {
                chat: (prompt: string) => Promise<string>;
            };
        };
    }
}

export {};