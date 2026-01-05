import { Block, world } from "@minecraft/server";

const addonNamespace = 'unusual_furniture';
const MAX_PROPAGATION_COUNT = 64;

const RELATIVE_DIRECTIONS = {
    'north': { left: 'west', right: 'east' },
    'east': { left: 'north', right: 'south' },
    'south': { left: 'east', right: 'west' },
    'west': { left: 'south', right: 'north' }
};

function getNearbyBlocks(block) {
    const d = block.dimension;
    const loc = block.location;
    return {
        'north': d.getBlock({ x: loc.x, y: loc.y, z: loc.z - 1 }),
        'east': d.getBlock({ x: loc.x + 1, y: loc.y, z: loc.z }),
        'south': d.getBlock({ x: loc.x, y: loc.y, z: loc.z + 1 }),
        'west': d.getBlock({ x: loc.x - 1, y: loc.y, z: loc.z }),
        'up': block.above(),
        'down': block.below()
    };
}

function updateOpenState(startBlock) {
    if (!startBlock) return;

    try {
        const startPerm = startBlock.permutation;
        if (!startPerm) return;

        const currentOpen = startPerm.getState("unusual_furniture:open");
        if (typeof currentOpen !== "boolean") return;

        const newOpen = !currentOpen;
        const rotation = startPerm.getState("minecraft:cardinal_direction");
        if (!rotation || !RELATIVE_DIRECTIONS[rotation]) return;

        const queue = [startBlock];
        const visited = new Set();
        const blocksToUpdate = [];

        const locStr = (b) => `${b.location.x},${b.location.y},${b.location.z}`;
        visited.add(locStr(startBlock));
        blocksToUpdate.push(startBlock);

        while (queue.length > 0 && blocksToUpdate.length < MAX_PROPAGATION_COUNT) {
            const current = queue.shift();
            const neighbors = getNearbyBlocks(current);

            for (const dir in neighbors) {
                if (blocksToUpdate.length >= MAX_PROPAGATION_COUNT) break;
                const neighbor = neighbors[dir];
                if (!neighbor) continue;

                const id = locStr(neighbor);
                if (visited.has(id)) continue;
                visited.add(id);

                if (!neighbor.hasTag("unusual_furniture:curtain")) continue;
                const neighborPerm = neighbor.permutation;
                if (!neighborPerm) continue;

                const sameRotation = neighborPerm.getState("minecraft:cardinal_direction") === rotation;
                const hasOpenState = typeof neighborPerm.getState("unusual_furniture:open") === "boolean";

                const isAllowedDir = dir === "up" || dir === "down" ||
                    dir === RELATIVE_DIRECTIONS[rotation].left ||
                    dir === RELATIVE_DIRECTIONS[rotation].right;

                if (sameRotation && hasOpenState && isAllowedDir) {
                    queue.push(neighbor);
                    blocksToUpdate.push(neighbor);
                }
            }
        }

        for (const b of blocksToUpdate) {
            try {
                let perm = b.permutation;
                if (perm.getState("unusual_furniture:open") !== newOpen) {
                    b.setPermutation(perm.withState("unusual_furniture:open", newOpen));
                }
            } catch { }
        }
    } catch { }
}

export const connectedCurtainComp = {
    onPlayerInteract: ({ block, player }) => {
        const open = block.permutation.getState("unusual_furniture:open");
        block.dimension.playSound(
            open ? "cfm.blinds_close" : "cfm.blinds_open",
            block.center()
        );
        if (player.isSneaking) return;
        updateOpenState(block);
        block.dimension.playSound("dig.cloth", block.center());
    }
};
