import React, { useRef, useEffect, useState } from 'react';
import { Button,Space } from 'antd';
import Home from '../Home/index';

const CanvasRectSelection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [rectangles, setRectangles] = useState({}); // 用于存储绘制的矩形列表
  const [excelData,setExcelData] = useState([]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 清空 Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制正在绘制的矩形
        if (isDrawing) {
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          const rectX = Math.min(startX, endX);
          const rectY = Math.min(startY, endY);
          const rectWidth = Math.abs(endX - startX);
          const rectHeight = Math.abs(endY - startY);
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        }
        if (excelData.length !== 0) {
          ctx.fillStyle = 'black';
          ctx.font = '16px Arial';
          const textX = startX + (rectangles.width - ctx.measureText(excelData[0]).width) / 2; // 计算文本的水平位置
          const textY = startY + rectangles.height / 2; // 计算文本的垂直位置
          ctx.fillText(excelData[0], textX, textY);
        }
        
      }
    }

  }, [isDrawing, startX, startY, endX, endY, rectangles,excelData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      setRectangles({})
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setStartX(mouseX);
      setStartY(mouseY);
      setEndX(mouseX);
      setEndY(mouseY);
      setIsDrawing(true);
      console.log('起始点为：',mouseX,mouseY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setEndX(mouseX);
      setEndY(mouseY);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
   
    if (isDrawing) {
      setIsDrawing(false);
      // 添加绘制的矩形到列表
      const rectX = Math.min(startX, endX);
      const rectY = Math.min(startY, endY);
      const rectWidth = Math.abs(endX - startX);
      const canvas = canvasRef.current;
      const rectHeight = Math.abs(endY - startY);
       const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
    
      console.log('鼠标松开位置坐标：', mouseX, mouseY);

      setRectangles({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });

    }
  };

  // const handlePrint = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const printWindow = window.open('', '_blank');
  //     if(printWindow){
  //       printWindow.document.open();

  //       // 创建打印页面的 HTML 结构
  //           printWindow.document.write(`
  //         <html>
  //           <head>
  //             <title>Print</title>
  //             <style>
  //               @page {
  //                 size: auto;
  //                 margin: 0;
  //               }
  //               body {
  //                 margin: 0;
  //               }
  //             </style>
  //           </head>
  //           <body>
  //             <img src="${canvas}" style="width: 100%; height: auto;">
  //           </body>
  //         </html>
  //       `);
  
  //       const image = new Image();
  //       image.src = canvas.toDataURL();
  //       image.onload = () => {
  //         // 在新窗口的文档中插入加载完成的图像
  //         printWindow.document.body.appendChild(image);
  //         printWindow.document.write('</body></html>');
  //         printWindow.document.close();
  //         printWindow.print();
  //         printWindow.close();
  //       };
  //     }
  //   }
  // };

// const handlePrint = () => {
//      if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const printWindow = window.open('', '_blank');
//       if(printWindow){
//         printWindow.document.open();
//         const pageHeight = 200;
//         const dataPerPage = 1;
//         excelData.forEach((data,index) => {
//           const pageIndex = Math.floor(index/dataPerPage);
//           ctx?.fillText(data,startX,setEndY);
//           if ((index + 1) % dataPerPage === 0 || index === excelData.length - 1) {
//             if (pageIndex < Math.floor(excelData.length / dataPerPage)) {
//               // 如果不是最后一页，则增加新页
//               ctx.fillText(`第 ${pageIndex + 1} 页`, 700, pageHeight - 20);
//               ctx.strokeRect(50, 50, 700, pageHeight - 40);
//               canvas.style.pageBreakAfter = 'always'; // 分页打印
//             }
//           }
//         })
//       }

//                 printWindow.document.write(`
//           <html>
//             <head>
//               <title>Print</title>
//               <style>
//                 @page {
//                   size: auto;
//                   margin: 0;
//                 }
//                 body {
//                   margin: 0;
//                 }
//               </style>
//             </head>
//             <body>
//               <img src="${canvas}" style="width: 100%; height: auto;">
//             </body>
//           </html>
//         `);
  
//         const image = new Image();
//         image.src = canvas.toDataURL();
//         image.onload = () => {
//           // 在新窗口的文档中插入加载完成的图像
//           printWindow.document.body.appendChild(image);
//           printWindow.document.write('</body></html>');
//           printWindow.document.close();
//           printWindow.print();
//           printWindow.close();
//         };
//       }
//     }

  const handlePrint = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();

        // 创建 Canvas
        const canvasToPrint = document.createElement('canvas');
        canvasToPrint.width = 800;
        canvasToPrint.height = 500;
        const ctx = canvasToPrint.getContext('2d');

        // 绘制多页内容
        const pageHeight = 500; // 每一页的高度
        const dataPerPage = 1; // 每页显示的数据条目数

        const dataArrayFromBackend = ["数据1", "数据2", "数据3", "数据4", "数据5", "数据6"]; // 假设从后端获取的数据

        dataArrayFromBackend.forEach((data, index) => {
          const pageIndex = Math.floor(index / dataPerPage); // 计算当前数据属于第几页
          const x = 100; // 文本的横坐标
          const y = (index % dataPerPage) * 50 + 300; // 计算纵坐标，每页50像素的间隔

          // 在 Canvas 上绘制数据
          ctx.fillText(data, x, y);

          // 如果当前数据是当前页的最后一条数据，准备分页
          if ((index + 1) % dataPerPage === 0 || index === dataArrayFromBackend.length - 1) {
            if (pageIndex < Math.floor(dataArrayFromBackend.length / dataPerPage)) {
              // 如果不是最后一页，则增加新页
              ctx.fillText(`第 ${pageIndex + 1} 页`, 700, pageHeight - 20);
              ctx.strokeRect(50, 50, 700, pageHeight - 40);
              canvasToPrint.style.pageBreakAfter = 'always'; // 分页打印
            }
          }
        });

        // 打印 Canvas
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                @page {
                  size: 800px ${pageHeight}px; // 设置页面尺寸
                }
              </style>
            </head>
            <body>
              <img src="${canvasToPrint.toDataURL()}" style="width: 100%; height: auto;">
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <>
    <div>
      <canvas
      id="canvas"
        ref={canvasRef}
        width={1200}
        height={400}
        style={{border:"1px solid #000"}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 当鼠标移出画布时停止绘制
      ></canvas>
     
    </div>
    <Space>
    <Button onClick={() =>setRectangles({}) }>清除所画图形</Button>
      <Button onClick={handlePrint}>打印</Button>
    </Space>
    

    <Home setExcelData={setExcelData} excelData={excelData}/>
    </>
  );
};

export default CanvasRectSelection;
