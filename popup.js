document.getElementById("download-button").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getTableData,
    });
  });

function getTableData() {
  const table = document.querySelector("table"); 
  if (!table) {
    console.error("No table found on this page");
    return;
  }

  const rows = table.querySelectorAll("tr");
  const data = [];
  for (const row of rows) {
    const cells = row.querySelectorAll("td, th");
    const rowData = [];
    for (const cell of cells) {
      rowData.push(cell.textContent.trim());
    }
    data.push(rowData);
  }

  const csvContent = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  const filename = "table_data.csv";
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  downloadLink.click();
}
