//Work in progress
import './Drag0nD/index'

import { world } from "@minecraft/server";

import { ActionFormData } from "@minecraft/server-ui"

import { CustomForm } from "./Drag0nD/customForm";

// 16x16 matrix with the characters corresponding to the hexadecimal codes
const matrix = [];
for (let row = 0; row < 16; row++) {
    const charRow = [];
    for (let col = 0; col < 16; col++) {
        const hexCode = ((row << 4) | col).toString(16).toUpperCase().padStart(2, "0");
        const fullCode = "F4" + hexCode;
        const point = parseInt(fullCode, 16);
        charRow.push(String.fromCharCode(point));
    }
    matrix.push(charRow);
}

/**
* @param {import("@minecraft/server").Player} player
* @param {string} title
* @param {string} body
* @param {{ text: any; texture: any; }[]} buttons
*/
function createGuideSection(player, title, body, buttons, actions = {}) {
    player.playSound("item.book.page_turn", { volume: 0.3 })
    let customform = new CustomForm();
    customform.title(title).body(body);

    buttons.forEach(({ text, texture }) => {
        customform.button("Recipes", text, texture, true);
    });

    customform.show(player).then(response => {
        if (response.canceled) return;

        // Busca si hay una acción definida para el botón presionado
        if (actions[response.text]) {
            actions[response.text](player);
        }
    });
}

world.afterEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId == "unusual_furniture:unusual_furniture_recipes_book") {
        guideBook(data.source)

        let form = new ActionFormData()

        if (!data.source.hasTag("unusual_furniture:guide_book")) {
            form.title("Hi!").body("book.unusual_furniture.this_book")

            form.button("Ok!", "textures/ui/check");

            form.show(data.source).then(response => {

                data.source.addTag("unusual_furniture:guide_book")

                if (response.canceled) {
                    guideBook(data.source)
                }
                guideBook(data.source)
            });
        }

        // data.source.onScreenDisplay.setActionBar("§cNot implemented yet")
        // data.source.playSound("note.bass")
    }
});

/**
* @param {import("@minecraft/server").Player} player
* @param {string} title
* @param {string | any[]} pages
* @param {{ (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (player: import("@minecraft/server").Player): void; (arg0: any): void; }} form
*/
function showtext(player, title, pages, form, pageIndex = 0) {

    player.playSound("item.book.page_turn", { volume: 0.3 })

    let form1 = new ActionFormData();

    form1.title(title).body(pages[pageIndex]);

    let buttonIndex = 0;
    let previousPageIndex = -1;
    let nextPageIndex = -1;

    if (pageIndex > 0) {
        previousPageIndex = buttonIndex++;
        form1.button("Previous page", "textures/ui/arrow_left");
    }
    if (pageIndex < pages.length - 1) {
        nextPageIndex = buttonIndex++;
        form1.button("Next page", "textures/ui/arrow_right");
    }

    let okIndex = buttonIndex;
    form1.button("Ok!", "textures/ui/check");

    form1.show(player).then(response => {
        if (response.canceled) return;

        if (response.selection === okIndex) {
            form(player);
        } else if (response.selection === previousPageIndex) {
            showtext(player, title, pages, form, pageIndex - 1);
        } else if (response.selection === nextPageIndex) {
            showtext(player, title, pages, form, pageIndex + 1);
        }
    });
}

/**
* @param {import("@minecraft/server").Player} player
*/
function guideBook(player) {

    player.playSound("item.book.page_turn", { volume: 0.3 })

    let customform = new CustomForm();
    customform.title("§6§lUnusual Furniture. 1st Edition").body("book.unusual_furniture.body");

    // Agregar botones con texturas específicas
    Object.entries(categories).forEach(([section, { texture }]) => {
        customform.button("Recipes", section, texture, true);
    });


    customform.show(player).then(response => {
        if (response.canceled) return;

        // Ejecutar la acción correspondiente si existe
        let selectedCategory = response.text.trim();
        if (categories[selectedCategory]?.action) {
            categories[selectedCategory].action(player);
        }
    });
}

