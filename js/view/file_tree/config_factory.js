import {MaterialConfig} from "./material_config";
import {ActorConfig} from "./actor_config";

export function createConfig(content) {
    if (content['type'] !== undefined) {
        switch (content['type']) {
            case 'Material':
                return new MaterialConfig();
            case 'Actor':
                return new ActorConfig();
        }
    }

    return new MaterialConfig();
}