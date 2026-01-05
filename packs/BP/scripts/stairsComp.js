import * as server from "@minecraft/server"

function oppositeDirection(direction) {
    switch (direction) {
        case "north":
            return "south"
        case "south":
            return "north"
        case "east":
            return "west"
        case "west":
            return "east"
    }
}

function setBlockAbove(block, direction) {
    let permutation = server.BlockPermutation.resolve("unusual_furniture:open_rise_stairs_collision")
    block.above().setPermutation(permutation.withState("minecraft:cardinal_direction", oppositeDirection(direction)))
}

server.world.afterEvents.playerBreakBlock.subscribe(result => {
    if (result.block.below().hasTag("unusual_furniture:stairs")) {
        setBlockAbove(result.block.below(), result.block.below().permutation.getState("minecraft:cardinal_direction"))
    }
})

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:stairs", {
        beforeOnPlayerPlace: result => {
            let itemStack = result.player.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand)
            let face = result.face

            let blockBelow = result.block.below()
            let blockBelowRotation = blockBelow.permutation.getState("minecraft:cardinal_direction")

            let rotation = result.permutationToPlace.getState("minecraft:cardinal_direction")

            let block = result.block

            if (face == "Up" && blockBelow.hasTag("unusual_furniture:stairs")) {
                if (rotation == blockBelowRotation) {
                    console.warn(rotation)
                    switch (rotation) {
                        case "north":
                            if (block.south().isAir) {
                                block.south().setPermutation(server.BlockPermutation.resolve(result.permutationToPlace.type.id, result.permutationToPlace.getAllStates()))
                                if (block.above().isAir) setBlockAbove(block.south(), rotation)
                                result.cancel = true
                            }
                            else {
                                if (block.above().isAir) setBlockAbove(block, rotation)
                            }
                            break
                        case "south":
                            if (block.north().isAir) {
                                block.north().setPermutation(server.BlockPermutation.resolve(result.permutationToPlace.type.id, result.permutationToPlace.getAllStates()))
                                if (block.above().isAir) setBlockAbove(block.north(), rotation)
                                result.cancel = true
                            }
                            else {
                                if (block.above().isAir) setBlockAbove(block, rotation)
                            }
                            break
                        case "east":
                            if (block.west().isAir) {
                                block.west().setPermutation(server.BlockPermutation.resolve(result.permutationToPlace.type.id, result.permutationToPlace.getAllStates()))
                                if (block.above().isAir) setBlockAbove(block.west(), rotation)
                                result.cancel = true
                            }
                            else {
                                if (block.above().isAir) setBlockAbove(block, rotation)
                            }
                            break
                        case "west":
                            if (block.east().isAir) {
                                block.east().setPermutation(server.BlockPermutation.resolve(result.permutationToPlace.type.id, result.permutationToPlace.getAllStates()))
                                if (block.above().isAir) setBlockAbove(block.east(), rotation)
                                result.cancel = true
                            }
                            else {
                                if (block.above().isAir) setBlockAbove(block, rotation)
                            }
                            break
                    }

                    if (result.player.getGameMode() != server.GameMode.creative) {
                        if (itemStack.amount > 1) itemStack.amount--
                        else itemStack = undefined
                        result.player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack)
                    }
                }
            }
            else {
                if (block.above().isAir) setBlockAbove(block, rotation)
            }
        },
        onPlayerDestroy: result => {
            if (result.block.above().typeId == "unusual_furniture:open_rise_stairs_collision") {
                result.block.above().setType("air")
            }
        }
    })
})