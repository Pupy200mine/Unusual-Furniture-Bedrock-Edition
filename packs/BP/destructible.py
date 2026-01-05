import os
import json

def agregar_componente(path, segundos):
    for root, _, files in os.walk(path):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)

                    if "minecraft:block" in data:
                        block = data["minecraft:block"]
                        if "components" not in block:
                            block["components"] = {}

                        if "minecraft:destructible_by_mining" not in block["components"]:
                            block["components"]["minecraft:destructible_by_mining"] = {
                                "seconds_to_destroy": segundos
                            }

                            with open(file_path, "w", encoding="utf-8") as f:
                                json.dump(data, f, indent=4)

                            print(f"Agregado a: {file_path}")

                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    print(f"Error al procesar {file_path}: {e}")

if __name__ == "__main__":
    while True:
        carpeta = input("\nIngresa la ruta de la carpeta 'blocks' (o escribe 'salir' para terminar): ").strip()
        if carpeta.lower() == "salir":
            break
        if not os.path.isdir(carpeta):
            print("La ruta proporcionada no es válida.")
            continue
        try:
            segundos = float(input("Ingresa el valor de 'seconds_to_destroy': ").strip())
            agregar_componente(carpeta, segundos)
        except ValueError:
            print("El valor ingresado no es un número válido.")
