const searchBar = document.querySelector(".search-bar");
const catalogSection = document.querySelector(".catalog-section");
const catalogContainer = document.querySelector(".catalog-container");
const itemTemplate = document.querySelector(".catalog-item-template");
const closeItemInfoButton = document.querySelector(".close-item-info");
const itemInfo = document.querySelector(".item-info");

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
