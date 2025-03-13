import { BlocksProvider } from "./views/blocks";
import { CustomProvider } from "./views/custom";

declare global {
    var blocksViewProvider: BlocksProvider;
    var customViewProvider: CustomProvider;
}

export { };

