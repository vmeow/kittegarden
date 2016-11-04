import { 
    Button,
    ButtonBehavior 
} from 'buttons';

let Pins = require("pins");
 

// Skins & Templates
let redSkin = new Skin({ fill: '#ff0000' });
let greenSkin = new Skin({ fill: '#00ff00' });
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





class AppBehavior extends Behavior {
    onLaunch(application) {
        Pins.configure({
            led1: {
                require: "Digital",
                pins: {
                    ground: { pin: 51, type: "Ground" },
                    digital: { pin: 52, direction: "output" }
                }
            },
            led2: {
                require: "Digital",
                pins: {
                    ground: { pin: 53, type: "Ground" },
                    digital: { pin: 54, direction: "output" }
                }
            }
            }, function(success) {
           if (!success) trace("Failed to configure\n");
           else {
                application.add(homeScreen);
           }
        });
        Pins.share("ws", {zeroconf: true, name: "kittegarden-pins"});
    }
}
application.behavior = new AppBehavior();


// Buttons
let hungerLED = new button({ top: 0, bottom: 10, left: 10, right: 10, textForLabel: "Feed Kitty"});
hungerLED.behavior = 
	Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            Pins.invoke("/led1/read", function(result) {
               application.remove(application.first);
               if (result) {
                  trace("Hunger Sensor reads: Kitty is not hungry.\n");
                  application.add(notHungryScreen);
               } else {
                  trace("Hunger Sensor reads: Kitty is hungry and has been fed.\n");
                  Pins.invoke("/led1/write", 1);
                  application.add(fedScreen);
               }
            });
        }
    });
    
let waterLED = new button({ top: 10, bottom: 10, left: 10, right: 10, textForLabel: "Set Water for Kitty"});
waterLED.behavior = 
	Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            Pins.invoke("/led2/read", function(result) {
               application.remove(application.first);
               if (result) {
                  trace("Your kitty\'s water bowl is still full.");
                  application.add(notWateredScreen);
               } else {
                  trace("Your kitty\'s water bowl is now full.");
                  Pins.invoke("/led2/write", 1);
                  application.add(wateredScreen);
               }
            });
        }
    });

let homeButton = new button({ top: 120, bottom: 10, left: 10, right: 180, textForLabel: "Done"});
homeButton.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(homeScreen);
        }
    }); 
       
// For some reason, containers can't have multiple instances of the same button.
let homeButton2 = new button({ top: 120, bottom: 10, left: 10, right: 180, textForLabel: "Back"});
homeButton2.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(homeScreen);
        }
    });    
    
let homeButton3 = new button({ top: 120, bottom: 10, left: 10, right: 180, textForLabel: "Done"});
homeButton3.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(homeScreen);
        }
    });
    
let homeButton4 = new button({ top: 120, bottom: 10, left: 10, right: 180, textForLabel: "Back"});
homeButton4.behavior =
    Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            application.remove(application.first);
            application.add(homeScreen);
        }
    });
    
    


// Screens
let heading = new Container({
    		left: 0, right: 0, top: 0, bottom: 30, skin: topSkin,
    		contents: [new StringTemplate({ string: 'KitteGarden', style: titleText })] 
    	});

let hungerContainer = new Container({
    		left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    		contents: [hungerLED]
    	});
    		
let waterContainer = new Container({
    		left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    		contents: [waterLED]
    	});
    	
let homeScreen = new Column({
    name: 'homeScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
    	heading, hungerContainer, waterContainer
    ]
});

let fedScreen = new Column({
	name: 'fedScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty has just been fed!', style: blackText }),
        homeButton
    ]    
});

let notHungryScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty is not hungry and does not need to be fed.', style: blackText }),
        homeButton2
    ]
});

let wateredScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty\'s water bowl has been filled!', style: blackText }),
        homeButton3
    ]
});

let notWateredScreen = new Column({
    name: 'hungerScreen',
    left: 0, right: 0, top: 0, bottom: 0, skin: appSkin,
    contents: [
        new StringTemplate({ string: 'Your kitty\'s water bowl is still full.', style: blackText }),
        homeButton4
    ]
});


/** Unused, unworking alternates for LEDs
let hungry = new Container({
    		left: 200, right: 10, top: 0, bottom: 10, skin: redSkin,
    		contents: [new StringTemplate({ string: 'Hungry!', style: blackText2 })]
    	});
    	
let notHungry = new Container({
    		left: 200, right: 10, top: 0, bottom: 10, skin: greenSkin,
    		contents: [new StringTemplate({ string: 'Not Hungry', style: blackText2 })]
    	});
    	
let thirsty = new Container({
    		left: 200, right: 10, top: 10, bottom: 10, skin: redSkin,
    		contents: [new StringTemplate({ string: 'Thirsty!', style: blackText2 })]
    	});
    	
let notThirsty = new Container({
    		left: 200, right: 10, top: 10, bottom: 10, skin: greenSkin,
    		contents: [new StringTemplate({ string: 'Not Thirsty', style: blackText2 })]
    	});
**/