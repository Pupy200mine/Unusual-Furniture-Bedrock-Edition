import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe(result => {
    if (result.itemStack.typeId == "unusual_furniture:unusual_furniture_book") book(result.source)
})

function book(player) {
    const mimenu = new ActionFormData()
        .title('§l§eUnusual §8Furniture - §6Credits')
        .body('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDid I forget someone?... I hope not...');
    mimenu.show(player).then((r) => {
        if (r.canceled && r.cancelationReason == 'UserBusy') miMenu(player)
        if (r.canceled && r.cancelationReason == 'UserClosed') return;
    });
}