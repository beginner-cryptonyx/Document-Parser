# updating json

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
                    "charspan": [
                        0, update_object["charspan"]
                    ]
                }
            ]
            item["text"] = update_object["text"]

    with open(json_path_output, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

my_data = [
    {
        "id": "#/texts/0",
        "text": "Dr. Nandini Rao (edit)",
        "original": "Dr. Nandini Rao",
        "l": 114,
        "t": 120,
        "r": 375,
        "b": 153,
        "charspan": 15,
    },
    {
        "id": "#/texts/1",
        "text": "MBBS, MD (General Medicine) - Reg. No. KMC 48213 Sunrise Clinic, 9th Block, Jayanagar, Bengaluru 560069",
        "original": "MBBS, MD (General Medicine) - Reg. No. KMC 48213 Sunrise Clinic, 9th Block, Jayanagar, Bengaluru 560069",
        "l": 113,
        "t": 165,
        "r": 680,
        "b": 227,
        "charspan": 103,
    },
    {
        "id": "#/texts/2",
        "text": "QF/10/26",
        "original": "QF/10/26",
        "l": 903,
        "t": 325,
        "r": 1052,
        "b": 350,
        "charspan": 8,
    },
    {
        "id": "#/texts/3",
        "text": "Tab. Pantoprazole 40 mag — 1-0-0 before food x # days",
        "original": "1. Tab. Pantoprazole 40 mag — 1-0-0 before food x # days",
        "l": 172,
        "t": 510,
        "r": 1043,
        "b": 565,
        "charspan": 56,
    },
    {
        "id": "#/texts/4",
        "text": "Tab. Ondansetron 4 wg — SOS for Vomiting",
        "original": "2. Tab. Ondansetron 4 wg — SOS for Vomiting",
        "l": 172,
        "t": 569,
        "r": 921,
        "b": 617,
        "charspan": 43,
    },
    {
        "id": "#/texts/5",
        "text": "ORS sachets — after each Loose stool",
        "original": "3. ORS sachets — after each Loose stool",
        "l": 172,
        "t": 633,
        "r": 768,
        "b": 668,
        "charspan": 39,
    },
    {
        "id": "#/texts/6",
        "text": "Cap. Racecadotril 100 wg — 1-1-1x3 days",
        "original": "4. Cap. Racecadotril 100 wg — 1-1-1x3 days",
        "l": 173,
        "t": 691,
        "r": 883,
        "b": 739,
        "charspan": 42,
    },
    {
        "id": "#/texts/7",
        "text": "Adv: Plenty of fluids, soft diet. Review after 3 da ys.",
        "original": "Adv: Plenty of fluids, soft diet. Review after 3 da ys.",
        "l": 172,
        "t": 956,
        "r": 977,
        "b": 1010,
        "charspan": 55,
    },
    {
        "id": "#/texts/8",
        "text": "a",
        "original": "a",
        "l": 812.6666666666666,
        "t": 577.3333333333333,
        "r": 882.3333333333334,
        "b": 531,
        "charspan": 1,
    },
    {
        "id": "#/texts/9",
        "text": "NSN",
        "original": "NSN",
        "l": 947.6666666666666,
        "t": 577.3333333333333,
        "r": 1067.6666666666667,
        "b": 531,
        "charspan": 3,
    },
    {
        "id": "#/texts/10",
        "text": "Signature",
        "original": "Signature",
        "l": 894,
        "t": 1276,
        "r": 990,
        "b": 1298,
        "charspan": 9,
    },
    {
        "id": "#/texts/11",
        "text": "Clinic hours 9 am - 1 pm, 5 pm - 8 pm - Ph 080-2663 1200",
        "original": "Clinic hours 9 am - 1 pm, 5 pm - 8 pm - Ph 080-2663 1200",
        "l": 370,
        "t": 144,
        "r": 911,
        "b": 119,
        "charspan": 56,
    },
]



update_json("backend/package/test/output.json","backend/package/test/edited_output.json", my_data)