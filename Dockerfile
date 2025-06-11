
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build dự án với biến môi trường sản xuất
RUN npm run build

# Stage 2: Sử dụng nginx để serve static files
FROM nginx:alpine

# Sao chép build files từ stage trước vào thư mục mặc định của nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Sao chép cấu hình nginx tùy chỉnh (tạo trước khi chạy)
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]