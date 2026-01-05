// Used in naming states in blocks: 'custom:north' , 'custom:down', ...
const addonNamespace = 'unusual_furniture';

/**
 * Maps directions to their opposite directions.
 * Used to get the correct directions of nearby blocks.
 */
const OPPOSITE_DIRECTIONS = {
    'up_right': 'down_left',
    'up_left': 'down_right',
    'down_right': 'up_left',
    'down_left': 'up_right'
};

/**
 * Gets nearby diagonal blocks based on block rotation.
 *
 * @param {Block} block - The block that was broken or placed.
 * @returns {object} - Returns diagonal blocks based on rotation.
 */
function getNearbyBlocks(block) {
    const rotation = block.permutation.getState('minecraft:cardinal_direction');

    let blocks = {};

    // Agrupar North/South y East/West
    if (rotation === 'north' || rotation === 'south') {
        blocks = {
            'up_right': block.above().east(),
            'up_left': block.above().west(),
            'down_right': block.below().east(),
            'down_left': block.below().west()
        };
    } else if (rotation === 'east' || rotation === 'west') {
        blocks = {
            'up_right': block.above().south(),
            'up_left': block.above().north(),
            'down_right': block.below().south(),
            'down_left': block.below().north()
        };
    }

    return blocks;
}

/**
 * Checks if a block has the railing tag
 * 
 * @param {Block} block - The block to check
 * @returns {boolean} - Returns true if the block has the railing tag
 */
function hasRailingTag(block) {
    return block?.hasTag('unusual_furniture:railing');
}

/**
 * Checks the block, nearby blocks and whether they should connect or not.
 *
 * @param {Block} block - The block that was placed or broken.
 * @param {string} blockId - (Ya no se usa para comparación, solo para compatibilidad)
 * @param {string} [checkType='break'] - Indicates whether the block was placed or broken, possible values: "break" or "placed".
 * @returns {undefined} - Does not return any value.
 */
function updateBlock(block, blockId, checkType = 'break') {
    // Get nearby directions
    const nearbyBlocks = getNearbyBlocks(block);
    const blockRotation = block.permutation.getState('minecraft:cardinal_direction');

    const stateValue = checkType === 'placed';

    // Get all nearby blocks
    for (const direction in nearbyBlocks) {
        const nearbyBlock = nearbyBlocks[direction];

        // Solo conectar si el bloque vecino tiene el tag de barandilla
        if (hasRailingTag(nearbyBlock)) {
            const nearbyRotation = nearbyBlock.permutation.getState('minecraft:cardinal_direction');

            // Solo conectar si tienen la misma rotación o rotaciones opuestas
            const validConnection = (
                (blockRotation === 'north' && (nearbyRotation === 'north' || nearbyRotation === 'south')) ||
                (blockRotation === 'south' && (nearbyRotation === 'north' || nearbyRotation === 'south')) ||
                (blockRotation === 'east' && (nearbyRotation === 'east' || nearbyRotation === 'west')) ||
                (blockRotation === 'west' && (nearbyRotation === 'east' || nearbyRotation === 'west'))
            );

            if (validConnection) {
                // Update current block if stateValue is true
                if (stateValue) {
                    // Manejar casos donde ambos estados serán verdaderos
                    if (direction === 'up_right' && hasRailingTag(nearbyBlocks['up_left'])) {
                        const randomChoice = Math.random() < 0.5 ? 'up_right' : 'up_left';
                        const newBlockPermutation = block.permutation.withState(`${addonNamespace}:${randomChoice}`, true);
                        block.setPermutation(newBlockPermutation);
                    } else if (direction === 'up_left' && hasRailingTag(nearbyBlocks['up_right'])) {
                        // No hacer nada aquí, ya que se manejó en el caso anterior
                    } else if (direction === 'down_left' && hasRailingTag(nearbyBlocks['down_right'])) {
                        const randomChoice = Math.random() < 0.5 ? 'down_left' : 'down_right';
                        const newBlockPermutation = block.permutation.withState(`${addonNamespace}:${randomChoice}`, true);
                        block.setPermutation(newBlockPermutation);
                    } else if (direction === 'down_right' && hasRailingTag(nearbyBlocks['down_left'])) {
                        // No hacer nada aquí, ya que se manejó en el caso anterior
                    } else {
                        const newBlockPermutation = block.permutation.withState(`${addonNamespace}:${direction}`, stateValue);
                        block.setPermutation(newBlockPermutation);
                    }
                }

                // Update the nearby block in the opposite direction
                const nearbyBlockPermutation = nearbyBlock.permutation.withState(`${addonNamespace}:${OPPOSITE_DIRECTIONS[direction]}`, stateValue);
                nearbyBlock.setPermutation(nearbyBlockPermutation);
            }
        }
    }
}

function updateNearbyBlocksAfterDestroy(block) {
    const nearby = [
        block.above().east(),
        block.above().west(),
        block.above().north(),
        block.above().south(),
        block.below().east(),
        block.below().west(),
        block.below().north(),
        block.below().south()
    ];

    for (const nearbyBlock of nearby) {
        if (hasRailingTag(nearbyBlock)) {
            const rotation = nearbyBlock.permutation.getState('minecraft:cardinal_direction');
            const nearbyDiagonal = getNearbyBlocks(nearbyBlock);

            for (const dir in nearbyDiagonal) {
                const diagBlock = nearbyDiagonal[dir];
                if (
                    diagBlock &&
                    diagBlock.location.x === block.location.x &&
                    diagBlock.location.y === block.location.y &&
                    diagBlock.location.z === block.location.z
                ) {
                    const newPerm = nearbyBlock.permutation.withState(`${addonNamespace}:${dir}`, false);
                    nearbyBlock.setPermutation(newPerm);
                }
            }
        }
    }
}

// Triggers block updates
export const railingComp = {
    onPlace: ({ block }) => {
        updateBlock(block, block.typeId, 'placed');
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
        updateNearbyBlocksAfterDestroy(block);
    }
}