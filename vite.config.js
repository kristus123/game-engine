import { defineConfig } from 'vite';

export default defineConfig({
	root: 'dist',
    server: {
        //hot: true,
        port: 5001,

        watch: {
            usePolling: true, // Ensures Vite watches the transpiler output properly
        },
    }
});
