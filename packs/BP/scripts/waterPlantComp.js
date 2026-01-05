import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:water_plant", {
        onPlace: result => {

            let state = result.block.permutation.getAllStates()

            let blockBelow = result.block.below()

            if (blockBelow.typeId === 'minecraft:water' || blockBelow.isWaterlogged) {
                state["unusual_furniture:water"] = true
                state["unusual_furniture:plant"] = Math.floor(Math.random() * 3);
            }
            else{
                state["unusual_furniture:plant"] = Math.floor(Math.random() * 2);
            }

            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        }
    })
})


//(https://discord.com/channels/523663022053392405/1342140630851129414)

server.world.beforeEvents.itemUseOn.subscribe((data) => {
    const { source, block, itemStack } = data;
    if (!data.isFirstEvent || (block.typeId !== 'minecraft:water' && !block.isWaterlogged)) { return }
    if (itemStack.typeId === 'unusual_furniture:water_plants') {
        data.cancel = true;
        server.system.run(() => {
            placeBlockAboveWater(source, server.BlockPermutation.resolve('unusual_furniture:water_plants_block'), block.location);
        });
    }
});

function placeBlockAboveWater(player, permutationToPlace, location) {
    const loc = { x: location.x, y: location.y + 1, z: location.z };

    for (let i = 0; i < 8; i++) {
        const block = player.dimension.getBlock(loc);

        if (block.typeId === 'minecraft:water' || block.isWaterlogged) {
            loc.y++;
            continue;
        }

        if (!block.isAir) break;

        block.setPermutation(permutationToPlace);

        const equippableComp = player.getComponent('equippable');
        const item = equippableComp.getEquipment('Mainhand');
        if (!item) break;

        if (player.getGameMode() != server.GameMode.creative) {
            if (item.amount <= 1) equippableComp.setEquipment('Mainhand', undefined);
            else { item.amount--; equippableComp.setEquipment('Mainhand', item); }
        }

        break;
    }

    return player.dimension.getBlock(loc);
}