// Вставь этот код в Google Apps Script (Расширения → Apps Script)

const SHEET_ID = '1-s_dIG1skLHWFcCa7Fad4X004AeNgytgaDkXYvTe56o';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Лист1');
    
    sheet.appendRow([
      new Date().toLocaleString('ru-RU'),  // Дата и время
      data.email,                           // Email
      data.source || 'cloone-landing',      // Источник
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Для теста из браузера
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Cloone Leads API работает' }))
    .setMimeType(ContentService.MimeType.JSON);
}
