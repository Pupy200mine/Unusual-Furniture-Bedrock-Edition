import { world, system, BlockTypes } from "@minecraft/server"

function adjustTextLength(text = '', totalLength = 100) {
  return (text.slice(0, totalLength)).padEnd(totalLength, '\t')
}

// §c§2§6§e§6§2§c§e§6 is the flag, you can change it, just dont forget to change it in your _global_variables.json
//                    these are the defaults, you can change it
function dynamicToast(title = '', message = '', icon = '', background = 'textures/ui/greyBorder') {
  return "§c§2§6§e§6§2§c§e§6" + adjustTextLength(title, 100) + adjustTextLength(message, 200) + adjustTextLength(icon, 100) + adjustTextLength(background, 100)
}

function dynamicToastEvent(text) {
  const contents = text.split('|') // this is the string you use for splitting in /scriptevent command
  if (contents[3] === undefined) { contents[3] = 'textures/ui/greyBorder' }
  return "§c§2§6§e§6§2§c§e§6" + adjustTextLength(contents[0], 100) + adjustTextLength(contents[1], 200) + adjustTextLength(contents[2], 100) + adjustTextLength(contents[3], 100)
}

system.afterEvents.scriptEventReceive.subscribe((data) => {
  const { id, sourceEntity, message } = data;
  if (id === 'cn:main') {
    sourceEntity.sendMessage(dynamicToastEvent(message))
  }
})

//Coming soon?
// let icon = "textures/ui/bang_icon"

// function IsUnusualBlock(typeId, end) {
//   let includes = typeId.startsWith("unusual_furniture:") && typeId.endsWith(end)
//   return includes
// }

// system.runInterval(() => {
//   for (let player of world.getAllPlayers()) {
//     let playerTags = String(player.getDynamicProperty("tags")).split("|") || []
//     // console.warn(JSON.stringify(playerTags))
//     let newTags = []
//     let hasNewTags = false

//     for (let i = 0; i < player.getComponent("inventory").container.size; i++) {
//       let item = player.getComponent("inventory").container.getItem(i)
//       if (!item || !item.typeId.startsWith("unusual_furniture:")) continue

//       if (IsUnusualBlock(item.typeId, "_coffee_table") && !playerTags.includes("coffee_table") && !newTags.includes("coffee_table")) {
//         player.sendMessage(dynamicToast("§6Coffee Table", "The Coffee Table is mostly decorative, but adds a cozy touch to any room!", icon))
//         newTags.push("coffee_table")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_table") && !playerTags.includes("table") && !newTags.includes("table")) {
//         player.sendMessage(dynamicToast("§6Table", "You can place items on the table. Try right-clicking with food, decorations or whatever you want!", icon))
//         newTags.push("table")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_chair") && !playerTags.includes("chair") && !newTags.includes("chair")) {
//         player.sendMessage(dynamicToast("§6Chair", "You can sit on the chair, perfect for relaxing or reading a book!", icon))
//         newTags.push("chair")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_stool") && !playerTags.includes("stool") && !newTags.includes("stool")) {
//         player.sendMessage(dynamicToast("§6Stool", "You can sit on the stool, perfect for relaxing or reading a book!", icon))
//         newTags.push("stool")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_sofa") && !playerTags.includes("sofa") && !newTags.includes("sofa")) {
//         player.sendMessage(dynamicToast("§6Sofa", "You can sit on the sofa, and even connect it to adjacent sofas!", icon))
//         newTags.push("sofa")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_ceiling_lamp") && !playerTags.includes("ceiling_lamp") && !newTags.includes("ceiling_lamp")) {
//         player.sendMessage(dynamicToast("§6Ceiling Lamp", "You can place a ceiling lamp to brighten up your room, doesn't require redstone!", icon))
//         newTags.push("ceiling_lamp")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_drawer") && !playerTags.includes("drawer") && !newTags.includes("drawer")) {
//         player.sendMessage(dynamicToast("§6Drawer", "You can place a drawer to store your items, same size as a chest!", icon))
//         newTags.push("drawer")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_bench") && !playerTags.includes("bench") && !newTags.includes("bench")) {
//         player.sendMessage(dynamicToast("§6Bench", "You can place a bench to sit on, and even connect it to adjacent benches!", icon))
//         newTags.push("bench")
//         hasNewTags = true
//       }

//       if (IsUnusualBlock(item.typeId, "_pot") && !playerTags.includes("pot") && !newTags.includes("pot")) {
//         player.sendMessage(dynamicToast("§6Pot", "You can place flowers in the pot, and even bamboo!", icon))
//         newTags.push("pot")
//         hasNewTags = true
//       }
//     }

//     if (hasNewTags) {
//       let allTags = [...playerTags, ...newTags].filter(tag => tag !== "")
//       player.setDynamicProperty("tags", allTags.join("|"))
//     }
//   }
// }, 20)

// system.afterEvents.scriptEventReceive.subscribe(result => {
//   if (result.id == "unusual_furniture:reset") {
//     result.sourceEntity.clearDynamicProperties()
//     result.sourceEntity.onScreenDisplay.setActionBar("Cleared all properties")
//   }
// })