const categories = {
    "book.unusual_furniture.tables": {
        texture: "textures/ui/tables",
        action: tables
    },
    "book.unusual_furniture.coffee_tables": {
        texture: "textures/ui/coffee_tables",
        action: coffeeTables
    },
    "book.unusual_furniture.chairs": {
        texture: "textures/ui/chairs",
        action: chairs
    },
    "book.unusual_furniture.stools": {
        texture: "textures/ui/stools",
        action: stools
    },
    "book.unusual_furniture.sofas": {
        texture: "textures/ui/sofas",
        action: sofas
    },
    "book.unusual_furniture.ceiling_lamps": {
        texture: "textures/ui/ceiling_lamps",
        action: ceiling_lamps
    },
    "book.unusual_furniture.drawers": {
        texture: "textures/ui/drawers",
        action: drawers
    },
    "book.unusual_furniture.benches": {
        texture: "textures/ui/benches",
        action: benches
    },
    "book.unusual_furniture.pots": {
        texture: "textures/ui/pots",
        action: pots
    },
    "book.unusual_furniture.barriers": {
        texture: "textures/ui/barriers",
        action: barriers
    },
    "book.unusual_furniture.open_riser_stairs": {
        texture: "textures/ui/open_riser_stairs",
        action: open_riser_stairs
    },
    "book.unusual_furniture.railings": {
        texture: "textures/ui/railings",
        action: railings
    },
    "book.unusual_furniture.beams": {
        texture: "textures/ui/beams",
        action: beams
    },
    "book.unusual_furniture.carved": {
        texture: "textures/ui/carved",
        action: carved
    },
    "book.unusual_furniture.shelves": {
        texture: "textures/ui/shelves",
        action: shelves
    },
    "book.unusual_furniture.curtains": {
        texture: "textures/ui/curtains",
        action: curtains
    },
    "book.unusual_furniture.lamp_decorations": {
        texture: "textures/ui/lamp_decorations",
        action: lamp_decorations
    },
    "book.unusual_furniture.bags": {
        texture: "textures/ui/mushroom_patch",
        action: bags
    },
    "book.unusual_furniture.miscellaneous": {
        texture: "textures/ui/miscellaneous",
        action: miscellaneous
    },
    "book.unusual_furniture.spooky": {
        texture: "textures/blocks/pumpkin_face_on",
        action: spooky
    }
};

let PLANKS_ORDER = ["Oak", "Spruce", "Birch", "Jungle", "Acacia", "Dark Oak", "Mangrove", "Cherry", "Bamboo", "Crimson", "Warped"];
let WOOL_ORDER = ["White", "Light Gray", "Gray", "Black", "Brown", "Red", "Orange", "Yellow", "Lime", "Green", "Cyan", "Light Blue", "Blue", "Purple", "Magenta", "Pink"]
let POTS_ORDER = ["Greek Pot", "Huge Pot", "Stone Pot", "Tall Terracota Pot", "Bauhaus Pot", "Blackstone Pot", "Fudge Pot", "Hanging Pot", "Large Hanging Pot", "Wooden Hanging Pot"];

// Rangos de la matriz para cada tipo de mobiliario
const matrixRanges = {
    tables: {
        start: [0, 1],
        end: [0, 11]
    },
    coffee_tables: {
        start: [0, 13],
        end: [1, 7]
    },
    chairs: {
        start: [1, 8],
        end: [2, 2]
    },
    stools: {
        start: [2, 3],
        end: [2, 13]
    },
    sofas: {
        start: [2, 14],
        end: [3, 13]
    },
    ceiling_lamps: {
        start: [3, 14],
        end: [4, 9]
    },
    drawers: {
        start: [4, 10],
        end: [5, 4]
    },
    benches: {
        start: [5, 5],
        end: [5, 15]
    },
    pots: {
        start: [6, 0],
        end: [6, 9]
    },
    barriers: {
        start: [6, 10],
        end: [6, 13]
    },
    open_riser_stairs: {
        start: [6, 14],
        end: [7, 8]
    },
    railings: {
        start: [7, 9],
        end: [8, 3]
    },
    carved: {
        start: [8, 4],
        end: [8, 14]
    },
    beams: {
        start: [8, 15],
        end: [9, 11]
    },
    shelves: {
        start: [9, 12],
        end: [10, 6]
    },
    curtains: {
        start: [10, 7],
        end: [11, 6]
    },
    lamp_decorations: {
        start: [11, 7],
        end: [11, 10]
    },
    bags: {
        start: [11, 11],
        end: [11, 14]
    },
    miscellaneous: {
        start: [11, 15],
        end: [12, 8]
    },
    spooky: {
        start: [12, 9],
        end: [12, 14]
    }
};

