import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                events: resolve(__dirname, 'events.html'),
                tournaments: resolve(__dirname, 'tournaments.html'),
                workshops: resolve(__dirname, 'workshops.html'),
                gamedev: resolve(__dirname, 'gamedev.html'),
                event_briefing: resolve(__dirname, 'event_briefing.html'),
                deploy_squad: resolve(__dirname, 'deploy_squad.html'),
                roster_fps: resolve(__dirname, 'roster_fps.html'),
                roster_moba: resolve(__dirname, 'roster_moba.html'),
                roster_racing: resolve(__dirname, 'roster_racing.html'),
                roster_strategy: resolve(__dirname, 'roster_strategy.html'),
            },
        },
    },
});
