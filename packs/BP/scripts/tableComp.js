import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:table", {
        onPlace: result => {
            let { x, y, z } = result.block.center()
            let y2 = y + 0.4
            let entities = [
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x + 0.5, y: y2, z: z + 0.5 }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x + 0.5, y: y2, z: z - 0.5 }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x - 0.5, y: y2, z: z + 0.5 }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x - 0.5, y: y2, z: z - 0.5 }),

                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x, y: y2, z: z + 0.5 }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x, y: y2, z: z - 0.5 }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x + 0.5, y: y2, z: z }),
                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x - 0.5, y: y2, z: z }),

                result.block.dimension.spawnEntity("unusual_furniture:inventory_table", { x: x, y: y2, z: z }),

            ]
        }
    })
})

server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {
        let viewedEntity = player.getEntitiesFromViewDirection({ ignoreBlockCollision: true, maxDistance: 6 })?.[0]?.entity;

        if (viewedEntity?.typeId === "unusual_furniture:inventory_table") {
            viewedEntity.triggerEvent("variant0");

            const targetEntity = viewedEntity; // Captura local de la entidad

            try {
                server.system.runTimeout(() => {
                    // Comprobar si el jugador aún está viendo la misma entidad
                    let stillViewedEntity = player.getEntitiesFromViewDirection({ maxDistance: 6, ignoreBlockCollision: true })?.[0]?.entity;

                    if (stillViewedEntity?.id !== targetEntity.id) {
                        targetEntity.triggerEvent("variant1");
                    }
                }, 1);
            } catch { }
        }
    }
});

server.world.afterEvents.playerInteractWithEntity.subscribe(result => {
    // let entity = result.target

    // entity.setRotation({ x: 0, y: Math.random() * 360 })

    // if (entity.typeId !== "unusual_furniture:inventory_table") return


    // let itemStack = result.itemStack

    // if (!itemStack) return

    // let block = false
    // let block2 = server.BlockTypes.get(itemStack.typeId)
    // let item = false

    // try {
    //     result.player.runCommand(`setblock ~ -64 ~ ${itemStack.typeId}`)
    //     block = true
    // }
    // catch {
    //     item = true
    // }

    // result.player.runCommand(`setblock ~ -64 ~ minecraft:bedrock`)

    // console.warn("Block: " + block)
    // console.warn("Item: " + item)

    // //variant0 = block
    // //variant1 = item

    // if (block && block2) {
    //     entity.triggerEvent("variant0")
    // }
    // else if (item || (block2 && item)) {
    //     entity.triggerEvent("variant1")
    // }
})