/**
 * Obtiene el carácter de la matriz usando coordenadas [fila, columna]
 * @param {string} furnitureType - Tipo de mobiliario (tables, chairs, etc.)
 * @param {number} index - Índice del tipo de madera (0-10)
 * @returns {string} Carácter de la matriz
 */
function getMatrixChar(furnitureType, index) {
    const range = matrixRanges[furnitureType];
    if (!range) return matrix[0][0]; // Valor por defecto

    const [startRow, startCol] = range.start;
    const [endRow, endCol] = range.end;

    // Si está en la misma fila
    if (startRow === endRow) {
        const col = startCol + index;
        if (col <= endCol) {
            return matrix[startRow][col];
        }
    }

    // Si necesitas cambiar de fila (para futuras expansiones)
    const totalCols = 16;
    const totalIndex = startRow * totalCols + startCol + index;
    const row = Math.floor(totalIndex / totalCols);
    const col = totalIndex % totalCols;

    return matrix[row][col];
}

function tables(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "tables";
    //Caso especial para industrial table
    specialName = "Industrial Table";
    ingredients = `- 4 Iron Nuggets\n- 1 Iron Ingot`;
    entries.push({
        key: specialName,
        texture: `textures/ui/planks/industrial`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, -1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Table";
        ingredients = `- 3 ${woodType} Slabs\n- 4 Stripped ${woodType} Logs`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, tables)]))
    };

    createGuideSection(
        player,
        "Tables",
        "book.unusual_furniture.tables",
        buttons,
        actions
    );
}

function coffeeTables(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "coffee_tables";
    specialName = "Industrial Coffee Table";
    ingredients = `- 3 Iron Nuggets\n- 1 Iron Ingot`;
    entries.push({
        key: specialName,
        texture: `textures/ui/planks/industrial`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, -1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Coffee Table";
        ingredients = `- 2 ${woodType} Slabs\n- 4 Stripped ${woodType} Logs`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, coffeeTables)]))
    };

    createGuideSection(
        player,
        "Coffee Tables",
        "book.unusual_furniture.coffee_tables",
        buttons,
        actions
    );
}

function chairs(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "chairs";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Chair";
        ingredients = `- 4 ${woodType} Slabs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, chairs)]))
    };

    createGuideSection(
        player,
        "Chairs",
        "book.unusual_furniture.chairs",
        buttons,
        actions
    );
}

function stools(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "stools";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Stool";
        ingredients = `- 2 ${woodType} Slabs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, stools)]))
    };

    createGuideSection(
        player,
        "Chairs",
        "book.unusual_furniture.stools",
        buttons,
        actions
    );
}

function sofas(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "sofas";

    // Generar entradas automáticamente para cada tipo de madera
    WOOL_ORDER.forEach((woolType, index) => {
        // Entrada para table
        specialName = woolType + " Sofa";
        ingredients = `- 4 ${woolType} Wool\n- 2 Planks*\n\n\n*Any type`;
        entries.push({
            key: specialName,
            texture: `textures/ui/wool/${woolType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, sofas)]))
    };

    createGuideSection(
        player,
        "Chairs",
        "book.unusual_furniture.sofas",
        buttons,
        actions
    );
}

function ceiling_lamps(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "ceiling_lamps";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Ceiling Lamp";
        ingredients = `- 3 ${woodType} Planks\n- 1 Torch`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    specialName = "Copper Ceiling Lamp";
    ingredients = `- 3 Copper Ingots\n- 1 Torch`;
    entries.push({
        key: specialName,
        texture: `textures/ui/planks/copper`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 11)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, ceiling_lamps)]))
    };

    createGuideSection(
        player,
        "Ceiling Lamps",
        "book.unusual_furniture.ceiling_lamps",
        buttons,
        actions
    );
}

function drawers(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "drawers";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Drawer";
        ingredients = `- 7 ${woodType} Slabs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, drawers)]))
    };

    createGuideSection(
        player,
        "Ceiling Lamps",
        "book.unusual_furniture.drawers",
        buttons,
        actions
    );
}

