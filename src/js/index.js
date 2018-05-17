import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cityStyles.css";

import $ from "jquery";
//window.jQuery = $;
//window.$ = $;
import * as THREE from "three";
import { BaseApp } from "./baseApp";
import { SceneConfig } from "./sceneConfig";
import Data from "../data/forest.json";

let ControlKit = require("controlkit");

class Framework extends BaseApp {
    constructor() {
        super();

        this.appRunning = false;
    }

    setContainer(container) {
        this.container = container;
    }

    init(container) {
        super.init(container);
    }

    createScene() {
        //Init base createsScene
        super.createScene();

        //Create root object.
        this.root = new THREE.Object3D();
        this.addToScene(this.root);

        //Add ground plane
        this.addGround();

        let teamGeom = new THREE.CylinderBufferGeometry(SceneConfig.radius, SceneConfig.radius, SceneConfig.winHeight);
        let teamMats = [new THREE.MeshLambertMaterial({color: SceneConfig.winColour}),
            new THREE.MeshLambertMaterial({color: SceneConfig.drawColour}),
            new THREE.MeshLambertMaterial({color: SceneConfig.loseColour})];
        let teamMesh;
        let teamPosition = SceneConfig.teamStart;
        let team, result;
        for(let i=0, numMatches=Data.length; i<numMatches; ++i) {
            team = Data[i];
            result = this.getResult(team);
            if(result === undefined) {
                console.log("Couldn't get result!");
                continue;
            }
            teamMesh = new THREE.Mesh(teamGeom, teamMats[result]);
            teamMesh.position.set(teamPosition.x, teamPosition.y, teamPosition.z + (SceneConfig.teamInc * i));
            this.root.add(teamMesh);
        }

        //DEBUG
        //console.log("Forest data = ", Data);
    }

    getResult(team) {
        //Get result from this record
        let result = team[SceneConfig.RESULT];
        switch (result) {
            case "W":
                result = 0;
                break;
            case "D":
                result = 1;
                break;
            case "L":
                result = 2;
                break;
            default:
                result = undefined;
        }

        return result;
    }
    createGUI() {
        //Create GUI - controlKit
        window.addEventListener('load', () => {
            let appearanceConfig = {
                Back: '#5c5f64',
                Ground: '#0c245c',
                Block: '#fffb37'
            };

            let controlKit = new ControlKit();

            let defaultWidth = 200;

            controlKit.addPanel({label: "Configuration", width: defaultWidth, enable: false})
                .addSubGroup({label: "Appearance", enable: false})
                .addColor(appearanceConfig, "Back", {
                    colorMode: "hex", onChange: () => {
                        this.onBackgroundColourChanged(appearanceConfig.Back);
                    }
                })
                .addColor(appearanceConfig, "Ground", {
                    colorMode: "hex", onChange: () => {
                        this.onGroundColourChanged(appearanceConfig.Ground);
                    }
                })
        });
    }

    onBackgroundColourChanged(colour) {
        this.renderer.setClearColor(colour, 1.0);
    }

    onGroundColourChanged(colour) {
        let ground = this.getObjectByName('Ground');
        if (ground) {
            ground.material.color.setStyle(colour);
        }
    }

    addGround() {
        //Ground plane
        const GROUND_WIDTH = 1000, GROUND_HEIGHT = 640, SEGMENTS = 16;
        let groundGeom = new THREE.PlaneBufferGeometry(GROUND_WIDTH, GROUND_HEIGHT, SEGMENTS, SEGMENTS);
        let groundMat = new THREE.MeshLambertMaterial({color: 0xcdcdcd});
        let ground = new THREE.Mesh(groundGeom, groundMat);
        ground.name = "Ground";
        ground.rotation.x = -Math.PI / 2;
        this.root.add(ground);
    }

    update() {
        super.update();
        let delta = this.clock.getDelta();
        this.elapsedTime += delta;
    }

    hideAllOptions() {
        //Hide main options on page
        $("body > div").addClass("d-none");
    }

    showOption(option) {
        this.hideAllOptions();
        $('#'+option).removeClass("d-none");
    }

    showSeason(season) {
        this.hideAllOptions();
        $('#WebGL-output').removeClass("d-none");
    }

    refresh() {
        if(!this.appRunning) {
            if(!this.container) {
                console.log("No container set!");
                return;
            }
            this.init(this.container);
            //app.createGUI();
            this.createScene();

            this.run();
            this.appRunning = true;
        }
    }
}

$(document).ready( () => {

    let container = document.getElementById("WebGL-output");
    let app = new Framework();
    app.setContainer(container);

    //Options
    $('#seasons').on("click", () => {
        app.showOption(SceneConfig.SEASONS);
    });

    $("#season2018").on("click", () => {
        app.showSeason("season2018");
        app.refresh();
    });

});
