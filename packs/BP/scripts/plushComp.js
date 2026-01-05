import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:plush", {
        onPlayerInteract: result => {
            if (result.block.typeId == "unusual_furniture:pig_plush") {
                result.block.dimension.playSound("mob.pig.say", result.block.center(), { pitch: 2, volume: 0.5 })
            }
            else if (result.block.typeId == "unusual_furniture:cow_plush") {
                result.block.dimension.playSound("mob.cow.say", result.block.center(), { pitch: 2, volume: 0.5 })
            }
            else if (result.block.typeId == "unusual_furniture:cat_plush") {
                result.block.dimension.playSound("mob.cat.meow", result.block.center(), { pitch: 2, volume: 0.5 })
            }

            result.block.dimension.spawnParticle("unusual_furniture:plush_particle", result.block.center())
            result.block.dimension.playSound("unusual_furniture:squeak", result.block.center())
        },
        beforeOnPlayerPlace: result => {
            let state = result.permutationToPlace.getAllStates()
            let blockBelow = result.block.below()

            if (blockBelow.typeId == "minecraft:bed" || blockBelow.hasTag("unusual_furniture:sofa")) {
                state["unusual_furniture:on_bed"] = true
            }
            result.permutationToPlace = server.BlockPermutation.resolve(result.permutationToPlace.type.id, state)
            // console.warn(blockBelow.typeId)
        }
    })
})