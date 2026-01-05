import os
import json

# Puedes editar este diccionario para agregar tus sufijos personalizados
CATEGORIES = {
    "_coffee_table": "unusual_furniture:itemGroup.name.coffee_table",
    "_table": "unusual_furniture:itemGroup.name.table", 
    "_chair": "unusual_furniture:itemGroup.name.chair",
    "_sofa": "unusual_furniture:itemGroup.name.sofa",
    "_stool": "unusual_furniture:itemGroup.name.stool",
    "_ceiling_lamp": "unusual_furniture:itemGroup.name.ceiling_lamp",
    "_drawer": "unusual_furniture:itemGroup.name.drawer",
    "_bench": "unusual_furniture:itemGroup.name.bench",
    "_pot": "unusual_furniture:itemGroup.name.pot",
    "_barrier": "unusual_furniture:itemGroup.name.barrier",
    "_open_riser_stairs": "unusual_furniture:itemGroup.name.open_riser_stairs",
    "_railing": "unusual_furniture:itemGroup.name.railing",
    "_beam": "unusual_furniture:itemGroup.name.beam",
    "_shelf": "unusual_furniture:itemGroup.name.shelf",
    "_plush": "unusual_furniture:itemGroup.name.plush",
    "_curtain": "unusual_furniture:itemGroup.name.curtain",
}

MISC_CATEGORY = "unusual_furniture:itemGroup.name.miscellaneous"

def get_identifier(file_path, key):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            if key in data and "description" in data[key]:
                # Verificar si la categoría del menú es "none"
                menu_category = data[key]["description"].get("menu_category", {}).get("category")
                if menu_category == "none":
                    return None
                return data[key]["description"].get("identifier")
    except Exception as e:
        print(f"Error leyendo {file_path}: {e}")
    return None

def categorize_item(identifier, file_path):

    #Agregar manualmente unusual_furniture:blackboard_menu
    # if identifier == "unusual_furniture:blackboard_menu":
    #     return "unusual_furniture:itemGroup.name.barrier"

    BLOCKS_LIST = ["unusual_furniture:broom", "unusual_furniture:rakes", "unusual_furniture:grave_broken", "unusual_furniture:grave_skeleton", "unusual_furniture:grave_creeper" ]
    if identifier in BLOCKS_LIST:
        return "unusual_furniture:itemGroup.name.spooky"

    BLOCKS_LIST = ["unusual_furniture:unusual_furniture_book", "unusual_furniture:unusual_furniture_recipes_book"]
    #Ignorar estos items    
    if identifier in BLOCKS_LIST:
        return None

    #Si termina en _plant ignorar
    if identifier.endswith("_plant"):
        return None
    
    #Si inicia con carved_ agregar a unusual_furniture:itemGroup.name.carved
    if identifier.startswith("unusual_furniture:carved_"):
        return "unusual_furniture:itemGroup.name.carved"
    
    # BLOCKS_LIST = ["unusual_furniture:poster", "unusual_furniture:trash", "unusual_furniture:fire_hydrant", "unusual_furniture:emergency_fire_hydrant", "unusual_furniture:manhole", "unusual_furniture:decorative_toolbox", "unusual_furniture:blackboard_menu"]
    # if identifier in BLOCKS_LIST:
    #     return "unusual_furniture:itemGroup.name.miscellaneous"

    # Si es "unusual_furniture:mystery_crate" agregar a "unusual_furniture:itemGroup.name.plush"
    if identifier == "unusual_furniture:mystery_crate":
        return "unusual_furniture:itemGroup.name.plush"
    
    BLOCKS_LIST = ["unusual_furniture:floor_lamp_decoration_villager", "unusual_furniture:floor_lamp_decoration_bat", "unusual_furniture:iron_lamp", "unusual_furniture:sphere_lamp"]
    if identifier in BLOCKS_LIST:
        return "unusual_furniture:itemGroup.name.lamp_decoration"
    
    BLOCKS_LIST = ["unusual_furniture:water_plants", "unusual_furniture:mushroom_patch","unusual_furniture:tropical_plants", "unusual_furniture:pebble_bag"]
    if identifier in BLOCKS_LIST:
        return "unusual_furniture:itemGroup.name.bag_plants"


    for suffix, category in CATEGORIES.items():
        if identifier.endswith(suffix):
            return category
    return MISC_CATEGORY

