import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:sit_interact", {
        onPlayerInteract: result => {
            let state = result.block.permutation.getAllStates()
            let { x, y, z } = result.block.location
            let center = { x: x + 0.5, y: y, z: z + 0.5 }

            if (result.player.isSneaking) return

            if (result.block.hasTag("unusual_furniture:stool")) {
                result.block.dimension.spawnEntity("unusual_furniture:sit5", center).getComponent("rideable").addRider(result.player)
                return
            }

            switch (state["minecraft:cardinal_direction"]) {
                case "north":
                    result.block.dimension.spawnEntity("unusual_furniture:sit2", center).getComponent("rideable").addRider(result.player)
                    break
                case "south":
                    result.block.dimension.spawnEntity("unusual_furniture:sit", center).getComponent("rideable").addRider(result.player)
                    break
                case "east":
                    result.block.dimension.spawnEntity("unusual_furniture:sit3", center).getComponent("rideable").addRider(result.player)
                    break
                case "west":
                    result.block.dimension.spawnEntity("unusual_furniture:sit4", center).getComponent("rideable").addRider(result.player)
                    break
            }
        }
    })
})