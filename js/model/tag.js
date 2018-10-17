import fs from 'fs';


class ColorTagImpl {
    constructor() {
        this.tags = JSON.parse(fs.readFileSync('asset/colorTag.json', 'utf8'));
    }
}


let _colorTag = null;
export class ColorTag {
    static inst() {
        if (_colorTag === null) {
            _colorTag = new ColorTagImpl();
        }

        return _colorTag;
    }
}
