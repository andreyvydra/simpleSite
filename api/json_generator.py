import json
import random
import requests

x_values = [-3, -2, -1, 0, 1, 2, 3, 4, 5]
y_min, y_max = (-4, 2)
r_values = [1, 1.5, 2, 2.5, 3]
data = []
for _ in range(1500):
    j = {
        "parsedX": float(random.choice(x_values)),
        "parsedY": float(random.randint(y_min, y_max)),
        "parsedR": float(random.choice(r_values))
    }
    data.append(requests.post("http://localhost:8000/api/result.php", data=j).json())
with open("data.json", "w") as json_file:
    json_file.write(json.dumps(data))
