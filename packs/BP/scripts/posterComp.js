import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:poster", {
        beforeOnPlayerPlace: result => {

            server.system.run(()=>{
                result.block.dimension.playSound("item.book.page_turn", result.block.center())
            })
            
            let faces = ["north", "south", "east", "west"]
            let state = result.permutationToPlace.getAllStates()

            if (faces.includes(state["minecraft:block_face"].toString())) {
                state["unusual_furniture:wall"] = true
            }

            state["unusual_furniture:variant"] = Math.floor(Math.random() * 7)

            result.permutationToPlace = server.BlockPermutation.resolve(result.permutationToPlace.type.id, state)
        }
    })
})