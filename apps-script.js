/**
 * NO SUS Landing Page - Google Apps Script
 * 
 * Replace the contents of your Code.gs with this code, then Deploy as a Web App.
 * Make sure the Web App runs as "Me" and allows access to "Anyone".
 */

function doPost(e) {
  try {
    // Open the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if it's a JSON payload
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    // Prepare the row data based on the new form fields
    const row = [
      data.timestamp || new Date().toISOString(),
      data.alphaId || "",
      data.name || "",
      data.email || "",
      data.instagram || "",
      data.userType || "",
      data.shareContent || "",
      data.sharedWithoutPermission || "",
      data.notifyAtLaunch || "No",
      data.alphaTester || "No"
    ];

    // Append to sheet
    sheet.appendRow(row);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
