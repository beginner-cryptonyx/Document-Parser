

import json


def update_json(json_path_input, json_path_output, new_data: list[dict]):
    update_ids = {item["id"]: item for item in new_data}

    with open(json_path_input, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Update the data with new_data

    for item in data["texts"]:
        print(f"Processing item with id: {item.get('self_ref')}")
        item_id = item.get("self_ref")

        if item_id in update_ids.keys():
            update_object = update_ids[item_id]

            item["prov"] = [
                {
                    "page_no": 1,
                    "bbox": {
                        "l": update_object["l"],
                        "t": update_object["t"],
                        "r": update_object["r"],
                        "b": update_object["b"],
                    },
                    "charspan": [0, update_object["charspan"]],
                }
            ]
            item["text"] = update_object["text"]

    with open(json_path_output, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
