import os
import json

# Prefijos a convertir
color_variants = [
    "orange", "magenta", "light_blue", "yellow", "lime",
    "pink", "gray", "light_gray", "cyan", "purple",
    "blue", "brown", "green", "red", "black"
]

# Prefijo base
base_color = "white_"

# Pedir carpeta al usuario
folder = input("Ingresa la ruta de la carpeta con los archivos .json: ").strip()

# Validar carpeta
if not os.path.isdir(folder):
    print("❌ La ruta proporcionada no es válida.")
    exit()

# Procesar archivos .json
for filename in os.listdir(folder):
    if filename.endswith(".json") and base_color in filename:
        base_path = os.path.join(folder, filename)

        with open(base_path, "r", encoding="utf-8") as f:
            try:
                content = f.read()
            except Exception as e:
                print(f"❌ Error al leer {filename}: {e}")
                continue

        # Crear copias para cada variante
        for color in color_variants:
            new_content = content.replace(base_color, f"{color}_")
            new_filename = filename.replace(base_color, f"{color}_")
            new_path = os.path.join(folder, new_filename)

            if os.path.exists(new_path):
                print(f"⚠️ Ya existe el archivo: {new_filename}, se omitirá.")
                continue

            try:
                with open(new_path, "w", encoding="utf-8") as out_file:
                    out_file.write(new_content)
                print(f"✅ Archivo creado: {new_filename}")
            except Exception as e:
                print(f"❌ Error al escribir {new_filename}: {e}")
