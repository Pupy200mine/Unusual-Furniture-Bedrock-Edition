import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:rakes", {
        onPlayerInteract: result => {
            let state = result.block.permutation.getAllStates()
            //Sumar 1 al estado cada vez que se interactua con el bloque
            state["unusual_furniture:state"] = state["unusual_furniture:state"] + 1
            if (state["unusual_furniture:state"] > 2) {
                state["unusual_furniture:state"] = 0
            }
            result.block.setPermutation(server.BlockPermutation.resolve(result.block.permutation.type.id, state))
            result.block.dimension.playSound("place.nether_wood", result.block.center())
        },
        onTick: result => {
            let entity = result.block.dimension.getEntitiesAtBlockLocation({ x: result.block.center().x, y: result.block.center().y - 0.5, z: result.block.center().z }).find(entity => entity.typeId == "minecraft:player")
            if (entity == null) return
            let state = result.block.permutation.getAllStates()
            let yaw = Math.floor(entity.getRotation().y)
            if (yaw > 180) yaw -= 360
            if (yaw <= -180) yaw += 360
            let rotation
            if (yaw >= -45 && yaw <= 45) {
                rotation = "north"
            } else if (yaw > 45 && yaw <= 135) {
                rotation = "east"
            } else if (yaw > 135 || yaw <= -135) {
                rotation = "south"
            } else {
                rotation = "west"
            }

            const vel = entity.getVelocity();
            const look = entity.getViewDirection();

            const lookXZ = { x: look.x, y: 0, z: look.z };
            const len = Math.hypot(lookXZ.x, lookXZ.z) || 1;
            lookXZ.x /= len; lookXZ.z /= len;

            const forwardSpeed = vel.x * lookXZ.x + vel.z * lookXZ.z;

            // console.warn("Forward speed: " + forwardSpeed)
            // console.warn("Player rotation: " + rotation)
            // console.warn("Block rotation: " + state["minecraft:cardinal_direction"])
            if (state["unusual_furniture:state"] == 2 && rotation == state["minecraft:cardinal_direction"] && forwardSpeed > 0.15) {
                result.block.dimension.playSound("item.shield.block", result.block.center())
                state["unusual_furniture:state"] = 0
                entity.clearVelocity()
                entity.applyDamage(4)
                result.block.setPermutation(server.BlockPermutation.resolve(result.block.permutation.type.id, state))
            }
        }
    })
})