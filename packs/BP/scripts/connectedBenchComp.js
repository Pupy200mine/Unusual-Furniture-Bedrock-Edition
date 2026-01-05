// Used in naming states in blocks: 'cfm:north_direction' , etc.
const addonNamespace = 'unusual_furniture';

/**
 * Tag that allows other blocks to connect to this type of block.
 */
const PARK_BENCH_CONNECT_TAG = 'unusual_furniture:bench';

/**
 * Maps cardinal directions to their opposite directions.
 */
const OPPOSITE_CARDINAL_DIRECTIONS = {
    'north': 'south',
    'east': 'west',
    'south': 'north',
    'west': 'east'
};

// These are the directions for which connection and direction states are defined
const RELEVANT_DIRECTIONS = ['north', 'east', 'south', 'west'];

// IMPORTANT: This value ("none") MUST be a valid option in your block's JSON definition
// for all "_direction" states (e.g., "cfm:north_direction": ["north", ..., "none"])
const UNCONNECTED_DIRECTION_STATE = "none";

/**
 * Gets nearby blocks in cardinal directions.
 * @param {Block} block - The block.
 * @returns {object} - Nearby blocks indexed by direction, or empty object if block is null.
 */
function getNearbyCardinalBlocks(block) {
    if (!block) {
        return {};
    }
    return {
        'north': block.north(),
        'east': block.east(),
        'south': block.south(),
        'west': block.west()
    };
}

/**
 * Updates a single block's direction state for one specific direction.
 * @param {Block} targetBlock The block whose permutation will be updated.
 * @param {string} directionOnTarget The direction on the targetBlock being updated (e.g., "north").
 * @param {boolean} shouldConnect True if establishing a connection with a neighbor, false if breaking or no neighbor.
 * @param {string | undefined} [otherBlockRotation] The 'minecraft:cardinal_direction' of the other block if connecting.
 *                                                 Undefined if disconnecting or if other block has no rotation.
 */
function updateSingleBlockDirectionState(targetBlock, directionOnTarget, shouldConnect, otherBlockRotation) {
    let perm = targetBlock.permutation;
    const directionValueStateName = `${addonNamespace}:${directionOnTarget}_direction`;

    if (shouldConnect && otherBlockRotation) {
        perm = perm.withState(directionValueStateName, otherBlockRotation);
    } else {
        perm = perm.withState(directionValueStateName, UNCONNECTED_DIRECTION_STATE);
    }

    if (targetBlock.permutation !== perm) {
        targetBlock.setPermutation(perm);
    }
}

/**
 * Main update function for a block and its cardinal neighbors.
 * This function is called when a block is placed or destroyed.
 *
 * @param {Block} centerBlock - The block that was placed, or the Air block where a block was destroyed.
 * @param {string} centerBlockTypeId - The type.id of the block that was placed or destroyed.
 * @param {'placed' | 'break'} eventType - Indicates if the event was a block placement or destruction.
 */
function updateConnectivity(centerBlock, centerBlockTypeId, eventType) {
    const centerBlockRotation = (eventType === 'placed' && centerBlock.permutation)
        ? centerBlock.permutation.getState('minecraft:cardinal_direction')
        : null;

    const nearbyPotentialPartners = getNearbyCardinalBlocks(centerBlock);

    // 1. Update the centerBlock itself (only if it was 'placed')
    if (eventType === 'placed') {
        let centerBlockCurrentPerm = centerBlock.permutation;

        for (const dirToNeighbor of RELEVANT_DIRECTIONS) {
            const neighbor = nearbyPotentialPartners[dirToNeighbor];
            let neighborRotationForCenterBlock = UNCONNECTED_DIRECTION_STATE;

            if (neighbor) {
                const isSameTypeAsCenter = neighbor.typeId === centerBlockTypeId;
                const neighborHasConnectTag = neighbor.hasTag(PARK_BENCH_CONNECT_TAG);

                if (isSameTypeAsCenter || neighborHasConnectTag) {
                    const actualNeighborRotation = neighbor.permutation.getState('minecraft:cardinal_direction');
                    if (actualNeighborRotation) {
                        neighborRotationForCenterBlock = actualNeighborRotation;
                    }
                }
            }
            centerBlockCurrentPerm = centerBlockCurrentPerm.withState(`${addonNamespace}:${dirToNeighbor}_direction`, neighborRotationForCenterBlock);
        }

        if (centerBlock.permutation !== centerBlockCurrentPerm) {
            centerBlock.setPermutation(centerBlockCurrentPerm);
        }
    }

    // 2. Update all relevant neighbors
    for (const dirToNeighbor of RELEVANT_DIRECTIONS) {
        const neighbor = nearbyPotentialPartners[dirToNeighbor];

        if (neighbor) {
            const neighborIsSameTypeAsCenter = neighbor.typeId === centerBlockTypeId;
            const neighborHasConnectTag = neighbor.hasTag(PARK_BENCH_CONNECT_TAG);

            if (neighborIsSameTypeAsCenter || neighborHasConnectTag) {
                const oppositeDirOnNeighbor = OPPOSITE_CARDINAL_DIRECTIONS[dirToNeighbor];

                if (eventType === 'placed') {
                    updateSingleBlockDirectionState(neighbor, oppositeDirOnNeighbor, true, centerBlockRotation);
                } else {
                    updateSingleBlockDirectionState(neighbor, oppositeDirOnNeighbor, false, undefined);
                }
            }
        }
    }
}

export const connectedBenchComp = {
    onPlace: ({ block }) => {
        updateConnectivity(block, block.typeId, 'placed');
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
        updateConnectivity(block, destroyedBlockPermutation.type.id, 'break');
    }
};