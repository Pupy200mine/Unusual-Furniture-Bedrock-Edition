console.warn("§l§eUnusual §8Furniture - §6Bedrock Edition§r§a loaded correctly, have fun!")
import "./sitInteractComp.js"
import "./ceilingLampComp.js"
import "./inventoryInteractComp.js"
import { connectedSofaComp } from './connectedSofaComp.js';
import { connectedBenchComp } from './connectedBenchComp.js';
import { railingComp } from './railingComp.js';
import { curtainComp } from "./curtainComp.js"
import { connectedCurtainComp } from "./connectedCurtainComp.js"
import "./tropicalPlantComp.js"
import "./mushroomPatchComp.js"
import "./waterPlantComp.js"
import "./posterComp.js"
import "./hydrantComp.js"
import "./manholeComp.js"
import "./carvedBlockComp.js"
import "./stairsComp.js"
import "./metalLampComp.js"
import "./batLampComp.js"
import "./tableComp.js"
import "./plushComp.js"
import "./lampComp.js"
import "./glassComp.js"
import "./pebbleComp.js"
import "./index.js"
import "./book.js"
import "./recipes_book.js"
import "./broomComp.js"
import "./rakesComp.js"
import "./woodenClockComp.js"

//By meerkat1352 (https://discord.com/channels/523663022053392405/1292149442341900339/1292149442341900339)
import { custom_pot } from "./blocks/custom_pot.js";
custom_pot.init();


import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"

server.world.afterEvents.playerPlaceBlock.subscribe(result => {
    if (!result.block.typeId.startsWith("unusual_furniture") || result.block.hasTag("unusual_furniture:no_particles")) return

    result.block.dimension.spawnParticle("unusual_furniture:particle", result.block.center())
})

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:sofa', connectedSofaComp);
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:bench', connectedBenchComp);
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:railing', railingComp);
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:curtain', curtainComp);
    initEvent.blockComponentRegistry.registerCustomComponent('unusual_furniture:connected_curtain', connectedCurtainComp);
})

// server.system.runInterval(() => {
//     for (let player of server.world.getAllPlayers()) {
//         let block = player.getBlockFromViewDirection({ maxDistance: 8 })?.block

//         if (!block) continue

//         player.onScreenDisplay.setActionBar(`${block.typeId}\n ${JSON.stringify(block.permutation.getAllStates()).replaceAll(",", "\n")}`)
//     }
// })


// server.system.runInterval(() => {
//     for (let player of server.world.getAllPlayers()) {
//         let block = player.getBlockFromViewDirection({ maxDistance: 8 })?.block

//         if (!block) continue

//         player.onScreenDisplay.setActionBar(`${JSON.stringify(block.permutation.getTags()).replaceAll(",", "\n")}`)
//     }
// })

import { world } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn && !player.hasTag("unusual_furniture:menu_shown")) {
        miMenu(player)
        player.addTag("unusual_furniture:menu_shown")
        player.getComponent("inventory").container.addItem(new server.ItemStack("unusual_furniture:unusual_furniture_book"))
        player.getComponent("inventory").container.addItem(new server.ItemStack("unusual_furniture:unusual_furniture_recipes_book"))
    }
});


//Testing Recipe UI
//meh, it's not working
// world.afterEvents.playerPlaceBlock.subscribe(result => {
//     if (result.block.typeId == "unusual_furniture:oak_stool") {
//         let entity = result.dimension.spawnEntity("unusual_furniture:unusual_entity", result.block.center())
//         entity.nameTag = "§t§e§s§t§r"
//     }
// })

// world.afterEvents.playerInteractWithEntity.subscribe(result => {
//     if (result.target.typeId == "unusual_furniture:unusual_entity") {

//         result.target.getComponent("inventory").container.clearAll()

//         result.target.getComponent("inventory").container.setItem(0, new server.ItemStack("unusual_furniture:unusual_furniture_book"))
//         result.target.getComponent("inventory").container.setItem(4, new server.ItemStack("unusual_furniture:unusual_furniture_book"))
//         result.target.getComponent("inventory").container.setItem(8, new server.ItemStack("unusual_furniture:unusual_furniture_book"))

//         result.target.getComponent("inventory").container.setItem(9, new server.ItemStack("unusual_furniture:unusual_furniture_book"))

//     }
// })

async function miMenu(player) {
    const mimenu = new ui.ActionFormData()
        .title('§l§eUnusual §8Furniture - §6Bedrock Edition')
        .body('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHave fun!');
    mimenu.show(player).then((r) => {
        if (r.canceled && r.cancelationReason == 'UserBusy') miMenu(player)
        if (r.canceled && r.cancelationReason == 'UserClosed') return;
    });
}



let items = [
    "unusual_furniture:iron_lamp",
    "unusual_furniture:sphere_lamp"
]
let set1 = [
    "unusual_furniture:broom",
    "unusual_furniture:rakes"
]

function setLore(player, slotIndex, item, text) {
    const lore = item.getLore()
    if (lore.includes(text)) return
    item.setLore([text])
    player.getComponent("inventory").container.setItem(slotIndex, item)
}



server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {
        for (let i = 0; i < player.getComponent("inventory").container.size; i++) {
            let item = player.getComponent("inventory").container.getItem(i)
            if (!item) continue

            if (items.includes(item.typeId)) {
                setLore(player, i, item, "§7React to the day cycle")
            }
            if (set1.includes(item.typeId)) {
                setLore(player, i, item, "§7Right click to change position")
            }
            if (item.typeId == "unusual_furniture:grave_broken") {
                setLore(player, i, item, "§7Broken")
            }
        }
    }
})