def process_folder(folder_path, key, items_to_add, ignore_folder=None):
    for root, _, files in os.walk(folder_path):
        if ignore_folder and ignore_folder in root:
            continue
        # Ordenar archivos para procesamiento consistente
        for file_name in sorted(files):
            if file_name.endswith(".json"):
                file_path = os.path.join(root, file_name)
                identifier = get_identifier(file_path, key)
                if identifier:
                    category = categorize_item(identifier, file_path)
                    if category:
                        items_to_add.setdefault(category, []).append(identifier)

def sort_items(items):
    wood_priority = ["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "crimson", "warped"]
    color_priority = ["white", "light_gray", "gray", "black", "brown", "red", "orange", "yellow", "lime", "green", "cyan", "light_blue", "blue", "purple", "magenta", "pink"]
    
    # Listas especiales que mantienen su orden específico
    spooky_order = ["unusual_furniture:broom", "unusual_furniture:rakes", "unusual_furniture:grave_broken", "unusual_furniture:grave_skeleton", "unusual_furniture:grave_creeper"]
    lamp_order = ["unusual_furniture:floor_lamp_decoration_villager", "unusual_furniture:floor_lamp_decoration_bat", "unusual_furniture:iron_lamp", "unusual_furniture:sphere_lamp"]
    plants_order = ["unusual_furniture:water_plants", "unusual_furniture:mushroom_patch", "unusual_furniture:tropical_plants", "unusual_furniture:pebble_bag"]
    
    def item_priority(item):
        # Verificar si está en alguna lista especial
        if item in spooky_order:
            return (0, spooky_order.index(item))
        if item in lamp_order:
            return (0, lamp_order.index(item))
        if item in plants_order:
            return (0, plants_order.index(item))
            
        parts = item.split(':')[1].split('_')
        
        # Verificar si es un item de color
        for part in parts:
            if part in color_priority:
                return (1, color_priority.index(part))
            
        # Verificar si es un item de madera
        for part in parts:
            if part == "dark" and "oak" in parts:
                return (2, wood_priority.index("dark_oak"))
            if part in wood_priority:
                return (2, wood_priority.index(part))
        
        return (3, 0)  # Para items que no son ni de color ni de madera
        
    return sorted(items, key=item_priority)

def clear_catalog_items(crafting_catalog_path):
    try:
        with open(crafting_catalog_path, 'r') as file:
            catalog = json.load(file)
        for category in catalog["minecraft:crafting_items_catalog"]["categories"]:
            for group in category["groups"]:
                group["items"] = []
        with open(crafting_catalog_path, 'w') as file:
            json.dump(catalog, file, indent=4)
        print("Todos los ítems han sido eliminados del catálogo.")
    except Exception as e:
        print(f"Error limpiando el catálogo: {e}")

def update_crafting_catalog(crafting_catalog_path, items_to_add):
    try:
        with open(crafting_catalog_path, 'r') as file:
            catalog = json.load(file)

        for category in catalog["minecraft:crafting_items_catalog"]["categories"]:
            for group in category["groups"]:
                group_name = group["group_identifier"].get("name")
                if group_name in items_to_add:
                    group["items"] = sort_items(list(set(items_to_add[group_name])))

        with open(crafting_catalog_path, 'w') as file:
            json.dump(catalog, file, indent=4)
        print("Catálogo actualizado correctamente.")
    except Exception as e:
        print(f"Error actualizando el catálogo: {e}")

def main():
    bp_folder = input("Ingresa la ruta de la carpeta 'BP': ").strip()
    items_folder = os.path.join(bp_folder, "items")
    blocks_folder = os.path.join(bp_folder, "blocks")
    catalog_folder = os.path.join(bp_folder, "item_catalog")

    crafting_catalog_path = None
    for root, _, files in os.walk(catalog_folder):
        for file_name in files:
            if file_name == "crafting_item_catalog.json":
                crafting_catalog_path = os.path.join(root, file_name)
                break

    if not crafting_catalog_path:
        print("No se encontró el archivo 'crafting_item_catalog.json'.")
        return

    clear_catalog_items(crafting_catalog_path)

    items_to_add = {}
    process_folder(items_folder, "minecraft:item", items_to_add)
    process_folder(blocks_folder, "minecraft:block", items_to_add, ignore_folder="blocks/crops")

    if items_to_add:
        update_crafting_catalog(crafting_catalog_path, items_to_add)
    else:
        print("No se encontraron ítems ni bloques para agregar al catálogo.")

if __name__ == "__main__":
    main()
