import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:pebble_bag", {
        beforeOnPlayerPlace: result => {
            let state = result.permutationToPlace.getAllStates()

            state["unusual_furniture:type"] = Math.floor(Math.random() * 5);

            result.permutationToPlace = server.BlockPermutation.resolve(result.permutationToPlace.type.id, state)
        }
    })
})