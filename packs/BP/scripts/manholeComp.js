import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:manhole_toolbox", {
        onPlayerInteract: result => {
            let state = result.block.permutation.getAllStates()
            state["unusual_furniture:open"] = !state["unusual_furniture:open"]
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.permutation.type.id, state))
            if (state["unusual_furniture:open"]) {
                result.block.dimension.playSound("random.door_close", result.block.center(), {pitch: 0.5})
            }
            else {
                result.block.dimension.playSound("random.door_open", result.block.center(), {pitch: 0.5})
            }
        }
    })
})