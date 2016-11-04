import { 
    Button,
    ButtonBehavior 
} from 'buttons';

import Pins from "pins";
let remotePins;


// Skins & Templates
let graySkin = new Skin({ fill: 'gray' });
let appSkin = new Skin({ fill: '#B3FF99' });
let topSkin = new Skin({ fill: '#66cc66' });
let buttonStyle = new Style({font: '22px', color: 'black'});
let blackText = new Style({ font: "bold 32px segoe script", color: "black" });
let blackText2 = new Style({ font: "bold 24px arial", color: "black" });
let titleText = new Style({ font: "bold 48px segoe script", color: "white" });

let button = Button.template($ => ({
    top: $.top, bottom: $.bottom, left: $.left, right: $.right,
    contents: [
        Label($, {left: 0, right: 0, height: 55, string: $.textForLabel, style: blackText})
    ],
    Behavior: class extends ButtonBehavior {
        onTap(button){
        trace("Button was tapped.\n");
		}	
    }
}));

var StringTemplate = Text.template($ => ({
    left: 10, right: 10, top: 10, bottom: 0,
    style: $.style,
    string: $.string
}));

let img = new Texture("assets/lucky.png");
let imgSkin = new Skin({
	width:200, height: 120, texture: img, fill: "white"});
let catpic = new Content({
	top: 0, left: 0, height: 120, width: 200,
	skin: imgSkin
});




// Buttons
let hungerSensor = new button({ top: 10, bottom: 10, left: 20, right: 20, textForLabel: "Hunger Sensor"});
hungerSensor.behavior = 
	Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            remotePins.invoke("/led1/read", function(result) {
               application.remove(application.first);
               if (result) {
                  trace("Hunger Sensor reads: Kitty is not hungry.\n");
                  application.add(notHungryScreen);
               } else {
                  trace("Hunger Sensor reads: Kitty is hungry.\n");
                  application.add(hungryScreen);
               }
            });
        }
    });
    
let feedButton = new button({ top: 10, bottom: 10, left: 20, right: 20, textForLabel: "Feed Kitty"});
feedButton.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            remotePins.invoke("/led1/read", function(result) {
                application.remove(application.first);
                if (result) {
                    trace("Kitty is not hungry.\n");
                    application.add(notHungryScreen);
                } else {
                    trace("Kitty has been fed.\n");
                    remotePins.invoke("/led1/write", 1);
                    application.add(fedScreen);
                }
            });
        }
    });
    
let waterButton = new button({ top: 10, bottom: 10, left: 20, right: 20, textForLabel: "Set Water"});
waterButton.behavior = 
	Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            remotePins.invoke("/led2/read", function(result) {
               application.remove(application.first);
               if (result) {
                  trace("Water bowl is already full.\n");
                  application.add(notWateredScreen);
               } else {
                  trace("Water bowl has been filled.\n");
                  remotePins.invoke("/led2/write", 1);
                  application.add(wateredScreen);
               }
            });
        }
    });
    
let homeButton = new button({ top: 40, bottom: 20, left: 20, right: 120, textForLabel: "Back"});
homeButton.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(homeScreen);
        }
    }); 
    
    
// For some reason, containers can't have multiple instances of the same button.
let homeButton2 = new button({ top: 200, bottom: 20, left: 20, right: 120, textForLabel: "Done"});
homeButton2.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    });    
    
let homeButton3 = new button({ top: 150, bottom: 20, left: 20, right: 120, textForLabel: "Back"});
homeButton3.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    });
    
let homeButton4 = new button({ top: 200, bottom: 20, left: 20, right: 120, textForLabel: "Back"});
homeButton4.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    });
    
let homeButton5 = new button({ top: 150, bottom: 20, left: 20, right: 120, textForLabel: "Done"});
homeButton5.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    });
    
let homeButton6 = new button({ top: 200, bottom: 20, left: 20, right: 120, textForLabel: "Back"});
homeButton6.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    });
    
let foodButton = new button({ top: 20, bottom: 20, left: 20, right: 20, textForLabel: "Food & Water"});
foodButton.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(foodScreen);
        }
    }); 
    
    



// Screens
let homeScreen = new Column({
    name: 'homeScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
    	new Container({
    		left: 0, right:0, top: 0, bottom: 10, skin: topSkin,
    		contents: [new StringTemplate({ string: 'KitteGarden', style: titleText })] 
    	}),
    	new Column({
    		left: 20, right: 20, top: 10, bottom: 0, 
    		contents: [ catpic,
    			new StringTemplate({ string: 'Lucky the Kitty', style: blackText }) ]
    	}),
    	foodButton
    ]
});

let foodScreen = new Column({
    name: 'foodScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
    	hungerSensor, feedButton, waterButton, homeButton
    ]
});

let fedScreen = new Column({
	name: 'fedScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty has just been fed!', style: blackText }),
        homeButton2
    ]    
});

let notHungryScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty is not hungry and does not need to be fed.', style: blackText }),
        homeButton3
    ]
});

let hungryScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty is hungry and needs to be fed.', style: blackText }),
        homeButton4
    ]
});

let wateredScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty\'s water bowl has been filled!', style: blackText }),
        homeButton5
    ]
});

let notWateredScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty\'s water bowl is still full.', style: blackText }),
        homeButton6
    ]
});

class AppBehavior extends Behavior {
    onLaunch(application) {
        application.add(homeScreen);
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "kittegarden-pins") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                }
            }, 
            connectionDesc => {
                if (connectionDesc.name == "kittegarden-pins") {
                    trace("Disconnected from remote pins\n");
                    remotePins = undefined;
                }
            }
        );
    }
    onToggleLight(application, value) {
        if (remotePins) remotePins.invoke("/led1/write", value);
        if (remotePins) remotePins.invoke("/led2/write", value);
    }
}

application.behavior = new AppBehavior();