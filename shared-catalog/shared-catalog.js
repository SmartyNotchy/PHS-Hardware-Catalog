const searchBar = document.querySelector(".search-bar");
const catalogSection = document.querySelector(".catalog-section");
const catalogContainer = document.querySelector(".catalog-container");
const itemTemplate = document.querySelector(".catalog-item-template");
const closeItemInfoButton = document.querySelector(".close-item-info");
const itemInfo = document.querySelector(".item-info");

// This table will be fetched from the database.
const catalogItemsContent = [
  {
    itemName: "Arduino Motor Shield Rev3",
    itemQty: "25/38",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/arduino-motor-shield-rev3.png",
    itemPinsAndPortsImgLink: "",
    itemDescription:
      "The Arduino Motor Shield Rev3 is an expansion board that allows an Arduino board to control DC motors, stepper motors, and relays. It is based on the L298P dual full-bridge driver, which enables bidirectional control of two DC motors or one stepper motor, with support for speed and direction control using PWM signals.",
    itemSpecificationsList: [
      ["Motor Driver", "L298P dual full-bridge driver"],
      ["Operating Voltage", "5V (from Arduino)"],
      ["Motor Voltage Supply (Vin)", "6V to 12V recommended"],
      ["Max Current per Channel", "2A continuous, 4A peak"],
      ["Number of Channels", "2"],
      ["PWM Frequency", "Up to 20 kHz"],
    ],
    itemPinsAndPortsList: [
      ["D3", "Motor A PWM"],
      ["D8", "Brake B"],
      ["D9", "Brake A"],
      ["D11", "Motor B PWM"],
      ["D12", "Motor A Direction"],
      ["D13", "Motor B Direction"],
      ["Vin", "External motor power (6-12V recommended)"],
      ["OUT A", "Motor A output"],
      ["OUT B", "Motor B output"],
    ],
  },
  {
    itemName: "Arduino Uno Rev3",
    itemQty: "41/45",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/arduino-uno-rev3.png",
    itemPinsAndPortsImgLink: "",
    itemDescription:
      "The Arduino Uno Rev3 is a microcontroller board based on the ATmega328P. It features 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, and more. It is ideal for beginners and widely supported by the Arduino community.",
    itemSpecificationsList: [
      ["Microcontroller", "ATmega328P"],
      ["Operating Voltage", "5V"],
      ["Input Voltage (recommended)", "7-12V"],
      ["Digital I/O Pins", "14 (of which 6 provide PWM output)"],
      ["Analog Input Pins", "6"],
      ["DC Current per I/O Pin", "20 mA"],
      ["Flash Memory", "32 KB (ATmega328P) of which 0.5 KB used by bootloader"],
      ["SRAM", "2 KB"],
      ["EEPROM", "1 KB"],
      ["Clock Speed", "16 MHz"],
    ],
    itemPinsAndPortsList: [
      ["D0–D13", "Digital I/O pins"],
      ["A0–A5", "Analog input pins"],
      ["PWM Pins", "D3, D5, D6, D9, D10, D11"],
      ["Power", "Vin, 3.3V, 5V, GND"],
      ["USB", "USB Type-B for programming/power"],
      ["ICSP", "In-Circuit Serial Programming header"],
    ],
  },
  {
    itemName: "Raspberry Pi 5",
    itemQty: "19/26",
    itemImgLink:
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/images/raspberry-pi-5.png",
    itemPinsAndPortsImgLink: "",
    itemDescription:
      "The Raspberry Pi 5 is a high-performance single-board computer featuring a quad-core ARM Cortex-A76 processor, dual 4K HDMI outputs, PCIe support, and improved power delivery. It is suitable for desktop computing, IoT, and embedded projects.",
    itemSpecificationsList: [
      ["Processor", "Quad-core Cortex-A76 @ 2.4GHz"],
      ["RAM Options", "4GB or 8GB LPDDR4X"],
      ["Video Output", "Dual micro-HDMI (up to 4Kp60)"],
      ["Networking", "Gigabit Ethernet, Wi-Fi 802.11ac, Bluetooth 5.0"],
      ["Storage", "microSD slot, PCIe 2.0 via FFC"],
      ["USB Ports", "2 × USB 3.0, 2 × USB 2.0"],
      ["GPIO", "40-pin header"],
      ["Power Supply", "USB-C, 5V/5A"],
    ],
    itemPinsAndPortsList: [
      ["GPIO", "40-pin general-purpose header"],
      ["HDMI", "2 × micro-HDMI ports"],
      ["USB", "2 × USB 3.0, 2 × USB 2.0"],
      ["Ethernet", "Gigabit Ethernet port"],
      ["Camera Connector", "2-lane MIPI CSI connector"],
      ["Display Connector", "2-lane MIPI DSI connector"],
      ["Power", "USB-C power input"],
      ["PCIe", "1-lane PCI Express 2.0 via FFC"],
    ],
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
  const themeLink = document.getElementById('theme-style');

  // Check the current theme and switch to the opposite one
  if (themeLink.getAttribute('href') === 'https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/inverse.css') {
    // Switch to light mode
    themeLink.setAttribute('href', 'https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/colorpalette.css');
  } else {
    // Switch to dark mode
    themeLink.setAttribute('href', 'https://smartynotchy.github.io/PHS-Hardware-Catalog/blob/main/global/inverse.css');
  }
}
catalogContainer.addEventListener("click", (e) => {
  handleCatalogItemClick(e);
});
closeItemInfoButton.addEventListener("click", () => {
  closeItemInfo();
});
