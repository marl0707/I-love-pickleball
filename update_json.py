import json
import os

data_path = r"c:\Users\sejim\OneDrive\デスクトップ\Ronshoal_Tech_Base\02_Development\I-love-pickleball\data\paddles\other_major_brands.json"
with open(data_path, 'r', encoding='utf-8') as f:
    paddles = json.load(f)

updates = {
    "Radical Tour 14mm": {"official_url": "https://www.head.com/en/product/radical-tour-raw-2024-200044", "image_url": "https://cdn11.bigcommerce.com/s-961daaf/images/stencil/1280x1280/products/2884/24996/Head-Radical-Tour-Raw-Pickleball-Paddle-Hero__52533.1706649779.jpg"},
    "Radical Tour GR 16mm": {"official_url": "https://pickleballcentral.com/radical-tour-graphite-paddle-by-head-226007/", "image_url": "https://cdn11.bigcommerce.com/s-961daaf/images/stencil/1280x1280/products/1264/11546/Head-Radical-Tour-Graphite-Pickleball-Paddle-Hero__07663.1666632617.jpg"},
    "Extreme Tour 14mm": {"official_url": "https://www.head.com/en/product/extreme-tour-2024-200034", "image_url": "https://cdn11.bigcommerce.com/s-961daaf/images/stencil/1280x1280/products/2887/25010/Head-Extreme-Tour-2024-Pickleball-Paddle-Hero__30347.1706651213.jpg"},
    "Gravity Tour 16mm": {"official_url": "https://www.head.com/en/product/gravity-tour-2024-200024", "image_url": "https://cdn11.bigcommerce.com/s-961daaf/images/stencil/1280x1280/products/2881/24982/Head-Gravity-Tour-2024-Pickleball-Paddle-Hero__39511.1706649230.jpg"},
    "VCORE 16": {"official_url": "https://us.yonex.com/products/vcore-pickleball-paddle", "image_url": "https://us.yonex.com/cdn/shop/files/VCORE.jpg"},
    "VCORE 13": {"official_url": "https://us.yonex.com/products/vcore-pickleball-paddle", "image_url": "https://us.yonex.com/cdn/shop/files/VCORE.jpg"},
    "EZONE 16": {"official_url": "https://us.yonex.com/products/ezone-pickleball-paddle", "image_url": "https://us.yonex.com/cdn/shop/files/NAV_Racquets_Ezone_D.jpg"},
    "Project Zero Tour 16mm": {"official_url": "https://www.wilson.com/en-us/product/blaze-tour-16mm-pickleball-paddle-wr15770", "image_url": "https://www.justpaddles.com/images/products/wilson-blaze-tour-16mm-pickleball-paddle_39103_1.jpg"},
    "Juice Tour 14mm": {"official_url": "https://www.wilson.com/en-us/product/juice-xl-pickleball-paddle-wr14550", "image_url": "https://images.clothes.com/is/image/Clothes/wr14550_0_juice_xl_pickleball_paddle_hero"},
    "Clash Tour 16mm": {"official_url": "https://www.wilson.com/en-us/product/clash-pickleball-paddle-wr055211u", "image_url": "https://images.clothes.com/is/image/Clothes/wr055211u_0_clash_pickleball_paddle_hero"},
    "RNGD Touch 16mm": {"official_url": "https://www.babolat.com/us/rngd/100-160027.html", "image_url": "https://s.babolat.com/image/upload/f_auto,q_auto,c_pad,w_800,h_800/v1689252000/Product_Visuals/Pickleball/Paddles/RNGD/RNGD_TOUCH_A_160027_100.png"},
    "RNGD Power 14mm": {"official_url": "https://www.babolat.com/us/rngd/100-160027.html", "image_url": "https://s.babolat.com/image/upload/f_auto,q_auto,c_pad,w_800,h_800/v1689252000/Product_Visuals/Pickleball/Paddles/RNGD/RNGD_TOUCH_A_160027_100.png"},
    "MNSTR 16mm": {"official_url": "https://www.babolat.com/us/mnstr/100-160025.html", "image_url": "https://s.babolat.com/image/upload/f_auto,q_auto,c_pad,w_800,h_800/v1689252000/Product_Visuals/Pickleball/Paddles/MNSTR/MNSTR_TOUCH_A_160010_100.png"}
}

count = 0
for p in paddles:
    name = p['product_name']
    if name in updates:
        p['official_url'] = updates[name]['official_url']
        p['image_url'] = updates[name]['image_url']
        count += 1

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(paddles, f, ensure_ascii=False, indent=4)

print(f"Updated {count} models successfully.")
