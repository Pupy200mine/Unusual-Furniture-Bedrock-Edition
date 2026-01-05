import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:lamp", {
        onPlace: result => {
            updateLamp(result.block)
            updateLamp(result.block.above())
            updateLamp(result.block.below())
        },
        onPlayerDestroy: result => {
            updateLamp(result.block.above())
            updateLamp(result.block.below())
        }
    })
})

function updateLamp(block) {
    if (!block.hasTag("unusual_furniture:lamp")) return
    let state = block.permutation.getAllStates()
    state["unusual_furniture:up"] = block.above().hasTag("unusual_furniture:lamp")
    state["unusual_furniture:down"] = block.below().hasTag("unusual_furniture:lamp")
    block.setPermutation(server.BlockPermutation.resolve(block.permutation.type.id, state))
}