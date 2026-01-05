import * as server from "@minecraft/server"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:inventory_interact', {
        onPlayerInteract: result => {
            const blockInteractionConfig = {
                "unusual_furniture:drawer": { open: "block.barrel.open", close: "block.barrel.close", pitch: 1.2, interactFaceRule: "all" },
            };

            let activeConfig = {
                open: "block.barrel.open",
                close: "block.barrel.close",
                pitch: 1,
                interactFaceRule: "all"
            };

            for (const tag in blockInteractionConfig) {
                if (result.block.hasTag(tag)) {
                    activeConfig = blockInteractionConfig[tag];
                    break;
                }
            }

            if (result.player.isSneaking) return;

            const blockState = result.block.permutation.getAllStates();
            const playerClickedFace = String(result.face).toLowerCase();
            const blockCardinalDirection = String(blockState["minecraft:cardinal_direction"] || "north").toLowerCase();
            const ruleSet = activeConfig.interactFaceRule;

            let isValidInteraction = false;

            function getAbsoluteFaceFromRelative(relativeRule, cardinalDirection) {
                const relRule = relativeRule.toLowerCase();
                if (relRule === "up") return "up";
                if (relRule === "down") return "down";

                switch (cardinalDirection) {
                    case "north":
                        if (relRule === "front") return "north";
                        if (relRule === "back") return "south";
                        if (relRule === "left") return "west";
                        if (relRule === "right") return "east";
                        break;
                    case "south":
                        if (relRule === "front") return "south";
                        if (relRule === "back") return "north";
                        if (relRule === "left") return "east";
                        if (relRule === "right") return "west";
                        break;
                    case "east":
                        if (relRule === "front") return "east";
                        if (relRule === "back") return "west";
                        if (relRule === "left") return "north";
                        if (relRule === "right") return "south";
                        break;
                    case "west":
                        if (relRule === "front") return "west";
                        if (relRule === "back") return "east";
                        if (relRule === "left") return "south";
                        if (relRule === "right") return "north";
                        break;
                }
                return "";
            }

            if (typeof ruleSet === 'string' && ruleSet.toLowerCase() === 'all') {
                isValidInteraction = true;
            } else if (Array.isArray(ruleSet)) {
                for (const relativeRule of ruleSet) {
                    const expectedAbsoluteFace = getAbsoluteFaceFromRelative(relativeRule, blockCardinalDirection);
                    if (expectedAbsoluteFace && playerClickedFace === expectedAbsoluteFace) {
                        isValidInteraction = true;
                        break;
                    }
                }
            } else if (typeof ruleSet === 'string') {
                const expectedAbsoluteFace = getAbsoluteFaceFromRelative(ruleSet, blockCardinalDirection);
                if (expectedAbsoluteFace && playerClickedFace === expectedAbsoluteFace) {
                    isValidInteraction = true;
                }
            }

            if (!isValidInteraction) return;

            const currentOpenState = !!blockState["unusual_furniture:open"];
            blockState["unusual_furniture:open"] = !currentOpenState;
            let permutation = server.BlockPermutation.resolve(result.block.typeId, blockState);
            result.block.setPermutation(permutation);

            result.block.dimension.playSound(activeConfig.open, result.block.center(), { pitch: activeConfig.pitch });
            server.system.runTimeout(() => {
                result.block.dimension.playSound(activeConfig.open, result.block.center(), { pitch: activeConfig.pitch });
            }, 3)

            let entity = result.block.dimension.getEntities({ families: ["unusual_furniture:inventory"], closest: true, location: result.block.center(), maxDistance: 1 })[0]
            try {
                entity.triggerEvent("open")
            } catch { }

            server.system.runTimeout(() => {
                try {
                    entity.triggerEvent("close")
                } catch { }
                const currentStateInTimeout = result.block.permutation.getAllStates();
                if (currentStateInTimeout["unusual_furniture:open"] === !currentOpenState) {
                    currentStateInTimeout["unusual_furniture:open"] = currentOpenState;
                    let closingPermutation = server.BlockPermutation.resolve(result.block.typeId, currentStateInTimeout);
                    result.block.setPermutation(closingPermutation);
                    result.block.dimension.playSound(activeConfig.close, result.block.center(), { pitch: activeConfig.pitch });
                    server.system.runTimeout(() => {
                        result.block.dimension.playSound(activeConfig.close, result.block.center(), { pitch: activeConfig.pitch });
                    }, 3)
                }
            }, 60);
        },
        onPlace: result => {
            let { x, y, z } = result.block.location;
            let center = { x: x + 0.5, y: y, z: z + 0.5 };
            result.block.dimension.spawnEntity("unusual_furniture:inventory_27", center);
        }
    });
});