// connectedSofaComp.js

// Not 100% yet, but works well

import { BlockPermutation } from "@minecraft/server"

const addonNamespace = 'unusual_furniture';
const SOFA_CONNECT_TAG = 'unusual_furniture:sofa';

const OPPOSITE = { north: 'south', east: 'west', south: 'north', west: 'east' };
const LEFT_OF = { north: 'west', west: 'south', south: 'east', east: 'north' };
const RIGHT_OF = { north: 'east', east: 'south', south: 'west', west: 'north' };
const CARDINALS = ['north', 'east', 'south', 'west'];

function getNearbyCardinalBlocks(block) {
  return {
    north: block.north(),
    east: block.east(),
    south: block.south(),
    west: block.west(),
  };
}

function getConnectionState(centerRot, neighbors, typeId) {
  const frontDir = centerRot;
  const backDir = OPPOSITE[centerRot];
  const leftDir = LEFT_OF[centerRot];
  const rightDir = RIGHT_OF[centerRot];

  const front = neighbors[frontDir];
  const back = neighbors[backDir];
  const left = neighbors[leftDir];
  const right = neighbors[rightDir];

  const frontConnected = front && (front.typeId === typeId || front.hasTag(SOFA_CONNECT_TAG));
  const backConnected = back && (back.typeId === typeId || back.hasTag(SOFA_CONNECT_TAG));
  const leftConnected = left && (left.typeId === typeId || left.hasTag(SOFA_CONNECT_TAG));
  const rightConnected = right && (right.typeId === typeId || right.hasTag(SOFA_CONNECT_TAG));

  // Orden de esquinas corregido
  if (frontConnected && rightConnected) return "corner_inner_left";
  if (frontConnected && leftConnected) return "corner_inner_right";
  if (backConnected && leftConnected) return "corner_outer_left";
  if (backConnected && rightConnected) return "corner_outer_right";

  if (leftConnected && rightConnected) return "middle";
  if (leftConnected) return "right";
  if (rightConnected) return "left";

  return "single";
}

function updateConnectivity(centerBlock, centerTypeId, eventType) {
  const currentPerm = centerBlock.permutation;
  const centerRot = currentPerm.getState("minecraft:cardinal_direction");
  const nearby = getNearbyCardinalBlocks(centerBlock);

  if (eventType === 'placed') {
    const connectionState = getConnectionState(centerRot, nearby, centerTypeId);
    const newPerm = currentPerm.withState(`${addonNamespace}:connection`, connectionState);
    if (newPerm !== currentPerm) {
      centerBlock.setPermutation(newPerm);
    }
  }

  // Actualizar vecinos al colocar o romper
  for (const dir of CARDINALS) {
    const neighbor = nearby[dir];
    if (!neighbor) continue;
    if (neighbor.typeId !== centerTypeId && !neighbor.hasTag(SOFA_CONNECT_TAG)) continue;

    const neighborRot = neighbor.permutation.getState("minecraft:cardinal_direction");
    const neighborNearby = getNearbyCardinalBlocks(neighbor);
    const newState = getConnectionState(neighborRot, neighborNearby, centerTypeId);
    const newPerm = neighbor.permutation.withState(`${addonNamespace}:connection`, newState);
    if (newPerm !== neighbor.permutation) {
      neighbor.setPermutation(newPerm);
    }
  }
}

export const connectedSofaComp = {
  onPlace: ({ block }) => {
    updateConnectivity(block, block.typeId, 'placed');
  },
  onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
    updateConnectivity(block, destroyedBlockPermutation.type.id, 'break');
  }
};
