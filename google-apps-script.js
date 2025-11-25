// Google Apps Script untuk Admin API
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    const sheet = SpreadsheetApp.openById('AKfycbyVnM9JhKx8xj2EZhETj1BdSCnmJxtNBV4eFmohKE0denRS4VEA3JqPI-RVsQFg7ZuEtw');
    
    switch(action) {
      case 'get_doctors':
        return getDoctorsData(sheet);
      case 'add_doctor':
        return addDoctor(sheet, data.data);
      case 'update_doctor':
        return updateDoctor(sheet, data.data);
      case 'delete_doctor':
        return deleteDoctor(sheet, data.id);
      case 'import_data':
        return importData(sheet, data.data);
      default:
        return createResponse('Action not found', false);
    }
  } catch (error) {
    return createResponse(error.toString(), false);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
  
  switch(action) {
    case 'get_doctors':
      return getDoctorsData(sheet);
    case 'get_activity_log':
      return getActivityLog(sheet);
    default:
      return createResponse('Action not found', false);
  }
}

function getDoctorsData(sheet) {
  const doctorsSheet = sheet.getSheetByName('Doctors');
  const data = doctorsSheet.getDataRange().getValues();
  const headers = data[0];
  
  const doctors = data.slice(1).map(row => {
    const doctor = {};
    headers.forEach((header, index) => {
      doctor[header] = row[index];
    });
    return doctor;
  });
  
  return createResponse(doctors, true);
}

function addDoctor(sheet, doctorData) {
  const doctorsSheet = sheet.getSheetByName('Doctors');
  const headers = doctorsSheet.getRange(1, 1, 1, doctorsSheet.getLastColumn()).getValues()[0];
  
  const newRow = headers.map(header => doctorData[header] || '');
  doctorsSheet.appendRow(newRow);
  
  // Log activity
  logActivity(sheet, `Added doctor: ${doctorData.Dokter}`);
  
  return createResponse('Doctor added successfully', true);
}

function logActivity(sheet, activity) {
  const logSheet = sheet.getSheetByName('ActivityLog');
  const timestamp = new Date();
  
  logSheet.appendRow([
    timestamp,
    activity,
    'Admin',
    'SUCCESS'
  ]);
}

function createResponse(data, success) {
  const response = {
    success: success,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}