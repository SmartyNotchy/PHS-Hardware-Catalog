function arrangeBoxes() {
  const container = document.getElementById('.bottom-main');
  const boxes = container.children;
  const numBoxes = boxes.length;

  const columns = Math.ceil(Math.sqrt(numBoxes));
  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}



arrangeBoxes();
