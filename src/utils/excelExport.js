/**
 * Excel Export Utility
 * Exports report data to Excel format
 */

import * as XLSX from 'xlsx';

export const downloadReportAsExcel = (data, config) => {
  const worksheetData = [
    ['Student Report'],
    [`Assessment: ${config?.examTitle || 'N/A'}`],
    [`Class: ${config?.classNum || 'N/A'}`],
    [`Subject: ${config?.subject || 'N/A'}`],
    [`Teacher: ${config?.teacher || 'N/A'}`],
    [`Generated: ${new Date().toLocaleDateString()}`],
    [],
    ['Name', 'Roll No', 'Correct', 'Wrong', 'Skipped', 'Marks', 'Percentage', 'Grade']
  ];

  data.forEach(row => {
    worksheetData.push([
      row.name,
      row.rollNumber,
      row.correct,
      row.wrong,
      row.skipped,
      row.marks,
      `${row.percentage}%`,
      row.grade
    ]);
  });

  worksheetData.push([]);
  worksheetData.push(['Summary']);
  worksheetData.push(['Total Students', data.length]);
  
  const totalCorrect = data.reduce((sum, d) => sum + d.correct, 0);
  const totalWrong = data.reduce((sum, d) => sum + d.wrong, 0);
  const totalSkipped = data.reduce((sum, d) => sum + d.skipped, 0);
  const avgPercentage = data.length > 0 
    ? (data.reduce((sum, d) => sum + d.percentage, 0) / data.length).toFixed(2) 
    : 0;

  worksheetData.push(['Total Correct', totalCorrect]);
  worksheetData.push(['Total Wrong', totalWrong]);
  worksheetData.push(['Total Skipped', totalSkipped]);
  worksheetData.push(['Average Percentage', `${avgPercentage}%`]);

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const colWidths = [
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 8 }
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  const fileName = `${(config?.examTitle || 'Report').replace(/[^a-zA-Z0-9]/g, '_')}_${config?.classNum || ''}_${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
