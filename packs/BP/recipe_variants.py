import os
import json

# Prefijos a convertir
wood_variants = [
    "spruce", "birch", "jungle", "acacia", "dark_oak",
    "mangrove", "cherry", "bamboo", "crimson", "warped"
]

# Prefijo base
base_wood = "oak_"

while True:
    # Pedir carpeta al usuario
    folder = input("Ingresa la ruta de la carpeta con los archivos .json (o 'salir' para terminar): ").strip()
    
    if folder.lower() == 'salir':
        break
        
    # Validar carpeta
    if not os.path.isdir(folder):
        print("❌ La ruta proporcionada no es válida.")
        continue

    # Procesar archivos .json
    for filename in os.listdir(folder):
        if filename.endswith(".json") and base_wood in filename:
            base_path = os.path.join(folder, filename)

            with open(base_path, "r", encoding="utf-8") as f:
                try:
                    content = f.read()
                except Exception as e:
                    print(f"❌ Error al leer {filename}: {e}")
                    continue

            # Crear copias para cada variante
            for wood in wood_variants:
                new_content = content.replace(base_wood, f"{wood}_")
                
                # Realizar reemplazos específicos
                if wood == "bamboo":
                    new_content = new_content.replace("bamboo_log", "bamboo_block")
                elif wood == "crimson":
                    new_content = new_content.replace("stripped_crimson_log", "stripped_crimson_stem")
                elif wood == "warped":
                    new_content = new_content.replace("stripped_warped_log", "stripped_warped_stem")
                    
                new_filename = filename.replace(base_wood, f"{wood}_")
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