function benches(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "benches";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Bench";
        ingredients = `- 5 ${woodType} Planks\n- 1 Iron Ingot`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, benches)]))
    };

    createGuideSection(
        player,
        "Ceiling Lamps",
        "book.unusual_furniture.benches",
        buttons,
        actions
    );
}

function pots(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "pots";

    specialName = "Greek Pot";
    ingredients = `- 4 Nether Quartz\n- 1 Lapis Lazuli`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/greek_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Huge Pot";
    ingredients = `- 4 Bricks`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/huge_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Stone Pot";
    ingredients = `- 4 Stone`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/stone_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Tall Terracota Pot";
    ingredients = `- 3 Brick`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/tall_terracota_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Bauhaus Pot";
    ingredients = `- 3 Nether Quartz\n- 1 Yellow Dye\n- 1 Light Blue Dye`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/bauhaus_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 4)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Blackstone Pot";
    ingredients = `- 2 Blackstone\n- 2 Gold Nuggets`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/blackstone_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 5)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Fudge Pot";
    ingredients = `- 4 Terracota`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/fudge_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 6)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Hanging Pot";
    ingredients = `- 1 String\n- 3 Brick`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/hanging_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 7)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Large Hanging Pot";
    ingredients = `- 1 String\n- 4 Brick`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/large_hanging_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 8)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Wooden Hanging Pot";
    ingredients = `- 1 String\n- 3 Planks*\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/pots/wooden_hanging_pot`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 9)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, pots)]))
    };

    createGuideSection(
        player,
        "Pots",
        "book.unusual_furniture.pots",
        buttons,
        actions
    );
}

function barriers(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "barriers";

    specialName = "Warning Barrier";
    ingredients = `- 2 White Dye\n- 1 Red Dye\n- 3 Iron Ingots\n- 2 Iron Beams`;
    entries.push({
        key: specialName,
        texture: `textures/ui/barriers/warning_barrier`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Works Barrier";
    ingredients = `- 2 Black Dye\n- 1 Yellow Dye\n- 3 Iron Ingots\n- 2 Iron Beams`;
    entries.push({
        key: specialName,
        texture: `textures/ui/barriers/works_barrier`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Danger Barrier";
    ingredients = `- 2 White Dye\n- 1 Yellow Dye\n- 3 Iron Ingots\n- 2 Iron Beams`;
    entries.push({
        key: specialName,
        texture: `textures/ui/barriers/danger_barrier`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Wooden Barrier";
    ingredients = `- 3 Wooden Slabs*\n- 2 Iron Beams\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/barriers/wooden_barrier`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, barriers)]))
    };

    createGuideSection(
        player,
        "Barriers",
        "book.unusual_furniture.barriers",
        buttons,
        actions
    );
}

function open_riser_stairs(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "open_riser_stairs";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Open Riser Stairs";
        ingredients = `- 2 ${woodType} Stairs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, open_riser_stairs)]))
    };

    createGuideSection(
        player,
        "Open Riser Stairs",
        "book.unusual_furniture.open_riser_stairs",
        buttons,
        actions
    );
}

function railings(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "railings";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Railings";
        ingredients = `- 3 Stripped ${woodType} Logs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, railings)]))
    };

    createGuideSection(
        player,
        "Railings",
        "book.unusual_furniture.railings",
        buttons,
        actions
    );
}

