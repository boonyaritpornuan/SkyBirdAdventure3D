# ใช้ Node.js 18 LTS version
FROM node:18-alpine

# สร้าง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดในโปรเจค
COPY . .

# Build โปรเจค
RUN npm run build

# Expose port ที่ใช้
EXPOSE 3000

# รันแอพพลิเคชัน
CMD ["npm", "start"] 