import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:metal_lamp", {
        onTick: result => {
            const block = result.block;

            let blocks = [
                block.north(),
                block.south(),
                block.east(),
                block.west(),
                block.above(),
                block.below()
            ]

            if (blocks.some(b => b == undefined)) return;

            if (block.typeId == "unusual_furniture:iron_lamp") {
                const isEffectivelyAir = (block) => {
                    return block.isAir || block.hasTag("unusual_furniture:iron_beam");
                };

                block.setPermutation(block.permutation.withState("unusual_furniture:north", !isEffectivelyAir(blocks[0])));
                block.setPermutation(block.permutation.withState("unusual_furniture:south", !isEffectivelyAir(blocks[1])));
                block.setPermutation(block.permutation.withState("unusual_furniture:east", !isEffectivelyAir(blocks[2])));
                block.setPermutation(block.permutation.withState("unusual_furniture:west", !isEffectivelyAir(blocks[3])));

                if (blocks.every(b => isEffectivelyAir(b)) || block.permutation.getState("minecraft:block_face") == "down" || ((block.permutation.getState("minecraft:block_face") == "north" && block.permutation.getState("unusual_furniture:south") == false) || (block.permutation.getState("minecraft:block_face") == "south" && block.permutation.getState("unusual_furniture:north") == false) || (block.permutation.getState("minecraft:block_face") == "east" && block.permutation.getState("unusual_furniture:west") == false) || (block.permutation.getState("minecraft:block_face") == "west" && block.permutation.getState("unusual_furniture:east") == false))) {
                    block.setPermutation(block.permutation.withState("unusual_furniture:lonely", true));
                }
                else {
                    block.setPermutation(block.permutation.withState("unusual_furniture:lonely", false));
                }
            }

            //Inspired by https://discord.com/channels/523663022053392405/1275587356216262798/1275601430710849667
            const time = server.world.getTimeOfDay();
            const dimension = block.dimension;

            if (dimension.id === "minecraft:overworld") {
                const permutation = block.permutation;
                const isNight = time >= 12000 && time <= 23999;

                if (isNight) {
                    block.setPermutation(permutation.withState("unusual_furniture:light", true));
                } else if (!isNight) {
                    block.setPermutation(permutation.withState("unusual_furniture:light", false));
                }
            }
        }
    })
})
