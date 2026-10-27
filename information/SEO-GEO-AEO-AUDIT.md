# SEO / GEO / AEO — thai-address-select

วันที่ตรวจ: 26 ตุลาคม 2026 (America/Los_Angeles)

เว็บไซต์: <https://www.thai-address-select-lib.taotech.site/>

สถานะการตรวจ: การปรับชุดนี้ผ่านการตรวจในเครื่องแล้ว ผลจากเว็บจริงในรายงานเป็นข้อมูลก่อนแก้ไข ให้ตรวจ deployment และ URL จริงซ้ำตามหัวข้อ “หลัง deploy”

ขอบเขต: เว็บเอกสารและเดโมของ npm package `thai-address-select` เวอร์ชัน 1.0.6 ตรวจเว็บจริงก่อนแก้และตรวจผล build ในเครื่อง ไม่ใช่การวัดอันดับค้นหา ปริมาณทราฟฟิก หรือจำนวนครั้งที่ AI อ้างอิง

## สิ่งที่พบก่อนแก้

| ประเด็น                | หลักฐานจากเว็บจริง                                          | ผลที่อาจเกิดขึ้น                                                    |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| Canonical URL          | HTML ตอบ 200 แต่ไม่มี `rel="canonical"`                     | ไม่มีสัญญาณระบุ URL หลักจากหน้าเว็บ                                 |
| Metadata สำหรับการแชร์ | ไม่มี Open Graph และ Twitter card                           | ไม่มีชื่อและคำอธิบายเฉพาะสำหรับการแชร์ลิงก์                         |
| Structured data        | ไม่พบ `application/ld+json`                                 | ไม่ได้อธิบายความสัมพันธ์ระหว่างคู่มือ ผู้ดูแล และแพ็กเกจด้วย schema |
| โค้ดตัวอย่าง           | ไม่พบตัวอย่าง import ใน HTML แรก                            | ตัวอ่านที่ไม่รัน JavaScript ไม่เห็นตัวอย่างติดตั้งและใช้งาน         |
| ไฟล์ discovery         | `/robots.txt`, `/sitemap.xml`, `/llms.txt` ตอบ 404          | ไม่มี sitemap และดัชนีเอกสารสำหรับ agent ให้ค้นพบจากไฟล์เหล่านี้    |
| ที่มาของข้อเท็จจริง    | มีคำอธิบาย API และจำนวนข้อมูล แต่ลิงก์ source หลักยังไม่ครบ | ตรวจย้อนกลับไปยัง implementation และ snapshot ได้ยาก                |

การไม่มี robots.txt ไม่ได้หมายความว่า crawler ถูกบล็อก การเพิ่มไฟล์ครั้งนี้ระบุการเข้าถึงและตำแหน่ง sitemap ให้ชัดเจน โดยคงการเข้าถึงเว็บสาธารณะไว้

HTTP เปลี่ยนไป HTTPS ด้วย 308 อยู่แล้ว โฮสต์ที่มี `www` ใช้งานได้ ส่วนโฮสต์ที่ไม่มี `www` ไม่ resolve ในการตรวจครั้งนี้ จึงเลือก URL ที่มี `www` เป็น canonical ไม่เปลี่ยน DNS จากโค้ด

## สิ่งที่ปรับ

### SEO

- ปรับ title, description และ H1/H2 ให้ระบุชื่อแพ็กเกจและเจตนาค้นหา เช่น dropdown ที่อยู่ไทย, JavaScript, React, การติดตั้ง และ API
- เพิ่ม canonical URL เดียวกันใน HTML, Open Graph, schema และ sitemap
- เพิ่ม Open Graph / Twitter summary โดยไม่ใส่รูปภาพหรือบัญชี social ที่ไม่มีข้อมูลจริง
- ย้าย Google Fonts จาก CSS `@import` มาเป็น stylesheet พร้อม preconnect ใน head
- ใช้ `vercel.json` ระบุ build เว็บเป็น `npm run docs:build`, output เป็น `docs-dist` และ redirect `/index.html` ไป `/`

### GEO / AEO

- ให้ Vite render ตัวอย่างโค้ดทุกแท็บตั้งแต่ HTML แรก ผู้ใช้และตัวอ่าน HTML ได้ข้อมูลเดียวกัน
- มี fallback สำหรับอ่านตัวอย่างและเมนูเมื่อไม่ใช้ JavaScript ส่วนเดโมโต้ตอบยังต้องใช้ JavaScript
- เขียนคำอธิบายโปรเจคแบบตอบตรง พร้อมแสดงเวอร์ชัน ผู้ดูแล และวันที่ตรวจเอกสารกับ source
- เพิ่มลิงก์ไปยัง npm, component, utilities, dataset และช่องทางแจ้งแก้ไขเอกสาร
- แก้ข้อความที่เคยบอกว่า README มีจำนวนข้อมูลไม่ตรง เพราะ README ถูกปรับให้ตรงแล้ว
- เพิ่มคำตอบว่าตัวไลบรารีไม่เรียก API ที่อยู่ภายนอกตอนเลือก และข้อมูลไม่ sync อัตโนมัติ
- ใช้ JSON-LD ชนิด `WebSite`, `Person`, `SoftwareSourceCode` และ `TechArticle` ซึ่งตรงกับเนื้อหาจริง ไม่สร้างองค์กร รีวิว คะแนน ราคา หรือคำรับรองขึ้นมา

