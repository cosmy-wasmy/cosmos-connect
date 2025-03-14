import { Environment } from "./utils/configuration";
import { BlocksProvider } from "./views/blocks";
import { CustomProvider } from "./views/custom";

declare global {
    var environment: Environment;
    var blocksViewProvider: BlocksProvider;
    var customViewProvider: CustomProvider;
}

export { };

