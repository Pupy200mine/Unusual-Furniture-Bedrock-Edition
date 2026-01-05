import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:tropical_plant", {
        beforeOnPlayerPlace: result => {

            let faces = ["north", "south", "east", "west"]
            let state = result.permutationToPlace.getAllStates()

            if (faces.includes(state["minecraft:block_face"].toString())) {
                state["unusual_furniture:wall"] = true
            }
            else {

                let blockBelow = result.block.below()

                if (!blockBelow.hasTag("grass") && !blockBelow.hasTag("unusual_furniture:pot")) { result.cancel = true; return }

                state["unusual_furniture:plant"] = Math.floor(Math.random() * 3);
            }
            result.permutationToPlace = server.BlockPermutation.resolve(result.permutationToPlace.type.id, state)
        }
    })
})