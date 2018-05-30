/*
import {addPlayer} from './reducers/game/players';
import {addFaction} from './reducers/game/factions';
import {addPlayerToFaction} from './reducers/game/factionPlayer';
import {addSystem} from './reducers/game/systems';
import {addSystemBody} from './reducers/game/systemBodies';
import {addSystemToFaction} from './reducers/game/factionSystem';
import {addSystemBodyToFaction} from './reducers/game/factionSystemBody';
import {setControlledFaction, tick} from './reducers/ui';
import {setTime, advanceTime} from './reducers/game';

import OrbitTypes from './consts/OrbitTypes';
import SystemBodyTypes from './consts/SystemBodyTypes';

import {orbitPeriod} from './helpers/Physics';
import {keyOf} from './helpers/Object';
import {volumeOfSphere} from './helpers/Maths';

import systems from './data/systems';
*/
import FactionPlayerTypes from './consts/FactionPlayerTypes';

const worldDefinition = {
  startDate: '2000-01-01T00:00:00',
  factions: [{
    name: 'Humans',
    //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
    //currently only known systems supported
    startingSystems: {
      sol: {
        type: 'known',
        name: 'Sol',
        //factionName: 'Crazytown',
        /*nameMap: {
          Earth: 'Bumhole 1'
        }*/
      }
    },
    startingColonies: [{
      system: 'sol',//ID from systemsSystems object (the key)
      body: 'Earth',//body ID (what if random?)
      population: 10000000000,
      //TODO
      //money, structures, minerals, fuel, technology, etc
    }]
  }],

  players: [
    {
      name: 'Billy',
      faction: 'Humans',
      role: FactionPlayerTypes.OWNER
    }
  ],

  //To be implemented
  //system generation properties
  numSystems: 10,
  wrecks: 0.1,
  ruins: 0.02,

  //threats
  swarmers: 0.1,
  invaders: 0.1,//probably will be more fine-tuned
  sentinels: 0.1,

};



import * as connector from './client/workerClient';

export function tempInitGameState(startGameCallback) {
  connector.initialise(() => {
    connector.createWorld(worldDefinition);

    //startGameCallback();
  });
}

/*
import importedAsteroids from './importAsteroids';

console.log(JSON.stringify(importedAsteroids, null, 2));
debugger;
*/

