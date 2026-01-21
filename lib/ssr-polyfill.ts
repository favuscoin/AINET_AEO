/**
 * This file polyfills browser globals that might be accessed during Server Side Rendering (SSR).
 * It should be imported at the very top of entry point files like layout.tsx.
 */

if (typeof window === 'undefined') {
    console.log('[SSR-POLYFILL] Initializing localStorage polyfill');

    const mockStorage = {
        getItem: (key: string) => {
            // console.log(`[SSR] localStorage.getItem('${key}')`);
            return null;
        },
        setItem: (key: string, value: string) => {
            // console.log(`[SSR] localStorage.setItem('${key}', '${value}')`);
        },
        removeItem: (key: string) => {
            // console.log(`[SSR] localStorage.removeItem('${key}')`);
        },
        clear: () => {
            // console.log('[SSR] localStorage.clear()');
        },
        length: 0,
        key: (index: number) => {
            // console.log(`[SSR] localStorage.key(${index})`);
            return null;
        },
    };

    // Define on global and globalThis
    try {
        // We set it on global and globalThis so it's available as a global variable
        // but we do NOT mock 'window' itself as that causes more issues with location, etc.
        (global as any).localStorage = mockStorage;
        (globalThis as any).localStorage = mockStorage;

        console.log('[SSR-POLYFILL] localStorage polyfill initialized');
    } catch (e) {
        console.error('[SSR-POLYFILL] Failed to define localStorage', e);
    }
}

export { };
