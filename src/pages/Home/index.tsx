import React, { FC, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from 'antd';

interface IProps{
  setExcelData:(str:string[]) => void;
  excelData:string[];
}

const ExcelImporter:FC<IProps> = (props:IProps) => {
  const {excelData, setExcelData} = props;

  const handleFileUpload = (e) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setExcelData(jsonData?.map(item => item[0]))

      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <Button onClick={handleFileUpload}>上传 Excel 文件</Button>
      {excelData && (
        <div>
          <h2>Excel Data:</h2>
          {/* <pre>{JSON.stringify(excelData?.map(item => item[0]), null, 2)}</pre> */}
        <pre>学生姓名：{excelData.join(',')}</pre>
        </div>
      )}
    </div>
  );
};

export default ExcelImporter;