### ไฟล์ที่ได้จาก build

| URL            | หน้าที่                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `/robots.txt`  | อนุญาต crawl และชี้ไป sitemap โดยไม่เพิ่มกฎเฉพาะ bot ที่อาจกลบกฎรวม                              |
| `/sitemap.xml` | ใส่ URL หลักเพียงหน้าเดียว ไม่ใส่ hash sections เป็นหน้าค้นหาแยก                                 |
| `/llms.txt`    | ดัชนีสั้นที่ชี้ไปคู่มือและ primary sources ตามแนวทาง llms.txt                                    |
| `/index.md`    | คู่มือ Markdown ที่สร้างจาก README พร้อมเวอร์ชันและข้อมูล snapshot จาก metadata เดียวกับหน้าเว็บ |

เพิ่ม `rel="alternate" type="text/markdown"` และ `rel="describedby"` เพื่อค้นพบเอกสารเหล่านี้จาก HTML ส่วน HTTP `Link` ของ `/index.md` บน Vercel ชี้ canonical กลับไปหน้าเว็บหลัก

ไฟล์และ schema ไม่ใช่การรับประกันว่าจะได้ rich results, ติดอันดับ หรือถูก AI อ้างอิง Google ระบุว่า AI Overviews/AI Mode ใช้พื้นฐาน SEO เดิมและไม่มีข้อกำหนดพิเศษเพิ่มเติม ส่วน llms.txt เป็นข้อเสนอสำหรับช่วย agent ใช้เอกสาร ไม่ใช่ปัจจัยจัดอันดับที่ยืนยันแล้ว

## การตรวจสอบ

- `npm run docs:check`: build ผ่าน และตรวจ HTML ที่ไม่มีการรัน JavaScript, ตัวอย่าง 8 ชุด, canonical, schema references, version, anchors, robots, sitemap และ Markdown
- Prettier: ตรวจไฟล์ที่แก้
- Browser: ตรวจแท็บตัวอย่าง, การค้นหา, คัดลอกโค้ด และเดโมที่คืนรหัส `10500` ทั้ง dev server และ production build ไม่มี browser error และจอ 320/390 px ไม่ล้นแนวนอน
- เดโมโหลดผ่าน dynamic import เมื่อพื้นที่เดโมเข้าใกล้ viewport; ฐานข้อมูลเดิมยังทำให้ chunk มีขนาดประมาณ 2.03 MB หรือ 213 kB เมื่อ gzip
- ไม่ได้วัด Core Web Vitals ของผู้ใช้จริง และไม่ได้ใช้ผล heuristic มาแทนคะแนน Search Console หรือสถิติการอ้างอิงจริง

## หลัง deploy

1. ตรวจ `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` และ `/index.md` บนโดเมนจริงอีกครั้ง ไฟล์ Markdown ต้องได้เนื้อหา Markdown ไม่ใช่หน้า HTML fallback
2. ตรวจ redirect `/index.html` และ HTTP `Link` header ของ `/index.md` บน Vercel ซึ่ง dev server ของ Vite ไม่ได้จำลองให้
3. เจ้าของเว็บยืนยันสิทธิ์ Google Search Console แล้วส่ง sitemap และใช้ URL Inspection กับหน้า canonical
4. ใช้ข้อมูล 2–4 สัปดาห์หลัง deploy เปรียบเทียบ impressions, queries, clicks และ index coverage ไม่สรุปผลจากการเปลี่ยนโค้ดอย่างเดียว
5. ถ้าติดตาม AI citations ให้บันทึก query, ระบบที่ใช้, วันเวลา และ URL ที่ถูกอ้างจริง ไม่มีการอ้างว่าแพ็กเกจถูกแนะนำโดย AI หากยังไม่พบหลักฐาน

กลุ่มคำค้นที่ตรงกับเนื้อหา: `thai-address-select`, `dropdown ที่อยู่ไทย JavaScript`, `Thai address dropdown React`, `thai-address-select setValue`, `รหัสไปรษณีย์ getzip_code` ไม่ได้อ้าง search volume หรืออันดับของคำเหล่านี้

## แหล่งอ้างอิง

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Schema.org: SoftwareSourceCode](https://schema.org/SoftwareSourceCode)
- [llms.txt proposal, v2](https://llmstxt.org/)
- [Published npm package](https://www.npmjs.com/package/thai-address-select/v/1.0.6)
- [Project source](https://github.com/rratchapol/thai-address-select-lib)
