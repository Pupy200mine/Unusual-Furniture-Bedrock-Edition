import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:ceiling_lamp", {
        onPlayerInteract: result => {
            let state = result.block.permutation.getAllStates()
            state["unusual_furniture:light"] = !state["unusual_furniture:light"]
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))

            result.block.dimension.spawnParticle("unusual_furniture:particle", result.block.center())

            let pitch = state["unusual_furniture:light"] ? 2 : 1.5

            result.block.dimension.playSound("random.click", result.block.center(), { pitch: pitch })
        }
    })
})