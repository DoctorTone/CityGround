//Class for creating and managing sprites

import { SpriteConfig } from "./spriteConfig";
import * as THREE from "three";

export class SpriteManager {
    constructor() {
        this.sprites = [];
    }

    create(spriteAttributes) {
        spriteAttributes.map.repeat.x = spriteAttributes.repeatX;
        spriteAttributes.map.repeat.y = spriteAttributes.repeatY;
        spriteAttributes.map.offset.x = spriteAttributes.offsetX;
        spriteAttributes.map.offset.y = spriteAttributes.offsetY;

        let spriteMap = new THREE.SpriteMaterial( {map: spriteAttributes.map});
        let logoSprite = new THREE.Sprite(spriteMap);
        logoSprite.name = spriteAttributes.name;
        logoSprite.position.copy(spriteAttributes.spritePosition);
        logoSprite.scale.copy(spriteAttributes.spriteScale);
        this.sprites.push(logoSprite);

        return logoSprite;
    }

    getSpriteByName(name) {
        for(let i=0, numSprites=this.sprites.length; i<numSprites; ++i) {
            if(this.sprites[i].name === name) {
                return this.sprites[i];
            }
        }

        return undefined;
    }
}