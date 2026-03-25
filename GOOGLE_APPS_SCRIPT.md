# Google Apps Script for Vehicle Loading Tracker

Copy and paste the following code into your Google Apps Script editor (`Extensions > Apps Script`).

## Code.gs

```javascript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const SHEET_NAME = 'LoadingData'; // Change to your sheet name

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Vehicle Loading Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getVehicles() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map((row, index) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    obj.rowId = index + 2; // Row number in sheet
    return obj;
  });
}

function updateStatus(rowId, status, columnName, timestamp) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const statusCol = headers.indexOf('Status') + 1;
  const targetCol = headers.indexOf(columnName) + 1;
  const percentageCol = headers.indexOf('Percentage') + 1;
  
  const percentages = {
    'Check In': 25,
    'Checking': 50,
    'Handover': 75,
    'Check Out': 100
  };

  if (statusCol > 0) sheet.getRange(rowId, statusCol).setValue(status);
  if (targetCol > 0) sheet.getRange(rowId, targetCol).setValue(timestamp);
  if (percentageCol > 0) sheet.getRange(rowId, percentageCol).setValue(percentages[status] || 0);
  
  if (status === 'Check Out') {
    calculateTotalTime(rowId, sheet, headers);
  }
  
  return { success: true };
}

function calculateTotalTime(rowId, sheet, headers) {
  const checkInCol = headers.indexOf('Check In') + 1;
  const checkOutCol = headers.indexOf('Check Out') + 1;
  const totalTimeCol = headers.indexOf('Total Time') + 1;
  
  if (checkInCol > 0 && checkOutCol > 0 && totalTimeCol > 0) {
    const checkIn = new Date(sheet.getRange(rowId, checkInCol).getValue());
    const checkOut = new Date(sheet.getRange(rowId, checkOutCol).getValue());
    
    if (checkIn && checkOut) {
      const diffMs = checkOut - checkIn;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      sheet.getRange(rowId, totalTimeCol).setValue(diffHrs + "h " + diffMins + "m");
    }
  }
}
```

## Sheet Structure (Headers)

Ensure your Google Sheet has these headers in the first row:

1. `SEQ Loading`
2. `Delivery Date`
3. `TRIP_C`
4. `Trip`
5. `SUB`
6. `Plan Load`
7. `Driver name / Phone number`
8. `Vehicle Info`
9. `Status`
10. `Check In`
11. `Checking`
12. `Handover`
13. `Check Out`
14. `Total Time`
15. `Percentage`
16. `Remark`
