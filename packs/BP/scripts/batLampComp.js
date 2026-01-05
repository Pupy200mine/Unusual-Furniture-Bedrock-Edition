import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:bat_lamp", {
        onPlayerInteract: result => {

            let state = result.block.permutation.getAllStates()

            state["unusual_furniture:variant"]++

            if (state["unusual_furniture:variant"] > 2) state["unusual_furniture:variant"] = 0

            result.block.dimension.playSound("random.door_open", result.block.center(), { pitch: 3 })
            server.system.runTimeout(() => {
                result.block.dimension.playSound("random.door_open", result.block.center(), { pitch: 3 })
            }, 1)
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        }
    })
})