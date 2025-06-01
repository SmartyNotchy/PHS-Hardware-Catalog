// This table will be fetched from the database.
const catalogItems = [
  {
    itemName: "Arduino Motor Shield Rev3",
    itemQty: "25/38",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/arduino-motor-shield-rev3.png",
    itemDescription: "",
  },
  {
    itemName: "Arduino Uno Rev3",
    itemQty: "41/45",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/arduino-uno-rev3.png",
    itemDescription: "",
  },
  {
    itemName: "Raspberry Pi 5",
    itemQty: "19/26",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/raspberry-pi-5.png",
    itemDescription: "",
  },
  {
    itemName: "Item 4",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 5",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 6",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 7",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 8",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 9",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 10",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 11",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 12",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
  {
    itemName: "Item 13",
    itemQty: "",
    itemImgLink: "",
    itemDescription: "",
  },
];

function renderCatalog(items) {
  const container = document.getElementById("catalog-container");
  container.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "item";

    const h3 = document.createElement("h3");
    h3.className = "item-name";
    h3.textContent = item.itemName;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";
    const img = document.createElement("img");
    img.src = item.itemImgLink || "";
    img.alt = "";
    imageWrapper.appendChild(img);

    const qty = document.createElement("p");
    qty.className = "qty";
    qty.textContent = item.itemQty;

    button.append(h3);
    button.append(imageWrapper);
    button.append(qty);

    container.append(button);
  });
}

renderCatalog(catalogItems);

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();

  const filteredItems = catalogItems.filter((item) =>
    item.itemName.toLowerCase().includes(query),
  );

  renderCatalog(filteredItems);
});
