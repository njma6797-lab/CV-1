// الترحيب مع صوت
window.onload = function(){
  const welcomeBox = document.getElementById('welcomeBox');
  const mainContent = document.getElementById('mainContent');
  let msg = new SpeechSynthesisUtterance("مرحباً بك في النجم داتا، أنشئ الآن سيفيك الخاص");
  msg.lang = 'ar-SA';
  speechSynthesis.speak(msg);

  setTimeout(()=>{
    welcomeBox.style.display='none';
    mainContent.style.display='block';
  },5000);
};

// الحسابات
const socialsDiv = document.getElementById('socials');
const socials = [];
document.getElementById('addSocial').onclick = ()=>{
  const n=document.getElementById('s_name').value.trim();
  const l=document.getElementById('s_link').value.trim();
  if(!n||!l)return alert('ادخل المنصة والرابط');
  socials.push({name:n,link:l});
  renderSocials();
};
function renderSocials(){
  socialsDiv.innerHTML='';
  socials.forEach((s,i)=>{
    const el = document.createElement('div'); el.innerHTML=`${s.name}: <a href='${s.link}' target='_blank'>${s.link}</a> <button onclick='socials.splice(${i},1);renderSocials()'>حذف</button>`;
    socialsDiv.appendChild(el);
  });
}

// رفع الصورة
let photoData='';
document.getElementById('photoFile').addEventListener('change', function(){
  const f=this.files[0]; if(!f)return;
  const r=new FileReader(); r.onload=()=>{photoData=r.result; document.getElementById('photoUrl').value=photoData;}
  r.readAsDataURL(f);
});

// إنشاء CV
function generateCV(){
  const data = {
    name: document.getElementById('name').value,
    photo: document.getElementById('photoUrl').value||photoData,
    age: document.getElementById('age').value,
    job: document.getElementById('job').value,
    edu: document.getElementById('edu').value,
    nid: document.getElementById('nid').value,
    applyTo: document.getElementById('applyTo').value,
    socials: [...socials],
    fontSize: document.getElementById('fontSize').value,
    fontColor: document.getElementById('fontColor').value,
    fontFamily: document.getElementById('fontFamily').value
  };
  const cv = document.getElementById('cvContainer');
  cv.style.fontSize=data.fontSize+'px'; cv.style.color=data.fontColor; cv.style.fontFamily=data.fontFamily;
  cv.innerHTML=`<h2>السيرة الذاتية</h2>
  <img src='${data.photo}' style='width:100px;height:100px;border-radius:8px'><p><b>الاسم:</b>${data.name}</p>
  <p><b>السن:</b>${data.age}</p><p><b>المهنة:</b>${data.job}</p>
  <p><b>التعليم:</b>${data.edu}</p><p><b>الرقم القومي:</b>${data.nid}</p>
  <p><b>التقديم إلى:</b>${data.applyTo}</p>
  <h3>الحسابات:</h3><ul>${data.socials.map(s=>`<li>${s.name}: <a href='${s.link}' target='_blank'>${s.link}</a></li>`).join('')}</ul>`;
}
document.getElementById('createCv').onclick=generateCV;

// حفظ وتحميل
document.getElementById('saveData').onclick=()=>{localStorage.setItem('cv',JSON.stringify({name:document.getElementById('name').value,photo:document.getElementById('photoUrl').value||photoData,age:document.getElementById('age').value,job:document.getElementById('job').value,edu:document.getElementById('edu').value,nid:document.getElementById('nid').value,applyTo:document.getElementById('applyTo').value,socials:socials})); alert('تم الحفظ');}
document.getElementById('loadData').onclick=()=>{const d=JSON.parse(localStorage.getItem('cv')||'{}');if(!d.name)return alert('لا يوجد بيانات'); document.getElementById('name').value=d.name;document.getElementById('photoUrl').value=d.photo||'';photoData=d.photo||'';document.getElementById('age').value=d.age;document.getElementById('job').value=d.job;document.getElementById('edu').value=d.edu;document.getElementById('nid').value=d.nid;document.getElementById('applyTo').value=d.applyTo;socials.length=0; (d.socials||[]).forEach(x=>socials.push(x)); renderSocials();}
document.getElementById('clearData').onclick=()=>{if(confirm('مسح الكل؟')){localStorage.removeItem('cv');location.reload();}}

// PDF
document.getElementById('downloadPdf').onclick=()=>{html2pdf().from(document.getElementById('cvContainer')).set({filename:'cv.pdf'}).save();}

// QR
let qr;document.getElementById('genQR').onclick=()=>{document.getElementById('qrArea').innerHTML='';qr=new QRCode(document.getElementById('qrArea'),{text:document.getElementById('cvContainer').outerHTML,width:160,height:160});}
