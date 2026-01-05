import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:hydrant", {
        onPlayerInteract: result => {

            let itemStack = result.player.getComponent("equippable").getEquipment(server.EquipmentSlot.Mainhand)

            result.block.dimension.playSound("mob.axolotl.splash", result.block.center())
            result.block.dimension.spawnParticle("unusual_furniture:hydrant_water", result.block.center())

            if (itemStack?.typeId == "minecraft:bucket") {

                let waterBucket = new server.ItemStack("minecraft:water_bucket", 1)

                if (itemStack.amount > 1) itemStack.amount--
                else itemStack = undefined

                // if (!result.player.getGameMode != server.GameMode.creative)
                result.block.dimension.playSound("bucket.empty_water", result.block.center())
                result.player.getComponent("equippable").setEquipment(server.EquipmentSlot.Mainhand, itemStack)
                result.player.getComponent("inventory").container.addItem(waterBucket)
            }
        }
    })
})