import os
import json

# Puedes editar este diccionario para asignar sonidos a cada subcarpeta
CATEGORIES = {
    "table": "wood",
    "coffee_table": "wood",
    "chair": "wood",
    "stool": "wood",
    "sofa": "wood",
    "ceiling_lamp": "wood",
    "drawer": "wood",
    "bench": "wood",
    "pot": "decorated_pot",
    "barrier": "heavy_core",
    "carved": "wood",
    "open_riser_stairs": "wood",
    "railing": "wood",
    "beam": "wood",
    "lamp": "heavy_core",
    "curtain": "cloth",
    "shelf": "wood",
    "plush": "cloth"
}

def extraer_identifier(ruta_archivo):
    try:
        with open(ruta_archivo, "r", encoding="utf-8") as f:
            datos = json.load(f)
            bloque = datos.get("minecraft:block", {})
            descripcion = bloque.get("description", {})
            return descripcion.get("identifier")
    except Exception as e:
        print(f"Error leyendo {ruta_archivo}: {e}")
    return None

def main():
    blocks_root = input("Ingresa la ruta de la carpeta 'blocks': ").strip()
    resultado = {"format_version": [1, 1, 0]}

    for subcarpeta in os.listdir(blocks_root):
        carpeta_completa = os.path.join(blocks_root, subcarpeta)
        if not os.path.isdir(carpeta_completa) or subcarpeta not in CATEGORIES:
            continue

        sonido = CATEGORIES[subcarpeta]

        for archivo in os.listdir(carpeta_completa):
            if archivo.endswith(".json"):
                ruta_json = os.path.join(carpeta_completa, archivo)
                identifier = extraer_identifier(ruta_json)
                if identifier:
                    resultado[identifier] = {"sound": sonido}

    salida_path = os.path.join(blocks_root, "blocks.json")
    with open(salida_path, "w", encoding="utf-8") as f:
        json.dump(resultado, f, indent=4)
    
    print(f"'blocks.json' creado en: {salida_path}")

if __name__ == "__main__":
    main()

input("Presiona Enter para salir...")