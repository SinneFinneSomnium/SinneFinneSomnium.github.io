/* TDC-01 drone + launcher module (unarmed recon only: no payload, weapon or targeting).
   Needs global THREE r128. Usage:
     const D = TDCDrone.build(THREE);
     scene.add(D.scenes.drone.group)  // also .tube, .box  (show one at a time)
     D.setExplode('drone', 0..1); D.setXray('drone', bool); D.highlight(pid, 'sel'|'hover'|null)
     every pickable mesh has mesh.userData.pid  -> TDCDrone.PARTS[pid]
   Tags: c = Certain, l = Likely, g = Guessing. Spec values locked by decision are tagged c. */
(function (root) {
"use strict";

/* ---------------- parts metadata ---------------- */
const PARTS = {
  /* drone รุ่น 2 (scene drone + tube) */
  nose:{scene:'drone',name:'หัวลำตัว (ครอบกล้อง)',role:'ทรงรีหน้าลดแรงต้าน มีช่องฝังลูกกล้องครึ่งลูก',dims:['⌀120 × 250 มม. · 0–250 มม. จากหัว','c'],mass:[100,'g'],mat:'ไฟเบอร์กลาส ให้คลื่นวิทยุผ่าน',shell:true},
  mid:{scene:'drone',name:'ลำตัวกลาง',role:'ท่อหลักรับแรงดีด ยึดปีก ร่ม และอุปกรณ์ทั้งหมด',dims:['⌀120 × 570 มม. · 250–820 มม.','c'],mass:[250,'g'],mat:'คาร์บอน + ไฟเบอร์กลาสช่วงเสาอากาศ',shell:true},
  tailcone:{scene:'drone',name:'ท้ายเรียว',role:'เรียวจาก ⌀120 เหลือ ⌀36 มม. ยึดหาง V และมอเตอร์',dims:['ยาว 280 มม. · 820–1,100 มม.','c'],mass:[100,'g'],mat:'ไฟเบอร์กลาส/คาร์บอน',shell:true},
  cam:{scene:'drone',name:'ป้อมกล้องลูกบอล ซูม 10×',role:'กิมบอล 2 แกน ฝังครึ่งลูกใต้คาง ส่งภาพกลับสถานีภาคพื้น',dims:['ลูก ⌀64 มม. (ห้ามเกิน ≈70) · 50–120 มม.','l'],mass:[300,'g'],mat:'โมดูลกล้องซูม + มอเตอร์กิมบอล + โดมใส',note:['ข้อจำกัดหลักของลำตัว ลูกโตกว่า ≈70 มม. จะชนผนังท่อ ยังไม่ได้ยืนยันว่ามีโมดูลซูม 10× ขนาดนี้ขาย','g']},
  batt:{scene:'drone',name:'แบต Li-ion 6S2P (Molicel P45B 12 ก้อน)',role:'พลังงานหลัก วางหน้าสุดหลังกล้อง เพื่อดึงจุดศูนย์ถ่วงมาที่ 28% ของคอร์ดปีก',dims:['140 × 64 × 43 มม. · 150–290 มม.','c'],mass:[900,'c'],mat:'เซลล์ 21700 หุ้มฟิล์มหด + แผ่นนิกเกิล',note:['194 Wh = 12 × 3.6 V × 4.5 Ah (คำนวณ) เวลาบิน 60 นาทียังไม่ได้พิสูจน์ ขึ้นกับ L/D จริง','c']},
  radio:{scene:'drone',name:'ลิงก์ภาพและควบคุม',role:'ส่งภาพจากกล้องและข้อมูลบินกลับสถานีภาคพื้น',dims:['70 × 50 × 22 มม. · 300–370 มม.','g'],mass:[90,'g'],mat:'โมดูลสำเร็จรูปคลาส SIYI HM30'},
  wings:{scene:'drone',name:'ปีกพับ 2 ชิ้น',role:'พับซ้อนบนหลังในท่อ กางออกเองเมื่อพ้นปากท่อ ปีกซ้ายขวาสูงต่างกัน 15 มม.',dims:['ชิ้นละ 700 × 150 มม. · กางรวม 1.40 ม.','c'],mass:[300,'g'],mat:'โฟม XPS/EPP หุ้มผิว + คานคาร์บอน ⌀8 มม.',note:['ความเร็วร่วงหล่น ≈52 กม./ชม. ที่ 2.77 กก.','l']},
  mech:{scene:'drone',name:'กลไกกางปีก (เฟืองซิงก์)',role:'เฟืองคู่ที่โคนปีกบังคับให้สองข้างกางพร้อมกัน สลักล็อกปลายทาง ไมโครสวิตช์บอกบอร์ดว่าล็อกแล้วจึงยอมให้มอเตอร์หมุน',dims:['แกนเฟืองที่ 400 มม. จากหัว','l'],mass:[90,'g'],mat:'เฟือง CNC + สปริงบิด + สลักสปริง',note:['จุดเสี่ยงอันดับ 1 ถ้าสองข้างกางห่างกัน 30–50 มิลลิวินาที เครื่องอาจหมุนควง','g']},
  vtail:{scene:'drone',name:'หาง V พับได้ 2 แพน',role:'คุมก้มเงยและหันเห พับแนบลำตัวในท่อ สปริงดีดกาง',dims:['แพนละ 180 × 80 มม. · มุม 45°','g'],mass:[70,'g'],mat:'โฟม + คานคาร์บอน + บานพับสปริง'},
  servos:{scene:'drone',name:'เซอร์โว 4 ตัว',role:'เอเลอรอน 2 ตัวในปีก · หาง V 2 ตัวในท้าย',dims:['≈23 × 12 × 23 มม. ต่อตัว','l'],mass:[48,'l'],mat:'เซอร์โวดิจิทัลเฟืองโลหะ (ต้องทนแรงดีด)'},
  fc:{scene:'drone',name:'บอร์ดคุมบิน + GPS + วัดความเร็วลม',role:'ArduPilot Plane บินตามจุด กลับบ้านเองเมื่อสัญญาณขาด ท่อพิโตอยู่ที่ปีกขวา',dims:['บอร์ด 54 × 36 มม. · 440–500 มม.','l'],mass:[90,'l'],mat:'บอร์ดคลาส H743 + GPS M10'},
  chute:{scene:'drone',name:'ร่มชูชีพกู้คืน',role:'เปิดจากฝาบนหลังหลังปีก ลงพื้นช้าพอให้ใช้ซ้ำ เป้า ≤6 ม./วิ',dims:['ร่ม ⌀1.3 ม. ในกระบอก ⌀80 × 160 มม. · 520–680 มม.','g'],mass:[160,'l'],mat:'ผ้าริปสต็อป + กระบอกพิมพ์ 3D + เซอร์โวปลดสลัก'},
  esc:{scene:'drone',name:'ตัวควบคุมมอเตอร์ (ESC)',role:'จ่ายไฟมอเตอร์ตามคำสั่งบอร์ดคุมบิน',dims:['60 × 28 × 12 มม. · 740–800 มม.','g'],mass:[40,'g'],mat:'ESC 50–60 A'},
  motor:{scene:'drone',name:'มอเตอร์ท้ายแบบดัน',role:'ใบพัดอยู่ท้ายสุด ไม่บังกล้อง',dims:['⌀34 มม. ขนาด 35xx','l'],mass:[120,'g'],mat:'มอเตอร์ไร้แปรงถ่าน'},
  prop:{scene:'drone',name:'ใบพัดพับ',role:'พับแนบลำตัวในท่อ แรงเหวี่ยงกางเองเมื่อมอเตอร์หมุน',dims:['10–11 นิ้ว (⌀254–279 มม.)','l'],mass:[30,'l'],mat:'ไนลอนผสมคาร์บอน'},
  /* tube launcher รุ่น 2 */
  tube:{scene:'tube',name:'ท่อปล่อย',role:'เก็บโดรน 1 ลำ ปีก หาง ใบพัดพับอยู่ข้างใน ผนังท่อกดปีกไว้จนพ้นปาก',dims:['ใน ⌀200 × 1,600 มม.','c'],mass:[null],mat:'ไฟเบอร์กลาส (ต้นแบบใช้ PVC ได้)',shell:true},
  piston:{scene:'tube',name:'ลูกสูบดัน',role:'ลมดันลูกสูบ ลูกสูบดันท้ายโดรน แล้วหยุดในท่อ ลูกสูบไม่ออกจากท่อ',dims:['⌀198 × 50 มม. · ระยะชัก 450 มม.','c'],mass:[null],mat:'POM/อะลูมิเนียม + ซีลยาง',note:['ออกท่อ 12 ม./วิ ด้วยชัก 0.45 ม. → ความเร่งเฉลี่ย ≈16 g (v²/2s)','c']},
  tank:{scene:'tube',name:'ถังลมอัด + ตัวปรับแรงดัน',role:'แรงดันเฉลี่ยบนลูกสูบแค่ ≈0.14 บาร์ เพราะหน้าลูกสูบใหญ่ ปัญหาจริงคือแรง g ไม่ใช่แรงลม',dims:['≈⌀110 × 500 มม.','g'],mass:[null],mat:'ถังเหล็ก/อะลูมิเนียม + เกจ',note:['F = 2.77 × 157 ≈ 435 N บนพื้นที่ 0.031 ม.² ≈ 14 kPa (ไม่นับการสูญเสีย)','c']},
  valve:{scene:'tube',name:'วาล์วไฟฟ้า + สวิตช์ ARM',role:'เปิดลมเข้าท้ายท่อ ต้องบิดกุญแจ ARM ก่อนกดยิงทุกครั้ง',dims:['รู ≥3/8 นิ้ว','g'],mass:[null],mat:'โซลินอยด์ 12 V'},
  stand:{scene:'tube',name:'ขาตั้งเอียง 40°',role:'มุมเงยชดเชยความเร็วออกท่อ 12 ม./วิ ที่ต่ำกว่าความเร็วร่วงหล่น ≈14.4 ม./วิ',dims:['มุม 40°','c'],mass:[null],mat:'เหล็กกล่อง'},
  /* รุ่น 1 test cell */
  walls:{scene:'box',name:'กล่องไม้อัด + ฐานเอียง 45°',role:'จำลองขนาดช่องปล่อย 1 ช่อง ผนังหน้าในโมเดลทำโปร่งให้เห็นข้างใน',dims:['ภายใน 0.30 × 0.30 × 0.85 ม. · ไม้ 12 มม.','c'],mass:[null],mat:'ไม้อัด 12 มม. + เหล็กฉาก',shell:true},
  lid:{scene:'box',name:'ฝาบน + เซอร์โวเปิดฝา',role:'เปิดก่อนดีด ปิดกันฝนตอนเก็บ',dims:['324 × 324 มม.','l'],mass:[null],mat:'ไม้อัด + เซอร์โว ≈20 kg·cm'},
  guide:{scene:'box',name:'ท่อนำกลม',role:'กดปีกที่พับไว้จนพ้นปากกล่อง แบบเดียวกับท่อรุ่น 2',dims:['ใน ⌀170 × 830 มม.','c'],mass:[null],mat:'ท่อ PVC + ค้ำยึด 8 จุด',shell:true},
  cyl:{scene:'box',name:'กระบอกลม',role:'ห้อยใต้พื้นกล่อง ก้านดันแผ่นรองขึ้นตามท่อนำ',dims:['⌀32 มม. · ชัก 400 มม.','c'],mass:[null],mat:'กระบอกลมอุตสาหกรรม',note:['12 ม./วิ ด้วยชัก 0.4 ม. → ≈18 g (คำนวณ)','c']},
  plate:{scene:'box',name:'แผ่นดัน + ถ้วยรองท้าย + ยางหยุด',role:'รับท้ายโดรน หยุดที่ปลายช่วงชัก',dims:['⌀160 มม.','g'],mass:[null],mat:'ไม้อัด/อะลูมิเนียม + ยาง'},
  pneu:{scene:'box',name:'ชุดลม: ถัง ปั๊ม วาล์ว ตัวปรับแรงดัน',role:'เติมลม ปรับแรงดันให้ได้ความเร็วออกซ้ำทุกนัด',dims:['ถัง 3–5 ลิตร · เกจ 0–10 บาร์','g'],mass:[null],mat:'ชิ้นส่วนลมอุตสาหกรรมทั่วไป'},
  ctrl:{scene:'box',name:'กล่องยิง',role:'สวิตช์กุญแจ ARM ปุ่มหยุดฉุกเฉิน Arduino สั่งวาล์วและฝา',dims:['≈180 × 120 × 80 มม.','g'],mass:[null],mat:'กล่องพลาสติก + แบต 12 V'},
  tdrone:{scene:'box',name:'โดรนทดสอบสเกล 41%',role:'ปีกตรึงทรงเดียวกับรุ่น 2 แต่เล็กลง ทดสอบการดีด กางปีก และไต่ระดับ ไม่มีกล้องซูม',dims:['⌀60 × 450 มม. · ปีกกาง ≈0.54 ม.','c'],mass:[650,'g'],mat:'ท่อไฟเบอร์กลาส/พิมพ์ PETG + ปีกโฟม',note:['กล่อง 0.85 ม. ใส่โดรนรุ่น 2 ยาว 1.10 ม. ไม่ได้ ผลจากกล่องนี้ยืนยันกลไก ไม่ได้ยืนยันโดรนตัวจริง','c']}
};

/* ---------------- BOM (THB). [pid|null, item, qty, unit, tag] ---------------- */
const BOM = {
  drone:[
    ['nose','ไฟเบอร์กลาส เรซิน วัสดุโมลด์ (หัว)',1,1000,'g'],
    ['mid','คาร์บอน/ไฟเบอร์กลาส เรซิน โมลด์ (ลำตัวกลาง)',1,2500,'g'],
    ['tailcone','ไฟเบอร์กลาส เรซิน (ท้าย)',1,1000,'g'],
    ['wings','โฟม XPS/EPP + คานคาร์บอน ⌀8 มม. (ปีก)',1,1500,'g'],
    ['vtail','โฟม คานคาร์บอน บานพับสปริง (หาง)',1,300,'g'],
    ['mech','เฟือง CNC สปริงบิด ลูกปืน สลัก ไมโครสวิตช์',1,2500,'g'],
    ['cam','โมดูลกล้องซูม 10× + มอเตอร์กิมบอล 2 ตัว + บอร์ด',1,15000,'g'],
    ['batt','เซลล์ Molicel P45B 21700',12,320,'g'],
    ['batt','แผ่นนิกเกิล สายบาลานซ์ ขั้วต่อ ฉนวน',1,900,'g'],
    ['radio','ลิงก์ภาพ/ควบคุมจุดต่อจุด (คลาส SIYI HM30)',1,14000,'g'],
    ['fc','บอร์ดคุมบิน H743 (ArduPilot Plane)',1,3000,'g'],
    ['fc','GPS + เข็มทิศ M10',1,1200,'g'],
    ['fc','เซ็นเซอร์ความเร็วลม + ท่อพิโต',1,1500,'g'],
    ['chute','ร่มชูชีพ ⌀1.3 ม. + ถุง + สาย',1,1800,'g'],
    ['chute','กลไกปล่อยร่ม (เซอร์โวสลัก + สปริงดันฝา)',1,500,'g'],
    ['esc','ESC 50–60 A',1,1500,'g'],
    ['servos','เซอร์โวดิจิทัลเฟืองโลหะ',4,450,'g'],
    ['motor','มอเตอร์ไร้แปรงถ่าน 35xx',1,1800,'g'],
    ['prop','ใบพัดพับ 10–11 นิ้ว + ฮับ (สำรอง 1)',2,450,'g'],
    [null,'เส้นพิมพ์ 3 มิติ PETG/ไนลอนคาร์บอน 1 กก.',1,1200,'l'],
    [null,'สายไฟซิลิโคน ขั้วต่อ น็อต กาว',1,1200,'g'],
    [null,'ภาคพื้น: วิทยุบังคับ ELRS ตัวส่ง + ตัวรับ',1,4000,'g'],
    [null,'ภาคพื้น: เครื่องชาร์จบาลานซ์ 6S',1,2500,'g'],
    [null,'ประกันภัยบุคคลที่สาม ≥1 ล้านบาท/ปี',1,2500,'g']
  ],
  tube:[
    ['tube','ท่อ ⌀200 × 1.6 ม. + ฝาท้าย + ฝาปากกันฝน',1,2000,'g'],
    ['piston','ลูกสูบ + ซีล + ยางหยุดปลายชัก',1,800,'g'],
    ['tank','ถังลม + ตัวปรับแรงดัน + เกจ',1,1200,'g'],
    ['valve','วาล์วไฟฟ้า 12 V + สวิตช์กุญแจ ARM',1,1000,'g'],
    ['stand','ขาตั้งเหล็กเอียง 40°',1,1000,'g']
  ],
  box:[
    ['walls','ไม้อัด 12 มม. 120 × 240 ซม.',2,1700,'g'],
    ['walls','บานพับ น็อต กาว เหล็กฉาก ขาตั้งเอียง',1,550,'g'],
    ['lid','เซอร์โวเปิดฝา ≈20 kg·cm',1,350,'l'],
    ['guide','ท่อนำ PVC ใน ≈170 มม. + ค้ำยึด',1,750,'g'],
    ['cyl','กระบอกลม ⌀32 × 400 มม.',1,1500,'l'],
    ['plate','แผ่นดัน ⌀160 + ถ้วยรองท้าย',1,300,'g'],
    ['plate','ยาง/โช้คหยุดปลายช่วงชัก',1,600,'g'],
    ['pneu','ถังลม 3–5 ลิตร',1,800,'g'],
    ['pneu','วาล์วไฟฟ้า 12 V รู ≥3/8"',1,650,'g'],
    ['pneu','ปั๊มลม 12 V',1,700,'l'],
    ['pneu','ตัวปรับแรงดัน + เกจ 0–10 บาร์',1,550,'g'],
    ['pneu','วาล์วนิรภัย',1,300,'g'],
    ['pneu','ข้อต่อ สายลม PU',1,450,'g'],
    ['ctrl','Arduino + โมดูล MOSFET/รีเลย์',1,350,'l'],
    ['ctrl','ปุ่มหยุดฉุกเฉิน + กล่อง',1,400,'l'],
    ['ctrl','สวิตช์กุญแจ ARM + ไฟสถานะ',1,200,'g'],
    ['ctrl','แบต 12 V 7 Ah',1,650,'l'],
    ['ctrl','ไมโครสวิตช์ก้นช่อง',2,80,'l'],
    ['tdrone','โครง ปีก หาง กลไก (ลำตัว ⌀60 × 450)',1,3350,'g'],
    ['tdrone','มอเตอร์ 2207 + ESC + ใบพัด ×3',1,2350,'l'],
    ['tdrone','เซอร์โวจิ๋ว ×4',4,600,'l'],
    ['tdrone','บอร์ดคุมบิน GPS ตัวรับ ELRS สวิตช์ท้ายลำ',1,3270,'l'],
    ['tdrone','แบต LiPo 1300 mAh',2,1600,'l'],
    [null,'ตาข่ายกั้น/รับ + แว่นนิรภัย ×2',1,1200,'g']
  ]
};
const TAGRANK={c:0,l:1,g:2};
function worst(tags){return tags.reduce((a,t)=>TAGRANK[t]>TAGRANK[a]?t:a,'c')}
function partPrice(pid){
  let sum=0,tags=[];
  for(const k in BOM) for(const r of BOM[k]) if(r[0]===pid){sum+=r[2]*r[3];tags.push(r[4])}
  return tags.length?[sum,worst(tags)]:[0,'c'];
}
function bomTotal(k){return BOM[k].reduce((a,r)=>a+r[2]*r[3],0)}
const droneMass=()=>Object.values(PARTS).filter(p=>p.scene==='drone').reduce((a,p)=>a+(p.mass[0]||0),0)+80; // +80 g wiring

/* Phase budget. Reuse = electronics bought in 1B that go into รุ่น 2 */
const PH1A=1500, PH1B=[['บอร์ดคุมบิน H743',3000],['GPS M10',1200],['มอเตอร์ 35xx',1800],['ESC 50–60 A',1500],['เซอร์โว ×4',1800],['วิทยุ ELRS ตัวส่ง+ตัวรับ',4000],['แบต LiPo 4S สำหรับบินทดสอบ',1200]];
const PH1B_SUM=PH1B.reduce((a,r)=>a+r[1],0), REUSE=PH1B_SUM-1200;
function phases(){
  const p2=bomTotal('box'), p3=bomTotal('drone')+bomTotal('tube')-REUSE;
  return [
    {id:'1A',name:'ร่อนโฟมขนาดจริง',cost:PH1A,weeks:'2 สัปดาห์',ask:true,
     what:'ทำลำตัว 1.10 ม. ปีก 1.40 ม. จากโฟม ไม่มีไฟฟ้า ถ่วงน้ำหนักให้เท่า 2.77 กก. และจุดศูนย์ถ่วงตรงแบบ แล้วโยนร่อน',
     pass:'ร่อนตรง 10/10 ครั้ง ไม่โยกก้มเงย จุดศูนย์ถ่วงที่ 28% ของคอร์ดยืนยันด้วยการชั่ง มีวิดีโอทุกครั้ง'},
    {id:'1B',name:'ใส่มอเตอร์ บินโยนมือ ปีกตรึง',cost:PH1B_SUM,weeks:'4–6 สัปดาห์',ask:true,
     what:'ใส่บอร์ดคุมบิน มอเตอร์ เซอร์โว ในโครงโฟมเดิม บินในระยะสายตา ต่ำกว่า 90 ม. วัดกำลังไฟจริงที่ 65 กม./ชม.',
     pass:'บิน 10 เที่ยวไม่เสียหาย จูน AUTOTUNE เสร็จ กำลังไฟจริงต่างจากที่คำนวณ (≈120 W) ไม่เกิน 15% อุปกรณ์ ≈'+fmt(REUSE)+' บาทย้ายไปใช้ในรุ่น 2 ได้'},
    {id:'2',name:'กล่องดีดทดสอบ รุ่น 1',cost:p2,weeks:'6–8 สัปดาห์',
     what:'กล่องเท่าช่องจริง 0.30 × 0.30 × 0.85 ม. เอียง 45° ดีดโดรนสเกล 0.45 ม. ด้วยกระบอกลม',
     pass:'ดีด 10 นัด ความเร็วออกแกว่งไม่เกิน ±10% ปีกล็อกทุกนัดก่อนแตะพื้น ไต่ระดับได้ด้วยมอเตอร์'},
    {id:'3',name:'ต้นแบบรุ่น 2 + ท่อปล่อย',cost:p3,weeks:'4–6 เดือน',
     what:'โครงคอมโพสิต กลไกเฟืองซิงก์ กล้องซูม ลิงก์ภาพ ร่มชูชีพ ท่อ ⌀0.20 × 1.6 ม. (หักอุปกรณ์ที่ย้ายมาจาก 1B แล้ว)',
     pass:'กางปีกบนโต๊ะ 50/50 ครั้ง ทนแรงกระแทก 24 g (1.5 เท่า) ปล่อยจากท่อและบิน 10 เที่ยว ร่มลงไม่เกิน 6 ม./วิ'}
  ];
}
function fmt(n){return Number(n).toLocaleString('th-TH')}

/* ---------------- 3D ---------------- */
function build(THREE){
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const scenes={}, EX={drone:[],tube:[],box:[]}, meshesByPid={};
  const COL={shell:0xd8ddd5,wing:0xeef0ea,dark:0x2a332f,accent:0xc77b25,glass:0x0f1d26,batt:0x2f6d8f,cell:0x5d8fb0,pcb:0x2f7a4c,metal:0x9aa3a0,chute:0xc0472e,wood:0xc9a26b,woodDark:0xa98552,steel:0x5b6661,tubeC:0x9fb8ae,air:0x2e5f7a,red:0xb42318,motor:0x6f7774,prop:0x1e2522};
  function mk(geo,color,pid,o){
    o=o||{};
    const mat=new THREE.MeshStandardMaterial({color,roughness:o.rough??0.55,metalness:o.metal??0.05,side:o.side??THREE.FrontSide,transparent:!!o.opacity,opacity:o.opacity??1,depthWrite:o.opacity?false:true});
    const m=new THREE.Mesh(geo,mat);
    m.userData.pid=pid; m.userData.baseOpacity=o.opacity??1;
    (meshesByPid[pid]=meshesByPid[pid]||[]).push(m);
    return m;
  }
  const ex=(sk,obj,v)=>EX[sk].push({obj,base:obj.position.clone(),v:V(...v)});
  function between(a,b,r,color,pid){
    const d=b.clone().sub(a), len=d.length();
    const m=mk(new THREE.CylinderGeometry(r,r,len,10),color,pid,{metal:0.3});
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());
    return m;
  }
  function qBasis(x,y,z){return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z))}

  /* fuselage radius vs metres from nose */
  function fuseR(s){
    if(s<=0.13){const u=1-s/0.13;return 0.06*Math.sqrt(Math.max(0,1-u*u))}
    if(s<=0.85)return 0.06;
    const P=[[0.85,0.06],[0.98,0.04],[1.07,0.024],[1.10,0.018]];
    for(let i=0;i<P.length-1;i++)if(s<=P[i+1][0]){const t=(s-P[i][0])/(P[i+1][0]-P[i][0]);return P[i][1]+t*(P[i+1][1]-P[i][1])}
    return 0.018;
  }
  function fuseSection(a,b,closeEnd,n){
    const pts=[];
    if(a===0)pts.push(new THREE.Vector2(0,0));
    for(let k=0;k<=n;k++){const s=a+(b-a)*k/n;pts.push(new THREE.Vector2(Math.max(0.0005,fuseR(s)),-s))}
    if(closeEnd)pts.push(new THREE.Vector2(0,-b));
    const g=new THREE.LatheGeometry(pts,48); g.rotateZ(-Math.PI/2); g.translate(0.55,0,0);
    return g;
  }
  function airfoil(chord,thick,span){
    const s=new THREE.Shape(), le=chord/2, te=-chord/2;
    s.moveTo(le,0); s.bezierCurveTo(le,thick*0.9,le-chord*0.25,thick,le-chord*0.45,thick*0.95);
    s.quadraticCurveTo(te+chord*0.2,thick*0.35,te,0.0006); s.lineTo(te,-0.0006);
    s.quadraticCurveTo(le-chord*0.4,-thick*0.35,le,0);
    return new THREE.ExtrudeGeometry(s,{depth:span,bevelEnabled:false,curveSegments:10});
  }

  /* drone รุ่น 2: nose at +x 0.55, tail at -0.55. sk='drone' registers per-part explode. */
  function buildDrone(folded,sk){
    const g=new THREE.Group(), E=(o,v)=>{if(sk)ex(sk,o,v)};
    const shellO={side:THREE.DoubleSide,rough:0.45};
    const nose=mk(fuseSection(0,0.25,false,24),COL.shell,'nose',shellO); g.add(nose); E(nose,[0.35,0,0]);
    const mid=mk(fuseSection(0.25,0.82,false,4),COL.shell,'mid',shellO); g.add(mid);
    const tail=mk(fuseSection(0.82,1.10,true,10),COL.shell,'tailcone',shellO); g.add(tail); E(tail,[-0.32,0,0]);
    // chute hatch + registration stripe on mid
    const hatch=mk(new THREE.BoxGeometry(0.15,0.003,0.05),COL.accent,'chute'); hatch.position.set(-0.05,0.0605,0); g.add(hatch); E(hatch,[0,0.3,0]);
    // camera
    const cam=new THREE.Group(); cam.position.set(0.465,-0.035,0); g.add(cam); E(cam,[0.28,-0.26,0]);
    cam.add(mk(new THREE.SphereGeometry(0.032,28,20),COL.dark,'cam',{rough:0.35}));
    const lens=mk(new THREE.CylinderGeometry(0.013,0.015,0.012,24),COL.glass,'cam',{rough:0.1,metal:0.6}); lens.rotation.z=Math.PI/2; lens.position.set(0.027,-0.01,0); cam.add(lens);
    const yoke=mk(new THREE.TorusGeometry(0.034,0.003,8,32),COL.metal,'cam',{metal:0.5}); yoke.rotation.y=Math.PI/2; cam.add(yoke);
    // battery: 12 x 21700 cells, 2 long x 3 wide x 2 high, in shrink wrap
    const bat=new THREE.Group(); bat.position.set(0.33,-0.005,0); g.add(bat); E(bat,[0.05,0.32,0]);
    bat.add(mk(new THREE.BoxGeometry(0.14,0.043,0.064),COL.batt,'batt',{opacity:0.55}));
    const cg=new THREE.CylinderGeometry(0.0105,0.0105,0.068,14); cg.rotateZ(Math.PI/2);
    for(const xx of [-0.035,0.035])for(const zz of [-0.021,0,0.021])for(const yy of [-0.0105,0.0105]){const c=mk(cg,COL.cell,'batt',{metal:0.4});c.position.set(xx,yy,zz);bat.add(c)}
    // radio link
    const rad=new THREE.Group(); rad.position.set(0.215,0.0,0); g.add(rad); E(rad,[0,0.4,0]);
    rad.add(mk(new THREE.BoxGeometry(0.07,0.022,0.05),COL.pcb,'radio'));
    const hs=mk(new THREE.BoxGeometry(0.06,0.008,0.04),COL.dark,'radio'); hs.position.y=0.015; rad.add(hs);
    for(const zz of [-0.018,0.018]){const a=mk(new THREE.CylinderGeometry(0.002,0.002,0.04,6),COL.dark,'radio');a.position.set(-0.02,0.03,zz);rad.add(a)}
    // flight controller + GPS
    const fc=new THREE.Group(); fc.position.set(0.08,-0.02,0); g.add(fc); E(fc,[0,0.46,0]);
    fc.add(mk(new THREE.BoxGeometry(0.054,0.012,0.036),COL.dark,'fc'));
    const fcTop=mk(new THREE.BoxGeometry(0.03,0.004,0.02),0x2d63a8,'fc'); fcTop.position.y=0.008; fc.add(fcTop);
    const gps=mk(new THREE.CylinderGeometry(0.013,0.013,0.006,20),COL.dark,'fc'); gps.position.set(0.0,0.049,0); fc.add(gps);
    // chute canister
    const ch=mk(new THREE.CylinderGeometry(0.04,0.04,0.16,24),COL.chute,'chute',{rough:0.8}); ch.rotation.z=Math.PI/2; ch.position.set(-0.05,0.005,0); g.add(ch); E(ch,[0,0.3,0]);
    // ESC
    const esc=mk(new THREE.BoxGeometry(0.06,0.012,0.028),0x3a4ea0,'esc'); esc.position.set(-0.22,-0.03,0); g.add(esc); E(esc,[0,-0.3,0]);
    // tail servos
    for(const zz of [-0.022,0.022]){const s=mk(new THREE.BoxGeometry(0.023,0.012,0.023),COL.dark,'servos');s.position.set(-0.33,0,zz);g.add(s);E(s,[0,-0.3,0])}
    // wings on pivots at 400 mm from nose
    const wingG=airfoil(0.15,0.016,0.70);
    const ailG=new THREE.BoxGeometry(0.03,0.004,0.30);
    [[1,0.062],[-1,0.077]].forEach(([side,py])=>{
      const piv=new THREE.Group(); piv.position.set(0.15,py,0); g.add(piv); E(piv,[0,0.58,0]);
      const w=mk(wingG.clone(),COL.wing,'wings',{side:THREE.DoubleSide}); w.position.x=-0.0375; if(side<0)w.position.z=-0.70; piv.add(w);
      const ail=mk(ailG,COL.accent,'wings'); ail.position.set(-0.0375-0.058,0.005,side*0.52); piv.add(ail);
      const sv=mk(new THREE.BoxGeometry(0.023,0.01,0.023),COL.dark,'servos'); sv.position.set(-0.045,0.006,side*0.25); piv.add(sv);
      if(side>0){const pit=mk(new THREE.CylinderGeometry(0.0025,0.0025,0.09,8),COL.metal,'fc',{metal:0.6}); pit.rotation.z=Math.PI/2; pit.position.set(0.09,0.004,0.55); piv.add(pit)}
      piv.rotation.y=folded?(side>0?-Math.PI/2:Math.PI/2):0;
    });
    // sync gears + lock pin
    [[0.019,0.058],[-0.019,0.073]].forEach(([zz,yy])=>{const gr=mk(new THREE.CylinderGeometry(0.02,0.02,0.008,16),COL.metal,'mech',{metal:0.7,rough:0.3});gr.position.set(0.15,yy,zz);g.add(gr);E(gr,[0,0.42,0])});
    const pin=mk(new THREE.BoxGeometry(0.03,0.01,0.012),COL.accent,'mech'); pin.position.set(0.12,0.058,0); g.add(pin); E(pin,[0,0.42,0]);
    // V-tail, hinge at x=-0.40, radius 0.062
    const tg=new THREE.BoxGeometry(0.08,0.005,0.18); tg.translate(0,0,0.09);
    [[0,0.7071,0.7071],[0,0.7071,-0.7071]].forEach(nv=>{
      const n=V(...nv), p=mk(tg,COL.wing,'vtail');
      p.position.set(-0.40,0,0).addScaledVector(n,0.05);
      let x,y,z;
      if(folded){z=V(1,0,0);y=n.clone();x=new THREE.Vector3().crossVectors(y,z)}
      else{z=n.clone();x=V(1,0,0);y=new THREE.Vector3().crossVectors(z,x)}
      p.quaternion.copy(qBasis(x,y,z)); g.add(p); E(p,[-0.32,0.24,0]);
    });
    // motor + folding prop
    const mot=mk(new THREE.CylinderGeometry(0.017,0.017,0.03,24),COL.motor,'motor',{metal:0.6,rough:0.35}); mot.rotation.z=Math.PI/2; mot.position.x=-0.56; g.add(mot); E(mot,[-0.5,0,0]);
    const prop=new THREE.Group(); prop.position.x=-0.585; g.add(prop); E(prop,[-0.72,0,0]);
    const hub=mk(new THREE.CylinderGeometry(0.014,0.01,0.02,20),COL.prop,'prop'); hub.rotation.z=Math.PI/2; prop.add(hub);
    [1,-1].forEach(sg=>{
      const h=new THREE.Group(); h.position.y=sg*0.016; prop.add(h);
      const bg=new THREE.BoxGeometry(0.006,0.12,0.022); bg.translate(0,sg*0.06,0);
      const b=mk(bg,COL.prop,'prop'); b.rotation.y=0.25*sg; h.add(b);
      h.rotation.z=folded?-sg*Math.PI/2:0;
    });
    return g;
  }

  /* ---- scene: drone alone ---- */
  {
    const grp=new THREE.Group(); const d=buildDrone(false,'drone'); d.position.y=0.75; grp.add(d);
    // explode vectors registered inside drone group local frame; fine since group is not rotated
    scenes.drone={group:grp,target:V(0,0.75,0),cam:V(1.25,1.25,1.45),label:'โดรนรุ่น 2'};
  }

  /* ---- scene: tube launcher รุ่น 2 ---- */
  {
    const grp=new THREE.Group();
    const L=new THREE.Group(); L.position.set(-0.7,0.32,0); L.rotation.z=40*Math.PI/180; grp.add(L);
    const tubeG=new THREE.CylinderGeometry(0.104,0.104,1.6,48,1,true); tubeG.rotateZ(-Math.PI/2); tubeG.translate(0.8,0,0);
    L.add(mk(tubeG,COL.tubeC,'tube',{opacity:0.22,side:THREE.DoubleSide,rough:0.3}));
    [0.0,1.6].forEach(x=>{const r=mk(new THREE.TorusGeometry(0.106,0.008,8,48),COL.steel,'tube',{metal:0.5});r.rotation.y=Math.PI/2;r.position.x=x;L.add(r)});
    const cap=mk(new THREE.CylinderGeometry(0.11,0.11,0.02,40),COL.steel,'tube',{metal:0.4}); cap.rotation.z=Math.PI/2; cap.position.x=-0.01; L.add(cap);
    for(const x of [0.35,1.2]){const band=mk(new THREE.TorusGeometry(0.108,0.006,6,40),COL.steel,'stand',{metal:0.5});band.rotation.y=Math.PI/2;band.position.x=x;L.add(band)}
    const pis=new THREE.Group(); pis.position.x=0.03; L.add(pis); ex('tube',pis,[-0.4,0,0]);
    const pg=new THREE.CylinderGeometry(0.099,0.099,0.05,40); pg.rotateZ(Math.PI/2);
    pis.add(mk(pg,0xb08a3e,'piston',{metal:0.4,rough:0.4}));
    const seal=mk(new THREE.TorusGeometry(0.099,0.004,6,40),COL.dark,'piston'); seal.rotation.y=Math.PI/2; pis.add(seal);
    const d=buildDrone(true,null); d.position.x=0.055+0.55; L.add(d); ex('tube',d,[1.55,0,0]);
    const tank=new THREE.Group(); tank.position.set(0.32,-0.18,0); L.add(tank); ex('tube',tank,[0,-0.32,0]);
    const tk=mk(new THREE.CylinderGeometry(0.055,0.055,0.5,24),COL.air,'tank',{metal:0.4}); tk.rotation.z=Math.PI/2; tank.add(tk);
    const gauge=mk(new THREE.CylinderGeometry(0.02,0.02,0.01,20),0xeeeeee,'tank'); gauge.position.set(-0.2,0.06,0); tank.add(gauge);
    const valve=new THREE.Group(); valve.position.set(-0.06,-0.12,0); L.add(valve); ex('tube',valve,[-0.25,-0.25,0]);
    valve.add(mk(new THREE.BoxGeometry(0.06,0.05,0.05),COL.dark,'valve'));
    const key=mk(new THREE.CylinderGeometry(0.008,0.008,0.02,12),COL.red,'valve'); key.position.y=0.035; valve.add(key);
    L.add(between(V(-0.03,-0.12,0),V(-0.01,-0.03,0),0.007,COL.steel,'valve'));
    L.add(between(V(0.07,-0.18,0),V(-0.03,-0.13,0),0.006,COL.steel,'tank'));
    L.updateMatrixWorld(true);
    // stand legs from ground to tube bands
    for(const x of [0.35,1.2])for(const z of [-0.09,0.09]){
      const top=L.localToWorld(V(x,-0.105,z)); const foot=V(top.x+(x>1?0.12:-0.05),0,z*2.4);
      grp.add(between(foot,top,0.012,COL.steel,'stand'));
    }
    const base=mk(new THREE.BoxGeometry(1.15,0.03,0.5),COL.steel,'stand',{metal:0.3}); base.position.set(-0.05,0.015,0); grp.add(base);
    scenes.tube={group:grp,target:V(0,0.75,0),cam:V(2.0,1.6,3.0),label:'ท่อปล่อยรุ่น 2'};
  }

  /* ---- scene: รุ่น 1 test cell ---- */
  {
    const grp=new THREE.Group();
    const C=new THREE.Group(); C.position.set(0,0.62,0); C.rotation.z=-Math.PI/4; grp.add(C);
    const t=0.012, H=0.85, W=0.30, wo={rough:0.8};
    const fl=mk(new THREE.BoxGeometry(W+2*t,t,W+2*t),COL.woodDark,'walls',wo); fl.position.y=-t/2; C.add(fl);
    const wx=new THREE.BoxGeometry(t,H,W+2*t), wz=new THREE.BoxGeometry(W,H,t);
    [[-1,0],[1,0]].forEach(([s])=>{const w=mk(wx,COL.wood,'walls',wo);w.position.set(s*(W/2+t/2),H/2,0);C.add(w);ex('box',w,[s*0.32,0,0])});
    const back=mk(wz,COL.wood,'walls',wo); back.position.set(0,H/2,-(W/2+t/2)); C.add(back); ex('box',back,[0,0,-0.32]);
    const front=mk(wz,COL.wood,'walls',{opacity:0.18,side:THREE.DoubleSide}); front.position.set(0,H/2,W/2+t/2); C.add(front); ex('box',front,[0,0,0.32]);
    const lid=new THREE.Group(); lid.position.set(-(W/2+t),H,0); lid.rotation.z=1.75; C.add(lid); ex('box',lid,[-0.1,0.3,0]);
    const lp=mk(new THREE.BoxGeometry(W+2*t,t,W+2*t),COL.wood,'lid',wo); lp.position.set((W+2*t)/2,t/2,0); lid.add(lp);
    const ls=mk(new THREE.BoxGeometry(0.04,0.02,0.02),COL.dark,'lid'); ls.position.set(-(W/2+t)-0.012,H-0.04,0.08); C.add(ls); ex('box',ls,[-0.42,0.3,0]);
    const gd=new THREE.Group(); C.add(gd);
    gd.add(mk(new THREE.CylinderGeometry(0.087,0.087,0.83,40,1,true),0xe3e9ec,'guide',{opacity:0.35,side:THREE.DoubleSide}).translateY(0.425));
    for(const yy of [0.06,0.45,0.8])for(let a=0;a<4;a++){const ang=Math.PI/4+a*Math.PI/2;gd.add(between(V(0.087*Math.cos(ang),yy,0.087*Math.sin(ang)),V(0.148*Math.SQRT2*Math.cos(ang)*0.97,yy,0.148*Math.SQRT2*Math.sin(ang)*0.97),0.004,COL.woodDark,'guide'))}
    const plate=new THREE.Group(); plate.position.y=0.018; C.add(plate); ex('box',plate,[0,-0.2,0.0]);
    plate.add(mk(new THREE.CylinderGeometry(0.08,0.08,0.012,36),COL.metal,'plate',{metal:0.4}));
    const cup=mk(new THREE.CylinderGeometry(0.034,0.034,0.03,24,1,true),COL.dark,'plate',{side:THREE.DoubleSide}); cup.position.y=0.02; plate.add(cup);
    const cyl=new THREE.Group(); C.add(cyl); ex('box',cyl,[0,-0.42,0]);
    const cb=mk(new THREE.CylinderGeometry(0.022,0.022,0.5,24),COL.metal,'cyl',{metal:0.6,rough:0.3}); cb.position.y=-0.012-0.25; cyl.add(cb);
    const rod=mk(new THREE.CylinderGeometry(0.008,0.008,0.03,12),0xd5d9d7,'cyl',{metal:0.8,rough:0.2}); rod.position.y=0.0; cyl.add(rod);
    const fla=mk(new THREE.BoxGeometry(0.07,0.01,0.07),COL.steel,'cyl'); fla.position.y=-0.017; cyl.add(fla);
    // scale test drone, nose +y
    const td=new THREE.Group(); td.position.y=0.05+0.225; td.rotation.z=Math.PI/2; C.add(td); ex('box',td,[0,0.85,0]);
    const tb=mk(new THREE.CylinderGeometry(0.03,0.03,0.36,24),COL.shell,'tdrone'); tb.rotation.z=Math.PI/2; tb.position.x=-0.02; td.add(tb);
    const tn=mk(new THREE.SphereGeometry(0.03,20,14,0,Math.PI*2,0,Math.PI/2),COL.shell,'tdrone'); tn.rotation.z=-Math.PI/2; tn.position.x=0.16; tn.scale.set(1,1.9,1); td.add(tn);
    const tt=mk(new THREE.CylinderGeometry(0.03,0.012,0.05,24),COL.shell,'tdrone'); tt.rotation.z=Math.PI/2; tt.position.x=-0.225; td.add(tt);
    const twg=airfoil(0.10,0.01,0.27);
    [[1,0.031],[-1,0.042]].forEach(([s,yy])=>{const w=mk(twg.clone(),COL.wing,'tdrone',{side:THREE.DoubleSide});const pv=new THREE.Group();pv.position.set(0.04,yy,0);pv.rotation.y=s>0?-Math.PI/2:Math.PI/2;if(s<0)w.position.z=-0.27;pv.add(w);td.add(pv)});
    const tm=mk(new THREE.CylinderGeometry(0.012,0.012,0.02,16),COL.motor,'tdrone',{metal:0.6}); tm.rotation.z=Math.PI/2; tm.position.x=-0.255; td.add(tm);
    // stand frame: legs from ground to the two lower corners on both sides
    C.updateMatrixWorld(true);
    for(const z of [-0.17,0.17]){
      const a=C.localToWorld(V(0.162,0.0,z)), b=C.localToWorld(V(-0.162,0.25,z));
      grp.add(between(V(a.x+0.08,0,z),a,0.012,COL.steel,'walls'));
      grp.add(between(V(b.x-0.12,0,z),b,0.012,COL.steel,'walls'));
    }
    const base=mk(new THREE.BoxGeometry(0.9,0.025,0.5),COL.woodDark,'walls',wo); base.position.set(0.0,0.0125,0); grp.add(base);
    // pneumatics on the ground
    const pn=new THREE.Group(); pn.position.set(-0.75,0,0.3); grp.add(pn); ex('box',pn,[-0.2,0,0.25]);
    const tk=mk(new THREE.CylinderGeometry(0.07,0.07,0.34,24),COL.air,'pneu',{metal:0.4}); tk.rotation.z=Math.PI/2; tk.position.y=0.07; pn.add(tk);
    const reg=mk(new THREE.BoxGeometry(0.05,0.08,0.05),COL.dark,'pneu'); reg.position.set(0.22,0.06,0); pn.add(reg);
    const gg=mk(new THREE.CylinderGeometry(0.02,0.02,0.01,16),0xeeeeee,'pneu'); gg.rotation.x=Math.PI/2; gg.position.set(0.22,0.09,0.03); pn.add(gg);
    const cylBot=C.localToWorld(V(0,-0.5,0));
    grp.add(between(V(-0.5,0.07,0.3),V(cylBot.x,cylBot.y,0.0),0.005,0x2b2b2b,'pneu'));
    const ct=new THREE.Group(); ct.position.set(0.55,0,0.45); grp.add(ct); ex('box',ct,[0.2,0,0.2]);
    const cbx=mk(new THREE.BoxGeometry(0.18,0.08,0.12),0x3d4a44,'ctrl'); cbx.position.y=0.04; ct.add(cbx);
    const es=mk(new THREE.CylinderGeometry(0.018,0.018,0.015,20),COL.red,'ctrl'); es.position.set(0.04,0.088,0); ct.add(es);
    const ky=mk(new THREE.CylinderGeometry(0.008,0.008,0.012,12),0xd0b04a,'ctrl',{metal:0.6}); ky.position.set(-0.04,0.086,0); ct.add(ky);
    scenes.box={group:grp,target:V(0,0.65,0),cam:V(1.9,1.5,2.4),label:'กล่องทดสอบรุ่น 1'};
  }

  /* ---- API ---- */
  function setExplode(sk,e){for(const r of EX[sk])r.obj.position.copy(r.base).addScaledVector(r.v,e)}
  function setXray(sk,on){
    scenes[sk].group.traverse(o=>{
      if(!o.isMesh)return; const p=PARTS[o.userData.pid]; if(!p||!p.shell)return;
      const base=o.userData.baseOpacity, op=on?Math.min(base,0.14):base;
      o.material.transparent=op<1; o.material.opacity=op; o.material.depthWrite=op>=1; o.material.needsUpdate=true;
    });
  }
  const state={sel:null,hover:null};
  function paint(){
    for(const pid in meshesByPid){
      const c=pid===state.sel?0xc77b25:pid===state.hover?0x444444:0x000000, k=pid===state.sel?0.55:1;
      for(const m of meshesByPid[pid]){m.material.emissive.setHex(c);m.material.emissiveIntensity=k}
    }
  }
  function highlight(pid,kind){state[kind==='hover'?'hover':'sel']=pid;paint()}
  return {scenes,setExplode,setXray,highlight};
}

const TAGS={c:'Certain',l:'Likely',g:'Guessing'};
root.TDCDrone={PARTS,BOM,TAGS,build,partPrice,bomTotal,droneMass,phases,PH1B,REUSE,fmt};
})(typeof window!=='undefined'?window:this);
