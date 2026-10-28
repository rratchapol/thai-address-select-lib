# ดูสถิติผู้เข้าชมเว็บด้วย Vercel Web Analytics

เว็บเอกสารใช้ `@vercel/analytics` ผ่าน `inject()` ใน `docs/main.js` โดยเปิดเฉพาะ production build ของ Vite ไม่โหลดตัวเก็บสถิติระหว่าง `npm run docs:dev` และไม่เพิ่มโค้ด Analytics ในไลบรารีที่แจกผ่าน npm

## เปิดใช้งาน

1. เข้า [Vercel Dashboard](https://vercel.com/dashboard) แล้วเลือกโปรเจกต์ `thai-address-select-lib`
2. เปิดเมนู **Analytics** แล้วกด **Enable**
3. Deploy โค้ดที่เพิ่ม Analytics หลังเปิดใช้งาน โดยใช้ build command `npm run docs:build` และ output directory `docs-dist` ตาม `vercel.json`
4. เปิดเว็บจริง https://www.thai-address-select-lib.taotech.site/ แล้วกลับมาดูแท็บ **Analytics** ของโปรเจกต์

ดูจำนวนผู้เข้าชม (Visitors), จำนวนการเปิดหน้า (Page Views), แหล่งที่มา (Referrers), ประเทศ และอุปกรณ์ได้จาก dashboard ไม่ต้องตั้ง API key หรือ environment variables สำหรับการติดตั้งบน Vercel

เว็บนี้ใช้หน้าเดียวและลิงก์ส่วนต่าง ๆ เช่น `#examples` จึงไม่ควรคาดหวังว่าการเลื่อนไปแต่ละส่วนจะนับเป็นหน้าแยก การติดตั้งนี้เก็บ page views ตามปกติ ไม่มี custom events สำหรับการเลือกที่อยู่หรือการคัดลอกโค้ด

## ตรวจเมื่อยังไม่เห็นข้อมูล

- ตรวจว่า deployment ที่เปิดอยู่มีโค้ด Analytics และเกิดขึ้นหลังเปิด Enable แล้ว
- ใน DevTools → Network ตรวจว่า script ของ Vercel Analytics โหลดสำเร็จ และมีคำขอส่งข้อมูลเมื่อเปิดหน้าเว็บ ลองปิดตัวบล็อกโฆษณาสำหรับการทดสอบ
- ข้อมูลเริ่มเก็บหลังเปิดใช้งาน ไม่มีประวัติผู้เข้าชมย้อนหลังจากก่อนติดตั้ง

อ้างอิง: [Vercel Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart), [Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics)
