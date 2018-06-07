import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cityStyles.css";

import $ from "jquery";
//window.jQuery = $;
//window.$ = $;
import * as THREE from "three";
import { BaseApp } from "./baseApp";
import { SceneConfig } from "./sceneConfig";
import Data from "../data/forest.json";
import { SpriteManager } from "./spriteManager";

let ControlKit = require("controlkit");

class Framework extends BaseApp {
    constructor() {
        super();

        this.appRunning = false;
        this.currentTeam = 0;
        this.animating = false;
        this.animationEnded = true;
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

        let textureLoader = new THREE.TextureLoader();
        let logoTexture = textureLoader.load("../images/forest.png");

        //Create results geometry
        this.createResultsGeometry();

        //Add sprites
        let spritePosition = new THREE.Vector3(SceneConfig.teamStart.x, SceneConfig.teamStart.y, SceneConfig.teamStart.z);
        let spriteManager = new SpriteManager();
        let spriteAttributes = {
            map: logoTexture,
            repeatX: 1,
            repeatY: 1,
            offsetX: 0,
            offsetY: 0,
            name: "Forest",
            spritePosition: spritePosition,
            spriteScale: new THREE.Vector3(10, 10, 1)
        };

        let logo;
        for(let i=0; i<this.numTeams; ++i) {
            spriteAttributes.spritePosition.y = this.teamHeights[i] + 5;
            spriteAttributes.spritePosition.z = SceneConfig.teamStart.z + (SceneConfig.teamInc * i);
            logo = spriteManager.create(spriteAttributes);
            this.root.add(logo);
        }

        //Add ground plane
        this.addGround();
    }

    createResultsGeometry() {
        let teamGeom = new THREE.CylinderBufferGeometry(SceneConfig.radius, SceneConfig.radius, SceneConfig.winHeight, SceneConfig.segments);
        let teamMats = [new THREE.MeshLambertMaterial({color: SceneConfig.loseColour}),
            new THREE.MeshLambertMaterial({color: SceneConfig.drawColour}),
            new THREE.MeshLambertMaterial({color: SceneConfig.winColour})];
        let teamMesh;
        let teamPosition = SceneConfig.teamStart;
        let team, result, teamColumns=[], teamHeights=[];
        let numTeams = Data.length;
        for(let i=0; i<numTeams; ++i) {
            team = Data[i];
            result = this.getResult(team);
            if(result === undefined) {
                console.log("Couldn't get result!");
                continue;
            }
            teamMesh = new THREE.Mesh(teamGeom, teamMats[result]);
            teamColumns.push(teamMesh);
            teamMesh.position.set(teamPosition.x, -SceneConfig.winHeight/2, teamPosition.z + (SceneConfig.teamInc * i));
            teamHeights.push(SceneConfig.resultOffset[result]);
            this.root.add(teamMesh);
        }

        this.numTeams = numTeams;
        this.teamColumns = teamColumns;
        this.teamHeights = teamHeights;
        this.animating = true;
    }

    getResult(team) {
        //Get result from this record
        let result = team[SceneConfig.RESULT];
        switch (result) {
            case "W":
                result = 2;
                break;
            case "D":
                result = 1;
                break;
            case "L":
                result = 0;
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
        let groundGeom = new THREE.PlaneBufferGeometry(SceneConfig.GroundWidth, SceneConfig.GroundHeight, SceneConfig.GroundSegments, SceneConfig.GroundSegments);
        let groundMat = new THREE.MeshLambertMaterial({color: 0xcdcdcd});
        let ground = new THREE.Mesh(groundGeom, groundMat);
        ground.name = "Ground";
        ground.rotation.x = -Math.PI / 2;
        this.root.add(ground);
    }

    update() {
        super.update();
        let delta = this.clock.getDelta();

        //Perform any animation
        if(this.animating) {
            if(this.animationEnded) {
                //Animate next result
                this.animationEnded = false;
                if(this.currentTeam >= this.numTeams) {
                    this.animating = false;
                }
            }
            else {
                let teamColumn = this.teamColumns[this.currentTeam];
                let deltaHeight = this.teamHeights[this.currentTeam];
                let realHeight = -SceneConfig.winHeight/2 + deltaHeight;
                teamColumn.position.y += delta/SceneConfig.animationTime * deltaHeight;
                if(teamColumn.position.y >= realHeight) {
                    teamColumn.position.y = realHeight;
                    this.animationEnded = true;
                    ++this.currentTeam;
                }
            }
        }
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
