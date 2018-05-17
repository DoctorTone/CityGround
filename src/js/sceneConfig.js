// General parameters to help with setting up scene

const SceneConfig = {
    clearColour: 0x5c5f64,
    ambientLightColour: 0x383838,
    pointLightColour: 0xffffff,
    CameraPos: {
        x: 210,
        y: 75,
        z: 340
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
    segments: 16,
    winHeight: 45,
    drawHeight: 30,
    loseHeight: 15,
    winColour: 0x00ff00,
    drawColour: 0xffbf00,
    loseColour: 0xff0000,
    teamStart: {
        x: 0,
        y: 15/2,
        z: -250
    },
    teamInc: 12,
    RESULT: 6,
    resultOffset: [3, 17.5, 45],
    animationTime: 0.15,
    //Options
    SEASONS: "seasonsOption"
};

export { SceneConfig };