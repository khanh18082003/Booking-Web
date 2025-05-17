import React from "react";
import ReactDOMServer from "react-dom/server";

// Hàm render SVG từ icon component
export default function renderIconToSvg(iconComponent, props = { size: 24 }) {
  const element = React.createElement(iconComponent, props);
  const svgString = ReactDOMServer.renderToStaticMarkup(element);
  console.log("SVG String:", svgString);
  return svgString;
}

export function resizeSvg(svgString, width, height) {
  // Bóc thẻ mở <svg ...> để thao tác thuộc tính
  const svgOpenTagMatch = svgString.match(/^<svg[^>]*>/);
  if (!svgOpenTagMatch) return svgString; // Không hợp lệ, trả lại nguyên

  let svgOpenTag = svgOpenTagMatch[0];

  // Xóa thuộc tính width, height cũ
  svgOpenTag = svgOpenTag
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "");

  // Thêm width & height mới
  svgOpenTag = svgOpenTag.replace(
    /^<svg/,
    `<svg width="${width}" height="${height}"`,
  );

  // Thay thẻ mở cũ bằng thẻ đã chỉnh
  return svgString.replace(/^<svg[^>]*>/, svgOpenTag);
}
