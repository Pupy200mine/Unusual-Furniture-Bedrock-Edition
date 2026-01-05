import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:carved_block", {
        onPlace: result => {
            let blocks = [
                result.block,
                result.block.north(),
                result.block.south(),
                result.block.west(),
                result.block.east(),
                result.block.above(),
                result.block.below()
            ]

            blocks.forEach(block => {
                connectedTexture(block)
            })
        },
        onPlayerDestroy: result => {
            let blocks = [
                result.block,
                result.block.north(),
                result.block.south(),
                result.block.west(),
                result.block.east(),
                result.block.above(),
                result.block.below()
            ]

            blocks.forEach(block => {
                connectedTexture(block)
            })
        }
    })


    function connectedTexture(block) {

        let state = block.permutation.getAllStates()

        if (state["unusual_furniture:carved_block"] == undefined) return

        let backBlock;
        let frontBlock;
        let face = state["minecraft:block_face"].toString();

        switch (face) {
            case "north":
                backBlock = block.south()
                frontBlock = block.north()
                break;
            case "south":
                backBlock = block.north()
                frontBlock = block.south()
                break;
            case "east":
                backBlock = block.west()
                frontBlock = block.east()
                break;
            case "west":
                backBlock = block.east()
                frontBlock = block.west()
                break;
            case "up":
                backBlock = block.below()
                frontBlock = block.above()
                break;
            case "down":
                backBlock = block.above()
                frontBlock = block.below()
                break;
            default:
                backBlock = block.north()
                frontBlock = block.north()
                break;
        }

        if ((backBlock.typeId == block.typeId && backBlock.permutation.getAllStates()["minecraft:block_face"] == face)
            || (frontBlock.typeId == block.typeId && frontBlock.permutation.getAllStates()["minecraft:block_face"] == face)) {

            if (frontBlock.typeId == block.typeId && backBlock.typeId != block.typeId) {
                state["unusual_furniture:carved_block"] = 1
            }
            else if (backBlock.typeId == block.typeId && frontBlock.typeId != block.typeId) {
                state["unusual_furniture:carved_block"] = 2
            }
            else if (frontBlock.typeId == block.typeId && backBlock.typeId == block.typeId) {
                state["unusual_furniture:carved_block"] = 3
            }
        }
        else {
            state["unusual_furniture:carved_block"] = 0
        }
        block.setPermutation(server.BlockPermutation.resolve(block.typeId, state))
    }
})