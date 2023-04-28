import { defineConfig, Plugin, UserConfig } from "vite";
import * as path from "path";

export default defineConfig(({ mode }) => {
    const port: number = parseInt(process.env.APP_PORT || "8000");

    const plugins: (Plugin | Plugin[])[] = [];

    const defaultOptions: UserConfig = {
        base: "/",
        plugins,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        server: {
            host: true,
            port
        },
        build: {
            terserOptions: {
                compress: {
                    // 生产环境时移除console
                    drop_console: true,
                    drop_debugger: true,
                }
            }
        }
    };

    return {
        ...defaultOptions
    };
});
