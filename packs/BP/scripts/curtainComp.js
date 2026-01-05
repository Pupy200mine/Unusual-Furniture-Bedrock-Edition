import { BlockPermutation } from "@minecraft/server";

const addonNamespace = 'unusual_furniture';

const RELATIVE_DIRECTIONS = {
    north: {
        left: 'east',
        right: 'west',
        top: 'above',
        bottom: 'below'
    },
    south: {
        left: 'west',
        right: 'east',
        top: 'above',
        bottom: 'below'
    },
    east: {
        left: 'south',
        right: 'north',
        top: 'above',
        bottom: 'below'
    },
    west: {
        left: 'north',
        right: 'south',
        top: 'above',
        bottom: 'below'
    }
};

function getBlockInDirection(block, direction) {
    switch (direction) {
        case 'north': return block.north();
        case 'south': return block.south();
        case 'east': return block.east();
        case 'west': return block.west();
        case 'above': return block.above();
        case 'below': return block.below();
        default: return null;
    }
}

function hasCurtainTag(block) {
    return block?.hasTag('unusual_furniture:curtain');
}

function updateSingleCurtainBlock(block) {
    const rotation = block.permutation.getState('minecraft:cardinal_direction');
    const directions = RELATIVE_DIRECTIONS[rotation];

    const statesToSet = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    let validNeighborsCount = 0;
    let openNeighborsCount = 0;

    for (const [key, dir] of Object.entries(directions)) {
        const neighbor = getBlockInDirection(block, dir);

        if (hasCurtainTag(neighbor)) {
            statesToSet[key] = true;
            validNeighborsCount++;

            if (neighbor.permutation.getState(`${addonNamespace}:open`)) {
                openNeighborsCount++;
            }
        }
    }

    let newPerm = block.permutation;
    for (const [stateKey, enabled] of Object.entries(statesToSet)) {
        newPerm = newPerm.withState(`${addonNamespace}:${stateKey}`, enabled);
    }

    if (validNeighborsCount > 0 && validNeighborsCount === openNeighborsCount) {
        newPerm = newPerm.withState(`${addonNamespace}:open`, true);
    }

    block.setPermutation(newPerm);
}

let glassTypes = [
    "minecraft:glass_pane",
    "minecraft:black_stained_glass_pane",
    "minecraft:blue_stained_glass_pane",
    "minecraft:brown_stained_glass_pane",
    "minecraft:cyan_stained_glass_pane",
    "minecraft:gray_stained_glass_pane",
    "minecraft:green_stained_glass_pane",
    "minecraft:light_blue_stained_glass_pane",
    "minecraft:light_gray_stained_glass_pane",
    "minecraft:lime_stained_glass_pane",
    "minecraft:magenta_stained_glass_pane",
    "minecraft:orange_stained_glass_pane",
    "minecraft:pink_stained_glass_pane",
    "minecraft:purple_stained_glass_pane",
    "minecraft:red_stained_glass_pane",
    "minecraft:white_stained_glass_pane",
    "minecraft:yellow_stained_glass_pane"
]

function updateCurtainAndNeighbors(block, isPlaced) {
    if (hasCurtainTag(block)) updateSingleCurtainBlock(block);

    const neighbors = [
        block.north(),
        block.south(),
        block.east(),
        block.west(),
        block.above(),
        block.below()
    ];

    for (const neighbor of neighbors) {
        if (hasCurtainTag(neighbor)) {
            updateSingleCurtainBlock(neighbor);
        }

        if (isPlaced && glassTypes.includes(neighbor.typeId.replace("unusual_furniture:", "minecraft:"))) {
            neighbor.setType(neighbor.typeId.replace("minecraft:", "unusual_furniture:"))
        }

        if (!isPlaced && glassTypes.includes(neighbor.typeId.replace("unusual_furniture:", "minecraft:"))) {
            neighbor.setType(neighbor.typeId.replace("unusual_furniture:", "minecraft:"))
        }

    }
}

export const curtainComp = {
    onPlace: ({ block }) => {
        updateCurtainAndNeighbors(block, true);
    },
    onPlayerDestroy: ({ block }) => {
        updateCurtainAndNeighbors(block, false);
    }
};
