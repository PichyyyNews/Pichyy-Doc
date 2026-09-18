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
        name: "Introduction",
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
        title: "About Me",
        slug: "about",
        description: "Personal profile, academic background, and student teaching credentials of Pichayut Sombun.",
        content: `> Welcome to my teaching practicum portfolio and documentation portal. This section outlines my personal background, education, and current academic standing.

## Personal Profile

- **Full Name**: Mr. Pichayut Sombun (นาย พิชญุตย์ สมบุญ)
- **Role**: Pre-Service Teacher / Student Teacher (นักศึกษาฝึกประสบการณ์วิชาชีพครู)
- **Academic Year**: 3rd Year Undergraduate (ชั้นปีที่ 3)
- **Student ID**: \`672041510113\`
- **Program / Branch**: TCT DERA
- **Status**: Currently undergoing Educational Institution Teaching Practicum

## Academic Background

I am currently pursuing a Bachelor of Science in Technical Education at King Mongkut's University of Technology North Bangkok:

- **Department**: Department of Computer Education (ภาควิชาคอมพิวเตอร์ศึกษา)
- **Faculty**: Faculty of Technical Education (คณะครุศาสตร์อุตสาหกรรม)
- **University**: King Mongkut's University of Technology North Bangkok (KMUTNB) (มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ)

## Current Practicum Status

I am actively engaged in my **Educational Institution Teaching Practicum** (การฝึกสอนสถานศึกษา). This practicum provides real-world pedagogical training, curriculum delivery, and instructional design experience in an accredited vocational institution.

### Objectives of the Practicum

1. **Instructional Delivery**: Deliver structured computer education curricula adhering to modern technical standards.
2. **Pedagogical Practice**: Implement effective classroom management, technical demonstrations, and student assessments.
3. **Mentorship & Guidance**: Support students in developing practical computer skills, ethics, and professional technical competencies.
`,
        tocAnchors: JSON.stringify([
          { id: "personal-profile", text: "Personal Profile", level: 2, enabled: true },
          { id: "academic-background", text: "Academic Background", level: 2, enabled: true },
          { id: "current-practicum-status", text: "Current Practicum Status", level: 2, enabled: true },
          { id: "objectives-of-the-practicum", text: "Objectives of the Practicum", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["about", "profile", "pichayut", "sombun", "kmutnb", "computer education", "tct"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-college",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "About the College",
        slug: "college",
        description: "Institutional profile of Lopburi Technical College and assigned teaching practicum responsibilities.",
        content: `> Institutional overview of Lopburi Technical College, host department information, and assigned teaching coursework.

## Institutional Profile

- **Institution Name**: Lopburi Technical College (วิทยาลัยเทคนิคลพบุรี)
- **Address**: 323 Narai Maharach Road, Thale Chup Sorn Subdistrict, Mueang Lop Buri District, Lop Buri 15000, Thailand
- **Telephone**: \`036-411-083\` / \`+66 36 411 083\`
- **Jurisdiction**: Vocational Education Commission, Ministry of Education, Thailand

## Host Department

I am stationed at the **Department of Computer Technology** (แผนกวิชาเทคโนโลยีคอมพิวเตอร์), which focuses on providing technical and vocational skills across hardware, networking, programming, and IT applications.

## Teaching Assignments

During this practicum period, I am assigned to teach students across two academic tiers: the **Vocational Certificate (ปวช.)** and the **High Vocational Certificate (ปวส.)**, encompassing a total of **4 classroom cohorts**:

### Vocational Certificate Level (ปวช.)
- **Program**: Computer Technical (ช่างเทคนิคคอมพิวเตอร์)
- **Grade**: Year 1 (ปวช. 1)
- **Classrooms (2 Rooms)**:
  - \`1 ชทค 1\` (Section 1)
  - \`1 ชทค 2\` (Section 2)

### High Vocational Certificate Level (ปวส.)
- **Program**: Computer Technology (เทคโนโลยีคอมพิวเตอร์)
- **Grade**: Year 1 (ปวส. 1)
  - **Classroom (1 Room)**: \`1 สทค 2\`
- **Grade**: Year 2 (ปวส. 2)
  - **Classroom (1 Room)**: \`2 สทค 4\`

## Summary of Teaching Load

| Level | Program / Major | Academic Year | Section Code | Cohort Name |
| :--- | :--- | :--- | :--- | :--- |
| **Vocational (ปวช.)** | Computer Technical | Year 1 | Section 1 | \`1 ชทค 1\` |
| **Vocational (ปวช.)** | Computer Technical | Year 1 | Section 2 | \`1 ชทค 2\` |
| **High Vocational (ปวส.)** | Computer Technology | Year 1 | Section 2 | \`1 สทค 2\` |
| **High Vocational (ปวส.)** | Computer Technology | Year 2 | Section 4 | \`2 สทค 4\` |
`,
        tocAnchors: JSON.stringify([
          { id: "institutional-profile", text: "Institutional Profile", level: 2, enabled: true },
          { id: "host-department", text: "Host Department", level: 2, enabled: true },
          { id: "teaching-assignments", text: "Teaching Assignments", level: 2, enabled: true },
          { id: "vocational-certificate-level", text: "Vocational Certificate Level (ปวช.)", level: 3, enabled: true },
          { id: "high-vocational-certificate-level", text: "High Vocational Certificate Level (ปวส.)", level: 3, enabled: true },
          { id: "summary-of-teaching-load", text: "Summary of Teaching Load", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["college", "lopburi", "technical", "practicum", "teaching", "computer technology", "ปวช", "ปวส"]),
        order: 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-mentor-faculty",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "Mentor & Department Faculty",
        slug: "mentor-and-faculty",
        description: "ข้อมูลครูพี่เลี้ยงและทำเนียบคณาจารย์ แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี",
        content: `> ข้อมูลอาจารย์พี่เลี้ยงและทำเนียบคณาจารย์ แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี (Supervisory guidance, mentor teacher credentials, and faculty directory of the Department of Computer Technology, Lopburi Technical College).

## Practicum Mentor Teacher (ครูพี่เลี้ยง)

ครูพี่เลี้ยงมีหน้าที่ให้คำปรึกษา แนะนำการจัดทำแผนการจัดการเรียนรู้ การควบคุมชั้นเรียน การประเมินผลการเรียนรู้ ตลอดจนการปฏิบัติตนตามจรรยาบรรณวิชาชีพครูตลอดระยะเวลาการฝึกปฏิบัติการสอนในสถานศึกษา

### Mentor Information (ข้อมูลครูพี่เลี้ยง)

- **ชื่อ - สกุล**: นายไพบูลย์ สมนึก (Mr. Paiboon Somnuek)
- **ตำแหน่ง / วิทยฐานะ**: ครู ชำนาญการ (Senior Teacher / Instructor)
- **ตำแหน่งในแผนกวิชา**: ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
- **ภาระหน้าที่รับผิดชอบ**:
  - หัวหน้างาน งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป
- **หน่วยงาน / สังกัด**: แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี

### Supervisory Responsibilities (หน้าที่ในการนิเทศการสอน)

1. **การวางแผนการจัดการเรียนรู้**: ให้คำแนะนำและตรวจประเมินแผนการจัดการเรียนรู้ สื่อการสอน และใบงานปฏิบัติการ
2. **การสังเกตและประเมินการสอน**: สังเกตการณ์จัดกิจกรรมการเรียนรู้ในชั้นเรียน การควบคุมดูแลผู้เรียนในห้องปฏิบัติการคอมพิวเตอร์ และให้ข้อเสนอแนะเพื่อพัฒนาทักษะการสอน
3. **การวัดและประเมินผล**: ให้คำปรึกษาการออกแบบเครื่องมือวัดผลสัมฤทธิ์ทางการเรียนและการประเมินทักษะภาคปฏิบัติ
4. **จรรยาบรรณและการปฏิบัติงานสถานศึกษา**: แนะนำการปฏิบัติตนตามระเบียบวินัย จรรยาบรรณวิชาชีพครู และงานธุรการที่เกี่ยวข้อง

---

## Department Faculty (ครูในแผนกวิชา)

ทำเนียบคณาจารย์และบุคลากร แผนกวิชาเทคโนโลยีคอมพิวเตอร์ วิทยาลัยเทคนิคลพบุรี รวมทั้งสิ้น 10 ท่าน ซึ่งร่วมกันขับเคลื่อนการจัดการเรียนการสอน พัฒนาหลักสูตรวิชาชีพ และดูแลงานบริหารตามภารกิจของสถานศึกษา

### Faculty Directory (ตารางสรุปข้อมูลครูในแผนก)

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

### Faculty Details (รายละเอียดบทบาทหน้าที่รายบุคคล)

#### 1. นายรณภูมิ นาคสมบูรณ์
- **ตำแหน่ง**: ครู
- **หน้าที่รับผิดชอบ**:
  - หัวหน้าแผนก แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป (เลขา ผอ.)

#### 2. นายจิตวัฒน์ เปิ่นวงษ์
- **ตำแหน่ง**: ครู ชำนาญการพิเศษ
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์

#### 3. นางสาวศิริพิไลย พรหมแพทย์
- **ตำแหน่ง**: ครู ชำนาญการพิเศษ
- **หน้าที่รับผิดชอบ**:
  - หัวหน้างาน งานการเงิน
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานการเงิน

#### 4. นายไพบูลย์ สมนึก (ครูพี่เลี้ยง)
- **ตำแหน่ง**: ครู ชำนาญการ
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - หัวหน้างาน งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ
  - เจ้าหน้าที่ งานบริหารงานทั่วไป

#### 5. นางสาวรจนาถ มูลตรีแก้ว
- **ตำแหน่ง**: ครูผู้ช่วย
- **หน้าที่รับผิดชอบ**:
  - ครูประจำ แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานบริหารงานทั่วไป

#### 6. นายอนุชา ดำรงค์สกุล
- **ตำแหน่ง**: ครูผู้ช่วย
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

#### 7. นายธนกฤต จำปาทอง
- **ตำแหน่ง**: ครู
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

#### 8. นายเมธาวี ภู่โต
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

#### 9. นางสาวรพีพร ชูสุวรรณ
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - เจ้าหน้าที่ งานวิทยบริการและเทคโนโลยีการศึกษา
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์

#### 10. นางสาวเพ็ญพิชชา ประยงค์หอม
- **ตำแหน่ง**: ครูพิเศษสอน / ลูกจ้างชั่วคราว
- **หน้าที่รับผิดชอบ**:
  - ครูพิเศษสอน แผนกวิชาเทคโนโลยีคอมพิวเตอร์
  - ลูกจ้างชั่วคราว (ครูพิเศษสอน) แผนกวิชาเทคโนโลยีคอมพิวเตอร์
`,
        tocAnchors: JSON.stringify([
          { id: "practicum-mentor-teacher", text: "Practicum Mentor Teacher (ครูพี่เลี้ยง)", level: 2, enabled: true },
          { id: "mentor-information", text: "Mentor Information (ข้อมูลครูพี่เลี้ยง)", level: 3, enabled: true },
          { id: "supervisory-responsibilities", text: "Supervisory Responsibilities (หน้าที่ในการนิเทศการสอน)", level: 3, enabled: true },
          { id: "department-faculty", text: "Department Faculty (ครูในแผนกวิชา)", level: 2, enabled: true },
          { id: "faculty-directory", text: "Faculty Directory (ตารางสรุปข้อมูลครูในแผนก)", level: 3, enabled: true },
          { id: "faculty-details", text: "Faculty Details (รายละเอียดบทบาทหน้าที่รายบุคคล)", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["ครูพี่เลี้ยง", "อาจารย์พี่เลี้ยง", "ไพบูลย์", "รณภูมิ", "จิตวัฒน์", "ศิริพิไลย", "รจนาถ", "อนุชา", "ธนกฤต", "เมธาวี", "รพีพร", "เพ็ญพิชชา", "mentor", "faculty", "computer technology"]),
        order: 3,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-teaching-schedule",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "Teaching Schedule",
        slug: "schedule",
        description: "Weekly teaching schedule, assigned course hours, classroom cohorts, and laboratory allocations.",
        content: `> Official weekly teaching schedule and class timetable across assigned vocational cohorts for the academic term.

## Weekly Teaching Timetable

The following timetable details the scheduled instructional periods, courses, assigned student cohorts, and laboratory locations for the current semester:

| Day | Periods | Time | Course Title | Cohort | Room / Laboratory |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Monday** | 1 – 4 | 08:30 – 12:30 | Computer Technical Fundamentals (ปฏิบัติการคอมพิวเตอร์) | \`1 ชทค 1\` | Computer Lab 521 |
| **Tuesday** | 5 – 8 | 13:00 – 17:00 | Programming & Web Application Development | \`1 สทค 2\` | Computer Lab 523 |
| **Wednesday** | 1 – 4 | 08:30 – 12:30 | Computer Hardware & Peripheral Maintenance | \`1 ชทค 2\` | Hardware Workshop 522 |
| **Thursday** | 5 – 8 | 13:00 – 17:00 | Advanced Database Management Systems | \`2 สทค 4\` | Computer Lab 524 |
| **Friday** | 1 – 2 | 08:30 – 10:30 | Homeroom & Student Mentorship Activity | All Cohorts | Building 5 Hall |
| **Friday** | 3 – 8 | 10:30 – 16:30 | Instructional Preparation & Practicum Duties | — | Department Office |

## Teaching Load Summary

Summary of assigned instructional workload per academic week across Vocational Certificate (ปวช.) and High Vocational Certificate (ปวส.) programs:

| Level | Cohort Code | Course Name | Lecture (Hrs) | Lab (Hrs) | Total (Hrs/Wk) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **ปวช. 1** | \`1 ชทค 1\` | Computer Technical Fundamentals | 1 | 3 | 4 |
| **ปวช. 1** | \`1 ชทค 2\` | Computer Hardware & Maintenance | 1 | 3 | 4 |
| **ปวส. 1** | \`1 สทค 2\` | Programming & Web App Development | 1 | 3 | 4 |
| **ปวส. 2** | \`2 สทค 4\` | Advanced Database Management Systems | 1 | 3 | 4 |
| **All Levels** | All Cohorts | Homeroom & Student Guidance Activity | 2 | 0 | 2 |
| **Total** | | | **6** | **12** | **18** |

## Instructional Preparation and Office Hours

Dedicated hours outside of scheduled classroom contact time are allocated for curriculum planning, grading, and student academic consultation:

- **Office Hours**: Monday – Friday, 12:30 – 13:30
- **Location**: Department of Computer Technology Staff Office, Building 5
- **Consultation Scope**: Academic inquiries, laboratory assignment assistance, makeup practical sessions, and technical project mentoring.
`,
        tocAnchors: JSON.stringify([
          { id: "weekly-teaching-timetable", text: "Weekly Teaching Timetable", level: 2, enabled: true },
          { id: "teaching-load-summary", text: "Teaching Load Summary", level: 2, enabled: true },
          { id: "instructional-preparation-and-office-hours", text: "Instructional Preparation and Office Hours", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["schedule", "timetable", "teaching", "hours", "periods", "classes", "load", "ปวช", "ปวส"]),
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
