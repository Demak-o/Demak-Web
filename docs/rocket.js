function byId(id){ return document.getElementById(id); }

const Entry1 = byId("Entry1");
const Entry2 = byId("Entry2");
const Entry3 = byId("Entry3");

const outFS = byId("fs");
const outCH = byId("ch");
const outMP = byId("mp");
const outLG = byId("lg");
const outMF = byId("mf");
const err = byId("err");

function setError(msg){
  if(!msg){
    err.hidden = true;
    err.textContent = "";
    return;
  }
  err.hidden = false;
  err.textContent = msg;
}

function calcRocket(){
  try{
    const R = parseInt(Entry1.value, 10);
    const S = parseInt(Entry2.value, 10);
    const G = parseInt(Entry3.value, 10);

    if([R,S,G].some(n => Number.isNaN(n))) throw new Error("Please enter valid numeric values.");

    const GP = (G * 2);
    const SN = (R * 1400);
    const FS = (SN - S - GP);
    const CH = (1950 * R);
    const MP = (2 * R);
    const LG = (30 * R);
    const MF = (100 * R);

    outFS.textContent = `Sulfur Required: ${FS}`;
    outCH.textContent = `Charcoal: ${CH}`;
    outMP.textContent = `Metal Pipes: ${MP}`;
    outLG.textContent = `Low Grade: ${LG}`;
    outMF.textContent = `Metal Frags: ${MF}`;
    setError("");
  } catch(e){
    setError(e.message || "Please enter valid numeric values.");
  }
}

function resetRocket(){
  Entry1.value = "";
  Entry2.value = "";
  Entry3.value = "";
  outFS.textContent = "Sulfur Required:";
  outCH.textContent = "Charcoal:";
  outMP.textContent = "Metal Pipes:";
  outLG.textContent = "Low Grade:";
  outMF.textContent = "Metal Frags:";
  setError("");
}

byId("calc").addEventListener("click", calcRocket);
byId("reset").addEventListener("click", resetRocket);

