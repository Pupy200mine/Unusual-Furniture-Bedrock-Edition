import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:glass", {
        onTick: result => {

            let state = result.block.permutation.getAllStates()

            state["unusual_furniture:north"] = !result.block.north().isAir && !result.block.north().hasTag("unusual_furniture:curtain")
            state["unusual_furniture:south"] = !result.block.south().isAir && !result.block.south().hasTag("unusual_furniture:curtain")
            state["unusual_furniture:west"] = !result.block.east().isAir && !result.block.east().hasTag("unusual_furniture:curtain")
            state["unusual_furniture:east"] = !result.block.west().isAir && !result.block.west().hasTag("unusual_furniture:curtain")

            result.block.setPermutation(server.BlockPermutation.resolve(result.block.typeId, state))
        }
    })
})