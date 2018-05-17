// General parameters to help with setting up scene

const SceneConfig = {
    clearColour: 0x5c5f64,
    ambientLightColour: 0x383838,
    pointLightColour: 0xffffff,
    CameraPos: {
        x: 230,
        y: 180,
        z: 430
    },
    LookAtPos: {
        x: 0,
        y: 0,
        z: 0
    },
    NEAR_PLANE: 0.1,
    FAR_PLANE: 10000,
    FOV: 45,
    radius: 5,
    winHeight: 15,
    winColour: 0x00ff00,
    teamStart: {
        x: 0,
        y: 15/2,
        z: -250
    },
    teamInc: 12,
    //Options
    SEASONS: "seasonsOption"
};

export { SceneConfig };