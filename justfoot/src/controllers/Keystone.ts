import { Keystone } from '@keystonejs/keystone';
import { PasswordAuthStrategy } from '@keystonejs/auth-password';
import { GraphQLApp } from '@keystonejs/app-graphql';
import { AdminUIApp } from '@keystonejs/app-admin-ui';
import { MongooseAdapter } from '@keystonejs/adapter-mongoose';
import * as express from 'express';

export class App {
    public static keystone;
    public static app;

    public static async initialize() {
        const keystone = new Keystone({
            name: 'JustFoot',
            adapter: new MongooseAdapter()
        });

        this.app = express();
        this.keystone = keystone;
    }

    public static async loadModels() {

    }

    public static async start() {
        const authStrategy = this.keystone.createAuthStrategy({
            type: PasswordAuthStrategy,
            list: 'User'
        });

        const adminUiApp = new AdminUIApp({ authStrategy: process.env.DISABLE_AUTH === 'true' ? undefined : authStrategy });
        const graphQlApp = new GraphQLApp();

        const { middlewares } = await this.keystone
            .prepare({ apps: [graphQlApp, adminUiApp], dev: process.env.NODE_ENV !== 'production' })

        await this.keystone.connect();

        this.app.use(middlewares);
        this.app.listen(3000);
        console.log(`Server is running`);
    }
}