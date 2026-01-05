import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:broom", {
        onPlayerInteract: result => {
            let state = result.block.permutation.getAllStates()
            //Sumar 1 al estado cada vez que se interactua con el bloque
            state["unusual_furniture:state"] = state["unusual_furniture:state"] + 1
            if (state["unusual_furniture:state"] > 2) {
                state["unusual_furniture:state"] = 0
            }
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.permutation.type.id, state))
            result.block.dimension.playSound("place.nether_wood", result.block.center())
        }
    })
})