/*
export function tempInitGameState(store) {
  let systemId = 0;
  let bodyId = 0;

  //create human faction
  store.dispatch(addPlayer(1, {name: 'Ian'}));
  store.dispatch(addFaction(1, {name: 'human'}));
  store.dispatch(addPlayerToFaction(1, 1, FactionPlayerTypes.OWNER))

  //create martian faction
  store.dispatch(addPlayer(2, {name: 'Dave'}));
  store.dispatch(addFaction(2, {name: 'martian'}));
  store.dispatch(addPlayerToFaction(2, 2, FactionPlayerTypes.OWNER));

  store.dispatch(setControlledFaction(1));

  //Initialise the worker
  client.initialise(() => {
    console.log('client initialised');
  });
  //End worker

  const factionIdByName = {
    human: '1',
    martian: '2'
  };

  const factionStartingColonies = {};

  systems.forEach((system, index) => {
    systemId++;//increment system ID
    const primaryBodyId = bodyId + 1;
    const nameToId = {};
    const systemBodiesData = {};
    const factionsAwareOfSystem = {};
    const systemBodiesFactionData = {};


    const parseSystemBody = (body) => {
      let {name, parent, startingColony, factionNames, ...data} = body;
      //get parent ID
      const parentId = body.parentId || (parent ? nameToId[parent] : null);
      const factionsAwareOfSystemBody = {};

      if(body.type === 'asteroidBelt') {
        const asteroids = makeAsteroidBelt(parentId, body);

        asteroids.forEach(parseSystemBody);

        return;
      }

      //Create data object
      systemBodiesData[++bodyId] = {
        ...data,
        parentId,
        children: [],
        systemId: systemId.toString(),
        orbit: data.orbit ? normaliseOrbit(data.orbit, data, systemBodiesData[parentId]) : null
      };

      //add to parents children list (if appropriate)
      if(parentId) {
        systemBodiesData[parentId].children.push(bodyId.toString());
      }

      //record name in lookup table
      nameToId[name] = bodyId.toString();

      if(startingColony) {
        startingColony.forEach(factionName => {
          const factionId = factionIdByName[factionName];

          //record that this is the home planet for this faction (create colony here)
          factionStartingColonies[factionId] = bodyId;

          //get system name
          factionsAwareOfSystem[factionId] = {
            name: (system.factionNames && system.factionNames[factionName]) || system.name
          };
        });
      }

      //Record names (and other faction specific data) of system bodies
      systemBodiesFactionData[bodyId] = {
        name,
        factionNames
      }
    };//end parse body

    system.bodies.forEach(parseSystemBody);

    //Actually add system bodies to store
    Object.keys(systemBodiesData).forEach(systemBodyId => {
      store.dispatch(addSystemBody(systemBodyId, systemBodiesData[systemBodyId]));
    });

    //Then add the system to the store
    store.dispatch(addSystem(systemId, {}));

    //Link known systems to factions
    Object.keys(factionsAwareOfSystem).forEach(factionId => {
      const factionName = keyOf(factionIdByName, factionId);

      store.dispatch(addSystemToFaction(systemId, factionId, factionsAwareOfSystem[factionId]));

      //Then link system bodies to factions
      Object.keys(systemBodiesFactionData).forEach(systemBodyId => {
        const systemBodyFactionData = systemBodiesFactionData[systemBodyId];

        store.dispatch(addSystemBodyToFaction(systemBodyId, factionId, {
          name: (systemBodyFactionData.factionNames && systemBodyFactionData.factionNames[factionName]) || systemBodyFactionData.name
        }));
      });
    });
  });//End for each system

  //Set initial game time
  store.dispatch(setTime(new Date('2100-01-01T00:00:00').valueOf() / 1000));

  //TEMP start timer running to update time
  setInterval(() => {
    store.dispatch(advanceTime(3600));
  }, (1000/60) * 1);

  setInterval(() => {
    store.dispatch(tick());
  }, (1000/60) * 1);
}

function normaliseOrbit(orbit, systemBody, systemBodyParent) {
  switch(orbit.type) {
    case OrbitTypes.REGULAR:
      return {
        ...orbit,
        minRadius: orbit.radius,
        maxRadius: orbit.radius,
        period: orbitPeriod(orbit.radius, systemBody, systemBodyParent)
      };
  }

  return orbit;
}




import {random} from './helpers/Maths';
import {mapObj} from './helpers/Object';
import {randomString} from './helpers/String';


function makeAsteroidBelt(parentId, {
  minOrbitRadius,
  maxOrbitRadius,
  minNumber,
  maxNumber,
  minRadius,
  maxRadius,
  cTypeWeight,
  sTypeWeight,
  mTypeWeight,
  nameProps,
  factionNameProps
}) {
  const cTypeDensity = [1380*0.9, 1380*1.1];//1.38//g/cm3
  const sTypeDensity = [2710*0.9, 2710*1.1];//2.71//g/cm3
  const mTypeDensity = [5320*0.9, 5320*1.1];//5.32//g/cm3

  const cTypeAlbedo = [0.03, 0.1];
  const sTypeAlbedo = [0.1, 0.22];
  const mTypeAlbedo = [0.1, 0.2];

  const totalWeight = cTypeWeight + sTypeWeight + mTypeWeight;

  const number = getNumberInRange(minNumber, maxNumber, 1);

  const asteroids = [];

  for(let i = 0; i < number; i++) {
    let orbitRadius = getNumberInRange(minOrbitRadius, maxOrbitRadius);
    let radius = getNumberInRange(minRadius, maxRadius, 2);//tend towards small asteroids
    let volume = volumeOfSphere(radius);
    let density, mass, albedo, asteroidType, asteroidTypeRand = Math.random() * totalWeight;

    if(asteroidTypeRand < cTypeWeight) {
      //is a cType
      density = getNumberInRange(cTypeDensity);
      albedo = getNumberInRange(cTypeAlbedo);
    } else if(asteroidTypeRand < cTypeWeight + sTypeWeight) {
      //is an s type
      density = getNumberInRange(sTypeDensity);
      albedo = getNumberInRange(sTypeAlbedo);
    } else {
      //is an m type
      density = getNumberInRange(mTypeDensity);
      albedo = getNumberInRange(mTypeAlbedo);
    }

    mass = volume * density;

    let asteroid = {
      type: SystemBodyTypes.ASTEROID,
      parentId,
      radius,
      mass,
      density,
      albedo,

      day: 1000,

      orbit: {
        type: OrbitTypes.REGULAR,
        radius: orbitRadius,
        offset: Math.random()
      }
    };

    asteroid.name = generateAsteroidName(nameProps, asteroid),
    asteroid.factionNames = mapObj(factionNameProps, (nameProps, factionName) => {
      return generateAsteroidName(nameProps, asteroid);
    });

    asteroids.push(asteroid);
  }

  //sort into radius order
  asteroids.sort((a, b) => {
    return a.orbit.radius - b.orbit.radius;
  });

  return asteroids;
}

function generateAsteroidName(nameProps, asteroid) {
  //TODO be better than this...
  switch(nameProps.system) {
    case 'sol':
      return random(1975, 2005, 0) + randomString(2, 'ABCDEFGHJKLMNOPQRSTUVWXYZ');
    default:
      return (nameProps.prefix || '') + Math.round(Math.random() * 1000000) + ('' + nameProps.suffix);
  }

}

function getNumberInRange(a, b, distribution = 1) {
  if(a instanceof Array) {
    b = a[1];
    a = a[0];
  }

  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const random = Math.pow(Math.random(), distribution);

  return min + ((max - min) * random);
}
*/
