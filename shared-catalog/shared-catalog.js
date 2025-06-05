const searchBar = document.querySelector(".search-bar");
const catalogSection = document.querySelector(".catalog-section");
const catalogContainer = document.querySelector(".catalog-container");
const itemTemplate = document.querySelector(".catalog-item-template");
const closeItemInfoButton = document.querySelector(".close-item-info");
const itemInfo = document.querySelector(".item-info");
const usergroup= document.getElementById("user-group");
const catalogItemsContent = [
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

function renderCatalog(itemsContents) {
  catalogContainer.innerHTML = "";

  itemsContents.forEach((itemContents) => {
    const clone = itemTemplate.content.cloneNode(true);
    const itemName = clone.querySelector(".item-name");
    const itemImg = clone.querySelector("img");
    const itemQty = clone.querySelector(".qty");

    itemName.textContent = itemContents.itemName;
    itemImg.src = itemContents.itemImgLink || "";
    itemQty.textContent = itemContents.itemQty;

    catalogContainer.append(clone);
  });
}

function handleCatalogItemClick(e) {
  const item = e.target.closest(".item");
  if (!item) return;

  const itemName = item.querySelector(".item-name").textContent;
  const selectedItem = catalogItemsContent.find((i) => i.itemName === itemName);
  if (!selectedItem) return;

  renderItemInfo(selectedItem);
  openItemInfo();
}
function renderItemInfo(item) {
  const itemName = document.querySelector(".item-name");
  const itemDescription = document.querySelector(".item-description");
  const itemSpecificationsList = document.querySelector(".specifications-list");
  const itemPinsAndPortsList = document.querySelector(".pins-and-ports-list");
  const itemImgLink = document.querySelector(".item-img");
  const itemPinsAndPortsImgLink = document.querySelector(
    ".item-pins-and-ports-img",
  );

  itemName.textContent = "";
  itemDescription.textContent = "";
  itemSpecificationsList.innerHTML = "";
  itemPinsAndPortsList.innerHTML = "";
  itemImgLink.src = "";
  itemPinsAndPortsImgLink.src = "";

  itemName.textContent = item.itemName;
  itemDescription.textContent = item.itemDescription;
  itemImgLink.src = item.itemImgLink || "";
  itemImgLink.alt = "";
  itemPinsAndPortsImgLink.src = item.itemPinsAndPortsImgLink || "";
  itemPinsAndPortsImgLink.alt = "";

  if (!itemSpecificationsList) return;
  item.itemSpecificationsList.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}: </strong>${value}`;
    itemSpecificationsList.appendChild(li);
  });

  if (!itemPinsAndPortsList) return;
  item.itemPinsAndPortsList.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}: </strong>${value}`;
    itemPinsAndPortsList.appendChild(li);
  });
}
function openItemInfo() {
  root.classList.add("show-item-info");
}
function closeItemInfo() {
  root.classList.remove("show-item-info");
}

function filterResults() {
  const query = searchBar.value.toLowerCase();

  const filteredItems = catalogItemsContent.filter((item) =>
    item.itemName.toLowerCase().includes(query),
  );

  renderCatalog(filteredItems);
}

window.addEventListener("load", () => {
  renderCatalog(catalogItemsContent);
  updateScrollBarPadding();
});
searchBar.addEventListener("input", () => {
  filterResults();
  updateScrollBarPadding();
});
function switchcolorpalette() {
  const themeLink = document.getElementById("theme-style");

  // Check the current theme and switch to the opposite one
  if (
    themeLink.getAttribute("href") ===
    "https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/inverse.css"
  ) {
    // Switch to light mode
    themeLink.setAttribute(
      "href",
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/colorpalette.css",
    );
  } else {
    // Switch to dark mode
    themeLink.setAttribute(
      "href",
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/inverse.css",
    );
  }
}
catalogContainer.addEventListener("click", (e) => {
  handleCatalogItemClick(e);
});
closeItemInfoButton.addEventListener("click", () => {
  closeItemInfo();
});


usergroup.text= localStorage.getItem("selectedGroupId", selectedGroupId);