function beams(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "beams";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Beam";
        ingredients = `- 2 Stripped ${woodType} Logs`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    specialName = "Decorated Iron Beam";
    ingredients = `- 2 Iron Bars\n- 1 Iron Ingot`;
    entries.push({
        key: specialName,
        texture: `textures/ui/iron_bars`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 11)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Iron Beam";
    ingredients = `- 3 Iron Bars`;
    entries.push({
        key: specialName,
        texture: `textures/ui/iron_bars`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 12)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, beams)]))
    };

    createGuideSection(
        player,
        "Beams",
        "book.unusual_furniture.beams",
        buttons,
        actions
    );
}

function carved(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "carved";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = "Carved " + woodType;
        ingredients = `- 2 ${woodType} Slabs`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, carved)]))
    };

    createGuideSection(
        player,
        "Carved",
        "book.unusual_furniture.carved",
        buttons,
        actions
    );
}

function shelves(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "shelves";

    // Generar entradas automáticamente para cada tipo de madera
    PLANKS_ORDER.forEach((woodType, index) => {
        // Entrada para table
        specialName = woodType + " Shelf";
        ingredients = `- 3 ${woodType} Slabs\n- 2 Sticks`;
        entries.push({
            key: specialName,
            texture: `textures/ui/planks/${woodType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, shelves)]))
    };

    createGuideSection(
        player,
        "Shelves",
        "book.unusual_furniture.shelves",
        buttons,
        actions
    );
}

function curtains(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "curtains";

    // Generar entradas automáticamente para cada tipo de madera
    WOOL_ORDER.forEach((woolType, index) => {
        // Entrada para table
        specialName = woolType + " Curtain";
        ingredients = `- 1 Stick\n- 1 ${woolType} Wool`;
        entries.push({
            key: specialName,
            texture: `textures/ui/wool/${woolType.toLowerCase().replace(' ', '_')}`,
            pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, index)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
        });
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, curtains)]))
    };

    createGuideSection(
        player,
        "Curtains",
        "book.unusual_furniture.curtains",
        buttons,
        actions
    );
}

function lamp_decorations(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "lamp_decorations";

    specialName = "Floor Lamp Decoration (Var. 0)";
    ingredients = `- 1 Decorated Iron Beam\n\n\nMade in a Stonecutter`;
    entries.push({
        key: specialName,
        texture: `textures/ui/lamp_decorations/floor_lamp_var0`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Floor Lamp Decoration (Var. 1)";
    ingredients = `- 1 Decorated Iron Beam\n\n\nMade in a Stonecutter`;
    entries.push({
        key: specialName,
        texture: `textures/ui/lamp_decorations/floor_lamp_var1`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Street Lantern";
    ingredients = `- 2 Iron Bars\n- 1 Redstone Lamp`;
    entries.push({
        key: specialName,
        texture: `textures/ui/lamp_decorations/street_lantern`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Sphere Lantern";
    ingredients = `- 1 Iron Bar\n- 1 Redstone Lamp\n- 1 Glass`;
    entries.push({
        key: specialName,
        texture: `textures/ui/lamp_decorations/sphere_lantern`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, lamp_decorations)]))
    };

    createGuideSection(
        player,
        "Lamp Decorations",
        "book.unusual_furniture.lamp_decorations",
        buttons,
        actions
    );
}

function bags(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "bags";

    specialName = "Bag of mushrooms";
    ingredients = `- 1 Mushroom*\n- 1 Bonemeal\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/items/mushroom_patch`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Bag of Water Plants";
    ingredients = `- 1 Water Plant*\n- 1 Bonemeal\n\n\n*Kelp, Seagrass, Sea Pickle or \nLily Pad`;
    entries.push({
        key: specialName,
        texture: `textures/items/water_plant_bag`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Bag of Tropical Plants";
    ingredients = `- 1 Tropical Plant*\n- 1 Bonemeal\n\n\n*Jungle Sapling, Big Dripleaf, \nSmall Dripleaf or Spore Blossom`;
    entries.push({
        key: specialName,
        texture: `textures/items/tropical_plant_bag`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Bag of Pebbles";
    ingredients = `- 1 Cobblestone\n\n\nMade in a Stonecutter`;
    entries.push({
        key: specialName,
        texture: `textures/items/pebble_bag`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, bags)]))
    };

    createGuideSection(
        player,
        "Bags",
        "book.unusual_furniture.bags",
        buttons,
        actions
    );
}

function miscellaneous(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "miscellaneous";

    specialName = "Wooden Floor Lamp";
    ingredients = `- 2 Paper\n- 1 Torch\n- 1 Wooden Slab*\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/wooden_floor_lamp`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Toolbox";
    ingredients = `- 2 Iron Trapdoors\n- 1 Chest`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/toolbox`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Emergency Fire Hydrant";
    ingredients = `- 1 Fire Hydrant\n- 1 Red Dye`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/emergency_fire_hydrant`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Fire Hydrant";
    ingredients = `- 2 Iron Ingots\n- 2 Iron Nuggets\n- 1 Water Bucket`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/fire_hydrant`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Poster";
    ingredients = `- 1 Ink Sac\n- 1 Paper`;
    entries.push({
        key: specialName,
        texture: `textures/items/poster2`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 4)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Manhole";
    ingredients = `- 2 Iron Nuggets\n- 1 Iron Trapdoor`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/manhole`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 5)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Blackboard Menu";
    ingredients = `- 6 Sticks\n- 2 Cobbled Deepslate Slab`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/blackboard_menu`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 6)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Trash";
    ingredients = `- 7 Iron Nuggets\n- 2 Wooden Slabs*\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/trash`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 7)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Wooden Clock";
    ingredients = `- 2 Wooden Slabs*\n- 1 Clock\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/wooden_clock`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 8)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Mystery Furniture Crate";
    ingredients = `- 8 Planks*\n- 1 Wool*\n\n\n*Any type`;
    entries.push({
        key: specialName,
        texture: `textures/ui/miscellaneous/mystery_furniture_crate`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 9)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, miscellaneous)]))
    };

    createGuideSection(
        player,
        "miscellaneous",
        "book.unusual_furniture.miscellaneous",
        buttons,
        actions
    );
}

