if (process.cwd().split('/').pop() !== 'dist') {
    process.chdir('dist');
}

import { App } from "./controllers/Keystone";
import * as fs from 'fs';
import { apiRouter } from "./routes";
import { runTasks } from "./tasks";

App.initialize().then(async () => {
    const models = fs.readdirSync('./models');
    for (const model of models.filter(m => m.endsWith('.js'))) {
        await import(`./models/${model}`);
    }
    App.loadModels();
    App.app.use(apiRouter);
    await App.start();
    runTasks();
});

process.on('SIGINT', () => {
    console.log("Caught interrupt signal");
    process.exit();
});

process.on('SIGTERM', () => {
    console.log("Caught interrupt signal");
    process.exit();
});