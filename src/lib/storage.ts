import fs from "fs";
import path from "path";
import { prisma } from "./db";
import { CategoryItem, DocPageItem, DocSpaceItem, SearchResultItem, TocItem } from "./types";
import { parseHeadingsFromMarkdown } from "./markdown";

export { parseHeadingsFromMarkdown };

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "docs-store.json");

const INITIAL_DATA: DocSpaceItem[] = [
  {
    id: "space-teaching-practicum",
    name: "Teaching Practicum",
    slug: "teaching-practicum",
    description: "Educational institution teaching practicum documentation, lesson plans, and portfolio.",
    order: 1,
    isDefault: true,
    categories: [
      {
        id: "cat-introduction",
        docSpaceId: "space-teaching-practicum",
        name: "บทนำ",
        slug: "introduction",
        order: 1,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-about",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "ประวัติส่วนตัว",
        slug: "about",
        description: "ประวัติส่วนตัว ข้อมูลการศึกษา และข้อมูลการฝึกประสบการณ์วิชาชีพครู นายพิชญุตย์ สมบุญ",
        content: `> ยินดีต้อนรับสู่ระบบเอกสารและพอร์ตโฟลิโอการฝึกประสบการณ์วิชาชีพครู รวบรวมข้อมูลประวัติส่วนตัว ข้อมูลทางการศึกษา และสถานะการปฏิบัติการสอนในสถานศึกษา

## ข้อมูลส่วนตัว (Personal Profile)

- **ชื่อ - นามสกุล**: นาย พิชญุตย์ สมบุญ (Mr. Pichayut Sombun)
- **สถานะ**: นักศึกษาฝึกประสบการณ์วิชาชีพครู (Pre-Service Student Teacher)
- **ระดับการศึกษา**: ชั้นปีที่ 3
- **รหัสนักศึกษา**: \`672041510113\`
- **หลักสูตร / สาขาวิชา**: TCT DERA
- **สถานะปัจจุบัน**: อยู่ในช่วงของการฝึกสอนสถานศึกษา

## ประวัติการศึกษา (Academic Background)

กำลังศึกษาระดับปริญญาตรี คณะครุศาสตร์อุตสาหกรรม มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ:

- **ภาควิชา**: ภาควิชาคอมพิวเตอร์ศึกษา (Department of Computer Education)
- **คณะ**: คณะครุศาสตร์อุตสาหกรรม (Faculty of Technical Education)
- **มหาวิทยาลัย**: มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (KMUTNB)

## สถานะการฝึกปฏิบัติการสอน (Current Practicum Status)

ปัจจุบันอยู่ในช่วงของการ **ฝึกสอนสถานศึกษา** (Educational Institution Teaching Practicum) เพื่อเสริมสร้างทักษะและประสบการณ์วิชาชีพครู การบริหารจัดการชั้นเรียน และการจัดกิจกรรมการเรียนรู้ในสถานศึกษาอาชีวศึกษาจริง

### วัตถุประสงค์การฝึกสอน (Practicum Objectives)

1. **การจัดการเรียนการสอน**: นำความรู้ด้านวิชาชีพคอมพิวเตอร์และครุศาสตร์มาถ่ายทอดสู่ผู้เรียนอย่างมีแบบแผนและถูกต้องตามหลักสูตร
2. **การบริหารจัดการชั้นเรียน**: ฝึกฝนทักษะการดูแลชั้นเรียน การใช้นวัตกรรมสื่อการสอน และการวัดผลสัมฤทธิ์ทางการเรียน
3. **การให้คำปรึกษาและแนะแนว**: ดูแลและส่งเสริมผู้เรียนทั้งในด้านวิชาการ ทักษะการปฏิบัติงาน และจรรยาบรรณวิชาชีพ
`,
        tocAnchors: JSON.stringify([
          { id: "personal-profile", text: "ข้อมูลส่วนตัว (Personal Profile)", level: 2, enabled: true },
          { id: "academic-background", text: "ประวัติการศึกษา (Academic Background)", level: 2, enabled: true },
          { id: "current-practicum-status", text: "สถานะการฝึกปฏิบัติการสอน (Current Practicum Status)", level: 2, enabled: true },
          { id: "practicum-objectives", text: "วัตถุประสงค์การฝึกสอน (Practicum Objectives)", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["ประวัติส่วนตัว", "พิชญุตย์", "สมบุญ", "มจพ", "คอมพิวเตอร์ศึกษา", "ครุศาสตร์อุตสาหกรรม", "tct", "dera"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-college",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "เกี่ยวกับวิทยาลัย",
        slug: "college",
        description: "ข้อมูลทั่วไปของวิทยาลัยเทคนิคลพบุรี แผนกวิชาเทคโนโลยีคอมพิวเตอร์ และกลุ่มชั้นเรียนที่ได้รับมอบหมายการสอน",
        content: `> ข้อมูลภาพรวมวิทยาลัยเทคนิคลพบุรี แผนกวิชาที่สังกัดปฏิบัติการสอน และภาระงานสอนประจำภาคเรียน

## ข้อมูลสถานศึกษา (Institutional Profile)

- **ชื่อสถานศึกษา**: วิทยาลัยเทคนิคลพบุรี (Lopburi Technical College)
- **ที่อยู่**: 323 ถนนนารายณ์มหาราช ตำบลทะเลชุบศร อำเภอเมืองลพบุรี จังหวัดลพบุรี 15000
- **เบอร์โทรศัพท์**: \`036-411-083\` / \`+66 36 411 083\`
- **สังกัด**: สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) กระทรวงศึกษาธิการ

## แผนกวิชาที่สังกัดปฏิบัติการสอน (Host Department)

สังกัดปฏิบัติการสอน ณ **แผนกวิชาเทคโนโลยีคอมพิวเตอร์** ซึ่งมุ่งเน้นการจัดการเรียนการสอนทักษะวิชาชีพทั้งด้านฮาร์ดแวร์ ระบบเครือข่าย การพัฒนาโปรแกรม และการประยุกต์ใช้เทคโนโลยีสารสนเทศ

## ภาระงานสอนที่ได้รับมอบหมาย (Teaching Assignments)

ในภาคเรียนนี้ ได้รับมอบหมายให้ปฏิบัติหน้าที่การสอนแก่นักเรียนนักศึกษา 2 ระดับชั้นการศึกษา คือ ระดับประกาศนียบัตรวิชาชีพ (ปวช.) และระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) รวมทั้งหมด **4 ห้องเรียน**:

### ระดับประกาศนียบัตรวิชาชีพ (ปวช.)
- **สาขาวิชา**: ช่างเทคนิคคอมพิวเตอร์
- **ระดับชั้น**: ปีที่ 1 (ปวช. 1)
- **ห้องเรียนที่รับผิดชอบ (2 ห้อง)**:
  - \`1 ชทค 1\` (กลุ่ม 1)
  - \`1 ชทค 2\` (กลุ่ม 2)

### ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)
- **สาขาวิชา**: เทคโนโลยีคอมพิวเตอร์
- **ระดับชั้น**: ปีที่ 1 (ปวส. 1)
  - **ห้องเรียนที่รับผิดชอบ (1 ห้อง)**: \`1 สทค 2\`
- **ระดับชั้น**: ปีที่ 2 (ปวส. 2)
  - **ห้องเรียนที่รับผิดชอบ (1 ห้อง)**: \`2 สทค 4\`

## สรุปกลุ่มชั้นเรียนที่รับผิดชอบการสอน (Summary of Teaching Load)

| ระดับการศึกษา | สาขาวิชา | ชั้นปี | กลุ่ม | รหัสห้องเรียน |
| :--- | :--- | :--- | :--- | :--- |
| **ระดับ ปวช.** | ช่างเทคนิคคอมพิวเตอร์ | ปีที่ 1 | กลุ่ม 1 | \`1 ชทค 1\` |
| **ระดับ ปวช.** | ช่างเทคนิคคอมพิวเตอร์ | ปีที่ 1 | กลุ่ม 2 | \`1 ชทค 2\` |
| **ระดับ ปวส.** | เทคโนโลยีคอมพิวเตอร์ | ปีที่ 1 | กลุ่ม 2 | \`1 สทค 2\` |
| **ระดับ ปวส.** | เทคโนโลยีคอมพิวเตอร์ | ปีที่ 2 | กลุ่ม 4 | \`2 สทค 4\` |
`,
        tocAnchors: JSON.stringify([
          { id: "institutional-profile", text: "ข้อมูลสถานศึกษา (Institutional Profile)", level: 2, enabled: true },
          { id: "host-department", text: "แผนกวิชาที่สังกัดปฏิบัติการสอน (Host Department)", level: 2, enabled: true },
          { id: "teaching-assignments", text: "ภาระงานสอนที่ได้รับมอบหมาย (Teaching Assignments)", level: 2, enabled: true },
          { id: "vocational-level", text: "ระดับประกาศนียบัตรวิชาชีพ (ปวช.)", level: 3, enabled: true },
          { id: "high-vocational-level", text: "ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)", level: 3, enabled: true },
          { id: "summary-of-teaching-load", text: "สรุปกลุ่มชั้นเรียนที่รับผิดชอบการสอน (Summary of Teaching Load)", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["วิทยาลัยเทคนิคลพบุรี", "เทคนิคลพบุรี", "เทคโนโลยีคอมพิวเตอร์", "ช่างเทคนิคคอมพิวเตอร์", "ปวช", "ปวส", "1 ชทค 1", "1 ชทค 2", "1 สทค 2", "2 สทค 4"]),
        order: 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-mentor-faculty",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "อาจารย์พี่เลี้ยงและอาจารย์ในแผนก",
        slug: "mentor-and-faculty",
        description: "ข้อมูลครูพี่เลี้ยงและทำเนียบคณาจารย์ แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี",
        content: `> ข้อมูลครูพี่เลี้ยงและทำเนียบคณาจารย์ แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี

## ครูพี่เลี้ยง (Practicum Mentor Teacher)

ครูพี่เลี้ยงมีหน้าที่ให้คำปรึกษา แนะนำการจัดทำแผนการจัดการเรียนรู้ การควบคุมชั้นเรียน การประเมินผลการเรียนรู้ ตลอดจนการปฏิบัติตนตามจรรยาบรรณวิชาชีพครูตลอดระยะเวลาการฝึกปฏิบัติการสอนในสถานศึกษา

### ข้อมูลครูพี่เลี้ยง (Mentor Information)

![82049_26082813133214](/uploads/82049_26082813133214-1789722487589-e6qmu.jpeg#border=false&width=120px&align=right&wrap=true)

- **ชื่อ - สกุล**: นายไพบูลย์ สมนึก (Mr. Paiboon Somnuek)
- **ตำแหน่ง / วิทยฐานะ**: ครู ชำนาญการ
- **ตำแหน่งในแผนกวิชา**: ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
- **ภาระหน้าที่รับผิดชอบ**:
  - หัวหน้างาน งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป
- **หน่วยงาน / สังกัด**: แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี

### หน้าที่ในการนิเทศการสอน (Supervisory Responsibilities)

1. **การวางแผนการจัดการเรียนรู้**: ให้คำแนะนำและตรวจประเมินแผนการจัดการเรียนรู้ สื่อการสอน และใบงานปฏิบัติการ
2. **การสังเกตและประเมินการสอน**: สังเกตการณ์จัดกิจกรรมการเรียนรู้ในชั้นเรียน การควบคุมดูแลผู้เรียนในห้องปฏิบัติการคอมพิวเตอร์ และให้ข้อเสนอแนะเพื่อพัฒนาทักษะการสอน
3. **การวัดและประเมินผล**: ให้คำปรึกษาการออกแบบเครื่องมือวัดผลสัมฤทธิ์ทางการเรียนและการประเมินทักษะภาคปฏิบัติ
4. **จรรยาบรรณและการปฏิบัติงานสถานศึกษา**: แนะนำการปฏิบัติตนตามระเบียบวินัย จรรยาบรรณวิชาชีพครู และงานธุรการที่เกี่ยวข้อง

---

## คณาจารย์ประจำแผนกวิชา (Department Faculty)

ทำเนียบคณาจารย์และบุคลากร แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี รวมทั้งสิ้น 10 ท่าน ซึ่งร่วมกันขับเคลื่อนการจัดการเรียนการสอน พัฒนาหลักสูตรวิชาชีพ และดูแลงานบริหารตามภารกิจของสถานศึกษา

### ตารางสรุปข้อมูลครูในแผนก (Faculty Directory)

| ลำดับ | ชื่อ - สกุล | ตำแหน่ง / วิทยฐานะ | บทบาทหน้าที่ในแผนกวิชา | หน้าที่รับผิดชอบอื่นในสถานศึกษา |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **นายรณภูมิ นาคสมบูรณ์** | ครู | หัวหน้าแผนกวิชาเทคโนโลยีคอมพิวเตอร์<br>ครูประจำแผนก | เจ้าหน้าที่ งานบริหารงานทั่วไป (เลขา ผอ.) |
| 2 | **นายจิตวัฒน์ เปิ่นวงษ์** | ครู ชำนาญการพิเศษ | ครูประจำแผนกวิชาเทคโนโลยีคอมพิวเตอร์ | การจัดการเรียนการสอนและพัฒนาผู้เรียน |
| 3 | **นางสาวศิริพิไลย พรหมแพทย์** | ครู ชำนาญการพิเศษ | ครูประจำแผนกวิชาเทคโนโลยีคอมพิวเตอร์ | หัวหน้างาน งานการเงิน<br>เจ้าหน้าที่ งานการเงิน |
| 4 | **นายไพบูลย์ สมนึก** | ครู ชำนาญการ *(ครูพี่เลี้ยง)* | ครูประจำแผนกวิชาเทคโนโลยีคอมพิวเตอร์ | หัวหน้างาน งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ<br>เจ้าหน้าที่ งานบริหารงานทั่วไป |
| 5 | **นางสาวรจนาถ มูลตรีแก้ว** | ครูผู้ช่วย | ครูประจำแผนกวิชาเทคโนโลยีคอมพิวเตอร์ | เจ้าหน้าที่ งานบริหารงานทั่วไป |
| 6 | **นายอนุชา ดำรงค์สกุล** | ครูผู้ช่วย | ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์ | เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา<br>ลูกจ้างชั่วคราว (ครูพิเศษสอน) |
| 7 | **นายธนกฤต จำปาทอง** | ครู | ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์ | เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา<br>ลูกจ้างชั่วคราว (ครูพิเศษสอน) |
| 8 | **นายเมธาวี ภู่โต** | ครูพิเศษสอน / ลูกจ้างชั่วคราว | ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์ | เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา<br>ลูกจ้างชั่วคราว (ครูพิเศษสอน) |
| 9 | **นางสาวรพีพร ชูสุวรรณ** | ครูพิเศษสอน / ลูกจ้างชั่วคราว | ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์ | เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา<br>ลูกจ้างชั่วคราว (ครูพิเศษสอน) |
| 10 | **นางสาวเพ็ญพิชชา ประยงค์หอม** | ครูพิเศษสอน / ลูกจ้างชั่วคราว | ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์ | ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์ |

### รายละเอียดบทบาทหน้าที่รายบุคคล (Faculty Details)

![35313_26072012122729](/uploads/35313_26072012122729-1789722919772-am9fq.jpg#border=false&width=120px&align=right&wrap=true)

#### 1. นายรณภูมิ นาคสมบูรณ์
- **ตำแหน่ง**: ครู
- **หน้าที่รับผิดชอบ**:
  - หัวหน้าแผนก แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป (เลขา ผอ.)

---

![3170500097473](/uploads/3170500097473-1789722946657-kjiyy.jpg#border=false&width=120px&align=right&wrap=true)

#### 2. นายจิตวัฒน์ เปิ่นวงษ์
- **ตำแหน่ง**: ครู ชำนาญการพิเศษ
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์

---

![33062_2402130993824](/uploads/33062_2402130993824-1789723016536-a4hp1.jpg#border=false&width=120px&align=right&wrap=true)

#### 3. นางสาวศิริพิไลย พรหมแพทย์
- **ตำแหน่ง**: ครู ชำนาญการพิเศษ
- **หน้าที่รับผิดชอบ**:
  - หัวหน้างาน งานการเงิน
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานการเงิน

---

![82049_26082813133214](/uploads/82049_26082813133214-1789723062751-8za2w.jpeg#border=false&width=120px&align=right&wrap=true)

#### 4. นายไพบูลย์ สมนึก (ครูพี่เลี้ยง)
- **ตำแหน่ง**: ครู ชำนาญการ
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - หัวหน้างาน งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ
  - เจ้าหน้าที่ งานบริหารงานทั่วไป

---

![85635_23072217175102](/uploads/85635_23072217175102-1789723037667-t30zh.jpeg#border=false&width=120px&align=right&wrap=true)

#### 5. นางสาวรจนาถ มูลตรีแก้ว
- **ตำแหน่ง**: ครูผู้ช่วย
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป

---

![61509_26060915154516](/uploads/61509_26060915154516-1789723145333-7xl93.png#border=false&width=120px&align=right&wrap=true)

#### 6. นายอนุชา ดำรงค์สกุล
- **ตำแหน่ง**: ครูผู้ช่วย
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

---

![25096_26060915154300](/uploads/25096_26060915154300-1789723165513-cngyy.jpg#border=false&width=120px&align=right&wrap=true)

#### 7. นายธนกฤต จำปาทอง
- **ตำแหน่ง**: ครู
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

---

![61509_26060915152801](/uploads/61509_26060915152801-1789723181214-rzr0z.png#border=false&width=120px&align=right&wrap=true)

#### 8. นายเมธาวี ภู่โต
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

---

![61509_26060915155450](/uploads/61509_26060915155450-1789723193546-eoszy.png#border=false&width=120px&align=right&wrap=true)

#### 9. นางสาวรพีพร ชูสุวรรณ
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

---

![61509_26061610102330](/uploads/61509_26061610102330-1789723240177-k1e5p.png#border=false&width=120px&align=right&wrap=true)

#### 10. นางสาวเพ็ญพิชชา ประยงค์หอม
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์
`,
        tocAnchors: JSON.stringify([
          { id: "practicum-mentor-teacher", text: "ครูพี่เลี้ยง (Practicum Mentor Teacher)", level: 2, enabled: true },
          { id: "mentor-information", text: "ข้อมูลครูพี่เลี้ยง (Mentor Information)", level: 3, enabled: true },
          { id: "supervisory-responsibilities", text: "หน้าที่ในการนิเทศการสอน (Supervisory Responsibilities)", level: 3, enabled: true },
          { id: "department-faculty", text: "คณาจารย์ประจำแผนกวิชา (Department Faculty)", level: 2, enabled: true },
          { id: "faculty-directory", text: "ตารางสรุปข้อมูลครูในแผนก (Faculty Directory)", level: 3, enabled: true },
          { id: "faculty-details", text: "รายละเอียดบทบาทหน้าที่รายบุคคล (Faculty Details)", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["ครูพี่เลี้ยง", "อาจารย์พี่เลี้ยง", "ไพบูลย์", "รณภูมิ", "จิตวัฒน์", "ศิริพิไลย", "รจนาถ", "อนุชา", "ธนกฤต", "เมธาวี", "รพีพร", "เพ็ญพิชชา", "เทคโนโลยีคอมพิวเตอร์"]),
        order: 3,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-teaching-schedule",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "ตารางสอน",
        slug: "schedule",
        description: "ตารางสอนประจำสัปดาห์ คาบเรียน ห้องปฏิบัติการ และภาระงานสอนที่ได้รับมอบหมาย",
        content: `> ตารางสอนประจำสัปดาห์ คาบเรียน รายวิชาที่สอน และห้องปฏิบัติการคอมพิวเตอร์ ประจำภาคเรียน

## ตารางสอนประจำสัปดาห์ (Weekly Timetable)

รายละเอียดตารางการจัดการเรียนการสอนประจำสัปดาห์ รายวิชา กลุ่มชั้นเรียน และห้องปฏิบัติการคอมพิวเตอร์:

| วัน | คาบเรียน | เวลา | รหัสและชื่อวิชา | กลุ่มชั้นเรียน | ห้องเรียน / ปฏิบัติการ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **วันจันทร์** | 1 – 4 | 08:30 – 12:30 น. | ปฏิบัติการคอมพิวเตอร์ (Computer Technical Fundamentals) | \`1 ชทค 1\` | ห้องปฏิบัติการคอมพิวเตอร์ 521 |
| **วันอังคาร** | 5 – 8 | 13:00 – 17:00 น. | การเขียนโปรแกรมและพัฒนาเว็บแอปพลิเคชัน (Programming & Web App) | \`1 สทค 2\` | ห้องปฏิบัติการคอมพิวเตอร์ 523 |
| **วันพุธ** | 1 – 4 | 08:30 – 12:30 น. | งานบำรุงรักษาอุปกรณ์และระบบคอมพิวเตอร์ (Computer Maintenance) | \`1 ชทค 2\` | โรงฝึกงานฮาร์ดแวร์ 522 |
| **วันพฤหัสบดี** | 5 – 8 | 13:00 – 17:00 น. | ระบบจัดการฐานข้อมูลขั้นสูง (Advanced Database Systems) | \`2 สทค 4\` | ห้องปฏิบัติการคอมพิวเตอร์ 524 |
| **วันศุกร์** | 1 – 2 | 08:30 – 10:30 น. | กิจกรรมโฮมรูมและพัฒนาผู้เรียน (Homeroom & Mentorship) | ทุกกลุ่มชั้นเรียน | ลานอเนกประสงค์ อาคาร 5 |
| **วันศุกร์** | 3 – 8 | 10:30 – 16:30 น. | เตรียมการสอน ผลิตสื่อการสอน และงานสนับสนุนแผนกวิชา | — | สำนักงานแผนกวิชาฯ |

## สรุปภาระงานสอนประจำสัปดาห์ (Teaching Load Summary)

สรุปชั่วโมงการสอนต่อสัปดาห์ครอบคลุมทั้งระดับ ปวช. และ ปวส.:

| ระดับการศึกษา | กลุ่มชั้นเรียน | รายวิชา | ทฤษฎี (ชม.) | ปฏิบัติ (ชม.) | รวม (ชม./สัปดาห์) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **ปวช. 1** | \`1 ชทค 1\` | ปฏิบัติการคอมพิวเตอร์ | 1 | 3 | 4 |
| **ปวช. 1** | \`1 ชทค 2\` | งานบำรุงรักษาอุปกรณ์และระบบคอมพิวเตอร์ | 1 | 3 | 4 |
| **ปวส. 1** | \`1 สทค 2\` | การเขียนโปรแกรมและพัฒนาเว็บแอปพลิเคชัน | 1 | 3 | 4 |
| **ปวส. 2** | \`2 สทค 4\` | ระบบจัดการฐานข้อมูลขั้นสูง | 1 | 3 | 4 |
| **ทุกระดับ** | ทุกกลุ่มเรียน | กิจกรรมโฮมรูมและพัฒนาผู้เรียน | 2 | 0 | 2 |
| **รวมทั้งหมด** | | | **6** | **12** | **18** |

## เวลาเตรียมการสอนและให้คำปรึกษา (Office Hours)

ช่วงเวลาสำหรับการเตรียมการสอน การตรวจงาน และการให้คำปรึกษาทางวิชาการแก่นักเรียนนักศึกษา:

- **ช่วงเวลาให้คำปรึกษา**: วันจันทร์ – วันศุกร์ เวลา 12:30 – 13:30 น.
- **สถานที่**: สำนักงานแผนกวิชาเทคโนโลยีคอมพิวเตอร์ อาคาร 5
- **ขอบข่ายการให้คำปรึกษา**: สอบถามเนื้อหาบทเรียน ชดเชยการฝึกปฏิบัติการคอมพิวเตอร์ และให้คำปรึกษาโครงงานวิชาชีพ
`,
        tocAnchors: JSON.stringify([
          { id: "weekly-timetable", text: "ตารางสอนประจำสัปดาห์ (Weekly Timetable)", level: 2, enabled: true },
          { id: "teaching-load-summary", text: "สรุปภาระงานสอนประจำสัปดาห์ (Teaching Load Summary)", level: 2, enabled: true },
          { id: "office-hours", text: "เวลาเตรียมการสอนและให้คำปรึกษา (Office Hours)", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["ตารางสอน", "ตารางเรียน", "คาบสอน", "ชั่วโมงสอน", "ภาระงานสอน", "ปวช", "ปวส", "1 ชทค 1", "1 ชทค 2", "1 สทค 2", "2 สทค 4"]),
        order: 4,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

function ensureFileStorage(): DocSpaceItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(content) as DocSpaceItem[];
  } catch (err) {
    console.warn("Falling back to in-memory INITIAL_DATA:", err);
    return INITIAL_DATA;
  }
}

function writeFileStorage(data: DocSpaceItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to file storage:", err);
  }
}

// Check if PostgreSQL Prisma is active and working
let isPostgresHealthy: boolean | null = null;
async function canUsePrisma(): Promise<boolean> {
  if (isPostgresHealthy !== null) return isPostgresHealthy;
  try {
    // Quick test query
    await prisma.$queryRaw`SELECT 1`;
    isPostgresHealthy = true;
    return true;
  } catch {
    isPostgresHealthy = false;
    return false;
  }
}

export async function getAllDocSpaces(): Promise<DocSpaceItem[]> {
  const usePrisma = await canUsePrisma();
  if (usePrisma) {
    try {
      const spaces = await prisma.docSpace.findMany({
        orderBy: { order: "asc" },
        include: {
          categories: {
            orderBy: { order: "asc" },
          },
          pages: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (spaces.length > 0) {
        return spaces.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          isDefault: s.isDefault,
          categories: s.categories.map((c) => ({
            id: c.id,
            docSpaceId: c.docSpaceId,
            name: c.name,
            slug: c.slug,
            order: c.order,
            isCollapsed: c.isCollapsed,
          })),
          pages: s.pages.map((p) => ({
            id: p.id,
            docSpaceId: p.docSpaceId,
            categoryId: p.categoryId,
            title: p.title,
            slug: p.slug,
            description: p.description,
            content: p.content,
            tocAnchors: p.tocAnchors,
            searchKeywords: p.searchKeywords,
            order: p.order,
            isPublished: p.isPublished,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
        }));
      }
    } catch (err) {
      console.warn("Prisma error in getAllDocSpaces, using file store:", err);
    }
  }

  return ensureFileStorage();
}

export async function getDocSpaceBySlug(slug: string): Promise<DocSpaceItem | null> {
  const spaces = await getAllDocSpaces();
  return spaces.find((s) => s.slug === slug) ?? null;
}

export async function getPageBySlug(
  docSlug: string,
  pageSlug: string
): Promise<{ space: DocSpaceItem; page: DocPageItem } | null> {
  const space = await getDocSpaceBySlug(docSlug);
  if (!space) return null;
  const page = space.pages.find((p) => p.slug === pageSlug);
  if (!page) return null;
  return { space, page };
}

export async function saveDocSpace(spaceData: Partial<DocSpaceItem>): Promise<DocSpaceItem> {
  const spaces = ensureFileStorage();
  const id = spaceData.id || `space-${Date.now()}`;
  const existingIdx = spaces.findIndex((s) => s.id === id);

  const updatedSpace: DocSpaceItem = {
    id,
    name: spaceData.name || "Untitled Doc Space",
    slug: spaceData.slug || `space-${Date.now()}`,
    description: spaceData.description || "",
    order: spaceData.order ?? (existingIdx >= 0 ? spaces[existingIdx].order : spaces.length + 1),
    isDefault: !!spaceData.isDefault,
    categories: existingIdx >= 0 ? spaces[existingIdx].categories : [],
    pages: existingIdx >= 0 ? spaces[existingIdx].pages : [],
  };

  if (existingIdx >= 0) {
    spaces[existingIdx] = updatedSpace;
  } else {
    spaces.push(updatedSpace);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.docSpace.upsert({
        where: { id: updatedSpace.id },
        update: {
          name: updatedSpace.name,
          slug: updatedSpace.slug,
          description: updatedSpace.description,
          order: updatedSpace.order,
          isDefault: updatedSpace.isDefault,
        },
        create: {
          id: updatedSpace.id,
          name: updatedSpace.name,
          slug: updatedSpace.slug,
          description: updatedSpace.description,
          order: updatedSpace.order,
          isDefault: updatedSpace.isDefault,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for docSpace:", e);
    }
  }

  return updatedSpace;
}

export async function deleteDocSpace(id: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const filtered = spaces.filter((s) => s.id !== id);
  writeFileStorage(filtered);

  if (await canUsePrisma()) {
    try {
      await prisma.docSpace.delete({ where: { id } });
    } catch (e) {
      console.warn("Prisma delete failed:", e);
    }
  }

  return true;
}

export async function saveCategory(categoryData: Partial<CategoryItem>): Promise<CategoryItem> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === categoryData.docSpaceId);
  if (!space) throw new Error("Doc space not found");

  const id = categoryData.id || `cat-${Date.now()}`;
  const existingIdx = space.categories.findIndex((c) => c.id === id);

  const updatedCategory: CategoryItem = {
    id,
    docSpaceId: space.id,
    name: categoryData.name || "Untitled Category",
    slug: categoryData.slug || `cat-${Date.now()}`,
    order: categoryData.order ?? (existingIdx >= 0 ? space.categories[existingIdx].order : space.categories.length + 1),
    isCollapsed: !!categoryData.isCollapsed,
  };

  if (existingIdx >= 0) {
    space.categories[existingIdx] = updatedCategory;
  } else {
    space.categories.push(updatedCategory);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.category.upsert({
        where: { id: updatedCategory.id },
        update: {
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          order: updatedCategory.order,
          isCollapsed: updatedCategory.isCollapsed,
        },
        create: {
          id: updatedCategory.id,
          docSpaceId: updatedCategory.docSpaceId,
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          order: updatedCategory.order,
          isCollapsed: updatedCategory.isCollapsed,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for category:", e);
    }
  }

  return updatedCategory;
}

export async function deleteCategory(docSpaceId: string, categoryId: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === docSpaceId);
  if (space) {
    space.categories = space.categories.filter((c) => c.id !== categoryId);
    // Unassign category from pages
    space.pages.forEach((p) => {
      if (p.categoryId === categoryId) p.categoryId = null;
    });
    writeFileStorage(spaces);
  }

  if (await canUsePrisma()) {
    try {
      await prisma.category.delete({ where: { id: categoryId } });
    } catch (e) {
      console.warn("Prisma delete category failed:", e);
    }
  }

  return true;
}

export async function saveDocPage(pageData: Partial<DocPageItem>): Promise<DocPageItem> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === pageData.docSpaceId);
  if (!space) throw new Error("Doc space not found");

  const id = pageData.id || `page-${Date.now()}`;
  const existingIdx = space.pages.findIndex((p) => p.id === id);

  const updatedPage: DocPageItem = {
    id,
    docSpaceId: space.id,
    categoryId: pageData.categoryId ?? null,
    title: pageData.title || "Untitled Page",
    slug: pageData.slug || `page-${Date.now()}`,
    description: pageData.description || "",
    content: pageData.content || "",
    tocAnchors: pageData.tocAnchors || "[]",
    searchKeywords: pageData.searchKeywords || "[]",
    order: pageData.order ?? (existingIdx >= 0 ? space.pages[existingIdx].order : space.pages.length + 1),
    isPublished: pageData.isPublished !== undefined ? pageData.isPublished : true,
    createdAt: existingIdx >= 0 ? space.pages[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    space.pages[existingIdx] = updatedPage;
  } else {
    space.pages.push(updatedPage);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.docPage.upsert({
        where: { id: updatedPage.id },
        update: {
          categoryId: updatedPage.categoryId,
          title: updatedPage.title,
          slug: updatedPage.slug,
          description: updatedPage.description,
          content: updatedPage.content,
          tocAnchors: updatedPage.tocAnchors,
          searchKeywords: updatedPage.searchKeywords,
          order: updatedPage.order,
          isPublished: updatedPage.isPublished,
        },
        create: {
          id: updatedPage.id,
          docSpaceId: updatedPage.docSpaceId,
          categoryId: updatedPage.categoryId,
          title: updatedPage.title,
          slug: updatedPage.slug,
          description: updatedPage.description,
          content: updatedPage.content,
          tocAnchors: updatedPage.tocAnchors,
          searchKeywords: updatedPage.searchKeywords,
          order: updatedPage.order,
          isPublished: updatedPage.isPublished,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for docPage:", e);
    }
  }

  return updatedPage;
}

export async function deleteDocPage(docSpaceId: string, pageId: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === docSpaceId);
  if (space) {
    space.pages = space.pages.filter((p) => p.id !== pageId);
    writeFileStorage(spaces);
  }

  if (await canUsePrisma()) {
    try {
      await prisma.docPage.delete({ where: { id: pageId } });
    } catch (e) {
      console.warn("Prisma delete docPage failed:", e);
    }
  }

  return true;
}

export async function searchDocs(query: string): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const spaces = await getAllDocSpaces();
  const results: SearchResultItem[] = [];

  for (const space of spaces) {
    for (const page of space.pages) {
      if (!page.isPublished) continue;

      const category = space.categories.find((c) => c.id === page.categoryId);
      const url = `/docs/${space.slug}/${page.slug}`;

      // 1. Match Page Title
      if (page.title.toLowerCase().includes(q)) {
        results.push({
          title: page.title,
          url,
          docSpaceName: space.name,
          categoryName: category?.name,
          type: "page",
          snippet: page.description || page.content.slice(0, 100),
        });
      }

      // 2. Match Custom Search Keywords
      let keywords: string[] = [];
      try {
        keywords = JSON.parse(page.searchKeywords || "[]");
      } catch {
        keywords = [];
      }
      for (const kw of keywords) {
        if (kw.toLowerCase().includes(q)) {
          results.push({
            title: `${page.title} (Keyword: ${kw})`,
            url,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "keyword",
            snippet: `Tagged with: ${kw}`,
          });
          break;
        }
      }

      // 3. Match Headings (TOC anchors)
      let anchors: TocItem[] = [];
      try {
        anchors = JSON.parse(page.tocAnchors || "[]");
      } catch {
        anchors = [];
      }
      for (const heading of anchors) {
        if (heading.text.toLowerCase().includes(q)) {
          results.push({
            title: `${page.title} > ${heading.text}`,
            url: `${url}#${heading.id}`,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "heading",
            snippet: `Section heading on ${page.title}`,
          });
        }
      }

      // 4. Match Content body snippet
      const contentLower = page.content.toLowerCase();
      const contentIdx = contentLower.indexOf(q);
      if (contentIdx >= 0) {
        const start = Math.max(0, contentIdx - 40);
        const end = Math.min(page.content.length, contentIdx + q.length + 60);
        const snippet = "..." + page.content.slice(start, end).replace(/\n/g, " ") + "...";
        // Avoid duplicate if already matched by title
        if (!results.some((r) => r.url === url && r.type === "page")) {
          results.push({
            title: page.title,
            url,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "page",
            snippet,
          });
        }
      }
    }
  }

  return results.slice(0, 20);
}
