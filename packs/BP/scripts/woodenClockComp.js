import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"

server.world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("unusual_furniture:wooden_clock", {
        onPlayerInteract: result => {
            const timeFormat = result.player.getDynamicProperty("unusual_furniture:time_format") || "Real time"
            let form = new ui.ModalFormData()
            form.title('§l§eUnusual §8Furniture - §6Bedrock Edition')
            form.slider('UTC Offset', -7, 12, 1)
            form.dropdown("Select time format", ["Real time", "World time"], timeFormat == "Real time" ? 0 : 1)
            form.submitButton('Accept')
            form.show(result.player).then((r) => {
                if (r.canceled && r.cancelationReason == 'UserBusy') return
                if (r.canceled && r.cancelationReason == 'UserClosed') return
                // console.warn(r.formValues[0], r.formValues[1])
                result.player.setDynamicProperty("unusual_furniture:utc_offset", Number(r.formValues[0]))
                result.player.setDynamicProperty("unusual_furniture:time_format", r.formValues[1])
            })
        }
    })
})

function TimeZone(dateInput, offsetHours) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const utcMs = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localMs = utcMs + (3600000 * offsetHours);
    const localDate = new Date(localMs);
    let hours = localDate.getHours();
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    return `${hours}:${minutes}:${seconds} ${amPm}`;
}

function formatWorldTime(timeOfDayTicks) {
    const ticksPerDay = 24000
    const ticksShifted = (timeOfDayTicks + 6000) % ticksPerDay // 0 -> 00:00
    const hours24 = Math.floor(ticksShifted / 1000)
    const minuteFraction = (ticksShifted % 1000) / 1000 * 60
    const minutes = Math.floor(minuteFraction)
    const seconds = Math.floor((minuteFraction - minutes) * 60)
    const amPm = hours24 >= 12 ? 'PM' : 'AM'
    const hours12 = (hours24 % 12) || 12
    const mm = String(minutes).padStart(2, '0')
    const ss = String(seconds).padStart(2, '0')
    return `${hours12}:${mm}:${ss} ${amPm}`
}

server.system.runInterval(() => {
    for (let player of server.world.getAllPlayers()) {
        if (player.getBlockFromViewDirection({ maxDistance: 8 })?.block.typeId == "unusual_furniture:wooden_clock") {
            const timeStamp = Date.now()
            const UTC_OFFSET = player.getDynamicProperty("unusual_furniture:utc_offset") || -7
            const timeFormat = player.getDynamicProperty("unusual_furniture:time_format") || "Real time"
            if (timeFormat == "Real time") {
                player.onScreenDisplay.setActionBar(`§7(Real time) The time is §e${TimeZone(timeStamp, UTC_OFFSET)}\n§6Right click to configure`)
            } else {
                player.onScreenDisplay.setActionBar(`§7(World time) The time is §e${formatWorldTime(server.world.getTimeOfDay())}\n§6Right click to configure`)
            }
        }
    }
})