function spooky(player) {
    const entries = [];
    let specialName = "";
    let ingredients = ""

    let matrixName = "spooky";

    specialName = "Broom";
    ingredients = `- 1 Stick\n- 1 Screw\n- 1 Wheat`;
    entries.push({
        key: specialName,
        texture: `textures/ui/spooky/broom`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 0)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Rakes";
    ingredients = `- 1 Stick\n- 1 Screw\n- 3 Iron Nugget`;
    entries.push({
        key: specialName,
        texture: `textures/ui/spooky/rakes`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 1)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Grave (Broken)";
    ingredients = `- 1 Stone Brick Slab\n- 1 Screw\n- 1 Chiseled Stone Bricks`;
    entries.push({
        key: specialName,
        texture: `textures/ui/spooky/grave_broken`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 2)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Grave (Skeleton)";
    ingredients = `- 1 Bone\n- 1 Screw\n- 1 Chiseled Stone Bricks`;
    entries.push({
        key: specialName,
        texture: `textures/ui/spooky/grave_skeleton`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 3)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    specialName = "Grave (Creeper)";
    ingredients = `- 1 Gunpowder\n- 1 Screw\n- 1 Chiseled Stone Bricks`;
    entries.push({
        key: specialName,
        texture: `textures/ui/spooky/grave_creeper`,
        pages: [{ "rawtext": [{ "translate": "book.unusual_furniture.entry", "with": [specialName, getMatrixChar(matrixName, 4)] }, { "text": "\n\n\n\n\n\n\n\n\n\n\n" }] }, { "rawtext": [{ "translate": "book.unusual_furniture.ingredients", "with": [ingredients] }] }]
    });

    const buttons = [{ text: "accessibility.button.back", texture: "textures/ui/arrow_left" }, ...entries.map(entry => ({ text: entry.key, texture: entry.texture }))];
    const actions = {
        "accessibility.button.back": () => guideBook(player),
        ...Object.fromEntries(entries.map(entry => [entry.key, () => showtext(player, entry.key, entry.pages, spooky)]))
    };

    createGuideSection(
        player,
        "Spooky",
        "book.unusual_furniture.spooky",
        buttons,
        actions
    );
}